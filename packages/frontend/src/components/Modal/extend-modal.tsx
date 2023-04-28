import React, { useContext, useState } from 'react'
import '../../../src/App.scss'
import { ModalContext } from '../../context/modal-context'
import { ReactComponent as PlusIcon } from '../../assets/icons/plus-icon.svg'
import { ReactComponent as MinusIcon } from '../../assets/icons/minus-icon.svg'
import InfoLoader from '../Loader/info-loader'
import { Button } from '../UI/button'
import { toast } from '../../hooks/useToast'

interface IProps {
  option: {
    price: string
    priceLoading: Boolean
    gasFee: string
  }
}

// TODO - TO BE RELEASED NEXT

function ExtendModal({ option }: IProps) {
  const ModalCntx = useContext<any>(ModalContext)
  const { setModalOpen, setModalType, setModalOption } = ModalCntx
  const [year, setYear] = useState<number>(1)

  const totalPrice = Number(option.gasFee) + Number(option.price)

  const handleClose = (e: any) => {
    if (e.target.classList.contains('modal')) {
      setModalOpen(false)
    }
  }

  const handleModalCancel = () => {
    setModalOpen(false)
    setModalType('')
    setModalOption(null)
  }

  // const handleExtend = async () => {
  //   setModalOption(1)
  //   try {
  //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //     const res: any = await renewNames(searchQuery, year.toString(), price)
  //     if (!res.error) {
  //       toast({
  //         title: 'Success',
  //         description: 'Please wait for address to register',
  //       })
  //     } else {
  //       setModalOpen(false)
  //       toast({
  //         title: 'Error',
  //         variant: 'destructive',
  //         description: res.response,
  //       })
  //     }
  //   } catch (error) {
  //     setModalOpen(false)
  //     console.log('Error in registering domain ->', error)
  //     toast({
  //       title: 'Error',
  //       description: (error as Error).message,
  //     })
  //   }
  // }

  return (
    <div className="register__modal modal" onClick={(e) => handleClose(e)}>
      <div className="register__modal__content max-w-lg space-y-5">
        <h2 className="font-semibold">Extend domain validity</h2>
        <hr className="border border-white border-opacity-10" />
        <div className="w-full flex items-start flex-col space-y-5">
          <div className="w-full flex items-center justify-between">
            <span className="text-base text-gray-text">Period:</span>
            <div className="flex items-center space-x-3">
              <MinusIcon
                onClick={() => setYear(year > 1 ? year - 1 : year)}
                className="unary__button"
              />
              <div className="text-primary-text text-center md:text-base text-sm min-w-[70px]">
                {year} year
              </div>
              <PlusIcon
                onClick={() => setYear(year + 1)}
                className="unary__button text-red-700 hover:text-red-700 ease-in-out"
              />
            </div>
          </div>
          <div className="w-full flex items-center justify-between">
            <span className="text-base text-gray-text">Price:</span>
            <div className="ml-12 font-semibold text-primary-text text-right ">
              {option.priceLoading ? <InfoLoader /> : `${option.price} TFIL`}
            </div>
          </div>
          <div className="w-full flex items-center justify-between">
            <span className="text-base text-gray-text">Gas fee:</span>
            <div className="ml-16 font-semibold text-primary-text text-right  ">
              {option.priceLoading ? <InfoLoader /> : `${option.gasFee} TFIL`}
            </div>
          </div>
        </div>
        <hr className="border border-white border-opacity-10" />
        <div className="w-full flex items-center justify-between">
          <div className="w-full flex items-center justify-between">
            <span className="text-base text-gray-text">Total:</span>
            <div className="font-semibold text-primary-text text-xl">
              {option.priceLoading ? (
                <InfoLoader />
              ) : (
                `${totalPrice.toFixed(4)} TFIL`
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-row flex-wrap gap-3 justify-end">
          <Button
            onClick={handleModalCancel}
            className="py-1 uppercase bg-white bg-opacity-10"
            variant="cancel"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setModalOption(null)
            }}
            className="py-1 uppercase"
          >
            Extend Validity
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ExtendModal
