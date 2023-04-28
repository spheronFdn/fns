import React, { useContext, useEffect, useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import InfoLoader from '../../components/Loader/info-loader'
import Loader from '../../components/Loader/loader'
import { Button } from '../../components/UI/button'
import { Web3Context } from '../../context/web3-context'
import { ModalContext } from '../../context/modal-context'
import {
  getAddress,
  getOwnerNames,
  setAddr,
  setContentHash,
} from '../../services/spheron-fns'
import { useToast } from '../../hooks/useToast'
import { ReactComponent as CopyIcon } from '../../assets/icons/copy-icon.svg'
import { ReactComponent as EditIcon } from '../../assets/icons/edit-icon.svg'
import { ReactComponent as CancelIcon } from '../../assets/icons/cancel-icon.svg'
import { copyToClipboard } from '../../lib/utils'
import CopyPopup from '../../components/Popup/copy-popup'
import { Input } from '../../components/InputField/input'

const DomainDetail = () => {
  const params = useParams()
  const { toast } = useToast()
  const Web3Cntx = useContext<any>(Web3Context)
  const { currentAccount } = Web3Cntx
  const ModalCntx = useContext<any>(ModalContext)
  const { setModalOpen, setModalType, setModalOption } = ModalCntx
  const [contentHashQuery, setContentHashQuery] = useState<string>('')
  const [controller, setController] = useState<string>('')
  const [updateControllerLoading, setUpdateControllerLoading] =
    useState<boolean>(false)
  const [settingContentHash, setSettingContentHash] = useState<boolean>(false)
  const [isSuccesful, setIsSuccesful] = useState<boolean>(false)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [isControllerEditMode, setIsControllerEditMode] =
    useState<boolean>(false)
  const [showControllerCopyPopup, setShowControllerCopyPopup] =
    useState<boolean>(false)
  const [copyControllerPopupText, setCopyControllerPopupText] =
    useState<string>('Click to Copy')
  const [showContentHashCopyPopup, setShowContentHashCopyPopup] =
    useState<boolean>(false)
  const [copyContentHashPopupText, setCopyContentHashPopupText] =
    useState<string>('Click to Copy')
  // If second step is not completed - to check if domain name is registered under current address
  const [isDomainPresent, setIsDomainPresent] = useState<boolean>(false)

  const [
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    searchQuery,
    isDomainAvailable,
    loading,
    ownerLoading,
    contentHashLoading,
    expiryDateLoading,
    ownerAddress,
    contentHash,
    expiryDate,
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
      ]
    >()

  let expirationDate = String(dayjs(Number(expiryDate) * 1000))

  async function getAddressFromDomainName() {
    try {
      const res = await getAddress(params.domainName || '')
      setController(res.response || '')
    } catch (error) {
      console.log('Error in getAddressFromDomainName: ')
      console.log(error)
      toast({
        title: 'Error',
        description: (error as Error).message,
      })
    }
  }

  const handleGetownerNames = async () => {
    try {
      const res: any = await getOwnerNames(currentAccount)
      if (!res.error) {
        setIsDomainPresent(res.response.includes(searchQuery.slice(0, -4)))
      }
    } catch (error) {
      console.log('Error in fetching owner names ->', error)
      toast({
        title: 'Error',
        description: (error as Error).message,
      })
    }
  }

  const handleSetController = async () => {
    setUpdateControllerLoading(true)
    try {
      const addrRes = await setAddr(searchQuery, controller)
      if (!addrRes.error) {
        toast({
          title: 'Successful',
          description:
            'Congratulations, you have successfully updated the controller',
        })
        setIsControllerEditMode(false)
        getAddressFromDomainName()
      } else {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: addrRes.response as string,
        })
      }
      setUpdateControllerLoading(false)
    } catch (error) {
      setUpdateControllerLoading(false)
      setIsSuccesful(false)
      console.log('Error in setting controller -> ', error)
      toast({
        title: 'Error',
        description: (error as Error).message,
      })
    }
  }

  const handleSetContentHash = async () => {
    setSettingContentHash(true)
    try {
      const res = await setContentHash(
        params.domainName || '',
        contentHashQuery,
        (step: string) => {
          if (step === 'tx-confirm')
            toast({
              title: 'Confirm Transaction',
              description: 'Please confirm the transaction in the metamask',
              variant: 'info',
            })
          if (step === 'tx-started')
            toast({
              title: 'Transaction initiated',
              description:
                'Please wait for 3-5 minutes to mine the transaction',
              variant: 'info',
            })
        },
      )
      if (!res.error) {
        setSettingContentHash(false)
        setIsSuccesful(true)
        toast({
          title: 'Success',
          description: 'Transaction is successful',
        })
      } else {
        setIsSuccesful(false)
        toast({
          title: 'Error',
          variant: 'destructive',
          description: res.response as string,
        })
        setSettingContentHash(false)
      }
    } catch (error) {
      setIsSuccesful(false)
      console.log('Error in setting content hash -> ', error)
      toast({
        title: 'Error',
        description: (error as Error).message,
      })
      setSettingContentHash(false)
    }
  }

  useEffect(() => {
    if (isEditMode && contentHash) {
      setContentHashQuery(contentHash.split('//')[1])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode])

  useEffect(() => {
    setIsEditMode(false)
    handleGetownerNames()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount])

  useEffect(() => {
    setController(ownerAddress)
  }, [ownerAddress])

  useEffect(() => {
    if (copyControllerPopupText === 'Copied!') {
      setTimeout(() => {
        setCopyControllerPopupText('Click to Copy')
      }, 2000)
    }
    if (copyContentHashPopupText === 'Copied!') {
      setTimeout(() => {
        setCopyContentHashPopupText('Click to Copy')
      }, 2000)
    }
  }, [copyControllerPopupText, copyContentHashPopupText])

  return (
    <>
      {loading ? (
        <div className="my-24 mb-12">
          <Loader />
        </div>
      ) : (
        <>
          <div className="lg:overflow-hidden overflow-x-scroll py-6">
            <div className="w-full flex items-start flex-col space-y-4">
              <div className="w-full flex items-center justify-between gap-4 h-12">
                <span className="md:text-base text-sm text-gray-unaryBorder">
                  Registrant:
                </span>
                <div className="font-semibold md:text-base text-sm text-primary-text">
                  {process.env.REACT_APP_CONTROLLER_ADDRESS}
                </div>
              </div>
              {!isDomainAvailable && (
                <div className="w-full flex items-center justify-between gap-4 h-12">
                  <span className="md:text-base text-sm text-gray-unaryBorder lg:w-1/3 text-left">
                    Controller:
                  </span>
                  <div className="lg:w-2/3 flex justify-end">
                    {ownerLoading || updateControllerLoading ? (
                      <InfoLoader />
                    ) : (
                      <div className="flex justify-end gap-3 lg:w-2/3">
                        {isControllerEditMode ? (
                          <div className="w-full flex items-center gap-3">
                            <div
                              className="w-full flex-row flex items-center gap-3 md:gap-6 
                            bg-[#141416] rounded-full border-2 border-[#434345] pl-2 pr-1 py-1"
                            >
                              <Input
                                className="bg-transparent md:text-base text-sm ml-2 w-full"
                                value={controller}
                                onChange={(e) => {
                                  setController(e.target.value)
                                }}
                              />
                              <Button
                                onClick={handleSetController}
                                className="py-1 h-9 md:text-sm text-xs"
                                disabled={
                                  ownerAddress === controller ||
                                  updateControllerLoading ||
                                  !controller
                                }
                              >
                                {!!ownerAddress ? 'Update' : 'Add'}
                              </Button>
                            </div>
                            <CancelIcon
                              className="cursor-pointer copy__button"
                              onClick={() =>
                                setIsControllerEditMode(!isControllerEditMode)
                              }
                            />
                          </div>
                        ) : (
                          <>
                            <div className="font-semibold md:text-base text-sm text-primary-text">
                              {ownerAddress}
                            </div>
                            {ownerAddress && (
                              <div className="static">
                                {showControllerCopyPopup && (
                                  <CopyPopup
                                    text={copyControllerPopupText}
                                    classname="-mt-11 -ml-9"
                                  />
                                )}
                                <CopyIcon
                                  className="copy__button"
                                  onClick={() => {
                                    copyToClipboard(contentHash)
                                    setCopyControllerPopupText('Copied!')
                                  }}
                                  onMouseOver={() =>
                                    setShowControllerCopyPopup(true)
                                  }
                                  onMouseOut={() => {
                                    setShowControllerCopyPopup(false)
                                  }}
                                />
                              </div>
                            )}
                            {!ownerAddress && !isControllerEditMode && (
                              <div className="font-semibold md:text-base text-sm text-gray-unaryBorder text-right">
                                Not Set
                              </div>
                            )}
                            {(currentAccount === ownerAddress ||
                              isDomainPresent) && (
                              <div className="flex justify-start">
                                <EditIcon
                                  className="copy__button"
                                  onClick={() =>
                                    setIsControllerEditMode(
                                      !isControllerEditMode,
                                    )
                                  }
                                />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          {!isDomainAvailable && (
            <div
              className="lg:overflow-hidden overflow-x-scroll pt-6 
            border-t border-gray-border w-full 
            flex items-start flex-col space-y-4"
            >
              <div className="w-full flex items-center justify-between">
                <div className="w-full flex items-center justify-between gap-4 h-12">
                  <span className="md:text-base text-sm text-gray-unaryBorder text-left lg:w-1/3">
                    Content Hash:
                  </span>
                  <div className="lg:w-2/3 flex justify-end gap-3">
                    {settingContentHash || contentHashLoading ? (
                      <InfoLoader />
                    ) : (
                      <>
                        {contentHash && !isEditMode ? (
                          <div className="flex flex-row gap-3">
                            <a
                              href={contentHash}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-500 md:text-base text-sm"
                            >
                              {contentHash}
                            </a>
                            <div className="static">
                              {showContentHashCopyPopup && (
                                <CopyPopup
                                  text={copyContentHashPopupText}
                                  classname="-mt-11 -ml-9"
                                />
                              )}
                              <CopyIcon
                                className="copy__button"
                                onClick={() => {
                                  copyToClipboard(contentHash)
                                  setCopyContentHashPopupText('Copied!')
                                }}
                                onMouseOver={() =>
                                  setShowContentHashCopyPopup(true)
                                }
                                onMouseOut={() => {
                                  setShowContentHashCopyPopup(false)
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            {ownerAddress === currentAccount && isEditMode && (
                              <div className="lg:w-2/3 flex items-center gap-3">
                                <div
                                  className="w-full flex-row flex items-center gap-3 md:gap-6 
                                bg-[#141416] rounded-full border-2 border-[#434345] pl-2 pr-1 py-1"
                                >
                                  <Input
                                    className="bg-transparent ml-2 md:text-base text-sm w-full"
                                    value={contentHashQuery}
                                    onChange={(e) => {
                                      setContentHashQuery(e.target.value)
                                    }}
                                  />
                                  <Button
                                    onClick={handleSetContentHash}
                                    className="py-1 h-9 md:text-sm text-xs"
                                    disabled={
                                      (isEditMode &&
                                        contentHash === contentHashQuery) ||
                                      settingContentHash ||
                                      !contentHashQuery ||
                                      isSuccesful
                                    }
                                  >
                                    {!!contentHash ? 'Update' : 'Set'}
                                  </Button>
                                </div>
                                <CancelIcon
                                  className="cursor-pointer copy__button"
                                  onClick={() => setIsEditMode(!isEditMode)}
                                />
                              </div>
                            )}
                          </>
                        )}
                        {!contentHash && !isEditMode && (
                          <div className="font-semibold md:text-base text-sm text-gray-unaryBorder text-right">
                            Not Set
                          </div>
                        )}
                        {ownerAddress === currentAccount && !isEditMode && (
                          <div className="flex justify-start lg:ml-0 lg:block">
                            <EditIcon
                              className="copy__button"
                              onClick={() => setIsEditMode(!isEditMode)}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-full flex items-center gap-4 justify-between h-12">
                <span className="md:text-base text-sm text-gray-unaryBorder">
                  Expiration:
                </span>
                <div>
                  {expiryDateLoading ? (
                    <InfoLoader />
                  ) : (
                    <div className="flex flex-row items-center gap-3">
                      <div className="md:text-base text-sm text-right font-semibold text-primary-text">
                        {expirationDate}
                      </div>
                      <Button
                        onClick={() => {
                          setModalOpen(true)
                          setModalType('extendDomain')
                          setModalOption({
                            price: '0',
                            gasFee: '2',
                            priceLoading: false,
                          })
                        }}
                        className="py-1"
                      >
                        Extend
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default DomainDetail
