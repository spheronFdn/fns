import { BigNumber } from '@ethersproject/bignumber'
import { FNSArgs } from '../index'
import { BaseRegistrationParams } from '../utils/registerHelpers'
import { wrappedLabelLengthCheck } from '../utils/wrapper'

type Params = BaseRegistrationParams & {
  value: BigNumber
}

export default async function (
  { contracts }: FNSArgs<'contracts'>,
  name: string,
  address: string,
  duration: number,
  { value }: Params,
) {
  const labels = name.split('.')
  if (labels.length !== 2 || labels[1] !== 'fil')
    throw new Error('Currently only .fil TLD registrations are supported')

  wrappedLabelLengthCheck(labels[0])

  const controller = await contracts!.getEthRegistrarController()
  const resolver = await contracts?.getPublicResolver()!

  return controller.populateTransaction.register(
    name,
    address,
    duration,
    resolver.address,
    [],
    true,
    {
      value,
    },
  )
}
