import dotenv from 'dotenv'
import { FNS } from '../index'
import setup from '../tests/setup'

dotenv.config()

let fnsInstance: FNS

beforeAll(async () => {
  ;({ fnsInstance } = await setup(true))
})

jest.setTimeout(20000)

describe('CCIP', () => {
  describe('getProfile', () => {
    it('should return a profile from a ccip-read name', async () => {
      const result = await fnsInstance.getProfile('1.offchainexample.eth', {
        fallback: {
          texts: ['email', 'description'],
          contentHash: true,
          coinTypes: ['LTC', '60'],
        },
      })
      expect(result).toBeTruthy()
      if (result) {
        expect(result.address).toBe(
          '0x41563129cDbbD0c5D3e1c86cf9563926b243834d',
        )
      }
    })
  })
  describe('batch', () => {
    it('allows batch ccip', async () => {
      const result = await fnsInstance.batch(
        fnsInstance.getAddr.batch('1.offchainexample.eth'),
        fnsInstance.getAddr.batch('1.offchainexample.eth', 'LTC'),
        fnsInstance.getText.batch('1.offchainexample.eth', 'email'),
      )
      expect(result).toBeTruthy()
      if (result) {
        expect(result[0]).toBe('0x41563129cDbbD0c5D3e1c86cf9563926b243834d')
        expect(result[1]).toStrictEqual({
          coin: 'LTC',
          addr: 'MQMcJhpWHYVeQArcZR3sBgyPZxxRtnH441',
        })
        expect(result[2]).toBe('nick@ens.domains')
      }
    })
    it('allows nested batch ccip', async () => {
      const result = await fnsInstance.batch(
        fnsInstance.batch.batch(
          fnsInstance.getAddr.batch('1.offchainexample.eth'),
        ),
      )
      expect(result).toBeTruthy()
      if (result) {
        expect(result[0]![0]).toBe('0x41563129cDbbD0c5D3e1c86cf9563926b243834d')
      }
    })
  })
})
