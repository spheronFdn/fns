/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useOutletContext } from 'react-router-dom'
import { Button } from '../../components/UI/button'
import { Web3Context } from '../../context/web3-context'
import { useToast } from '../../hooks/useToast'
import Loader from '../../components/Loader/loader'
import InfoLoader from '../../components/Loader/info-loader'
import RegisterModal from '../../components/Modal/register-modal'
import { ModalContext } from '../../context/modal-context'

const DomainRegister = () => {
  const params = useParams()
  const { toast } = useToast()
  const Web3Cntx = useContext<any>(Web3Context)
  const { currentAccount, connectWallet } = Web3Cntx
  const ModalCntx = useContext<any>(ModalContext)
  const { modalOpen, modalType, setModalOpen, setModalType, setModalOption } =
    ModalCntx
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
    isSuccessful,
    setIsSuccessful,
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
        boolean,
        (succes: boolean) => void,
      ]
    >()

  const totalPrice = Number(gasFee) + Number(price)
  const isLessBalance = userBalance ? totalPrice > Number(userBalance) : false

  return (
    <>
      {loading ? (
        <div className="mt-24 mb-12">
          <Loader />
        </div>
      ) : (
        <>
          {isDomainAvailable ? (
            <>
              <div className="py-6 lg:py-10 border-b border-gray-border">
                <div className="w-full flex items-start flex-col space-y-8">
                  <div className="w-full flex items-center justify-between">
                    <span className="text-base text-gray-text">Period:</span>
                    <div className="flex items-center space-x-3">
                      <Button
                        onClick={() => setYear(year > 1 ? year - 1 : year)}
                        variant="outline"
                        className="h-5 w-5 p-0 flex items-center"
                      >
                        -
                      </Button>
                      <div className="text-primary-text text-center min-w-[70px]">
                        {year} year
                      </div>
                      <Button
                        onClick={() => setYear(year + 1)}
                        variant="outline"
                        className="h-5 w-5 p-0 flex-shrink-0 flex items-center justify-center text-base"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="w-full flex items-center justify-between">
                    <span className="text-base text-gray-text">Price:</span>
                    <div className="ml-12 font-semibold text-primary-text text-right ">
                      {priceLoading ? <InfoLoader /> : `${price} TFIL`}
                    </div>
                  </div>
                  <div className="w-full flex items-center justify-between">
                    <span className="text-base text-gray-text">Gas fee:</span>
                    <div className="ml-16 font-semibold text-primary-text text-right  ">
                      {priceLoading ? <InfoLoader /> : `${gasFee} TFIL`}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 lg:mt-10 w-full flex items-start flex-col space-y-8">
                <div className="w-full flex items-center justify-between">
                  <div className="w-full flex items-center justify-between">
                    <span className="text-base text-gray-text">Total:</span>
                    <div className="font-semibold text-primary-text text-xl">
                      {priceLoading ? (
                        <InfoLoader />
                      ) : (
                        `${totalPrice.toFixed(4)} TFIL`
                      )}
                    </div>
                  </div>
                </div>
                {currentAccount && (
                  <div className="w-full flex items-center justify-between">
                    <span className="text-base text-gray-text">
                      Your Balance:
                    </span>
                    <div
                      className={`font-semibold ${
                        isLessBalance ? 'text-red-600' : 'text-primary-text'
                      }`}
                    >
                      {userBalanceLoading ? (
                        <InfoLoader />
                      ) : (
                        `${Number(userBalance).toFixed(4)} TFIL`
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="mt-20 mb-12 text-primary-text text-xl font-semibold ">
              Domain is already registered
            </div>
          )}
        </>
      )}
    </>
  )
}

export default DomainRegister
