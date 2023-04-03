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
import { Input } from '../../components/UI/input'
import { Web3Context } from '../../context/web3-context'
import { useToast } from '../../hooks/useToast'
import { getFee, getUserBalance, isValidAddress } from '../../lib/utils'
import {
  getAddress,
  getContentHash,
  getExpiry,
  getPriceOnYear,
  isAvailable,
} from '../../services/spheron-fns'

const Domain = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  const Web3Cntx = useContext<any>(Web3Context)
  const { currentAccount } = Web3Cntx
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

  useEffect(() => {
    if (!isDomainAvailable && params.domainName) {
      getAddressFromDomainName(params.domainName || '')
      getContentHashFromDomainName(params.domainName || '')
      getExpiryFromDomainName(params.domainName || '')
    }
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

  const navItems = [
    {
      id: 1,
      label: 'registration',
      isActive: location.pathname.split('/')[3] === 'register',
    },
    {
      id: 2,
      label: 'details',
      isActive: location.pathname.split('/')[3] === 'details',
    },
  ]

  const handleSearch = async (searchQuery: string) => {
    const containsFilSubstr =
      searchQuery.slice(searchQuery.length - 3, searchQuery.length) === 'fil'
    getAvailibility(searchQuery)
    navigate(
      `/${
        isValidAddress(searchQuery)
          ? `address/${searchQuery}/registrant`
          : `domain/${searchQuery}${containsFilSubstr ? '' : '.fil'}/register`
      }`,
    )
  }

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

  return (
    <div className="w-10/12 lg:w-8/12 mx-auto">
      <div className="mt-8 mb-5 flex items-center justify-between">
        {/* <div className="mr-auto ml-0 w-full md:w-9/12 lg:w-6/12 flex space-x-3">
            <Input
              className="h-10 w-11/12 text-base lg:text-lg"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
              }}
            />
            <Button onClick={() => handleSearch(searchQuery)}>Search</Button>
          </div> */}
        <span className="result__text">Result for `{searchQuery}`</span>
      </div>

      <div className="result__container p-8">
        <div className="flex justify-start space-x-8">
          {navItems.map((navItem) => (
            <Link
              key={navItem.id}
              to={`/domain/${params.domainName}/${navItem.label}`}
              className={`capitalize font-semibold text-lg px-4 ${
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
        <>
          <div className="mt-8 w-full flex justify-end"></div>
          <div className="result__container p-8 my-8 pb-8 grid grid-cols-1 lg:grid-cols-2 gap-x-4 lg:space-y-0 space-y-4">
            {processInformation.map((information) => (
              <div className="flex items-start justify-start space-x-4">
                <div className="info__circle__outer">
                  <div className="info__circle__inner">{information.id}</div>
                </div>
                <div className="flex flex-col items-start justify-start">
                  <h3 className="scroll-m-20 text-left lg:text-center text-lg lg:text-2xl font-semibold tracking-tight text-primary-text">
                    {information.title}
                  </h3>
                  <p className="text-xs lg:text-sm font-medium text-gray-text text-opacity-80 text-justify lg:text-left">
                    {information.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Domain
