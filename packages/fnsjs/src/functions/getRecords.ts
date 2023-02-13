import { FNSArgs } from '../index'
import { parseInputType } from '../utils/validation'

type ProfileOptions = {
  contentHash?: boolean
  texts?: boolean | string[]
  coinTypes?: boolean | string[]
  resolverAddress?: string
}

export default async function (
  { getProfile }: FNSArgs<'getProfile'>,
  name: string,
  options?: ProfileOptions,
) {
  const inputType = parseInputType(name)

  if (inputType.type !== 'name' && inputType.type !== 'label') {
    throw new Error('Input must be an FNS name')
  }

  return getProfile(name, options)
}
