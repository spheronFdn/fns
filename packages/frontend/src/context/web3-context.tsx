import React, { createContext, useState } from 'react'
import { getUserBalance } from '../lib/utils'

export const Web3Context: any = createContext<any>({} as any)

const { ethereum } = window as any

const Web3ContextProvider: any = ({ children }: any) => {
  const [currentAccount, setCurrentAccount] = useState(null)
  const [userBalance, setUserBalance] = useState('')

  const disconnectWallet = async () => {
    try {
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
        params: [{ eth_accounts: {} }],
      })
      console.log(accounts)
      setCurrentAccount(null)
    } catch (error) {}
  }

  const connectWallet = async () => {
    if (!ethereum) {
      alert('Please install MetaMask to use this application')
      return
    }
    try {
      if (
        (window as any).ethereum.chainId !== `0x${Number(3141).toString(16)}`
      ) {
        await (window as any).ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${Number(3141).toString(16)}`,
              rpcUrls: [process.env.REACT_APP_RPC_URL],
              chainName: 'Filecoin hyperspace',
              nativeCurrency: {
                name: 'tFIL',
                symbol: 'tFIL',
                decimals: 18,
              },
              blockExplorerUrls: ['https://hyperspace.filfox.info'],
            },
          ],
        })
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      })
      setCurrentAccount(accounts[0])
      const userBalanceRes = await getUserBalance(accounts[0])
      setUserBalance(userBalanceRes)
    } catch (error) {
      console.log(error)
      throw new Error('No Ethereum Object')
    }
  }

  return (
    <Web3Context.Provider
      value={{
        connectWallet,

        disconnectWallet,
        currentAccount,
        setCurrentAccount,
        userBalance,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}
export default Web3ContextProvider
