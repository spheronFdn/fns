import { FNSArgs } from '../index'
import { namehash } from '../utils/normalise'

const raw = async (
  { contracts }: FNSArgs<'contracts'>,
  name: string,
  key: string,
) => {
  const baseRegistrar = await contracts?.getPublicResolver()!

  const label = namehash(name)

  return {
    to: baseRegistrar.address,
    data: baseRegistrar.interface.encodeFunctionData('text', [label, key]),
  }
}

const decode = async ({ contracts }: FNSArgs<'contracts'>, data: string) => {
  if (data === null) return
  const baseRegistrar = await contracts?.getPublicResolver()!
  try {
    const result = baseRegistrar.interface.decodeFunctionResult('text', data)
    return result[0]
  } catch {
    return
  }
}

export default {
  raw,
  decode,
}
