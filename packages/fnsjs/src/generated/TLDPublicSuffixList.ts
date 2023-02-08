/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type { FunctionFragment, Result } from '@ethersproject/abi'
import { Interface } from '@ethersproject/abi'
import type { Listener, Provider } from '@ethersproject/abstract-provider'
import type { Signer } from '@ethersproject/abstract-signer'
import type { BigNumber } from '@ethersproject/bignumber'
import type { BytesLike } from '@ethersproject/bytes'
import type {
  BaseContract,
  CallOverrides,
  PopulatedTransaction,
} from '@ethersproject/contracts'
import type {
  OnEvent,
  PromiseOrValue,
  TypedEvent,
  TypedEventFilter,
  TypedListener,
} from './common'

export interface TLDPublicSuffixListInterface extends Interface {
  functions: {
    'isPublicSuffix(bytes)': FunctionFragment
  }

  getFunction(nameOrSignatureOrTopic: 'isPublicSuffix'): FunctionFragment

  encodeFunctionData(
    functionFragment: 'isPublicSuffix',
    values: [PromiseOrValue<BytesLike>],
  ): string

  decodeFunctionResult(
    functionFragment: 'isPublicSuffix',
    data: BytesLike,
  ): Result

  events: {}
}

export interface TLDPublicSuffixList extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this
  attach(addressOrName: string): this
  deployed(): Promise<this>

  interface: TLDPublicSuffixListInterface

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined,
  ): Promise<Array<TEvent>>

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>,
  ): Array<TypedListener<TEvent>>
  listeners(eventName?: string): Array<Listener>
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>,
  ): this
  removeAllListeners(eventName?: string): this
  off: OnEvent<this>
  on: OnEvent<this>
  once: OnEvent<this>
  removeListener: OnEvent<this>

  functions: {
    isPublicSuffix(
      name: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides,
    ): Promise<[boolean]>
  }

  isPublicSuffix(
    name: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides,
  ): Promise<boolean>

  callStatic: {
    isPublicSuffix(
      name: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides,
    ): Promise<boolean>
  }

  filters: {}

  estimateGas: {
    isPublicSuffix(
      name: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>
  }

  populateTransaction: {
    isPublicSuffix(
      name: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>
  }
}
