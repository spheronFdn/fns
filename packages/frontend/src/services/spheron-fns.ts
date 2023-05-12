import { FNS } from '@spheron/fnslib'
import { BlockchainIdentifier } from '@spheron/fnslib/utils/blockchainIdentifiers'
import { ethers } from 'ethers'
import { getSecondsFromYear } from '../lib/utils'

const providerUrl = process.env.REACT_APP_RPC_URL
const provider = new ethers.providers.JsonRpcProvider(providerUrl)

export const isAvailable = async (name: string) => {
  try {
    const FNSInstance = new FNS()
    await FNSInstance.setProvider(provider)
    const isAvailable = await FNSInstance.getAvailable(name)
    return { error: false, response: !!isAvailable }
  } catch (error) {
    return { error: true, response: (error as Error).message }
  }
}

export const getPriceOnYear = async (name: string, duration: number) => {
  try {
    const FNSInstance = new FNS()
    await FNSInstance.setProvider(provider)
    const price = await FNSInstance.getPrice(name, getSecondsFromYear(duration))
    return { error: true, response: price }
  } catch (error) {
    return { error: true, response: (error as Error).message }
  }
}

//  Set Addr
export const setAddr = async (domainName: string, value: string) => {
  try {
    const FNSInstance = new FNS()
    const provider = new ethers.providers.Web3Provider((window as any).ethereum)
    await FNSInstance.setProvider(provider)
    const res = await FNSInstance.setAddr(domainName, {
      address: String(value),
      coinType: BlockchainIdentifier.FILCOINEVM,
    })
    await res.wait()
    localStorage.removeItem('domain-underpurchase')
    return { error: false, response: res }
  } catch (error) {
    console.log('ERROR: ', error)
    return { error: true, response: (error as Error).message }
  }
}

export const registerDomain = async (
  name: string,
  address: string,
  duration: number,
  price: string,
) => {
  try {
    const FNSInstance = new FNS()
    const provider = new ethers.providers.Web3Provider((window as any).ethereum)
    await FNSInstance.setProvider(provider)
    if (await isAvailable(name)) {
      const res = await FNSInstance.registerName(name, {
        owner: address,
        duration: getSecondsFromYear(duration),
        secret: process.env.REACT_APP_SPHERON_SECRET || '',
        value: ethers.utils.parseUnits(price, 18),
      })
      await res.wait()
      if (res.hash) {
        return { error: false, response: res.hash }
      } else {
        return { error: true, response: 'Something went wrong' }
      }
    } else {
      return { error: true, response: 'Domain is not available' }
    }
  } catch (error) {
    return { error: true, response: (error as Error).message }
  }
}

export const getProfile = async (domainName: string) => {
  try {
    const FNSInstance = new FNS()
    await FNSInstance.setProvider(provider)
    const profile = await FNSInstance.getProfile(domainName)
    return { error: false, response: profile }
  } catch (error) {
    return { error: true, response: (error as Error).message }
  }
}

export const getAddress = async (domainName: string) => {
  try {
    const FNSInstance = new FNS()
    await FNSInstance.setProvider(provider)
    const address = await FNSInstance.getAddress(
      domainName,
      BlockchainIdentifier.FILCOINEVM,
    )
    return { error: false, response: address }
  } catch (error) {
    return { error: true, response: (error as Error).message }
  }
}

export const getContentHash = async (domainName: string) => {
  try {
    const FNSInstance = new FNS()
    await FNSInstance.setProvider(provider)
    const contentHash = await FNSInstance.getContent(domainName)
    if (!contentHash?.protocolType || !contentHash?.decoded) {
      return {
        error: false,
        response: '',
      }
    }
    return {
      error: false,
      response: `${contentHash?.protocolType}://${contentHash?.decoded}`,
    }
  } catch (error) {
    return { error: true, response: (error as Error).message }
  }
}

export const getNameFromAddress = async (address: string) => {
  try {
    const FNSInstance = new FNS()
    await FNSInstance.setProvider(provider)
    const node = await FNSInstance.getNameNode(address)
    const name = await FNSInstance.getAddrName(node)
    console.log('NAME: ', name, address)
    return { error: false, response: name }
  } catch (error) {
    console.log(error)
    return { error: true, response: (error as Error).message }
  }
}

export const getExpiry = async (domainName: string) => {
  try {
    const FNSInstance = new FNS()
    await FNSInstance.setProvider(provider)
    const expiry = await FNSInstance.getExpiry(domainName)
    return { error: false, response: expiry?.expiry }
  } catch (error) {
    return { error: true, response: (error as Error).message }
  }
}
//  Set Content Hash
export const setContentHash = async (
  domainName: string,
  value: string,
  callback: (step: string) => void,
) => {
  try {
    const FNSInstance = new FNS()
    const provider = new ethers.providers.Web3Provider((window as any).ethereum)
    await FNSInstance.setProvider(provider)
    callback('tx-confirm')
    const res = await FNSInstance.setContentHash(domainName, value)
    callback('tx-started')
    await res.wait()
    return { error: false, response: res }
  } catch (error) {
    console.log('ERROR: ', error)
    return { error: true, response: (error as Error).message }
  }
}

export const getOwnerNames = async (address: string) => {
  try {
    const FNSInstance = new FNS()
    await FNSInstance.setProvider(provider)
    const names = await FNSInstance.getOwnerNames(address)
    return { error: false, response: names }
  } catch (error) {
    console.log(error)
    return { error: true, response: (error as Error).message }
  }
}

export const setTextRecord = async (
  domainName: string,
  key: string,
  value: string,
) => {
  try {
    const FNSInstance = new FNS()
    const provider = new ethers.providers.Web3Provider((window as any).ethereum)
    await FNSInstance.setProvider(provider)
    const res = await FNSInstance.setTxtRecord(domainName, { key, value })
    await res.wait()
    return { error: false, response: res }
  } catch (error) {
    console.log('ERROR: ', error)
    return { error: true, response: (error as Error).message }
  }
}

export const getTextRecord = async (domainName: string, key: string) => {
  try {
    const FNSInstance = new FNS()
    const provider = new ethers.providers.Web3Provider((window as any).ethereum)
    await FNSInstance.setProvider(provider)
    const res = await FNSInstance.getTxtRecord(domainName, key)
    return { error: false, response: res }
  } catch (error) {
    console.log('ERROR: ', error)
    return { error: true, response: (error as Error).message }
  }
}

export const getRecords = async (domainName: string) => {
  try {
    const FNSInstance = new FNS()
    const provider = new ethers.providers.Web3Provider((window as any).ethereum)
    await FNSInstance.setProvider(provider)
    const res = await FNSInstance.getRecords(domainName)
    return { error: false, response: res }
  } catch (error) {
    console.log('ERROR: ', error)
    return { error: true, response: (error as Error).message }
  }
}

export const renewNames = async (
  name: string,
  duration: number,
  price: string,
) => {
  try {
    const FNSInstance = new FNS()
    const provider = new ethers.providers.Web3Provider((window as any).ethereum)
    await FNSInstance.setProvider(provider)
    const res = await FNSInstance.renewNames(name, {
      duration: getSecondsFromYear(duration),
      value: ethers.utils.parseUnits(price, 18),
    })
    await res.wait()
    if (res.hash) {
      return { error: false, response: res.hash }
    } else {
      return { error: true, response: 'Something went wrong' }
    }
  } catch (error) {
    return { error: true, response: (error as Error).message }
  }
}
