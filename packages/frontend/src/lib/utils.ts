import { ethers } from 'ethers'
import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isValidAddress = (address: string): boolean => {
  return ethers.utils.isAddress(address)
}

export const truncateAddress = (address: string): string => {
  return `${address.slice(0, 2)}....${address.slice(
    address.length - 3,
    address.length,
  )}`
}

export const getSecondsFromYear = (year: number): number => {
  return year * 365 * 24 * 60 * 60
}

export const getUserBalance = async (address: string) => {
  try {
    const network = process.env.REACT_APP_RPC_URL
    const provider = new ethers.providers.JsonRpcProvider(network)
    const balance = await provider.getBalance(address)
    const balanceInFil = ethers.utils.formatEther(balance)
    return balanceInFil
  } catch (error) {
    console.log('ERROR: ', error)
    return '0'
  }
}

export const getFee = async () => {
  try {
    const network = process.env.REACT_APP_RPC_URL
    const provider = new ethers.providers.JsonRpcProvider(network)
    const feeData = await provider.getFeeData()
    return ethers.utils.formatUnits(`${parseInt(feeData!.gasPrice!._hex, 16)}`)
  } catch (error) {
    console.log('ERROR: ', error)
    return '0'
  }
}

export const copyToClipboard = async (value: string) => {
  await navigator.clipboard.writeText(value || '')
}
