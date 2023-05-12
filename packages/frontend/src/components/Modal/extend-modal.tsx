import React, { useContext, useState, useEffect } from 'react'
import { utils } from 'ethers'
import { useParams } from 'react-router-dom'
import '../../../src/App.scss'
import { ModalContext } from '../../context/modal-context'
import { ReactComponent as PlusIcon } from '../../assets/icons/plus-icon.svg'
import { ReactComponent as MinusIcon } from '../../assets/icons/minus-icon.svg'
import { ReactComponent as HourglassIcon } from '../../assets/icons/hourglass-icon.svg'
import { ReactComponent as CheckCircleIcon } from '../../assets/icons/check-circle-icon.svg'
import InfoLoader from '../Loader/info-loader'
import { Button } from '../UI/button'
import { toast } from '../../hooks/useToast'
import { getPriceOnYear, renewNames } from '../../services/spheron-fns'
import { getFee } from '../../lib/utils'

interface IProps {
  option: {
    searchQuery: string
    expirationDate: string
    isDomainAvailable: boolean
  }
}

const ExtendModal = ({ option }: IProps) => {
  const ModalCntx = useContext<any>(ModalContext)
  const { setModalOpen, setModalType, setModalOption } = ModalCntx
  const params = useParams<{ domainName: string }>()
  const [year, setYear] = useState<number>(1)
  const [price, setPrice] = useState<string>('')
  const [gasFee, setGasFee] = useState<string>('')
  const [priceLoading, setPriceLoading] = useState<boolean>(false)
  const [extendLoading, setExtendLoading] = useState<boolean>(false)
  const [extendSuccess, setExtendSuccess] = useState<boolean>(false)

  const totalPrice = Number(gasFee) + Number(price)

  const handleClose = (e: any) => {
    if (e.target.classList.contains('modal')) {
      setModalOpen(false)
      setExtendSuccess(false)
    }
  }

  const handleModalCancel = () => {
    setModalOpen(false)
    setModalType('')
    setModalOption(null)
    setExtendSuccess(false)
  }

  useEffect(() => {
    async function getGasFee() {
      const fees = await getFee()
      setGasFee(fees)
    }

    async function getPrice(domainName: string) {
      setPriceLoading(true)
      try {
        const res: any = await getPriceOnYear(domainName, year)

        const finalPrice = utils.formatEther(
          `${parseInt(res.response.base._hex, 16)}`,
        )
        setPrice(finalPrice)
      } catch (error) {
        console.log('Error in get price  ->', error)
        toast({
          title: 'Error',
          description: (error as Error).message,
        })
      }

      setPriceLoading(false)
    }
    getPrice(option.searchQuery)
    getGasFee()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.domainName, year, option.isDomainAvailable])

  const handleExtend = async () => {
    setExtendLoading(true)
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const res: any = await renewNames(option.searchQuery, year, price)
      if (!res.error) {
        setExtendSuccess(true)
        toast({
          title: 'Success',
          description: 'Domain name extended successfully',
        })
      } else {
        setModalOpen(false)
        toast({
          title: 'Error',
          variant: 'destructive',
          description: res.response,
        })
      }

      setExtendLoading(false)
    } catch (error) {
      setExtendLoading(false)
      setModalOpen(false)
      console.log('Error in registering domain ->', error)
      toast({
        title: 'Error',
        description: (error as Error).message,
      })
    }
  }

  return (
    <div className="register__modal modal" onClick={(e) => handleClose(e)}>
      {extendLoading ? (
        <div
          className="register__modal__content max-w-lg space-y-5
          flex flex-col items-center justify-center"
        >
          <div className="h-14 w-14 flex items-center justify-center rounded-full bg-gray-900">
            <HourglassIcon className="animate-spin" />
          </div>
          <h2 className="font-semibold">Extending domain validity date</h2>
          <h3 className="text-base text-gray-text text-center">
            We’re extending validity period for your domain, it will take some
            minutes, please hang on with us.
          </h3>
          <h3 className="text-base text-gray-text text-center">
            Please do not close the window.
          </h3>
        </div>
      ) : (
        <>
          {extendSuccess ? (
            <div
              className="register__modal__content max-w-lg space-y-5
          flex flex-col items-center justify-center"
            >
              <div className="h-14 w-14 flex items-center justify-center rounded-full bg-gray-900">
                <CheckCircleIcon />
              </div>
              <h2 className="font-semibold text-center">
                Validity is extended till <br /> ‘{option.expirationDate}’
              </h2>
              <h3 className="text-base text-gray-text text-center">
                Hurray you’ve extended the validity period. Thank you for
                choosing us.
              </h3>
              <Button onClick={handleModalCancel} className="py-1 uppercase">
                View Details
              </Button>
            </div>
          ) : (
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
                    {priceLoading ? <InfoLoader /> : `${price} TFIL`}
                  </div>
                </div>
                <div className="w-full flex items-center justify-between">
                  <span className="text-base text-gray-text">Gas fee:</span>
                  <div className="ml-16 font-semibold text-primary-text text-right  ">
                    {priceLoading ? <InfoLoader /> : `${gasFee} TFIL`}
                  </div>
                </div>
              </div>
              <hr className="border border-white border-opacity-10" />
              <div className="w-full flex items-center justify-between">
                <div className="w-full flex items-center justify-between">
                  <span className="text-base text-gray-text">Total:</span>
                  <div className="font-semibold text-primary-text text-xl">
                    {priceLoading ? (
                      <InfoLoader />
                    ) : (
                      `${totalPrice.toFixed(4)} TFIL`
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-row flex-wrap gap-3 justify-end text-sm">
                <Button
                  onClick={handleModalCancel}
                  className="py-1 uppercase bg-white bg-opacity-10"
                  variant="cancel"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleExtend}
                  disabled={priceLoading || extendLoading}
                  className="py-1 uppercase disabled:bg-primary-buttonHover"
                >
                  Extend Validity
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ExtendModal
