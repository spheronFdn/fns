import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import InfoLoader from '../../components/Loader/info-loader'
import { useToast } from '../../hooks/useToast'
import { getExpiry, getNameFromAddress } from '../../services/spheron-fns'

const AddressRegistrant = () => {
  const { toast } = useToast()
  const params = useParams()
  const [domainNameLoading, setDomainNameLoading] = useState<boolean>(true)
  const [domainName, setDomainName] = useState<string>('')
  const [expiryDate, setExpiryDate] = useState<string>('')
  const [expiryDateLoading, setExpiryDateLoading] = useState<boolean>(true)

  useEffect(() => {
    async function getDomainNameFromAddress(address: string) {
      setDomainNameLoading(true)
      try {
        const res = await getNameFromAddress(`${address}`)
        if (!res.error) {
          setDomainName(res.response || '')
        } else {
          toast({
            title: 'Error',
            variant: 'destructive',
            description:
              'Something went wrong, please check the entered address',
          })
        }
      } catch (error) {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: (error as Error).message,
        })
      }
      setDomainNameLoading(false)
    }

    if (params.address) getDomainNameFromAddress(params.address)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.address])

  useEffect(() => {
    async function getExpiryFromDomainName(domainName: string) {
      setExpiryDateLoading(true)
      const res = await getExpiry(domainName)
      const finalDate = String(parseInt((res as any).response._hex || '0', 16))
      setExpiryDate(finalDate)
      setExpiryDateLoading(false)
    }
    if (domainName) getExpiryFromDomainName(domainName)
  }, [domainName])

  let expirationDate = String(dayjs(Number(expiryDate) * 1000))

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
          {domainNameLoading ? (
            <tr className="border-b border-slate-200 ">Loading...</tr>
          ) : (
            <>
              {domainName.length ? (
                <tr className="border-b border-slate-200 ">
                  <td className="px-4 font-medium text-slate-700 text-sm pt-3 pb-2 text-left">
                    {domainName}
                  </td>
                  <td className="pt-3 font-medium text-slate-700 text-sm pb-2 text-left">
                    {expiryDateLoading ? (
                      <InfoLoader />
                    ) : (
                      <div>{expirationDate}</div>
                    )}
                  </td>
                  <td className="pt-3 font-medium text-slate-700 text-sm pb-2 text-left">
                    {expiryDateLoading ? (
                      <InfoLoader />
                    ) : (
                      <div>{expirationDate}</div>
                    )}
                  </td>
                </tr>
              ) : (
                <tr className="text-center text-slate-700 font-semibold border-b border-slate-200 ">
                  No domains are attached to this address
                </tr>
              )}
            </>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default AddressRegistrant
