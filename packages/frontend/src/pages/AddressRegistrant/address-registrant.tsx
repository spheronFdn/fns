import React, { useContext, useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Web3Context } from '../../context/web3-context'
import { getExpiry, getNameFromAddress } from '../../services/spheron-fns'

const AddressRegistrant = () => {
  const Web3Cntx = useContext<any>(Web3Context)
  const { currentAccount } = Web3Cntx
  const [searchQuery] = useOutletContext<[string]>()
  const [domainName, setDomainName] = useState<string>('')
  const [expiryDate, setExpiryDate] = useState<string>('')
  const [expiryDateLoading, setExpiryDateLoading] = useState<boolean>(true)

  useEffect(() => {
    async function getDomainNameFromAddress(address: string) {
      const name = await getNameFromAddress(`${address}`)
      setDomainName(name)
    }

    if (searchQuery) getDomainNameFromAddress(searchQuery)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  useEffect(() => {
    async function getExpiryFromDomainName(domainName: string) {
      setExpiryDateLoading(true)
      const res = await getExpiry(domainName)
      const finalDate = String(parseInt((res as any)._hex || '0', 16))
      setExpiryDate(finalDate)
      setExpiryDateLoading(false)
    }
    if (domainName) getExpiryFromDomainName(domainName)
  }, [domainName])

  return (
    <div>
      <table className="table-auto w-full">
        <thead className=" bg-slate-100 w-full">
          <tr className="text-md font-semibold text-slate-500">
            <th className="px-4 pt-5 pb-2 text-left w-7/12">Name</th>
            <th className="pt-6 pb-2 text-left">Expiration Time</th>
            <th className="pt-6 pb-2 text-left">Year</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-slate-200 ">
            <td className="px-4 font-medium text-slate-700 text-sm pt-3 pb-2 text-left">
              {domainName}
            </td>
            <td className="pt-3 font-medium text-slate-700 text-sm pb-2 text-left">
              {expiryDateLoading ? (
                <div>Loading..</div>
              ) : (
                <div>
                  {new Date(Number(expiryDate) * 1000) as unknown as string}
                </div>
              )}
            </td>
            <td className="pt-3 font-medium text-slate-700 text-sm pb-2 text-left">
              1961
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default AddressRegistrant
