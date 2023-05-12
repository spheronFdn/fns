import React, { useContext, useEffect, useState } from 'react'
import { Web3Context } from '../../context/web3-context'
import { toast } from '../../hooks/useToast'
import { getTextRecord, setTextRecord } from '../../services/spheron-fns'
import { Input } from '../InputField/input'
import { Button } from './button'
import { ReactComponent as EditIcon } from '../../assets/icons/edit-icon.svg'
import { ReactComponent as CancelIcon } from '../../assets/icons/cancel-icon.svg'
import Loader from '../Loader/loader'

interface IGetTextRecordResponse {
  error: boolean
  response: string
}

interface ISetTextRecordResponse {
  error: boolean
  // response type - ethers.ContractTransaction & {customData?: Record<string, any> | undefined;}
  response: any
}

interface IProps {
  recordKey: string
  ownerAddress: string
  img: string | null
  type: string
  domainName: string
}

const EditRecord = ({
  recordKey,
  ownerAddress,
  img,
  type,
  domainName,
}: IProps) => {
  const Web3Cntx = useContext<any>(Web3Context)
  const { currentAccount } = Web3Cntx

  const [recordLoading, setRecordLoading] = useState<boolean>(true)

  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [recordValue, setRecordValue] = useState<string>('')
  const [presetRecordValue, setPresetRecordValue] = useState<string>('')

  const handleGetTextRecord = async (key: string) => {
    try {
      setRecordLoading(true)
      const getRecordRes: IGetTextRecordResponse = await getTextRecord(
        domainName,
        key,
      )
      if (!getRecordRes.error) {
        setPresetRecordValue(getRecordRes.response)
        setRecordValue(getRecordRes.response)
      } else
        toast({
          title: 'Error',
          variant: 'destructive',
          description: getRecordRes.response,
        })
      setRecordLoading(false)
    } catch (error) {
      setRecordLoading(false)
      console.log('Error in fetching record ->', error)
      toast({
        title: 'Error',
        description: (error as Error).message,
      })
    }
  }

  const handleSetTextRecord = async (key: string, value: string) => {
    try {
      setRecordLoading(true)
      const setRecordRes: ISetTextRecordResponse = await setTextRecord(
        domainName,
        key,
        value,
      )
      if (!setRecordRes.error) {
        toast({
          title: 'Success',
          description: 'Record updated successfully',
        })
        handleGetTextRecord(key)
      } else {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: setRecordRes.response,
        })
      }
      setIsEditMode(false)
      setRecordLoading(false)
    } catch (error) {
      setIsEditMode(false)
      setRecordLoading(false)
      console.log('Error in setting record ->', error)
      toast({
        title: 'Error',
        description: (error as Error).message,
      })
    }
  }

  useEffect(() => {
    handleGetTextRecord(recordKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordKey])

  return (
    <div className="w-full flex items-center justify-between gap-4 h-8">
      <span
        className={`md:text-base text-sm text-gray-unaryBorder lg:w-1/3 text-left
       flex flex-row items-center gap-3 ${
         type === 'address' ? 'uppercase' : 'capitalize'
       }`}
      >
        {img && <img src={img} alt={recordKey} />}
        {recordKey}:
      </span>
      {recordLoading ? (
        <Loader />
      ) : (
        <div className="lg:w-2/3 flex justify-end">
          <div className="flex justify-end gap-3 lg:w-2/3">
            {isEditMode ? (
              <div className="w-full flex items-center gap-3">
                <div
                  className="w-full flex-row flex items-center gap-3 md:gap-6 
                            bg-[#141416] rounded-full border-2 border-[#434345] pl-2 pr-1 py-1"
                >
                  <Input
                    className="bg-transparent md:text-base text-sm ml-2 w-full"
                    value={recordValue}
                    onChange={(e) => {
                      setRecordValue(e.target.value)
                    }}
                  />
                  <Button
                    onClick={() => handleSetTextRecord(recordKey, recordValue)}
                    className="py-1 h-9 md:text-sm text-xs"
                    disabled={recordLoading}
                  >
                    {!!presetRecordValue ? 'Update' : 'Set'}
                  </Button>
                </div>
                <CancelIcon
                  className="cursor-pointer copy__button"
                  onClick={() => setIsEditMode(!isEditMode)}
                />
              </div>
            ) : (
              <>
                <div className="font-semibold md:text-base text-sm text-primary-text">
                  {presetRecordValue}
                </div>
                {!presetRecordValue && !isEditMode && (
                  <div className="font-semibold md:text-base text-sm text-gray-unaryBorder text-right">
                    Not Set
                  </div>
                )}
                {currentAccount === ownerAddress && (
                  <div className="flex justify-start">
                    <EditIcon
                      className="copy__button"
                      onClick={() => setIsEditMode(!isEditMode)}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default EditRecord
