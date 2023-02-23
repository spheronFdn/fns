import type { Provider } from '@ethersproject/providers'

export default async (
  provider: Provider,
  fnsData: any,
  func: {
    raw: (
      ...args: any[]
    ) => Promise<{ to: string; data: string; passthrough?: any }>
    decode: (...args: any[]) => Promise<any>
  },
  ...data: any[]
) => {
  const { passthrough, ...rawData } = await func.raw(fnsData, ...data)
  const result = await provider
    .call({ ...rawData, ccipReadEnabled: true })
    .catch(() => null)
  if (!result) return
  if (passthrough) return func.decode(fnsData, result, passthrough, ...data)
  return func.decode(fnsData, result, ...data)
}
