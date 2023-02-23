import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useOutletContext } from 'react-router-dom'
import { Button } from '../../components/UI/button'
import { getPriceOnYear, registerDomain } from '../../services/spheron-fns'
import { Web3Context } from '../../context/web3-context'
import { ethers } from 'ethers'
import { getFee, getUserBalance } from '../../lib/utils'
import { useToast } from '../../hooks/useToast'
import Loader from '../../components/Loader/loader'
import InfoLoader from '../../components/Loader/info-loader'

const DomainRegister = () => {
  const params = useParams()
  const { toast } = useToast()
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
  const [hash, setHash] = useState<string>('')
  const [isSuccessful, setIsSuccessful] = useState<boolean>(false)

  useEffect(() => {
    async function getGasFee() {
      const fees = await getFee()
      setGasFee(fees)
    }

    async function getPrice(domainName: string) {
      setPriceLoading(true)
      const res: any = await getPriceOnYear(domainName, year)
      const finalPrice = ethers.utils.formatEther(
        `${parseInt(res.response.base._hex, 16)}`,
      )
      setPrice(finalPrice)
      setPriceLoading(false)
    }
    if (searchQuery && isDomainAvailable) {
      getPrice(searchQuery)
      getGasFee()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.domainName, year, isDomainAvailable])

  useEffect(() => {
    async function getBalance(address: string) {
      setUserBalanceLoading(true)
      const balance = await getUserBalance(address)
      setUserBalance(balance)
      setUserBalanceLoading(false)
    }
    if (currentAccount) getBalance(currentAccount)
  }, [currentAccount])

  useEffect(() => {
    if (params.domainName === localStorage.getItem('domain-underpurchase')) {
      setRegisterLoading(true)
    }
    return () => setIsSuccessful(false)
  }, [params.domainName])

  const handleRegister = async () => {
    setRegisterLoading(true)
    localStorage.setItem('domain-underpurchase', searchQuery)
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const res: any = await registerDomain(
        searchQuery,
        currentAccount,
        year,
        price,
      )
      if (!res.error) {
        setIsSuccessful(true)
        setRegisterLoading(false)
        toast({
          title: 'Success',
          description: 'Please wait for 3-5 minutes',
        })
        setHash(res.response)
      } else {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: res.response,
        })
        setRegisterLoading(false)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message,
      })
      setRegisterLoading(false)
    }
  }

  const totalPrice = Number(gasFee) + Number(price)
  const isLessBalance = totalPrice > Number(userBalance)

  if (isSuccessful) {
    return (
      <>
        <div className="mt-20 text-slate-600 font-semibold ">
          Domain is being registered
        </div>
      </>
    )
  }

  return (
    <>
      {loading ? (
        <div className="mt-24">
          <Loader />
        </div>
      ) : (
        <>
          {isDomainAvailable ? (
            <>
              {registerLoading ? (
                <>
                  <Loader />
                </>
              ) : (
                <>
                  {' '}
                  <div className="py-10 border-b border-slate-200">
                    <div className="w-full flex items-start flex-col space-y-12">
                      <div className="w-5/12 flex items-center justify-between">
                        <span className="text-base text-gray-text">
                          Period:
                        </span>
                        <div className="flex items-center space-x-3">
                          <Button
                            onClick={() =>
                              setYear((prevState) =>
                                prevState > 1 ? prevState - 1 : prevState,
                              )
                            }
                            variant="outline"
                            className="h-7 w-5 text-xs"
                          >
                            -
                          </Button>
                          <div>{year} year</div>

                          <Button
                            onClick={() =>
                              setYear((prevState) => prevState + 1)
                            }
                            variant="outline"
                            className="h-7 w-5 text-xs"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <div className="w-5/12 flex items-center justify-between">
                        <span className="text-base text-gray-text">Price:</span>
                        <div className="ml-12 font-semibold text-right ">
                          {priceLoading ? <InfoLoader /> : `${price} TFIL`}
                        </div>
                      </div>
                      <div className="w-5/12 flex items-center justify-between">
                        <span className="text-base text-gray-text">
                          Gas fee:
                        </span>
                        <div className="ml-16 font-semibold text-right  ">
                          {priceLoading ? <InfoLoader /> : `${gasFee} TFIL`}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-10 w-full flex items-start flex-col space-y-12">
                    <div className="w-full flex items-center justify-between">
                      <div className="w-5/12 flex items-center justify-between">
                        <span className="text-base text-gray-text">Total:</span>
                        <div className="font-semibold">
                          {priceLoading ? (
                            <InfoLoader />
                          ) : (
                            `${totalPrice.toFixed(4)} TFIL`
                          )}
                        </div>
                      </div>
                      {currentAccount && (
                        <Button
                          disabled={
                            priceLoading ||
                            registerLoading ||
                            !!hash ||
                            isSuccessful ||
                            isLessBalance
                          }
                          className="bg-primary-100 hover:bg-primary-200 transition-all ease-in-out"
                          onClick={handleRegister}
                        >
                          Register
                        </Button>
                      )}
                    </div>
                    <div className="w-5/12 flex pb-10 items-center justify-between">
                      {currentAccount && (
                        <>
                          <span className="text-base text-gray-text">
                            Your Balance:
                          </span>
                          <div
                            className={`font-semibold ${
                              isLessBalance ? 'text-red-600' : ''
                            }`}
                          >
                            {userBalanceLoading ? (
                              <InfoLoader />
                            ) : (
                              `${Number(userBalance).toFixed(4)} TFIL`
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="border-t border-slate-200 pt-10">
                    <div className="grid grid-cols-2 w-9/12">
                      <div className="flex items-start justify-start space-x-4">
                        <div className="border-2 border-slate-200 rounded-full h-12 w-12 text-sm font-bold px-4 py-2 flex items-center justify-center">
                          1
                        </div>
                        <div className="flex flex-col items-start justify-start">
                          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                            Transaction Signing
                          </h3>
                          <p className="text-sm font-medium text-slate-600 text-left">
                            Your wallet will open and you will be asked to
                            confirm the first of two transactions required for
                            registration. If the second transaction is not
                            processed within 7 days of the first, you will need
                            to start again from step 1.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start justify-start space-x-4">
                        <div className="border-2 border-slate-200 rounded-full h-12 w-12 text-sm font-bold px-4 py-2 flex items-center justify-center">
                          2
                        </div>
                        <div className="flex flex-col items-start justify-start">
                          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                            Wait for a few minutes
                          </h3>
                          <p className="text-sm font-medium text-slate-600 text-left">
                            The waiting period is required to ensure another
                            person hasn’t tried to register the same name and
                            protect you after your request.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {/* 
              {hash && (
                <div className="font-medium text-base bg-slate-100 px-4 py-2 border border-slate-200 rounded-sm  text-slate-900 mt-8">
                  <span className="cursor-pointer">{hash}</span>
                </div>
              )} */}
            </>
          ) : (
            <div className="mt-20 text-slate-600 font-semibold ">
              Domain is already registered
            </div>
          )}
        </>
      )}
    </>
  )
}

export default DomainRegister
