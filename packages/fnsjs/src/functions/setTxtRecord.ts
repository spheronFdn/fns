import { FNSArgs } from '..'
import { wrappedLabelLengthCheck } from '../utils/wrapper'
import { namehash } from '../utils/normalise'

type BaseArgs = {
  key: string
  value: string
}

export default async function (
  { contracts }: FNSArgs<'contracts'>,
  name: string,
  { key, value }: BaseArgs,
) {
  const labels = name.split('.')
  if (labels.length !== 2 || labels[1] !== 'fil')
    throw new Error('Currently only .fil TLD are supported')

  wrappedLabelLengthCheck(labels[0])
  const hash = namehash(name)

  const controller = await contracts!.getPublicResolver()
  return controller.populateTransaction.setText(hash, key, value)
}
