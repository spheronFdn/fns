import type { JsonRpcProvider } from '@ethersproject/providers'
import { FNSRegistry__factory } from '../generated/factories/FNSRegistry__factory'

export default (provider: JsonRpcProvider, address: string) =>
  FNSRegistry__factory.connect(address, provider)
