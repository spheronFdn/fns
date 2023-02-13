import { ethers } from 'ethers'
import { FNS } from '../index'
import setup from './setup'

let fnsInstance: FNS
let providerFake: ethers.providers.JsonRpcProvider

beforeAll(async () => {
  ;({ fnsInstance } = await setup())
  providerFake = new ethers.providers.JsonRpcProvider(
    'http://localhost:34023',
    'ropsten',
  )
})

describe('withProvider', () => {
  it('should be able to use a new provider', async () => {
    const addr = await fnsInstance.getAddr('with-profile.eth')
    expect(addr).toBeTruthy()

    try {
      await fnsInstance.withProvider(providerFake).getOwner('with-profile.eth')
      expect(false).toBeTruthy()
    } catch {
      expect(true).toBeTruthy()
    }
  })
})
