import { utils } from 'ethers'
import React, { useContext, useEffect, useState } from 'react'
import {
  useParams,
  useLocation,
  useNavigate,
  Outlet,
  Link,
} from 'react-router-dom'
import { Button } from '../../components/UI/button'
import { ModalContext } from '../../context/modal-context'
import { Web3Context } from '../../context/web3-context'
import { useToast } from '../../hooks/useToast'
import { copyToClipboard, getFee, getUserBalance } from '../../lib/utils'
import {
  getAddress,
  getContentHash,
  getExpiry,
  getPriceOnYear,
  isAvailable,
  registerDomain,
  setAddr,
} from '../../services/spheron-fns'
import { ReactComponent as CopyIcon } from '../../assets/icons/copy-icon.svg'
import CopyPopup from '../../components/Popup/copy-popup'
import SearchDomain from '../../components/InputField/search-domain'
import DomainRecords from '../../components/UI/domain-records'

const Domain = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  const Web3Cntx = useContext<any>(Web3Context)
  const { currentAccount, connectWallet } = Web3Cntx
  const [isDomainAvailable, setIsDomainAvailable] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [contentHashLoading, setContentHashLoading] = useState<boolean>(true)
  const [ownerLoading, setOwnerLoading] = useState<boolean>(true)
  const [ownerAddress, setOwnerAddress] = useState<string>('')
  const [contentHash, setContentHash] = useState<string>('')
  const params = useParams<{ domainName: string }>()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [expiryDate, setExpiryDate] = useState<string>('')
  const [expiryDateLoading, setExpiryDateLoading] = useState<boolean>(true)
  const [step, setStep] = useState<number>(0)
  const [priceLoading, setPriceLoading] = useState<boolean>(true)
  const [price, setPrice] = useState<string>('')
  const [userBalanceLoading, setUserBalanceLoading] = useState<boolean>(true)
  const [userBalance, setUserBalance] = useState<string>('')
  const [gasFee, setGasFee] = useState<string>('')
  const [year, setYear] = useState<number>(1)
  const [isSuccessful, setIsSuccessful] = useState<boolean>(false)

  async function getAddressFromDomainName(domainName: string) {
    setOwnerLoading(true)
    try {
      const res = await getAddress(domainName)
      setOwnerAddress(res.response || '')
    } catch (error) {
      console.log('Error in getAddressFromDomainName: ')
      console.log(error)
      toast({
        title: 'Error',
        description: (error as Error).message,
      })
    }
    setOwnerLoading(false)
  }

  async function getContentHashFromDomainName(domainName: string) {
    setContentHashLoading(true)
    try {
      const res = await getContentHash(domainName)
      setContentHash(res.response || '')
    } catch (error) {
      console.log('Error in getContentHashFromDomainName: ')
      console.log(error)
      toast({
        title: 'Error',
        description: (error as Error).message,
      })
    }
    setContentHashLoading(false)
  }

  async function getExpiryFromDomainName(domainName: string) {
    setExpiryDateLoading(true)
    try {
      const res = await getExpiry(domainName)
      const finalDate = String(parseInt((res.response as any)._hex || '0', 16))
      setExpiryDate(finalDate)
    } catch (error) {
      console.log('Error in getExpiryFromDomainName: ')
      console.log(error)
      toast({
        title: 'Error',
        description: (error as Error).message,
      })
    }

    setExpiryDateLoading(false)
  }

  useEffect(() => {
    if (Boolean(params.domainName)) {
      setSearchQuery(params.domainName || '')
    } else {
      navigate('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.domainName])

  async function getAvailibility(searchTerm: string) {
    setLoading(true)
    try {
      let response = await isAvailable(searchTerm)
      setIsDomainAvailable(!!response.response)
    } catch (error) {
      console.log('Error in getAvailibility: ')
      console.log(error)
    }

    setLoading(false)
  }

  useEffect(() => {
    setYear(1)
    if (params.domainName) {
      getAvailibility(params.domainName)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.domainName])

  const getDomainDetails = () => {
    getAddressFromDomainName(params.domainName || '')
    getContentHashFromDomainName(params.domainName || '')
    getExpiryFromDomainName(params.domainName || '')
  }

  useEffect(() => {
    if (!isDomainAvailable && params.domainName) getDomainDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDomainAvailable, params.domainName])

  useEffect(() => {
    setIsSuccessful(false)
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
    if (searchQuery && isDomainAvailable) {
      getPrice(searchQuery)
      getGasFee()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.domainName, year, isDomainAvailable])

  useEffect(() => {
    async function getBalance(address: string) {
      setUserBalanceLoading(true)
      const balance = await getUserBalance(address)
      setUserBalance(balance)
      setUserBalanceLoading(false)
    }
    if (currentAccount) getBalance(currentAccount)
  }, [currentAccount])

  const domainOptionsPathname = location.pathname.split('/')[3]

  const navItems = [
    {
      id: 1,
      label: 'registration',
      route: 'register',
      isActive: domainOptionsPathname === 'register',
    },
    {
      id: 2,
      label: 'details',
      route: 'details',
      isActive: domainOptionsPathname === 'details',
    },
    // TODO - WILL BE RELEASED WHEN PACKAGE SUPPORT FOR SUBDOMAIN IS RELEASED
    // {
    //   id: 2,
    //   label: 'subdomains',
    //   route: 'subdomain',
    //   isActive: domainOptionsPathname === 'subdomain',
    // },
  ]

  const processInformation = [
    {
      id: 1,
      title: 'Transaction Signing',
      description: `Your wallet will open and you will be asked to confirm the first of two transactions required for registration. If the second transaction is not processed within 7 days of the first, you will need to start again from step 1.`,
    },
    {
      id: 2,
      title: 'Wait for a few minutes',
      description: `The waiting period is required to ensure another person hasn’t tried to register the same name and protect you after your request.`,
    },
  ]

  const ModalCntx = useContext<any>(ModalContext)
  const { setModalOpen, setModalType, setModalOption } = ModalCntx

  const [registerLoading, setRegisterLoading] = useState<boolean>(false)
  const [hash, setHash] = useState<string>('')

  const totalPrice = Number(gasFee) + Number(price)
  const isLessBalance = userBalance ? totalPrice > Number(userBalance) : false

  const handleRegister = async () => {
    setModalType('registerDomain')
    setRegisterLoading(true)
    setStep(1)
    setModalOption(1)
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const res: any = await registerDomain(
        searchQuery,
        currentAccount,
        year,
        price,
      )
      if (!res.error) {
        toast({
          title: 'Success',
          description: 'Please wait for address to register',
        })
        setStep(2)
        setModalOption(2)
        const addrRes = await setAddr(searchQuery, currentAccount)
        if (!addrRes.error) {
          setModalOpen(false)
          setStep(3)
          setModalOption(3)
          setIsSuccessful(true)
          setRegisterLoading(false)
          navigate(`/domain/${params.domainName}/details`)
          getDomainDetails()
          toast({
            title: 'Successful',
            description:
              'Congratulations, you have successfully registered a domain',
          })
          setHash(res.response)
        } else {
          setModalOpen(false)
          setStep(0)
          setModalOption(0)
          setRegisterLoading(false)
          toast({
            title: 'Error',
            variant: 'destructive',
            description: res.response,
          })
        }
      } else {
        setModalOpen(false)
        setStep(0)
        setModalOption(0)
        setRegisterLoading(false)
        toast({
          title: 'Error',
          variant: 'destructive',
          description: res.response,
        })
      }
    } catch (error) {
      setModalOpen(false)
      console.log('Error in registering domain ->', error)
      toast({
        title: 'Error',
        description: (error as Error).message,
      })
      setRegisterLoading(false)
    }
  }

  const handleRegisterClick = () => {
    if (!!currentAccount) {
      setModalOpen(true)
      if (!registerLoading) handleRegister()
    }
    connectWallet()
  }

  const [showCopyPopup, setShowCopyPopup] = useState<boolean>(false)
  const [copyPopupText, setPopupText] = useState<string>('Click to Copy')

  useEffect(() => {
    if (copyPopupText === 'Copied!') {
      setTimeout(() => {
        setPopupText('Click to Copy')
      }, 2000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [copyPopupText])

  return (
    <div className="w-11/12 lg:w-10/12 mx-auto flex flex-col justify-end">
      <div className="mt-6 mb-5 flex flex-col items-start gap-8">
        <SearchDomain showBtn={false} classname="lg:hidden w-full" />
        {isDomainAvailable ? (
          <span className="result__text">Result for `{searchQuery}`</span>
        ) : (
          <div className="flex flex-row gap-4 items-center">
            <h2 className="result__text">{searchQuery}</h2>
            <div className="static">
              {showCopyPopup && (
                <CopyPopup text={copyPopupText} classname="-mt-11 -ml-9" />
              )}
              <CopyIcon
                className="copy__button copy__button__result"
                onClick={() => {
                  copyToClipboard(searchQuery)
                  setPopupText('Copied!')
                }}
                onMouseOver={() => setShowCopyPopup(true)}
                onMouseOut={() => {
                  setShowCopyPopup(false)
                }}
              />
            </div>
          </div>
        )}
      </div>
      <div className="result__container p-6 md:p-8">
        <div className="flex justify-start space-x-8">
          {navItems.map((navItem) => (
            <Link
              key={navItem.id}
              to={`/domain/${params.domainName}/${navItem.route}`}
              className={`capitalize font-semibold text-sm sm:text-base md:text-lg px-4 ${
                navItem.isActive
                  ? 'text-primary-textBlue pb-2 border-b border-primary-textBlue'
                  : 'text-gray-inactive'
              }`}
            >
              {navItem.label}
            </Link>
          ))}
        </div>
        <Outlet
          context={[
            searchQuery,
            isDomainAvailable,
            loading,
            ownerLoading,
            contentHashLoading,
            expiryDateLoading,
            ownerAddress,
            contentHash,
            expiryDate,
            step,
            setStep,
            price,
            userBalance,
            gasFee,
            priceLoading,
            userBalanceLoading,
            year,
            setYear,
            isSuccessful,
            setIsSuccessful,
          ]}
        />
      </div>
      {isDomainAvailable && (
        <div className="w-full flex justify-end">
          <Button
            disabled={priceLoading || !!hash || isSuccessful || isLessBalance}
            onClick={handleRegisterClick}
            className="mt-6 uppercase md:text-sm text-xs"
          >
            {currentAccount
              ? registerLoading
                ? 'registering'
                : 'register now'
              : 'connect to register'}
          </Button>
        </div>
      )}

      {!isDomainAvailable && domainOptionsPathname === 'details' && (
        <DomainRecords ownerAddress={ownerAddress} domainName={searchQuery} />
      )}

      {isDomainAvailable && (
        <div className="mt-6 w-full sm:flex hidden">
          <div className="result__container p-6 md:p-8 my-8 pb-8 grid grid-cols-1 lg:grid-cols-2 gap-x-4 lg:space-y-0 space-y-4">
            {processInformation.map((information) => (
              <div className="flex items-start justify-start space-x-4">
                <div className="info__circle__outer">
                  <div className="info__circle__inner">{information.id}</div>
                </div>
                <div className="flex flex-col items-start justify-start">
                  <h3 className="scroll-m-20 text-left lg:text-center text-base lg:text-2xl font-semibold tracking-tight text-primary-text">
                    {information.title}
                  </h3>
                  <p className="text-sm lg:text-base font-medium text-gray-text text-opacity-80 text-justify lg:text-left">
                    {information.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Domain
