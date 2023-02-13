import type batch from './batch'
import type {
  multicallWrapper,
  resolverMulticallWrapper,
  universalWrapper,
} from './batchWrappers'
import type commitName from './commitName'
import type createSubname from './createSubname'
import type deleteSubname from './deleteSubname'
import type getAvailable from './getAvailable'
import type getAddress from './getAddress'
import type getContent from './getContent'
import type getAddrName from './getAddrName'
import type getNameNode from './getNameNode'
import type getDecryptedName from './getDecryptedName'
import type getDNSOwner from './getDNSOwner'
import type getExpiry from './getExpiry'
import type { getHistory } from './getHistory'
import type getName from './getName'
import type getNames from './getNames'
import type getOwner from './getOwner'
import type getPrice from './getPrice'
import type getProfile from './getProfile'
import type getRecords from './getRecords'
import type getResolver from './getResolver'
import type {
  getABI,
  getAddr,
  getContentHash,
  getText,
  _getABI,
  _getAddr,
  _getContentHash,
  _getText,
} from './getSpecificRecord'
import type getSubnames from './getSubnames'
import type getWrapperData from './getWrapperData'
import type importDNSSECName from './importDNSSECName'
import type registerName from './registerName'
import type {
  // eslint-disable-next-line import/no-named-default
  default as renewNames,
  extendWrappedName,
} from './renewNames'
import type setFuses from './setFuses'
import type { setChildFuses } from './setFuses'
import type setName from './setName'
import type setRecord from './setRecord'
import type setRecords from './setRecords'
import type setResolver from './setResolver'
import type supportsTLD from './supportsTLD'
import type transferController from './transferController'
import type transferName from './transferName'
import type transferSubname from './transferSubname'
import type unwrapName from './unwrapName'
import type wrapName from './wrapName'

type Function = {
  batch: typeof batch
  multicallWrapper: typeof multicallWrapper
  resolverMulticallWrapper: typeof resolverMulticallWrapper
  universalWrapper: typeof universalWrapper
  setFuses: typeof setFuses
  setChildFuses: typeof setChildFuses
  commitName: typeof commitName
  createSubname: typeof createSubname
  deleteSubname: typeof deleteSubname
  getAvailable: typeof getAvailable
  getAddress: typeof getAddress
  getContent: typeof getContent
  getNameNode: typeof getNameNode
  getAddrName: typeof getAddrName
  getDecryptedName: typeof getDecryptedName
  getDNSOwner: typeof getDNSOwner
  getExpiry: typeof getExpiry
  getHistory: typeof getHistory
  getName: typeof getName
  getNames: typeof getNames
  getOwner: typeof getOwner
  getPrice: typeof getPrice
  getProfile: typeof getProfile
  getRecords: typeof getRecords
  getResolver: typeof getResolver
  getAddr: typeof getAddr
  getContentHash: typeof getContentHash
  getText: typeof getText
  getABI: typeof getABI
  _getAddr: typeof _getAddr
  _getContentHash: typeof _getContentHash
  _getText: typeof _getText
  _getABI: typeof _getABI
  getSubnames: typeof getSubnames
  getWrapperData: typeof getWrapperData
  importDNSSECName: typeof importDNSSECName
  registerName: typeof registerName
  renewNames: typeof renewNames
  extendWrappedName: typeof extendWrappedName
  setName: typeof setName
  setRecord: typeof setRecord
  setRecords: typeof setRecords
  setResolver: typeof setResolver
  supportsTLD: typeof supportsTLD
  transferController: typeof transferController
  transferName: typeof transferName
  transferSubname: typeof transferSubname
  unwrapName: typeof unwrapName
  wrapName: typeof wrapName
}

export default Function
