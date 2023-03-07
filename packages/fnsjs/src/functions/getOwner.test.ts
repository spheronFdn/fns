import { JsonRpcProvider } from '@ethersproject/providers'
import { FNS } from '../index'
import setup from '../tests/setup'

let fnsInstance: FNS
let revert: Awaited<ReturnType<typeof setup>>['revert']
let provider: JsonRpcProvider
let accounts: string[]

beforeAll(async () => {
  ;({ fnsInstance, revert, provider } = await setup())
  accounts = await provider.listAccounts()
})

afterAll(async () => {
  await revert()
})

describe('getOwner', () => {
  it('should return correct ownership level and values for a wrapped .fil name', async () => {
    const result = await fnsInstance.getOwner('wrapped.fil')
    expect(result).toEqual({
      ownershipLevel: 'nameWrapper',
      owner: accounts[1],
      expired: false,
    })
  })
  it('should return correct ownership level and values for an expired wrapped .fil name', async () => {
    const result = await fnsInstance.getOwner('expired-wrapped.fil')
    expect(result).toEqual({
      ownershipLevel: 'nameWrapper',
      owner: '0x0000000000000000000000000000000000000000',
      expired: true,
    })
  })
  it('should return correct ownership level and values for an unwrapped .fil name', async () => {
    const result = await fnsInstance.getOwner('test123.fil')
    expect(result).toEqual({
      ownershipLevel: 'registrar',
      owner: accounts[1],
      registrant: accounts[1],
      expired: false,
    })
  })
  it('should return correct ownership level and values for an expired unwrapped .fil name', async () => {
    const result = await fnsInstance.getOwner('expired.fil')
    expect(result).toEqual({
      ownershipLevel: 'registrar',
      owner: accounts[1],
      registrant: accounts[1].toLowerCase(),
      expired: true,
    })
  })
  describe('subname', () => {
    it('should return correct ownership level and values for a unwrapped name', async () => {
      const result = await fnsInstance.getOwner('test.with-subnames.fil')
      expect(result).toEqual({
        ownershipLevel: 'registry',
        owner: accounts[2],
      })
    })
    it('should return correct ownership level and values for a wrapped name', async () => {
      const result = await fnsInstance.getOwner(
        'test.wrapped-with-subnames.fil',
      )
      expect(result).toEqual({
        ownershipLevel: 'nameWrapper',
        owner: accounts[2],
      })
    })
    it('should return correct ownership level and values for an expired wrapped name', async () => {
      const result = await fnsInstance.getOwner('test.expired-wrapped.fil')
      expect(result).toEqual({
        ownershipLevel: 'nameWrapper',
        owner: accounts[2],
      })
    })
  })
})
