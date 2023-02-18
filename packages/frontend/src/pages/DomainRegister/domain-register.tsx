import React, { useContext, useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Button } from '../../components/UI/button'
import { getPriceOnYear, registerDomain } from '../../services/spheron-fns'
import { Web3Context } from '../../context/web3-context'
import { ethers } from 'ethers'
import { getFee, getUserBalance } from '../../lib/utils'

const DomainRegister = () => {
  const Web3Cntx = useContext<any>(Web3Context)
  const { currentAccount } = Web3Cntx
  const [searchQuery, isDomainAvailable, loading] =
    useOutletContext<[string, boolean, boolean]>()
  const [priceLoading, setPriceLoading] = useState<boolean>(true)
  const [price, setPrice] = useState<string>('')
  const [userBalanceLoading, setUserBalanceLoading] = useState<boolean>(true)
  const [userBalance, setUserBalance] = useState<string>('')
  const [year, setYear] = useState<number>(1)
  const [registerLoading, setRegisterLoading] = useState<boolean>(false)
  const [gasFee, setGasFee] = useState<string>('')

  useEffect(() => {
    async function getGasFee() {
      const fees = await getFee()
      setGasFee(fees)
    }

    async function getPrice(domainName: string) {
      setPriceLoading(true)
      const priceHex: any = await getPriceOnYear(domainName, year)
      console.log('PRICE: ', priceHex)
      const finalPrice = ethers.utils.formatEther(
        `${parseInt(priceHex.base._hex, 16)}`,
      )
      setPrice(finalPrice)
      setPriceLoading(false)
    }
    if (searchQuery && isDomainAvailable) {
      getPrice(searchQuery)
      getGasFee()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, year, isDomainAvailable])

  useEffect(() => {
    async function getBalance(address: string) {
      setUserBalanceLoading(true)
      const balance = await getUserBalance(address)
      setUserBalance(balance)
      setUserBalanceLoading(false)
    }
    if (currentAccount) getBalance(currentAccount)
  }, [currentAccount])

  const handleRegister = async () => {
    setRegisterLoading(true)
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await registerDomain(
        searchQuery,
        currentAccount,
        year,
        price,
      )
    } catch (error) {
      console.log('ERROR: ', error)
    }
    setRegisterLoading(false)
  }

  const totalPrice = Number(gasFee) + Number(price)
  const isLessBalance = totalPrice > Number(userBalance)

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {isDomainAvailable ? (
            <>
              <div className="py-10 border-b border-slate-200">
                <div className="w-full flex items-start flex-col space-y-12">
                  <div className="w-56 flex items-center justify-between">
                    <span className="text-base text-slate-600">Period:</span>
                    <div className="flex items-center space-x-3">
                      <Button
                        onClick={() =>
                          setYear((prevState) =>
                            prevState > 0 ? prevState - 1 : prevState,
                          )
                        }
                        variant="outline"
                        className="h-7 w-5 text-xs"
                      >
                        -
                      </Button>
                      <div>{year} year</div>

                      <Button
                        onClick={() => setYear((prevState) => prevState + 1)}
                        variant="outline"
                        className="h-7 w-5 text-xs"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="w-56 flex items-center justify-between">
                    <span className="text-base text-slate-600">Price:</span>
                    <div className="font-semibold">
                      {priceLoading ? 'Loading..' : `${price} TFIL`}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-10 w-full flex items-start flex-col space-y-12">
                <div className="w-full flex items-center justify-between">
                  <div className="w-56 flex items-center justify-between">
                    <span className="text-base text-slate-600">Total:</span>
                    <div className="font-semibold">
                      {priceLoading
                        ? 'Loading..'
                        : `${totalPrice.toFixed(4)} TFIL`}
                    </div>
                  </div>
                  {currentAccount && (
                    <Button
                      disabled={priceLoading || registerLoading}
                      onClick={handleRegister}
                    >
                      Register
                    </Button>
                  )}
                </div>
                <div className="w-56 flex items-center justify-between">
                  {currentAccount && (
                    <>
                      <span className="text-base text-slate-600">
                        Your Balance:
                      </span>
                      <div
                        className={`font-semibold ${
                          isLessBalance ? 'text-red-600' : ''
                        }`}
                      >
                        {userBalanceLoading
                          ? 'Loading..'
                          : `${Number(userBalance).toFixed(4)} TFIL`}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="mt-20 text-slate-600 font-semibold">
              Domain is already registered
            </div>
          )}
        </>
      )}
    </>
  )
}

export default DomainRegister
