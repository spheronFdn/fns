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
})

beforeEach(async () => {
  await revert()
})

describe('transferSubname', () => {
  it('should allow transferring a subname on the registry', async () => {
    const tx = await fnsInstance.transferSubname('test.with-subnames.eth', {
      contract: 'registry',
      owner: accounts[1],
      addressOrIndex: 1,
    })
    expect(tx).toBeTruthy()
    await tx.wait()

    const registry = await fnsInstance.contracts!.getRegistry()!
    const result = await registry.owner(namehash('test.with-subnames.eth'))
    expect(result).toBe(accounts[1])
  })

  describe('wrapped name with PCC NOT burned', () => {
    it('should NOT allow transferring a subname by name owner', async () => {
      const nameWrapper = await fnsInstance.contracts!.getNameWrapper()!
      await expect(
        fnsInstance.transferSubname('test.wrapped-with-subnames.eth', {
          contract: 'nameWrapper',
          owner: accounts[1],
          addressOrIndex: 2,
        }),
      ).rejects.toThrow()

      const result = await nameWrapper.ownerOf(
        namehash('test.wrapped-with-subnames.eth'),
      )
      expect(result).toBe(accounts[2])
    })

    it('should allow transferring a subname by parent owner', async () => {
      const tx = await fnsInstance.transferSubname(
        'test.wrapped-with-subnames.eth',
        {
          contract: 'nameWrapper',
          owner: accounts[1],
          addressOrIndex: 1,
        },
      )
      expect(tx).toBeTruthy()
      await tx.wait()

      const nameWrapper = await fnsInstance.contracts!.getNameWrapper()!
      const result = await nameWrapper.ownerOf(
        namehash('test.wrapped-with-subnames.eth'),
      )
      expect(result).toBe(accounts[1])
    })
  })

  describe('wrapped name with PCC burned', () => {
    beforeEach(async () => {
      const tx0 = await fnsInstance.setFuses('wrapped-with-subnames.eth', {
        named: ['CANNOT_UNWRAP'],
        addressOrIndex: 1,
      })
      expect(tx0).toBeTruthy()
      await tx0.wait()
    })

    it('should NOT allow transferring a subname by name owner', async () => {
      const nameWrapper = await fnsInstance.contracts!.getNameWrapper()!

      const tx1 = await fnsInstance.setChildFuses(
        'test.wrapped-with-subnames.eth',
        {
          fuses: {
            parent: {
              named: ['PARENT_CANNOT_CONTROL'],
            },
          },
          addressOrIndex: 1,
        },
      )
      expect(tx1).toBeTruthy()
      await tx1.wait()

      const checkOwner = await nameWrapper.ownerOf(
        namehash('test.wrapped-with-subnames.eth'),
      )
      expect(checkOwner).toBe(accounts[2])

      await expect(
        fnsInstance.transferSubname('test.wrapped-with-subnames.eth', {
          contract: 'nameWrapper',
          owner: accounts[1],
          addressOrIndex: 2,
        }),
      ).rejects.toThrow()
      const result = await nameWrapper.ownerOf(
        namehash('test.wrapped-with-subnames.eth'),
      )
      expect(result).toBe(accounts[2])
    })

    it('should NOT allow transferring a subname by parent owner', async () => {
      const nameWrapper = await fnsInstance.contracts!.getNameWrapper()!

      const tx1 = await fnsInstance.setChildFuses(
        'test.wrapped-with-subnames.eth',
        {
          fuses: {
            parent: {
              named: ['PARENT_CANNOT_CONTROL'],
            },
          },
          addressOrIndex: 1,
        },
      )
      expect(tx1).toBeTruthy()
      await tx1.wait()

      const checkOwner = await nameWrapper.ownerOf(
        namehash('test.wrapped-with-subnames.eth'),
      )
      expect(checkOwner).toBe(accounts[2])

      await expect(
        fnsInstance.transferSubname('test.wrapped-with-subnames.eth', {
          contract: 'nameWrapper',
          owner: accounts[1],
          addressOrIndex: 1,
        }),
      ).rejects.toThrow()

      const result = await nameWrapper.ownerOf(
        namehash('test.wrapped-with-subnames.eth'),
      )
      expect(result).toBe(accounts[2])
    })
  })
})
