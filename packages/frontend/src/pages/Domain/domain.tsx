import { ethers } from 'ethers'
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
      console.log('Error in getting address ->', error)
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
      console.log('Error in getting content hash ->', error)
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
      console.log('Error in domain expiry ->', error)
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
    } catch (error) {}

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

        const finalPrice = ethers.utils.formatEther(
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
      label: 'register',
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

  return (
    <>
      <div className="w-full bg-blue-bg bg-opacity-30 py-4">
        <div className="w-8/12 mx-auto flex items-center justify-between">
          <div className="mr-auto ml-0 w-6/12 flex space-x-3">
            <Input
              className="h-10 w-11/12 text-lg"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
              }}
            />
            <Button onClick={() => handleSearch(searchQuery)}>Search</Button>
          </div>
        </div>
      </div>
      <div className="w-8/12 mx-auto flex justify-start space-x-8 pt-5 pb-4 border-b border-gray-border">
        {navItems.map((navItem) => (
          <Link
            key={navItem.id}
            to={`/domain/${params.domainName}/${navItem.label}`}
            className={`capitalize text-lg ${
              navItem.isActive
                ? 'font-semibold text-white'
                : 'text-gray-inactive'
            }`}
          >
            {navItem.label}
          </Link>
        ))}
      </div>
      <div className="w-8/12 mx-auto">
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
    </>
  )
}

export default Domain
