// eslint-disable-next-line import/no-extraneous-dependencies
import { config } from 'dotenv'
import { ethers } from 'ethers'
import { resolve } from 'path'
import { FNS } from '../index'
import { ContractName } from '../contracts/types'
import StaticFNS from '../static'
import contracts from './contract-imports'
import functions from './func-imports'

config({
  path: resolve(__dirname, '../../.env.local'),
  override: true,
})

export const deploymentAddresses = JSON.parse(
  process.env.DEPLOYMENT_ADDRESSES!,
) as Record<
  ContractName | 'ENSRegistry' | 'LegacyPublicResolver' | 'NoMulticallResolver',
  string
>

const IS_STATIC = !!process.env.STATIC_ENS

const createFNS = async (
  provider: ethers.providers.StaticJsonRpcProvider,
  graphURI: string,
  useReal?: boolean,
) => {
  const options: ConstructorParameters<typeof FNS>[0] = {
    graphURI,
    getContractAddress: useReal
      ? undefined
      : () => (contractName) => deploymentAddresses[contractName],
  }
  if (!IS_STATIC) {
    const fnsInstance = new FNS(options)
    await fnsInstance.setProvider(provider)
    return fnsInstance
  }
  return new StaticFNS(provider, { ...options, functions, contracts })
}

export default async (useReal?: boolean) => {
  const { graphURI, providerURI, chainId } = useReal
    ? {
        graphURI:
          'https://api.thegraph.com/subgraphs/name/ensdomains/ensgoerli',
        providerURI: 'https://web3.ens.domains/v1/goerli',
        chainId: 5,
      }
    : {
        graphURI: 'http://localhost:8000/subgraphs/name/graphprotocol/ens',
        providerURI: 'http://localhost:8545',
        chainId: 1337,
      }
  const provider = new ethers.providers.StaticJsonRpcProvider(
    providerURI,
    chainId,
  )

  let fnsInstance = await createFNS(provider, graphURI, useReal)

  if (useReal) {
    return { fnsInstance, revert: () => {}, createSnapshot: () => {}, provider }
  }

  let snapshot = await provider.send('evm_snapshot', [])

  const revert = async (customSnapshot?: any) => {
    const snapshotToUse = customSnapshot || snapshot
    await provider.send('evm_revert', [snapshotToUse])
    if (parseInt(snapshot, 16) >= parseInt(snapshotToUse, 16)) {
      snapshot = await provider.send('evm_snapshot', [])
    }

    fnsInstance = await createFNS(provider, graphURI)
    return
  }

  const createSnapshot = async () => provider.send('evm_snapshot', [])

  return { fnsInstance, revert, createSnapshot, provider }
}
