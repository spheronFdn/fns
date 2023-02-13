import { ContractTransaction, ethers } from 'ethers'
import { FNS } from '../index'
import setup from './setup'

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

jest.setTimeout(20000)

describe('Signer Injection', () => {
  beforeEach(async () => {
    await revert()
  })
  it('should return a transaction successfully for a custom signer', async () => {
    const signer = provider.getSigner(accounts[3])
    const tx = await fnsInstance.setName('fleek.eth', {
      signer,
    })
    expect(tx).toBeTruthy()
    if (tx) {
      await tx.wait()
      expect(tx.from).toBe(accounts[3])
    }
  })
  it('should return a transaction successfully for a custom signer index', async () => {
    const tx = (await fnsInstance.setName('fleek.eth', {
      addressOrIndex: 3,
    })) as ContractTransaction
    expect(tx).toBeTruthy()
    if (tx) {
      await tx.wait()
      expect(tx.from).toBe(accounts[3])
    }
  })
})
