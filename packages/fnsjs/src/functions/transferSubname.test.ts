import { ethers } from 'ethers'
import { ENS } from '../index'
import setup from '../tests/setup'
import { namehash } from '../utils/normalise'

let ensInstance: ENS
let revert: Awaited<ReturnType<typeof setup>>['revert']
let provider: ethers.providers.JsonRpcProvider
let accounts: string[]

beforeAll(async () => {
  ;({ ensInstance, revert, provider } = await setup())
  accounts = await provider.listAccounts()
})

afterAll(async () => {
  await revert()
})

describe('transferSubname', () => {
  beforeEach(async () => {
    await revert()
  })
  it('should allow transferring a subname on the registry', async () => {
    const tx = await ensInstance.transferSubname('test.with-subnames.eth', {
      contract: 'registry',
      owner: accounts[1],
      addressOrIndex: 1,
    })
    expect(tx).toBeTruthy()
    await tx.wait()

    const registry = await ensInstance.contracts!.getRegistry()!
    const result = await registry.owner(namehash('test.with-subnames.eth'))
    expect(result).toBe(accounts[1])
  })
  it('should allow transferring a subname on the nameWrapper', async () => {
    const tx = await ensInstance.transferSubname(
      'test.wrapped-with-subnames.eth',
      {
        contract: 'nameWrapper',
        owner: accounts[1],
        addressOrIndex: 1,
      },
    )
    expect(tx).toBeTruthy()
    await tx.wait()

    const nameWrapper = await ensInstance.contracts!.getNameWrapper()!
    const result = await nameWrapper.ownerOf(
      namehash('test.wrapped-with-subnames.eth'),
    )
    expect(result).toBe(accounts[1])
  })
})
