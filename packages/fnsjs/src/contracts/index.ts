import type { Interface } from '@ethersproject/abi'
import type { Signer } from '@ethersproject/abstract-signer'
import type { BaseContract } from '@ethersproject/contracts'
import type { Provider } from '@ethersproject/providers'
import type { Registrar } from '../generated/Registrar'
import type { FNSRegistry } from '../generated/FNSRegistry'
import type { RegistrarController } from '../generated/RegistrarController'
import type { PublicResolver } from '../generated/PublicResolver'
import type { ReverseRegistrar } from '../generated/ReverseRegistrar'
import { ContractAddressFetch } from './getContractAddress'
import { ContractName } from './types'

type BaseFactory = {
  readonly abi: object
  createInterface(): Interface
  connect(address: string, signerOrProvider: Signer | Provider): BaseContract
}

export default class ContractManager {
  private provider: Provider

  private fetchAddress: ContractAddressFetch

  // eslint-disable-next-line class-methods-use-this
  protected getModule = async (name: string) => {
    const mod = await import(
      /* webpackMode: "lazy", webpackChunkName: "[request]", webpackPreload: true, webpackExclude: /.*\.ts$/ */
      `../generated/factories/${name}__factory`
    )
    return mod[`${name}__factory`] as BaseFactory
  }

  constructor(
    provider: Provider,
    fetchAddress: ContractAddressFetch,
    getModule?: (name: string) => Promise<BaseFactory>,
  ) {
    this.provider = provider
    this.fetchAddress = fetchAddress
    if (getModule) {
      this.getModule = getModule
    }
  }

  private generateContractGetter = <C extends BaseContract>(
    name: ContractName,
  ): ((passedProvider?: any, address?: string) => Promise<C>) => {
    return async (passedProvider, address) => {
      const mod = await this.getModule(name)
      const inputAddress = address || this.fetchAddress(name)
      const provider = passedProvider || this.provider
      return mod.connect(inputAddress, provider) as C
    }
  }

  public getPublicResolver =
    this.generateContractGetter<PublicResolver>('PublicResolver')

  public getRegistry = this.generateContractGetter<FNSRegistry>('FNSRegistry')

  public getReverseRegistrar =
    this.generateContractGetter<ReverseRegistrar>('ReverseRegistrar')

  public getBaseRegistrar = this.generateContractGetter<Registrar>('Registrar')

  public getEthRegistrarController =
    this.generateContractGetter<RegistrarController>('RegistrarController')
}
