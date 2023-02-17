import React, { useContext, useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Web3Context } from '../../context/web3-context'
import {
  getAddress,
  getContentHash,
  getProfile,
  isAvailable,
} from '../../services/spheron-fns'

const DomainDetail = () => {
  const Web3Cntx = useContext<any>(Web3Context)
  const { currentAccount } = Web3Cntx
  const [searchQuery] = useOutletContext<[string]>()
  const [ownerAddress, setOwnerAddress] = useState<string>('')
  const [contentHash, setContentHash] = useState<string>('')
  const [isDomainAvailable, setIsDomainAvailable] = useState<boolean>(true)

  useEffect(() => {
    async function getAvailibility() {
      let response = await isAvailable(searchQuery)
      setIsDomainAvailable(!!response)
    }
    getAvailibility()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    async function getAddressFromDomainName(domainName: string) {
      const addr = await getAddress(domainName)
      setOwnerAddress(addr || '')
    }
    async function getDomainProfile(domainName: string) {
      const profile = await getProfile(domainName)
      console.log('PROFILE:', profile)
    }

    async function getContentHashFromDomainName(domainName: string) {
      const hash = await getContentHash(domainName)
      setContentHash(hash)
    }
    if (searchQuery) {
      getDomainProfile(searchQuery)
      getAddressFromDomainName(searchQuery)
      getContentHashFromDomainName(searchQuery)
    }
  }, [searchQuery])
  return (
    <>
      <div className="py-10 border-b border-slate-200">
        <div className="w-full flex items-start flex-col space-y-12">
          <div className="w-[800px] flex items-center justify-between">
            <span className="text-base text-slate-600">Period:</span>
            <div>1 year</div>
          </div>
          <div className="w-[800px] flex items-center justify-between">
            <span className="text-base text-slate-600">Parent:</span>
            <div>0x5c688E78840839f781F096e3d0f4690a95409271</div>
          </div>
          <div className="w-[800px] flex items-center justify-between">
            <span className="text-base text-slate-600">Controller:</span>
            <div>{ownerAddress}</div>
          </div>
        </div>
      </div>
      {!isDomainAvailable && (
        <div className="mt-10 w-full flex items-start flex-col space-y-12">
          <div className="w-full flex items-center justify-between">
            <div className="w-[800px] flex items-center justify-between">
              <span className="text-base text-slate-600 text-right">
                Content Hash:
              </span>
              <div>{contentHash}</div>
            </div>
          </div>
          <div className="w-[800px] flex items-center justify-between">
            <span className="text-base text-slate-600">Your Balance:</span>
            <div>0.63072 TFIL</div>
          </div>
          <div className="w-[800px] flex items-center justify-between">
            <span className="text-base text-slate-600">Expiration:</span>
            <div>2025-02-08 at 14:05 (UTC+08:00)</div>
          </div>
        </div>
      )}
    </>
  )
}

export default DomainDetail
