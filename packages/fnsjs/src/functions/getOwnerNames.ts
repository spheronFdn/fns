import { FNSArgs } from '../index'
// import { labelhash } from '../utils/labels'

const raw = async ({ contracts }: FNSArgs<'contracts'>, address: string) => {
  const baseRegistrar = await contracts?.getEthRegistrarController()!

  return {
    to: baseRegistrar.address,
    data: baseRegistrar.interface.encodeFunctionData('getNames', [address]),
  }
}

const decode = async ({ contracts }: FNSArgs<'contracts'>, data: string) => {
  if (data === null) return
  const baseRegistrar = await contracts?.getEthRegistrarController()!
  try {
    const result = baseRegistrar.interface.decodeFunctionResult(
      'getNames',
      data,
    )
    return result['0'] as string[]
  } catch {
    return
  }
}

export default {
  raw,
  decode,
}
