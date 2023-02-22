import { FNS } from '@spheron/fnslib'
import { ethers } from 'ethers'
import { getSecondsFromYear } from '../lib/utils'

const providerUrl = 'https://api.hyperspace.node.glif.io/rpc/v1'
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
      return { error: false, response: res.hash }
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
    const address = await FNSInstance.getAddress(domainName)
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
    console.log('CONTENT: ', contentHash)
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
