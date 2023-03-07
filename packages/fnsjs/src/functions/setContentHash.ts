import contentHash from 'content-hash'
import { toUtf8Bytes } from '@ethersproject/strings'
import { FNSArgs } from '..'
import { wrappedLabelLengthCheck } from '../utils/wrapper'
import { namehash } from '../utils/normalise'

export default async function (
  { contracts }: FNSArgs<'contracts'>,
  name: string,
  content: string,
) {
  const labels = name.split('.')
  if (labels.length !== 2 || labels[1] !== 'fil')
    throw new Error('Currently only .fil TLD are supported')

  wrappedLabelLengthCheck(labels[0])
  const hash = namehash(name)
  const hashValue = toUtf8Bytes(contentHash.fromIpfs(content))

  const controller = await contracts!.getPublicResolver()
  return controller.populateTransaction.setContenthash(hash, hashValue)
}
