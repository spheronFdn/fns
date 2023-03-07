import { BigNumber } from '@ethersproject/bignumber'
import { toUtf8Bytes } from '@ethersproject/strings'

export type Expiry = string | number | Date | BigNumber

export const expiryToBigNumber = (expiry?: Expiry, defaultValue = 0) => {
  if (!expiry) return BigNumber.from(defaultValue)
  if (expiry instanceof Date) {
    return BigNumber.from(expiry.getTime() / 1000)
  }
  if (expiry instanceof BigNumber) {
    return expiry
  }
  return BigNumber.from(expiry)
}

export const wrappedLabelLengthCheck = (label: string) => {
  const bytes = toUtf8Bytes(label)
  if (bytes.byteLength > 255)
    throw new Error("Label can't be longer than 255 bytes")
}
