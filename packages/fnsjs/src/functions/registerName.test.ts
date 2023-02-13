import { ethers } from 'ethers'
import { FNS } from '../index'
import setup from '../tests/setup'
import { namehash } from '../utils/normalise'

let fnsInstance: FNS
let revert: Awaited<ReturnType<typeof setup>>['revert']
let provider: ethers.providers.JsonRpcProvider
let accounts: string[]

beforeAll(async () => {
  ;({ fnsInstance, revert, provider } = await setup())
  accounts = await provider.listAccounts()
})

afterAll(async () => {
  await revert()
  await provider.send('anvil_removeBlockTimestampInterval', [])
})

describe('registerName', () => {
  beforeEach(async () => {
    await revert()
  })
  it('should return a registration transaction and succeed', async () => {
    // const controller = await fnsInstance.contracts!.getEthRegistrarController()!

    const name = 'cool-swag.eth'
    const duration = 31536000
    const { customData, ...commitPopTx } =
      await fnsInstance.commitName.populateTransaction(name, {
        duration,
        owner: accounts[1],
        addressOrIndex: accounts[1],
      })
    const commitTx = await provider.getSigner().sendTransaction(commitPopTx)
    await commitTx.wait()

    await provider.send('evm_increaseTime', [60])
    await provider.send('evm_mine', [])

    const nameWrapper = await fnsInstance.contracts!.getNameWrapper()!
    const owner = await nameWrapper.ownerOf(namehash(name))
    expect(owner).toBe(accounts[1])
  })
})
