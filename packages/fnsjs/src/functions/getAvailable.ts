import { FNSArgs } from '../index'
// import { labelhash } from '../utils/labels'

const raw = async ({ contracts }: FNSArgs<'contracts'>, name: string) => {
  const baseRegistrar = await contracts?.getEthRegistrarController()!

  const labels = name.split('.')
  if (labels.length !== 2 || labels[1] !== 'fil') {
    throw new Error('Currently only .fil names can be checked for availability')
  }

  return {
    to: baseRegistrar.address,
    data: baseRegistrar.interface.encodeFunctionData('available', [labels[0]]),
  }
}

const decode = async ({ contracts }: FNSArgs<'contracts'>, data: string) => {
  if (data === null) return
  const baseRegistrar = await contracts?.getEthRegistrarController()!
  try {
    const result = baseRegistrar.interface.decodeFunctionResult(
      'available',
      data,
    )
    return result['0'] as boolean
  } catch {
    return
  }
}

export default {
  raw,
  decode,
}
