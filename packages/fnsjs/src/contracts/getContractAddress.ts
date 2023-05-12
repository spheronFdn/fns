import { ContractName, SupportedNetworkId } from './types'

const addresses: Record<
  ContractName,
  Partial<Record<SupportedNetworkId, string>> | string
> = {
  /* eslint-disable @typescript-eslint/naming-convention */
  BaseRegistrarImplementation: {
    '1': '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85',
    '3': '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85',
    '4': '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85',
    '5': '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85',
    '314': '0xd74C08f8ffDF88C807367813Ad64a960618f4dcC',
    '3141': '0x480D84AADf8B72929de7b99C9708bf58506b8568',
    '314159': '0xB52329A11333462D192110357Be2da470B79B13e',
  },
  DNSRegistrar: {
    '1': '0x58774Bb8acD458A640aF0B88238369A167546ef2',
    '3': '0xdB328BA5FEcb432AF325Ca59E3778441eF5aa14F',
    '5': '0x8edc487D26F6c8Fa76e032066A3D4F87E273515d',
  },
  ETHRegistrarController: {
    '1': '0x283af0b28c62c092c9727f1ee09c02ca627eb7f5',
    '3': '0xa5627AB7Ae47063B533622C34FEBDb52d3281dF8',
    '4': '0x283af0b28c62c092c9727f1ee09c02ca627eb7f5',
    '5': '0x603A4F2e7615d0099244496883062bA2eFBbeaf0',
    '314': '0xB52329A11333462D192110357Be2da470B79B13e',
    '3141': '0x986acF45e1475c6c386B78E9f57E642E052bAffd',
    '314159': '0x270d622149F46fFc72A9fD5A8cF92D1FdE5AD5E0',
  },
  Multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
  NameWrapper: {
    '1': '0x0000000000000000000000000000000000000000',
    '3': '0xF82155e2a43Be0871821E9654Fc8Ae894FB8307C',
    '4': '0x0000000000000000000000000000000000000000',
    '5': '0x060f1546642E67c485D56248201feA2f9AB1803C',
  },
  PublicResolver: {
    '1': '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
    '3': '0x13F0659Ee6bb7484C884FEeFb7F75C93951ef837',
    '5': '0x19c2d5D0f035563344dBB7bE5fD09c8dad62b001',
    '314': '0x76e593392523243ACD38ceD87c2007F14483a86B',
    '3141': '0xbeB0B97A5e238b383f45757dE2e93080DACe0eCb',
    '314159': '0xA0c5ba7d9eccbE59000e8E67654CA5d867C6b401',
  },
  ENSRegistry: {
    '1': '0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e',
    '3': '0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e',
    '4': '0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e',
    '5': '0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e',
    '314': '0x816413630c39780677E1584D4a6DbAFd76b161F7',
    '3141': '0x6a099BBaD55C2B50c159cAaA4E35B59114a0a941',
    '314159': '0xcF5F08686dBE94B88b93FB2E8E5482A7f432C892',
  },
  ReverseRegistrar: {
    '1': '0x084b1c3C81545d370f3634392De611CaaBFf8148',
    '3': '0x806246b52f8cB61655d3038c58D2f63Aa55d4edE',
    '5': '0x9a879320A9F7ad2BBb02063d67baF5551D6BD8B0',
    '314': '0xcF5F08686dBE94B88b93FB2E8E5482A7f432C892',
    '3141': '0x751aeD410cAb124192ab0f5189fb36B99D222F19',
    '314159': '0xd74C08f8ffDF88C807367813Ad64a960618f4dcC',
  },
  UniversalResolver: {
    '1': '0x74E20Bd2A1fE0cdbe45b9A1d89cb7e0a45b36376',
    '3': '0x74e20bd2a1fe0cdbe45b9a1d89cb7e0a45b36376',
    '4': '0x74e20bd2a1fe0cdbe45b9a1d89cb7e0a45b36376',
    '5': '0x687c30Cc44bFA39A1449e86E172BF002E7b3f0b0',
  },
  BulkRenewal: {
    '1': '0xfF252725f6122A92551A5FA9a6b6bf10eb0Be035',
    '3': '0x051b02245D826757EfaF5C6209D4D79FB39FBC45',
    '5': '0xa9e1df95a79C768aA435805b28E1B54Bb5ead063',
  },
  /* eslint-enable @typescript-eslint/naming-convention */
}

export type ContractAddressFetch = (contractName: ContractName) => string

export const getContractAddress = (networkId: SupportedNetworkId) =>
  ((contractName: ContractName) => {
    try {
      return typeof addresses[contractName] === 'string'
        ? addresses[contractName]
        : addresses[contractName][networkId]
    } catch {
      throw new Error(
        `No address for contract ${contractName} on network ${networkId}`,
      )
    }
  }) as ContractAddressFetch
