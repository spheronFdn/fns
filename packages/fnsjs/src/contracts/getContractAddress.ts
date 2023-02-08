import { ContractName, SupportedNetworkId } from './types'

const addresses: Record<
  ContractName,
  Partial<Record<SupportedNetworkId, string>> | string
> = {
  /* eslint-disable @typescript-eslint/naming-convention */
  Registrar: {
    '3141': '0x480D84AADf8B72929de7b99C9708bf58506b8568',
  },
  RegistrarController: {
    '3141': '0x2667Ae54d789De3bEA1fBEb76dc5624e7e7d09E8',
  },
  PublicResolver: {
    '3141': '0xbeB0B97A5e238b383f45757dE2e93080DACe0eCb',
  },
  FNSRegistry: {
    '3141': '0x6a099BBaD55C2B50c159cAaA4E35B59114a0a941',
  },
  ReverseRegistrar: {
    '3141': '0x751aeD410cAb124192ab0f5189fb36B99D222F19',
  },
  /* eslint-enable @typescript-eslint/naming-convention */
}

export type ContractAddressFetch = (contractName: ContractName) => string

export const getContractAddress = (networkId: SupportedNetworkId) =>
  ((contractName: ContractName) => {
    try {
      return typeof addresses[contractName] === 'string'
        ? addresses[contractName]
        : addresses[contractName][networkId]
    } catch {
      throw new Error(
        `No address for contract ${contractName} on network ${networkId}`,
      )
    }
  }) as ContractAddressFetch
