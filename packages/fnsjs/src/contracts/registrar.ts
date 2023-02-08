import type { JsonRpcProvider } from '@ethersproject/providers'
import { Registrar__factory } from '../generated/factories/Registrar__factory'

export default (provider: JsonRpcProvider, address: string) =>
  Registrar__factory.connect(address, provider)
