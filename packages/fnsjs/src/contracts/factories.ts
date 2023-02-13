/* eslint-disable @typescript-eslint/naming-convention */
import type { BaseRegistrarImplementation__factory } from '../generated/factories/BaseRegistrarImplementation__factory'
import type { BulkRenewal__factory } from '../generated/factories/BulkRenewal__factory'
import type { DefaultReverseResolver__factory } from '../generated/factories/DefaultReverseResolver__factory'
import type { DNSRegistrar__factory } from '../generated/factories/DNSRegistrar__factory'
import type { DNSSECImpl__factory } from '../generated/factories/DNSSECImpl__factory'
import type { ENSRegistry__factory } from '../generated/factories/FNSRegistry__factory'
import type { ETHRegistrarController__factory } from '../generated/factories/ETHRegistrarController__factory'
import type { Multicall__factory } from '../generated/factories/Multicall__factory'
import type { NameWrapper__factory } from '../generated/factories/NameWrapper__factory'
import type { P256SHA256Algorithm__factory } from '../generated/factories/P256SHA256Algorithm__factory'
import type { PublicResolver__factory } from '../generated/factories/PublicResolver__factory'
import type { ReverseRegistrar__factory } from '../generated/factories/ReverseRegistrar__factory'
import type { Root__factory } from '../generated/factories/Root__factory'
import type { RSASHA1Algorithm__factory } from '../generated/factories/RSASHA1Algorithm__factory'
import type { RSASHA256Algorithm__factory } from '../generated/factories/RSASHA256Algorithm__factory'
import type { SHA1Digest__factory } from '../generated/factories/SHA1Digest__factory'
import type { SHA1NSEC3Digest__factory } from '../generated/factories/SHA1NSEC3Digest__factory'
import type { SHA256Digest__factory } from '../generated/factories/SHA256Digest__factory'
import type { StaticMetadataService__factory } from '../generated/factories/StaticMetadataService__factory'
import type { TLDPublicSuffixList__factory } from '../generated/factories/TLDPublicSuffixList__factory'
import type { UniversalResolver__factory } from '../generated/factories/UniversalResolver__factory'

type Factories = {
  BaseRegistrarImplementation: BaseRegistrarImplementation__factory
  DefaultReverseResolver: DefaultReverseResolver__factory
  DNSRegistrar: DNSRegistrar__factory
  DNSSECImpl: DNSSECImpl__factory
  ENSRegistry: ENSRegistry__factory
  ETHRegistrarController: ETHRegistrarController__factory
  P256SHA256Algorithm: P256SHA256Algorithm__factory
  PublicResolver: PublicResolver__factory
  ReverseRegistrar: ReverseRegistrar__factory
  Root: Root__factory
  RSASHA1Algorithm: RSASHA1Algorithm__factory
  RSASHA256Algorithm: RSASHA256Algorithm__factory
  SHA1Digest: SHA1Digest__factory
  SHA1NSEC3Digest: SHA1NSEC3Digest__factory
  SHA256Digest: SHA256Digest__factory
  TLDPublicSuffixList: TLDPublicSuffixList__factory
  Multicall: Multicall__factory
  NameWrapper: NameWrapper__factory
  StaticMetadataService: StaticMetadataService__factory
  UniversalResolver: UniversalResolver__factory
  BulkRenewal: BulkRenewal__factory
}

export default Factories
