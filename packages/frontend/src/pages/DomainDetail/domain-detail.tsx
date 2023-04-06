import React, { useContext, useEffect, useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import InfoLoader from '../../components/Loader/info-loader'
import Loader from '../../components/Loader/loader'
import { Input } from '../../components/UI/input'
import { Button } from '../../components/UI/button'
import { Web3Context } from '../../context/web3-context'
import { setContentHash } from '../../services/spheron-fns'
import { useToast } from '../../hooks/useToast'
import { ReactComponent as CopyIcon } from '../../assets/icons/copy-icon.svg'
import { ReactComponent as EditIcon } from '../../assets/icons/edit-icon.svg'
import { ReactComponent as CancelIcon } from '../../assets/icons/cancel-icon.svg'
import { copyToClipboard } from '../../lib/utils'
import { ModalContext } from '../../context/modal-context'

const DomainDetail = () => {
  const params = useParams()
  const { toast } = useToast()
  const Web3Cntx = useContext<any>(Web3Context)
  const { currentAccount } = Web3Cntx
  const ModalCntx = useContext<any>(ModalContext)
  const { setModalOpen, setModalType, setModalOption } = ModalCntx
  const [contentHashQuery, setContentHashQuery] = useState<string>('')
  const [settingContentHash, setSettingContentHash] = useState<boolean>(false)
  const [isSuccesful, setIsSuccesful] = useState<boolean>(false)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [isControllerEditMode, setIsControllerEditMode] =
    useState<boolean>(false)
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
  }, [currentAccount])

  return (
    <>
      {loading ? (
        <div className="my-24 mb-12">
          <Loader />
        </div>
      ) : (
        <>
          <div className="lg:overflow-hidden overflow-x-scroll py-6">
            <div className="w-full flex items-start flex-col space-y-7">
              <div className="w-full flex items-center justify-between">
                <span className="text-base text-gray-unaryBorder">Text:</span>
                <div className="font-semibold text-primary-text ml-4">
                  {process.env.REACT_APP_CONTROLLER_ADDRESS}
                </div>
              </div>
              {!isDomainAvailable && (
                <div className="w-full flex items-center justify-between">
                  <span className="text-base text-gray-unaryBorder">
                    Controller:
                  </span>
                  <div>
                    {ownerLoading ? (
                      <InfoLoader />
                    ) : (
                      <div className="flex justify-end gap-3">
                        {isControllerEditMode ? (
                          <div className="w-full flex items-center gap-3">
                            <div className="w-full flex-row flex items-center gap-8 bg-[#141416] rounded-full border-2 border-[#434345] p-2">
                              <Input
                                className="bg-transparent ml-2 w-full"
                                value={ownerAddress}
                                onChange={(e) => {
                                  setContentHashQuery(e.target.value)
                                }}
                              />
                              <Button
                                onClick={handleSetContentHash}
                                className="py-1"
                                disabled={
                                  (isControllerEditMode &&
                                    contentHash === contentHashQuery) ||
                                  settingContentHash ||
                                  !contentHashQuery ||
                                  isSuccesful
                                }
                              >
                                {isControllerEditMode ? 'Update' : 'Add'}
                              </Button>
                            </div>
                            <CancelIcon
                              className="cursor-pointer"
                              onClick={() =>
                                setIsControllerEditMode(!isControllerEditMode)
                              }
                            />
                          </div>
                        ) : (
                          <>
                            <div className="font-semibold text-primary-text ml-4">
                              {ownerAddress}
                            </div>
                            <CopyIcon
                              className="cursor-pointer"
                              onClick={() => copyToClipboard(contentHash)}
                            />
                            {true && (
                              <div className="flex justify-start">
                                <EditIcon
                                  className="cursor-pointer"
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
            <div className="lg:overflow-hidden overflow-x-scroll pt-6 border-t border-gray-border w-full flex items-start flex-col space-y-7">
              <div className="w-full flex items-center justify-between">
                <div className="w-full flex items-center justify-between">
                  <span className="text-base text-gray-unaryBorder text-left lg:text-right">
                    Content Hash:
                  </span>
                  <div>
                    {settingContentHash || contentHashLoading ? (
                      <InfoLoader />
                    ) : (
                      <>
                        {!contentHash && !isEditMode ? (
                          <div className="flex flex-row gap-3">
                            <a
                              href={contentHash}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-500 lg:ml-0 ml-4 lg:mr-2"
                            >
                              {contentHash}
                            </a>
                            <CopyIcon
                              className="cursor-pointer"
                              onClick={() => copyToClipboard(contentHash)}
                            />
                            {true && (
                              <div className="flex justify-start lg:ml-0 ml-4 lg:block">
                                <EditIcon
                                  className="cursor-pointer"
                                  onClick={() => setIsEditMode(!isEditMode)}
                                />
                              </div>
                            )}
                          </div>
                        ) : (
                          <>
                            {(ownerAddress === currentAccount ||
                              isEditMode) && (
                              <div className="w-full flex items-center gap-3">
                                <div className="w-full flex-row flex items-center gap-8 bg-[#141416] rounded-full border-2 border-[#434345] p-2">
                                  <Input
                                    className="bg-transparent ml-2 w-full"
                                    value={contentHashQuery}
                                    onChange={(e) => {
                                      setContentHashQuery(e.target.value)
                                    }}
                                  />
                                  <Button
                                    onClick={handleSetContentHash}
                                    className="py-1"
                                    disabled={
                                      (isEditMode &&
                                        contentHash === contentHashQuery) ||
                                      settingContentHash ||
                                      !contentHashQuery ||
                                      isSuccesful
                                    }
                                  >
                                    {isEditMode ? 'Update' : 'Add'}
                                  </Button>
                                </div>
                                <CancelIcon
                                  className="cursor-pointer"
                                  onClick={() => setIsEditMode(!isEditMode)}
                                />
                              </div>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-full flex items-center justify-between">
                <span className="text-base text-gray-unaryBorder">
                  Expiration:
                </span>
                <div>
                  {expiryDateLoading ? (
                    <InfoLoader />
                  ) : (
                    <div className="flex flex-row items-center gap-3">
                      <div className="lg:ml-0 ml-4 lg:text-base text-sm font-semibold text-primary-text">
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
