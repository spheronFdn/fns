import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import InfoLoader from '../../components/Loader/info-loader'
import Loader from '../../components/Loader/loader'
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
        console.log('ERROR in getDomainNameFromAddress: ', error)
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
        <thead className="bg-blue-bg bg-opacity-30 w-full">
          <tr className="text-md font-semibold text-slate-500">
            <th className="px-4 pt-5 pb-2 text-left text-white w-7/12">Name</th>
            <th className="pt-6 pb-2 text-left text-white">Expiration Time</th>
          </tr>
        </thead>

        {domainNameLoading ? (
          <div className="w-full border-gray-border pt-6 pb-2 text-center flex items-center justify-end">
            <Loader />
          </div>
        ) : (
          <>
            <tbody>
              {domainName.length ? (
                <tr className="border-b border-gray-border ">
                  <td className="px-4 font-medium text-gray-text text-sm pt-3 pb-2 text-left">
                    {domainName}
                  </td>
                  <td className="pt-3 font-medium text-gray-text text-sm pb-2 text-left">
                    {expiryDateLoading ? (
                      <InfoLoader />
                    ) : (
                      <div>{expirationDate}</div>
                    )}
                  </td>
                </tr>
              ) : (
                <tr className="text-center text-primary-text font-semibold border-b border-gray-border ">
                  No domains are attached to this address
                </tr>
              )}
            </tbody>
          </>
        )}
      </table>
    </div>
  )
}

export default AddressRegistrant
