import type { JsonRpcProvider } from '@ethersproject/providers'
import { RegistrarController__factory } from '../generated/factories/RegistrarController__factory'

export default (provider: JsonRpcProvider, address: string) =>
  RegistrarController__factory.connect(address, provider)
