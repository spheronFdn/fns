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

describe('getHistory', () => {
  it('should return null for a non-existent name', async () => {
    const result = await fnsInstance.getHistory('test123123cool.eth')
    expect(result).toBeUndefined()
  })
  it('should return the history of a name', async () => {
    const result = await fnsInstance.getHistory('with-profile.eth')
    expect(result).toBeTruthy()
    if (result) {
      expect(result).toHaveProperty('domain')
      expect(result).toHaveProperty('resolver')
      expect(result).toHaveProperty('registration')
    }
  })
  it('should return the history of a wrapped name', async () => {
    const result = await fnsInstance.getHistory('wrapped.eth')
    expect(result).toBeTruthy()
    if (result) {
      expect(result).toHaveProperty('domain')
      expect(result).toHaveProperty('resolver')
      expect(result).toHaveProperty('registration')
    }
  })
  it('should return the history of a subname', async () => {
    const result = await fnsInstance.getHistory(
      'test.wrapped-with-subnames.eth',
    )
    expect(result).toBeTruthy()
    if (result) {
      expect(result).toHaveProperty('domain')
      expect(result).toHaveProperty('resolver')
      expect(result).not.toHaveProperty('registration')
    }
  })
})
