import React, { useState } from 'react'
import { ReactComponent as PlusIcon } from '../../assets/icons/plus-icon.svg'
import { ReactComponent as MinusIcon } from '../../assets/icons/minus-icon.svg'
import { ReactComponent as EditIcon } from '../../assets/icons/edit-icon.svg'
import { toast } from '../../hooks/useToast'
import { setTextRecord } from '../../services/spheron-fns'

const DomainRecords = () => {
  const [showRecords, setShowRecords] = useState<boolean>(false)
  const [showAddressRecords, setShowAddressRecords] = useState<boolean>(false)
  const [showTextRecords, setShowTextRecords] = useState<boolean>(false)
  const [showSocialRecords, setShowSocialRecords] = useState<boolean>(false)

  const handleSetTextRecord = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const res: any = await setTextRecord('nitinshr', {
        key: 'eth',
        value: 'helloiamunderthewaterblll..',
      })
      console.log('YEE RES --', res)
      if (!res.error) {
        toast({
          title: 'Success',
          description: 'Record updated successfully',
        })
      } else {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: res.response,
        })
      }
    } catch (error) {
      console.log('Error in setting record ->', error)
      toast({
        title: 'Error',
        description: (error as Error).message,
      })
    }
  }

  const addressRecordList = [
    { id: 1, key: 'FIL' },
    { id: 2, key: 'ETH' },
    { id: 3, key: 'BTC' },
  ]

  return (
    <div className="result__container duration-500 transition ease-in-out delay-150 p-6 md:p-8 my-10">
      <div
        className="flex flex-row justify-between items-center cursor-pointer"
        onClick={() => setShowRecords(!showRecords)}
      >
        <h2 className="text-lg text-white font-medium">Records</h2>
        {showRecords ? (
          <MinusIcon
            onClick={() => setShowRecords(false)}
            className="unary__button ease-in-out"
          />
        ) : (
          <PlusIcon
            onClick={() => setShowRecords(true)}
            className="unary__button ease-in-out"
          />
        )}
      </div>
      {showRecords && (
        <div className="pt-7">
          <div
            className="flex flex-row justify-between items-center
               border-t border-gray-border
               py-7 cursor-pointer"
            onClick={() => setShowAddressRecords(!showAddressRecords)}
          >
            <h2 className="text-md text-gray-400 font-medium uppercase">
              Addresses
            </h2>
            {showAddressRecords ? (
              <MinusIcon
                onClick={() => handleSetTextRecord()}
                className="unary__button ease-in-out"
              />
            ) : (
              <PlusIcon
                onClick={() => setShowAddressRecords(true)}
                className="unary__button ease-in-out"
              />
            )}
          </div>
          {showAddressRecords && (
            <div className="pb-7 space-y-7">
              {addressRecordList.map((address) => (
                <div
                  key={address.id}
                  className="flex flex-row items-center justify-between"
                >
                  <h3 className="md:text-base text-sm text-gray-unaryBorder text-left">
                    {address.key}:
                  </h3>
                  <EditIcon className="copy__button" onClick={() => null} />
                </div>
              ))}
            </div>
          )}
          <div
            className="flex flex-row justify-between items-center
               border-t border-gray-border
               py-7"
          >
            <h2 className="text-md text-gray-400 font-medium uppercase">
              Text Records
            </h2>
            {showTextRecords ? (
              <MinusIcon
                onClick={() => setShowTextRecords(false)}
                className="unary__button ease-in-out"
              />
            ) : (
              <PlusIcon
                onClick={() => setShowTextRecords(true)}
                className="unary__button ease-in-out"
              />
            )}
          </div>
          <div
            className="flex flex-row justify-between items-center
               border-t border-gray-border
               py-7"
          >
            <h2 className="text-md text-gray-400 font-medium uppercase">
              Social Records
            </h2>
            {showSocialRecords ? (
              <MinusIcon
                onClick={() => setShowSocialRecords(false)}
                className="unary__button ease-in-out"
              />
            ) : (
              <PlusIcon
                onClick={() => setShowSocialRecords(true)}
                className="unary__button ease-in-out"
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DomainRecords
