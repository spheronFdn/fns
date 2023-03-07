import { BigNumber } from '@ethersproject/bignumber'
import { FNSArgs } from '..'
import {
  BaseRegistrationParams,
  makeRegistrationData,
} from '../utils/registerHelpers'
import { wrappedLabelLengthCheck } from '../utils/wrapper'

type Params = BaseRegistrationParams & {
  value: BigNumber
}

export default async function (
  { contracts }: FNSArgs<'contracts'>,
  name: string,
  { resolverAddress, value, ...params }: Params,
) {
  const labels = name.split('.')
  if (labels.length !== 2 || labels[1] !== 'fil')
    throw new Error('Currently only .fil TLD registrations are supported')

  wrappedLabelLengthCheck(labels[0])

  const controller = await contracts!.getEthRegistrarController()
  const _resolver = await contracts!.getPublicResolver(
    undefined,
    resolverAddress,
  )
  const generatedParams = makeRegistrationData({
    name,
    resolver: _resolver,
    ...params,
  })
  console.log('Params', generatedParams)
  return controller.populateTransaction.register(...generatedParams, {
    value,
  })
}
