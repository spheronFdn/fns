import { BigNumber } from '@ethersproject/bignumber'
import { FNSArgs } from '../index'

const raw = async ({ contracts }: FNSArgs<'contracts'>, name: string) => {
  const controller = await contracts?.getEthRegistrarController()!
  const labels = name.split('.')
  if (labels.length !== 2 || labels[1] !== 'fil')
    throw new Error('Currently only .fil TLD registrations are supported')

  const baseCall = {
    to: controller.address,
    data: controller.interface.encodeFunctionData('nameExpires', [labels[0]]),
  }
  return baseCall
}

const decode = async ({ contracts }: FNSArgs<'contracts'>, data: string) => {
  if (data === null) return
  const controller = await contracts?.getEthRegistrarController()!
  try {
    const result = controller.interface.decodeFunctionResult(
      'nameExpires',
      data,
    )
    return {
      expiry: BigNumber.from(result[0]).add(BigNumber.from(7776000)),
    }
  } catch {
    return
  }
}

export default { raw, decode }
