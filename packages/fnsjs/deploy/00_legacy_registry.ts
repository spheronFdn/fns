/* eslint-disable import/no-extraneous-dependencies */

import { ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { labelhash } from '../src/utils/labels'
import { namehash } from '../src/utils/normalise'

const ZERO_HASH =
  '0x0000000000000000000000000000000000000000000000000000000000000000'

const names = ['legacy']

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts } = hre
  const { owner } = await getNamedAccounts()

  const registry = await ethers.getContract('LegacyENSRegistry', owner)

  const tldTx = await registry.setSubnodeOwner(
    ZERO_HASH,
    labelhash('test'),
    owner,
  )
  console.log(`Creating .test TLD (tx: ${tldTx.hash})...`)
  await tldTx.wait()

  await Promise.all(
    names.map(async (name) => {
      const nameTx = await registry.setSubnodeOwner(
        namehash('test'),
        labelhash(name),
        owner,
      )
      console.log(`Creating ${name}.test (tx: ${nameTx.hash})...`)
      await nameTx.wait()
    }),
  )

  return true
}

func.id = 'legacy-registry-names'
func.tags = ['legacy-registry-names']
func.dependencies = ['ENSRegistry']
func.skip = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts } = hre
  const { owner } = await getNamedAccounts()

  const registry = await ethers.getContract('LegacyENSRegistry')

  const ownerOfTestTld = await registry.owner(namehash('test'))
  if (ownerOfTestTld !== owner) {
    return false
  }
  return true
}
func.runAtTheEnd = true

export default func
