import { FNS } from '../index'
import setup from '../tests/setup'

let fnsInstance: FNS

beforeAll(async () => {
  ;({ fnsInstance } = await setup())
})

describe('batch', () => {
  it('should batch calls together', async () => {
    const result = await fnsInstance.batch(
      fnsInstance.getText.batch('with-profile.eth', 'description'),
      fnsInstance.getAddr.batch('with-profile.eth'),
      fnsInstance.getName.batch('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'),
    )
    expect(result).toBeTruthy()
    if (result) {
      expect(result[0]).toBe('Hello2')
      expect(result[1]).toBe('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC')
      expect(result[2]).toMatchObject({
        name: 'with-profile.eth',
        match: true,
      })
    }
  })
  it('should batch a single call', async () => {
    const result = await fnsInstance.batch(
      fnsInstance.getText.batch('with-profile.eth', 'description'),
    )
    expect(result).toBeTruthy()
    if (result) {
      expect(result[0]).toBe('Hello2')
    }
  })
})
