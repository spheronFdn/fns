import React, { useContext, useEffect } from 'react'
import { ReactComponent as GlobeLogo } from '../../assets/icons/globe-icon.svg'
import { ReactComponent as CopyIcon } from '../../assets/icons/copy-icon.svg'
import { copyToClipboard } from '../../lib/utils'
import { Button } from '../../components/UI/button'
import { getOwnerNames } from '../../services/spheron-fns'
import { toast } from '../../hooks/useToast'
import { Web3Context } from '../../context/web3-context'

const MyAccount = () => {
  const arr = [
    { name: 'nitinshr.fil', date: 'Jan 18, 2023 at 00:49 (UTC+05:30)' },
    { name: 'nitinshr.fil', date: 'Jan 18, 2023 at 00:49 (UTC+05:30)' },
    { name: 'nitinshr.fil', date: 'Jan 18, 2023 at 00:49 (UTC+05:30)' },
  ]

  const Web3Cntx = useContext<any>(Web3Context)
  const { currentAccount } = Web3Cntx

  const handleGetownerNames = async (address: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const res: any = await getOwnerNames(address)
      if (!res.error) {
        console.log('yee res --', res)
      } else {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: res.response,
        })
      }
    } catch (error) {
      console.log('Error in fetching owner names ->', error)
      toast({
        title: 'Error',
        description: (error as Error).message,
      })
    }
  }

  useEffect(() => {
    handleGetownerNames(currentAccount)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="w-10/12 lg:w-8/12 mx-auto">
      <div className="text-white text-left font-bold text-2xl mt-8 mb-5">
        My Account
      </div>
      <div className="result__container font-medium text-gray-unaryBorder p-8 pb-0">
        <div className="flex flex-row justify-between pb-8">
          <h3>Registered Domains</h3>
          <h3>Expiry date</h3>
        </div>
        {arr.map((arr) => (
          <div
            className="border-t-[0.5px] border-[#333336]
            flex flex-row justify-between pt-8 pb-8"
          >
            <div className="flex flex-row items-center gap-3">
              <GlobeLogo />
              <h3 className="text-primary-textBlue text-lg">{arr.name}</h3>
              <CopyIcon
                className="cursor-pointer"
                onClick={() => copyToClipboard(arr.name)}
              />
            </div>
            <div className="flex flex-row items-center gap-3">
              {arr.date}
              <Button onClick={undefined}>Extend</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAccount
