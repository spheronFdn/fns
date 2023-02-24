/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useOutletContext } from 'react-router-dom'
import { Button } from '../../components/UI/button'
import {
  getPriceOnYear,
  registerDomain,
  setAddr,
} from '../../services/spheron-fns'
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
  const { currentAccount, connectWallet } = Web3Cntx
  const [
    searchQuery,
    isDomainAvailable,
    loading,
    ownerLoading,
    contentHashLoading,
    expiryDateLoading,
    ownerAddress,
    contentHash,
    expiryDate,
    step,
    setStep,
    price,
    userBalance,
    gasFee,
    priceLoading,
    userBalanceLoading,
    year,
    setYear,
  ] =
    useOutletContext<
      [
        string,
        boolean,
        boolean,
        boolean,
        boolean,
        boolean,
        string,
        string,
        string,
        number,
        (step: number) => void,
        string,
        string,
        string,
        boolean,
        boolean,
        number,
        (year: number) => void,
      ]
    >()
  const [registerLoading, setRegisterLoading] = useState<boolean>(false)
  const [hash, setHash] = useState<string>('')
  const [isSuccessful, setIsSuccessful] = useState<boolean>(false)

  const processInformation = [
    {
      id: 1,
      title: 'Transaction Signing',
      description: `Your wallet will open and you will be asked to confirm the first of two transactions required for registration. If the second transaction is not processed within 7 days of the first, you will need to start again from step 1.`,
    },
    {
      id: 2,
      title: 'Wait for a few minutes',
      description: `The waiting period is required to ensure another person hasn’t tried to register the same name and protect you after your request.`,
    },
  ]

  useEffect(() => {
    return () => setIsSuccessful(false)
  }, [params.domainName])

  const handleRegister = async () => {
    setRegisterLoading(true)
    setStep(1)
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const res: any = await registerDomain(
        searchQuery,
        currentAccount,
        year,
        price,
      )
      if (!res.error) {
        toast({
          title: 'Success',
          description: 'Please wait for address to register',
        })
        setStep(2)
        const addrRes = await setAddr(searchQuery, currentAccount)
        if (!addrRes.error) {
          setStep(0)
          setIsSuccessful(true)
          setRegisterLoading(false)
          toast({
            title: 'Successful',
            description:
              'Congratulations, you have successfully registered a domain',
          })
          setHash(res.response)
        } else {
          toast({
            title: 'Error',
            variant: 'destructive',
            description: res.response,
          })
        }
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
  const isLessBalance = userBalance ? totalPrice > Number(userBalance) : false

  if (step === 1) {
    return (
      <>
        <div className="mt-20 flex flex-col items-center justify-center text-primary-text font-semibold space-x-6">
          Registering the domain, please wait <Loader />
        </div>
      </>
    )
  }

  if (step === 2) {
    return (
      <>
        <div className="mt-20 flex flex-col space-y-6 items-center justify-center text-primary-text font-semibold space-x-6">
          Attaching the user, please wait
          <div className="text-red-600">Do not cancel the transaction</div>
          <Loader />
        </div>
      </>
    )
  }

  if (isSuccessful) {
    return (
      <>
        <div className="mt-20 text-primary-text font-semibold ">
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
                  <div className="py-10 border-b border-gray-border">
                    <div className="w-full flex items-start flex-col space-y-12">
                      <div className="w-5/12 flex items-center justify-between">
                        <span className="text-base text-gray-text">
                          Period:
                        </span>
                        <div className="flex items-center space-x-3">
                          <Button
                            onClick={() => setYear(year > 1 ? year - 1 : year)}
                            variant="outline"
                            className="text-primary-text h-7 w-5 text-xs hover:bg-primary-text transition hover:text-white"
                          >
                            -
                          </Button>
                          <div className="text-primary-text">{year} year</div>

                          <Button
                            onClick={() => setYear(year + 1)}
                            variant="outline"
                            className="text-primary-text h-7 w-5 text-xs hover:bg-primary-text transition hover:text-white"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <div className="w-5/12 flex items-center justify-between">
                        <span className="text-base text-gray-text">Price:</span>
                        <div className="ml-12 font-semibold text-primary-text text-right ">
                          {priceLoading ? <InfoLoader /> : `${price} TFIL`}
                        </div>
                      </div>
                      <div className="w-5/12 flex items-center justify-between">
                        <span className="text-base text-gray-text">
                          Gas fee:
                        </span>
                        <div className="ml-16 font-semibold text-primary-text text-right  ">
                          {priceLoading ? <InfoLoader /> : `${gasFee} TFIL`}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-10 w-full flex items-start flex-col space-y-12">
                    <div className="w-full flex items-center justify-between">
                      <div className="w-5/12 flex items-center justify-between">
                        <span className="text-base text-gray-text">Total:</span>
                        <div className="font-semibold text-primary-text">
                          {priceLoading ? (
                            <InfoLoader />
                          ) : (
                            `${totalPrice.toFixed(4)} TFIL`
                          )}
                        </div>
                      </div>

                      <Button
                        disabled={
                          priceLoading ||
                          registerLoading ||
                          !!hash ||
                          isSuccessful ||
                          isLessBalance
                        }
                        onClick={
                          currentAccount ? handleRegister : connectWallet
                        }
                      >
                        Register
                      </Button>
                    </div>
                    <div className="w-5/12 flex pb-10 items-center justify-between">
                      {currentAccount && (
                        <>
                          <span className="text-base text-gray-text">
                            Your Balance:
                          </span>
                          <div
                            className={`font-semibold ${
                              isLessBalance
                                ? 'text-red-600'
                                : 'text-primary-text'
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
                  <div className="border-t border-gray-border pt-10">
                    <div className="grid grid-cols-2 w-9/12">
                      {processInformation.map((information) => (
                        <div className="flex items-start justify-start space-x-4">
                          <div className="border-2 text-primary-text border-gray-border rounded-full h-12 w-12 text-sm font-bold px-4 py-2 flex items-center justify-center">
                            {information.id}
                          </div>
                          <div className="flex flex-col items-start justify-start">
                            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-primary-text">
                              {information.title}
                            </h3>
                            <p className="text-sm font-medium text-gray-text text-opacity-80 text-left">
                              {information.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="mt-20 text-primary-text text-xl font-semibold ">
              Domain is already registered
            </div>
          )}
        </>
      )}
    </>
  )
}

export default DomainRegister
