import { FNSArgs } from '../index'
// import { labelhash } from '../utils/labels'

const raw = async ({ contracts }: FNSArgs<'contracts'>, name: string) => {
  const baseRegistrar = await contracts?.getReverseRegistrar()!

  return {
    to: baseRegistrar.address,
    data: baseRegistrar.interface.encodeFunctionData('node', [name]),
  }
}

const decode = async ({ contracts }: FNSArgs<'contracts'>, data: string) => {
  if (data === null) return
  const baseRegistrar = await contracts?.getReverseRegistrar()!
  try {
    const result = baseRegistrar.interface.decodeFunctionResult('node', data)
    return result['0']
  } catch {
    return
  }
}

export default {
  raw,
  decode,
}
