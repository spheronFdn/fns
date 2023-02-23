import { FNSArgs } from '../index'
// import { namehash } from '../utils/normalise'

const raw = async ({ contracts }: FNSArgs<'contracts'>, name: string) => {
  const baseRegistrar = await contracts?.getPublicResolver()!

  return {
    to: baseRegistrar.address,
    data: baseRegistrar.interface.encodeFunctionData('name', [name]),
  }
}

const decode = async ({ contracts }: FNSArgs<'contracts'>, data: string) => {
  if (data === null) return
  const baseRegistrar = await contracts?.getPublicResolver()!
  try {
    const result = baseRegistrar.interface.decodeFunctionResult('name', data)
    return result[0]
  } catch {
    return 'nil'
  }
}

export default {
  raw,
  decode,
}
