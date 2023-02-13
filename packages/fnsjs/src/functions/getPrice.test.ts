import { BigNumber } from 'ethers'
import { FNS } from '../index'
import setup from '../tests/setup'

let fnsInstance: FNS

beforeAll(async () => {
  ;({ fnsInstance } = await setup())
})

const yearCost = BigNumber.from('8561643835626')

describe('getPrice', () => {
  it('should return a base and premium price for a name', async () => {
    const { base, premium } = (await fnsInstance.getPrice(
      'test123',
      86400,
      false,
    ))!
    expect(base.eq(yearCost)).toBe(true)
    expect(premium.toNumber()).toBe(0)
  })

  it('should return a base and premium price for an array of names', async () => {
    const { base, premium } = (await fnsInstance.getPrice(
      ['test123', 'to-be-renewed'],
      86400,
      false,
    ))!
    expect(base.eq(yearCost.mul(2))).toBe(true)
    expect(premium.toNumber()).toBe(0)
  })

  describe('legacy mode', () => {
    it('should return a base and premium price for a name', async () => {
      const { base, premium } = (await fnsInstance.getPrice(
        'test123',
        86400,
        true,
      ))!
      expect(base.eq(yearCost)).toBe(true)
      expect(premium.toNumber()).toBe(0)
    })

    it('should return a base and premium price for an array of names', async () => {
      const { base, premium } = (await fnsInstance.getPrice(
        ['test123', 'to-be-renewed'],
        86400,
        true,
      ))!
      expect(base.eq(yearCost.mul(2))).toBe(true)
      expect(premium.toNumber()).toBe(0)
    })
  })
})
