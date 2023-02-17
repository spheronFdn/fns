import React, { useEffect, useState } from 'react'
import {
  useParams,
  useLocation,
  useNavigate,
  Outlet,
  Link,
} from 'react-router-dom'
import { Button } from '../../components/UI/button'
import { Input } from '../../components/UI/input'
import { isValidAddress } from '../../lib/utils'
import { isAvailable } from '../../services/spheron-fns'

const Domain = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isDomainAvailable, setIsDomainAvailable] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const params = useParams<{ domainName: string }>()
  const [searchQuery, setSearchQuery] = useState<string>('')

  useEffect(() => {
    console.log(params)
    if (Boolean(params.domainName)) {
      setSearchQuery(params.domainName || '')
    } else {
      navigate('/lol')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.domainName])

  async function getAvailibility(searchTerm: string) {
    setLoading(true)
    let response = await isAvailable(searchTerm)
    setIsDomainAvailable(!!response)
    setLoading(false)
  }

  useEffect(() => {
    if (params.domainName) {
      getAvailibility(params.domainName)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.domainName])

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

  console.log(searchQuery.slice(searchQuery.length - 3, searchQuery.length))

  return (
    <>
      <div className="w-full bg-slate-100 py-4">
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
          <span className="cursor-pointer underline text-sm">
            View on explorer
          </span>
        </div>
      </div>
      <div className="w-8/12 mx-auto flex justify-start space-x-8 pt-5 pb-4 border-b border-slate-200">
        {navItems.map((navItem) => (
          <Link
            key={navItem.id}
            to={`/domain/${params.domainName}/${navItem.label}`}
            className={`capitalize text-lg ${
              navItem.isActive
                ? 'font-semibold text-slate-700'
                : 'text-slate-400'
            }`}
          >
            {navItem.label}
          </Link>
        ))}
      </div>
      <div className="w-8/12 mx-auto">
        <Outlet context={[searchQuery, isDomainAvailable, loading]} />
      </div>
    </>
  )
}

export default Domain
