import { FNS } from '@spheron/fnslib'
import { BigNumber, ethers } from 'ethers'
import { getSecondsFromYear } from '../lib/utils'

const providerUrl = 'https://api.hyperspace.node.glif.io/rpc/v1'
const provider = new ethers.providers.JsonRpcProvider(providerUrl)

export const isAvailable = async (name: string): Promise<boolean | string> => {
  try {
    console.log('NAME: -', name)
    const FNSInstance = new FNS()
    await FNSInstance.setProvider(provider)
    const isAvailable = await FNSInstance.getAvailable(name)
    return !!isAvailable
  } catch (error) {
    console.log('ERROR: ', error)
    return error as string
  }
}

export const getPriceOnYear = async (name: string, duration: number) => {
  try {
    const FNSInstance = new FNS()
    await FNSInstance.setProvider(provider)
    const price = await FNSInstance.getPrice(name, getSecondsFromYear(duration))

    return price
  } catch (error) {
    return error
  }
}

export const registerDomain = async (
  name: string,
  address: string,
  duration: number,
  price: BigNumber,
) => {
  try {
    const FNSInstance = new FNS()
    await FNSInstance.setProvider(provider)

    const res = await FNSInstance.registerName(name, {
      owner: address,
      duration: getSecondsFromYear(duration),
      secret: process.env.REACT_APP_SPHERON_SECRET || '',
      value: price,
    })
    console.log('RESPONE: ', res)
    return res
  } catch (error) {
    console.log(error)
    return error
  }
}

export const getProfile = async (domainName: string) => {
  try {
    const FNSInstance = new FNS()
    await FNSInstance.setProvider(provider)
    const profile = await FNSInstance.getProfile(domainName)
    return profile
  } catch (error) {
    console.log('ERROR: ', error)
  }
}

export const getAddress = async (domainName: string) => {
  try {
    const FNSInstance = new FNS()
    await FNSInstance.setProvider(provider)
    const address = await FNSInstance.getAddress(domainName)
    return address
  } catch (error) {
    console.log('ERROR: ', error)
  }
}

export const getContentHash = async (domainName: string) => {
  const FNSInstance = new FNS()
  await FNSInstance.setProvider(provider)
  const contentHash = await FNSInstance.getContent(domainName)
  console.log('CONTENT: ', contentHash)
  return `${contentHash?.protocolType}://${contentHash?.decoded}`
}

export const getNameFromAddress = async (address: string) => {
  try {
    const FNSInstance = new FNS()
    await FNSInstance.setProvider(provider)
    const node = await FNSInstance.getNameNode(address)
    const name = await FNSInstance.getAddrName(node)
    return name
  } catch (error) {
    console.log(error)
  }
}
