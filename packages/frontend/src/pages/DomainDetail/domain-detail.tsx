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

const DomainDetail = () => {
  const params = useParams()
  const { toast } = useToast()
  const Web3Cntx = useContext<any>(Web3Context)
  const { currentAccount } = Web3Cntx
  const [contentHashQuery, setContentHashQuery] = useState<string>('')
  const [settingContentHash, setSettingContentHash] = useState<boolean>(false)
  const [isSuccesful, setIsSuccesful] = useState<boolean>(false)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
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
        <div className="mt-24">
          <Loader />
        </div>
      ) : (
        <>
          <div className="lg:overflow-hidden overflow-x-scroll py-6 lg:py-10 border-b border-gray-border">
            <div className="w-full flex items-start flex-col space-y-12">
              <div className="w-11/12 lg:w-[800px] flex items-center justify-between">
                <span className="text-base text-gray-text">Parent:</span>
                <div className="font-semibold text-primary-text lg:ml-0 ml-4">
                  {process.env.REACT_APP_CONTROLLER_ADDRESS}
                </div>
              </div>
              {!isDomainAvailable && (
                <div className="w-11/12 lg:w-[800px] flex items-center justify-between">
                  <span className="text-base text-gray-text">Controller:</span>
                  <div>
                    {ownerLoading ? (
                      <InfoLoader />
                    ) : (
                      <>
                        <div className="font-semibold text-primary-text lg:ml-0 ml-4">
                          {ownerAddress}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          {!isDomainAvailable && (
            <div className="lg:overflow-hidden overflow-x-scroll mt-6 lg:mt-10 w-full flex items-start flex-col space-y-12">
              <div className="w-full flex items-center justify-between">
                <div className="w-11/12 lg:w-[800px] flex items-center justify-between">
                  <span className="text-base text-gray-text text-left lg:text-right">
                    Content Hash:
                  </span>
                  <div>
                    {settingContentHash || contentHashLoading ? (
                      <InfoLoader />
                    ) : (
                      <>
                        {contentHash && !isEditMode ? (
                          <>
                            <a
                              href={contentHash}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-500 lg:ml-0 ml-4 lg:mr-2"
                            >
                              {contentHash}
                            </a>
                            {ownerAddress === currentAccount && (
                              <div className="flex justify-start lg:ml-0 ml-4 lg:block">
                                <Button
                                  onClick={() => setIsEditMode(!isEditMode)}
                                >
                                  Edit
                                </Button>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            {(ownerAddress === currentAccount ||
                              isEditMode) && (
                              <div className="flex items-center space-x-3">
                                <Input
                                  className="h-10 w-11/12 text-base lg:text-lg"
                                  value={contentHashQuery}
                                  onChange={(e) => {
                                    setContentHashQuery(e.target.value)
                                  }}
                                />
                                <Button
                                  onClick={handleSetContentHash}
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
                            )}
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-11/12 lg:w-[800px] flex items-center justify-between">
                <span className="text-base text-gray-text">Expiration:</span>
                <div>
                  {expiryDateLoading ? (
                    <InfoLoader />
                  ) : (
                    <div className="lg:ml-0 ml-4 lg:text-base text-sm font-semibold text-primary-text">
                      {expirationDate}
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
