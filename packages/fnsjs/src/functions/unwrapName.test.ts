import { ethers, utils } from 'ethers'
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
})

describe('unwrapName', () => {
  beforeEach(async () => {
    await revert()
  })
  it('should return a .eth unwrap name transaction and succeed', async () => {
    const tx = await fnsInstance.unwrapName('wrapped.eth', {
      newController: accounts[1],
      newRegistrant: accounts[1],
      addressOrIndex: 1,
    })
    expect(tx).toBeTruthy()
    await tx.wait()

    const baseRegistrar = await fnsInstance.contracts!.getBaseRegistrar()!
    const result = await baseRegistrar.ownerOf(
      utils.solidityKeccak256(['string'], ['wrapped']),
    )
    expect(result).toBe(accounts[1])
  })
  it('should return a regular unwrap name transaction and succeed', async () => {
    const tx = await fnsInstance.unwrapName('test.wrapped-with-subnames.eth', {
      newController: accounts[1],
      addressOrIndex: 2,
    })
    expect(tx).toBeTruthy()
    await tx.wait()

    const registry = await fnsInstance.contracts!.getRegistry()!
    const result = await registry.owner(
      namehash('test.wrapped-with-subnames.eth'),
    )
    expect(result).toBe(accounts[1])
  })
})
