import { ethers } from 'ethers'
import { FNS } from '../index'
import setup from '../tests/setup'
import { unnamedUserSettableFuses, userSettableFuseEnum } from '../utils/fuses'
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

const checkFuses = (
  fuses: number,
  expected: (keyof typeof userSettableFuseEnum)[],
) => {
  // eslint-disable-next-line guard-for-in
  for (const fuse in userSettableFuseEnum) {
    const active =
      (fuses &
        userSettableFuseEnum[fuse as keyof typeof userSettableFuseEnum]) >
      0
    if (expected.includes(fuse as keyof typeof userSettableFuseEnum)) {
      try {
        expect(active).toBeTruthy()
      } catch {
        throw new Error(`${fuse} should be true but is false`)
      }
    } else if (active) {
      try {
        expect(active).toBeFalsy()
      } catch {
        throw new Error(`${fuse} should be false but is true`)
      }
    }
  }
}

const checkUnnamedFuses = (
  fuses: number,
  expected: (keyof typeof unnamedUserSettableFuses)[],
) => {
  // eslint-disable-next-line guard-for-in
  for (const fuse of unnamedUserSettableFuses) {
    const active = (fuses & fuse) > 0
    if (expected.includes(fuse as keyof typeof unnamedUserSettableFuses)) {
      try {
        expect(active).toBeTruthy()
      } catch {
        throw new Error(`${fuse} should be true but is false`)
      }
    } else if (active) {
      try {
        expect(active).toBeFalsy()
      } catch {
        throw new Error(`${fuse} should be false but is true`)
      }
    }
  }
}

describe('setFuses', () => {
  beforeEach(async () => {
    await revert()
  })
  describe('Array', () => {
    it('should return a setFuses transaction from a named fuse array and succeed', async () => {
      const tx = await fnsInstance.setFuses('wrapped.eth', {
        named: ['CANNOT_UNWRAP', 'CANNOT_CREATE_SUBDOMAIN', 'CANNOT_SET_TTL'],
        addressOrIndex: accounts[1],
      })
      expect(tx).toBeTruthy()
      await tx.wait()

      const nameWrapper = await fnsInstance.contracts!.getNameWrapper()!
      const [, fuses] = await nameWrapper.getData(namehash('wrapped.eth'))
      checkFuses(fuses, [
        'CANNOT_UNWRAP',
        'CANNOT_CREATE_SUBDOMAIN',
        'CANNOT_SET_TTL',
        'PARENT_CANNOT_CONTROL',
      ])
    })
    it('should return a setFuses transaction from an unnamed fuse array and succeed', async () => {
      const tx0 = await fnsInstance.setFuses('wrapped.eth', {
        named: ['CANNOT_UNWRAP'],
        addressOrIndex: accounts[1],
      })
      expect(tx0).toBeTruthy()
      await tx0.wait()

      const tx = await fnsInstance.setFuses('wrapped.eth', {
        unnamed: [128, 256, 512],
        addressOrIndex: accounts[1],
      })
      expect(tx).toBeTruthy()
      await tx.wait()

      const nameWrapper = await fnsInstance.contracts!.getNameWrapper()!
      const [, fuses] = await nameWrapper.getData(namehash('wrapped.eth'))
      checkUnnamedFuses(fuses, [128, 256, 512])
    })
    it('should return a setFuses transaction from both an unnamed and named fuse array and succeed', async () => {
      const tx = await fnsInstance.setFuses('wrapped.eth', {
        named: ['CANNOT_UNWRAP', 'CANNOT_CREATE_SUBDOMAIN', 'CANNOT_SET_TTL'],
        unnamed: [128, 256, 512],
        addressOrIndex: accounts[1],
      })
      expect(tx).toBeTruthy()
      await tx.wait()

      const nameWrapper = await fnsInstance.contracts!.getNameWrapper()!
      const [, fuses] = await nameWrapper.getData(namehash('wrapped.eth'))
      checkFuses(fuses, [
        'CANNOT_UNWRAP',
        'CANNOT_CREATE_SUBDOMAIN',
        'CANNOT_SET_TTL',
        'PARENT_CANNOT_CONTROL',
      ])
      checkUnnamedFuses(fuses, [128, 256, 512])
    })
    it('should throw an error when trying to burn a named fuse in an unnamed fuse array', async () => {
      try {
        await fnsInstance.setFuses('wrapped.eth', {
          unnamed: [32] as any,
          addressOrIndex: accounts[1],
        })
        expect(false).toBeTruthy()
      } catch (e: any) {
        expect(e.message).toBe(
          '32 is not a valid unnamed fuse. If you are trying to set a named fuse, use the named property.',
        )
      }
    })
    it('should throw an error when trying to burn an unnamed fuse in a named fuse array', async () => {
      try {
        await fnsInstance.setFuses('wrapped.eth', {
          named: ['COOL_SWAG_FUSE'] as any,
        })
        expect(false).toBeTruthy()
      } catch (e: any) {
        expect(e.message).toBe('COOL_SWAG_FUSE is not a valid named fuse.')
      }
    })
  })
  describe('Number', () => {
    it('should return a setFuses transaction from a number and succeed', async () => {
      const tx = await fnsInstance.setFuses('wrapped.eth', {
        number: 49,
        addressOrIndex: accounts[1],
      })
      expect(tx).toBeTruthy()
      await tx.wait()

      const nameWrapper = await fnsInstance.contracts!.getNameWrapper()!
      const [, fuses] = await nameWrapper.getData(namehash('wrapped.eth'))
      checkFuses(fuses, [
        'CANNOT_UNWRAP',
        'CANNOT_CREATE_SUBDOMAIN',
        'CANNOT_SET_TTL',
        'PARENT_CANNOT_CONTROL',
      ])
    })
    it('should throw an error if the number is too high', async () => {
      try {
        await fnsInstance.setFuses('wrapped.eth', {
          number: 4294967297,
          addressOrIndex: accounts[1],
        })
        expect(false).toBeTruthy()
      } catch (e: any) {
        expect(e.message).toBe(
          'Fuse number must be limited to uint32, 4294967297 was too high.',
        )
      }
    })
    it('should throw an error if the number is too low', async () => {
      try {
        await fnsInstance.setFuses('wrapped.eth', {
          number: -1,
          addressOrIndex: accounts[1],
        })
        expect(false).toBeTruthy()
      } catch (e: any) {
        expect(e.message).toBe(
          'Fuse number must be limited to uint32, -1 was too low.',
        )
      }
    })
    it('should throw an error if the number is not an integer', async () => {
      try {
        await fnsInstance.setFuses('wrapped.eth', {
          number: 7.5,
        })
        expect(false).toBeTruthy()
      } catch (e: any) {
        expect(e.message).toBe('Fuse number must be an integer, 7.5 was not.')
      }
    })
  })
})

describe('setChildFuses', () => {
  it('should return a setChildFuses transaction and succeed', async () => {
    const nameWrapper = await fnsInstance.contracts!.getNameWrapper()!
    const setParentTx = await fnsInstance.setFuses(
      'wrapped-with-subnames.eth',
      {
        named: ['CANNOT_UNWRAP'],
        addressOrIndex: accounts[1],
      },
    )
    expect(setParentTx).toBeTruthy()
    await setParentTx.wait()

    const tx = await fnsInstance.setChildFuses(
      'test.wrapped-with-subnames.eth',
      {
        fuses: 65537,
        addressOrIndex: accounts[1],
      },
    )
    expect(tx).toBeTruthy()
    await tx.wait()

    const [, fuses] = await nameWrapper.getData(
      namehash('test.wrapped-with-subnames.eth'),
    )

    checkFuses(fuses, ['CANNOT_UNWRAP', 'PARENT_CANNOT_CONTROL'])
  })
})
