import { toUtf8String } from '@ethersproject/strings'
import { FNSArgs } from '../index'
import { namehash } from '../utils/normalise'
import { decodeContenthash } from '../utils/contentHash'

const raw = async ({ contracts }: FNSArgs<'contracts'>, name: string) => {
  const baseRegistrar = await contracts?.getPublicResolver()!

  const label = namehash(name)

  return {
    to: baseRegistrar.address,
    data: baseRegistrar.interface.encodeFunctionData('contenthash', [label]),
  }
}

const decode = async ({ contracts }: FNSArgs<'contracts'>, data: string) => {
  if (data === null) return
  const baseRegistrar = await contracts?.getPublicResolver()!
  try {
    const result = baseRegistrar.interface.decodeFunctionResult(
      'contenthash',
      data,
    )
    return decodeContenthash(toUtf8String(result[0]))
  } catch {
    return
  }
}

export default {
  raw,
  decode,
}
