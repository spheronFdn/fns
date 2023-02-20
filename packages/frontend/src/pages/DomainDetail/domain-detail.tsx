import React, { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import dayjs from 'dayjs'
import {
  getAddress,
  getContentHash,
  getExpiry,
} from '../../services/spheron-fns'

const DomainDetail = () => {
  const [searchQuery, isDomainAvailable, loading] =
    useOutletContext<[string, boolean, boolean]>()
  const [ownerAddress, setOwnerAddress] = useState<string>('')
  const [contentHash, setContentHash] = useState<string>('')
  const [expiryDate, setExpiryDate] = useState<string>('')
  const [contentHashLoading, setContentHashLoading] = useState<boolean>(true)
  const [ownerLoading, setOwnerLoading] = useState<boolean>(true)
  const [expiryDateLoading, setExpiryDateLoading] = useState<boolean>(true)

  useEffect(() => {
    async function getAddressFromDomainName(domainName: string) {
      setOwnerLoading(true)
      const addr = await getAddress(domainName)
      setOwnerAddress(addr || '')
      setOwnerLoading(false)
    }

    async function getContentHashFromDomainName(domainName: string) {
      setContentHashLoading(true)
      const hash = await getContentHash(domainName)
      setContentHash(hash)
      setContentHashLoading(false)
    }
    if (searchQuery) {
      getAddressFromDomainName(searchQuery)
      getContentHashFromDomainName(searchQuery)
    }
  }, [searchQuery])

  useEffect(() => {
    async function getExpiryFromDomainName(domainName: string) {
      setExpiryDateLoading(true)
      const res = await getExpiry(domainName)
      const finalDate = String(parseInt((res as any)._hex || '0', 16))
      setExpiryDate(finalDate)
      setExpiryDateLoading(false)
    }
    if (!isDomainAvailable && searchQuery) {
      getExpiryFromDomainName(searchQuery)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDomainAvailable, searchQuery])

  let expirationDate = String(dayjs(Number(expiryDate) * 1000))

  return (
    <>
      {loading ? (
        <div>Loading...</div>
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
                    {ownerLoading ? (
                      <div>Loading...</div>
                    ) : (
                      <div>{ownerAddress}</div>
                    )}
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
                      <div>Loading...</div>
                    ) : (
                      <div>{contentHash}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-[800px] flex items-center justify-between">
                <span className="text-base text-slate-600">Expiration:</span>
                <div>
                  {expiryDateLoading ? (
                    <div>Loading...</div>
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
