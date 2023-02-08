import { ENSArgs } from '../index'

const raw = async ({ contracts }: ENSArgs<'contracts'>, address: string) => {
  const publicResolver = await contracts?.getPublicResolver()!
  const reverseRegistrar = await contracts?.getReverseRegistrar()!
  const reverseNode = await reverseRegistrar.node(address)
  return {
    to: publicResolver.address,
    data: publicResolver.interface.encodeFunctionData('name(bytes32)', [
      reverseNode,
    ]),
  }
}

const decode = async (
  { contracts }: ENSArgs<'contracts'>,
  data: string,
  address: string,
) => {
  if (data === null) return
  const universalResolver = await contracts?.getPublicResolver()!
  try {
    const result = universalResolver.interface.decodeFunctionResult(
      'name(bytes32)',
      data,
    )
    return {
      name: result['0'],
      match: result['1'].toLowerCase() === address.toLowerCase(),
      reverseResolverAddress: result['2'],
      resolverAddress: result['3'],
    }
  } catch {
    return { name: undefined }
  }
}

export default {
  raw,
  decode,
}
