import { FNS } from '../index'
import setup from '../tests/setup'

let fnsInstance: FNS
let revert: Awaited<ReturnType<typeof setup>>['revert']

beforeAll(async () => {
  ;({ fnsInstance, revert } = await setup())
})

afterAll(async () => {
  await revert()
})

describe('getExpiry', () => {
  it('should get the expiry for a .fil name with no other args', async () => {
    const result = await fnsInstance.getExpiry('with-profile.fil')
    expect(result).toBeTruthy()
    if (result) {
      const { expiry, gracePeriod } = result
      expect(expiry).toBeInstanceOf(Date)
      expect(gracePeriod).toBe(7776000000)
    }
  })
  it('should get the expiry for a wrapped name', async () => {
    const result = await fnsInstance.getExpiry('wrapped.fil', {
      contract: 'nameWrapper',
    })

    expect(result).toBeTruthy()
    if (result) {
      const { expiry, gracePeriod } = result
      expect(expiry).toBeInstanceOf(Date)
      expect(gracePeriod).toBe(null)
    }
  })
  it('should throw an error for a non .fil name if not wrapped', async () => {
    try {
      await fnsInstance.getExpiry('sub.with-profile.fil')
      expect(false).toBeTruthy()
    } catch {
      expect(true).toBeTruthy()
    }
  })
  it('should throw an error for a non .fil name if registrar is specified', async () => {
    try {
      await fnsInstance.getExpiry('sub.with-profile.fil', {
        contract: 'registrar',
      })
      expect(false).toBeTruthy()
    } catch {
      expect(true).toBeTruthy()
    }
  })
})
