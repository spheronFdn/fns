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
import { ReactComponent as PlusIcon } from '../../assets/icons/plus-icon.svg'
import { ReactComponent as MinusIcon } from '../../assets/icons/minus-icon.svg'
import config from '../../config'

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
                    <span className="md:text-base text-sm text-gray-text  text-left">
                      Period:
                    </span>
                    <div className="flex items-center space-x-3">
                      <MinusIcon
                        onClick={() => setYear(year > 1 ? year - 1 : year)}
                        className="unary__button"
                      />
                      <div className="text-primary-text text-center md:text-base text-sm min-w-[70px]">
                        {year} year
                      </div>
                      <PlusIcon
                        onClick={() => setYear(year + 1)}
                        className="unary__button text-red-700 hover:text-red-700 ease-in-out"
                      />
                    </div>
                  </div>
                  <div className="w-full flex items-center justify-between">
                    <span className="md:text-base text-sm text-gray-text  text-left">
                      Price:
                    </span>
                    <div className="ml-12 font-semibold md:text-base text-sm text-primary-text text-right">
                      {priceLoading ? (
                        <InfoLoader />
                      ) : (
                        `${price} ${config.web3.NETWORK.nativeCurrency.symbol}`
                      )}
                    </div>
                  </div>
                  <div className="w-full flex items-center justify-between">
                    <span className="md:text-base text-sm text-gray-text text-left">
                      Gas fee:
                    </span>
                    <div className="ml-16 font-semibold md:text-base text-sm text-primary-text text-right  ">
                      {priceLoading ? (
                        <InfoLoader />
                      ) : (
                        `${gasFee} ${config.web3.NETWORK.nativeCurrency.symbol}`
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 lg:mt-10 w-full flex items-start flex-col space-y-8">
                <div className="w-full flex items-center justify-between">
                  <div className="w-full flex items-center justify-between">
                    <span className="md:text-base text-sm text-gray-text  text-left">
                      Total:
                    </span>
                    <div className="font-semibold md:text-xl text-base text-primary-text">
                      {priceLoading ? (
                        <InfoLoader />
                      ) : (
                        `${totalPrice.toFixed(4)} ${
                          config.web3.NETWORK.nativeCurrency.symbol
                        }`
                      )}
                    </div>
                  </div>
                </div>
                {currentAccount && (
                  <div className="w-full flex items-center justify-between">
                    <span className="md:text-base text-sm text-gray-text text-left">
                      Your Balance:
                    </span>
                    <div
                      className={`font-semibold md:text-base text-sm ${
                        isLessBalance ? 'text-red-600' : 'text-primary-text'
                      }`}
                    >
                      {userBalanceLoading ? (
                        <InfoLoader />
                      ) : (
                        `${Number(userBalance).toFixed(4)} ${
                          config.web3.NETWORK.nativeCurrency.symbol
                        }`
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="mt-20 mb-12 text-primary-text md:text-xl text-base font-semibold ">
              Domain is already registered
            </div>
          )}
        </>
      )}
    </>
  )
}

export default DomainRegister
