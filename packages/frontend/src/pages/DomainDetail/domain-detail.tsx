import React from 'react'
import { useOutletContext } from 'react-router-dom'
import dayjs from 'dayjs'
import InfoLoader from '../../components/Loader/info-loader'
import Loader from '../../components/Loader/loader'

const DomainDetail = () => {
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
                <span className="text-base text-slate-600">Period:</span>
                <div>1 year</div>
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
                    {contentHashLoading ? (
                      <InfoLoader />
                    ) : (
                      <a
                        href={contentHash}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500"
                      >
                        {contentHash}
                      </a>
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
