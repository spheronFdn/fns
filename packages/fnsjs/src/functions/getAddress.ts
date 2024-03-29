import { toUtf8String } from '@ethersproject/strings'
import { FNSArgs } from '../index'
import { namehash } from '../utils/normalise'
import { BlockchainIdentifier } from '../utils/blockchainIdentifiers'

const raw = async (
  { contracts }: FNSArgs<'contracts'>,
  name: string,
  coinType: BlockchainIdentifier,
) => {
  const baseRegistrar = await contracts?.getPublicResolver()!

  const label = namehash(name)

  return {
    to: baseRegistrar.address,
    data: baseRegistrar.interface.encodeFunctionData('addr(bytes32,uint256)', [
      label,
      coinType,
    ]),
  }
}

const decode = async ({ contracts }: FNSArgs<'contracts'>, data: string) => {
  if (data === null) return
  const baseRegistrar = await contracts?.getPublicResolver()!
  try {
    const result = baseRegistrar.interface.decodeFunctionResult(
      'addr(bytes32,uint256)',
      data,
    )
    return toUtf8String(result[0])
  } catch {
    return
  }
}

export default {
  raw,
  decode,
}
