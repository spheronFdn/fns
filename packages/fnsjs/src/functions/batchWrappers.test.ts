import { FNS } from '../index'
import setup from '../tests/setup'

let fnsInstance: FNS

beforeAll(async () => {
  ;({ fnsInstance } = await setup())
})

describe('batchWrappers', () => {
  it('should batch calls together', async () => {
    const batch = await fnsInstance.resolverMulticallWrapper.raw([
      await fnsInstance._getText.raw('with-profile.eth', 'description'),
      await fnsInstance._getText.raw('with-profile.eth', 'url'),
      await fnsInstance._getAddr.raw('with-profile.eth'),
    ])
    const universalResponse = await fnsInstance.universalWrapper(
      'with-profile.eth',
      batch.data,
    )
    const [batchDecoded] = await fnsInstance.resolverMulticallWrapper.decode(
      universalResponse?.data,
    )
    const decoded1 = await fnsInstance._getText.decode(batchDecoded[0])
    const decoded2 = await fnsInstance._getText.decode(batchDecoded[1])
    const decoded3 = await fnsInstance._getAddr.decode(batchDecoded[2])
    expect(decoded1).toBe('Hello2')
    expect(decoded2).toBe('twitter.com')
    expect(decoded3).toBe('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC')
  })
})
