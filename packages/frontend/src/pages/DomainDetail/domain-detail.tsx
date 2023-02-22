import React, { useContext, useState } from 'react'
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

  let expirationYear = String(dayjs(Number(expiryDate) * 1000).year())
  let expirationDate = String(dayjs(Number(expiryDate) * 1000))

  const handleSetContentHash = async () => {
    setSettingContentHash(true)
    try {
      const res = await setContentHash(
        params.domainName || '',
        contentHashQuery,
      )
      if (!res.error) {
        setSettingContentHash(false)
        toast({
          title: 'Success',
          description: 'Please wait for 3-5 minutes',
        })
      } else {
        toast({
          title: 'Error',
          variant: 'destructive',
        })
        setSettingContentHash(false)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message,
      })
      setSettingContentHash(false)
    }
  }

  return (
    <>
      {loading ? (
        <div className="mt-24">
          <Loader />
        </div>
      ) : (
        <>
          <div className="py-10 border-b border-slate-200">
            <div className="w-full flex items-start flex-col space-y-12">
              <div className="w-[800px] flex items-center justify-between">
                <span className="text-base text-slate-600">Year:</span>
                <div>{expirationYear}</div>
              </div>
              <div className="w-[800px] flex items-center justify-between">
                <span className="text-base text-slate-600">Parent:</span>
                <div>{process.env.REACT_APP_CONTROLLER_ADDRESS}</div>
              </div>
              {!isDomainAvailable && (
                <div className="w-[800px] flex items-center justify-between">
                  <span className="text-base text-slate-600">Controller:</span>
                  <div>
                    {ownerLoading ? <InfoLoader /> : <div>{ownerAddress}</div>}
                  </div>
                </div>
              )}
            </div>
          </div>
          {!isDomainAvailable && (
            <div className="mt-10 w-full flex items-start flex-col space-y-12">
              <div className="w-full flex items-center justify-between">
                <div className="w-[800px] flex items-center justify-between">
                  <span className="text-base text-slate-600 text-right">
                    Content Hash:
                  </span>
                  <div>
                    {settingContentHash || contentHashLoading ? (
                      <InfoLoader />
                    ) : (
                      <>
                        {contentHash ? (
                          <>
                            <a
                              href={contentHash}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-500"
                            >
                              {contentHash}
                            </a>
                          </>
                        ) : (
                          <>
                            {ownerAddress === currentAccount && (
                              <div className="flex items-center space-x-3">
                                <Input
                                  className="h-10 w-11/12 text-lg"
                                  value={contentHashQuery}
                                  onChange={(e) => {
                                    setContentHashQuery(e.target.value)
                                  }}
                                />
                                <Button
                                  onClick={handleSetContentHash}
                                  disabled={settingContentHash}
                                >
                                  Search
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

              <div className="w-[800px] flex items-center justify-between">
                <span className="text-base text-slate-600">Expiration:</span>
                <div>
                  {expiryDateLoading ? (
                    <InfoLoader />
                  ) : (
                    <div>{expirationDate}</div>
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
