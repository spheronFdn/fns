import { FNS } from '../index'
import setup from '../tests/setup'

let fnsInstance: FNS

beforeAll(async () => {
  ;({ fnsInstance } = await setup())
})

describe('getAvailable', () => {
  it('should return false for a name that is unavailable', async () => {
    const result = await fnsInstance.getAvailable('test123.eth')
    expect(typeof result).toBe('boolean')
    expect(result).toBe(false)
  })
  it('should return true for a name that is available', async () => {
    const result = await fnsInstance.getAvailable('available-name.eth')
    expect(typeof result).toBe('boolean')
    expect(result).toBe(true)
  })
})
