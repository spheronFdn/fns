import { ethers } from 'ethers'
import { FNS } from '../index'
import setup from '../tests/setup'
import { hexEncodeName } from '../utils/hexEncodedName'

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
})

describe('setName', () => {
  beforeEach(async () => {
    await revert()
  })
  it('should return a transaction for a name and set successfully', async () => {
    const tx = await fnsInstance.setName('test123.eth', { addressOrIndex: 1 })
    expect(tx).toBeTruthy()
    await tx?.wait()

    const universalResolver =
      await fnsInstance.contracts!.getUniversalResolver()!
    const reverseNode = `${accounts[1].toLowerCase().substring(2)}.addr.reverse`
    const result = await universalResolver['reverse(bytes)'](
      hexEncodeName(reverseNode),
    )
    expect(result[0]).toBe('test123.eth')
  })
  it("should return a transaction for setting another address' name", async () => {
    const registry = (await fnsInstance.contracts!.getRegistry()!).connect(
      provider.getSigner(1),
    )
    const setApprovedForAllTx = await registry.setApprovalForAll(
      accounts[2],
      true,
    )
    await setApprovedForAllTx?.wait()

    const tx = await fnsInstance.setName('test123.eth', {
      address: accounts[1],
      addressOrIndex: 2,
    })
    expect(tx).toBeTruthy()
    await tx?.wait()

    const universalResolver =
      await fnsInstance.contracts!.getUniversalResolver()!
    const reverseNode = `${accounts[1].toLowerCase().substring(2)}.addr.reverse`
    const result = await universalResolver['reverse(bytes)'](
      hexEncodeName(reverseNode),
    )
    expect(result[0]).toBe('test123.eth')
  })
})
