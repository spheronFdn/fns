import React, { useContext, useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Web3Context } from '../../context/web3-context'
import { getNameFromAddress } from '../../services/spheron-fns'

const AddressRegistrant = () => {
  const Web3Cntx = useContext<any>(Web3Context)
  const { currentAccount } = Web3Cntx
  const [searchQuery] = useOutletContext<[string]>()
  const [domainName, setDomainName] = useState<string>('')

  useEffect(() => {
    async function getDomainNameFromAddress(address: string) {
      const name = await getNameFromAddress(`${address}`)

      setDomainName(name)
    }

    getDomainNameFromAddress(searchQuery)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
              2025-02-08 at 14:05 (UTC+08:00)
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
