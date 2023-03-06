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

const Domain = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams<{ address: string }>()
  const [searchQuery, setSearchQuery] = useState<string>('')

  useEffect(() => {
    if (Boolean(params.address)) {
      setSearchQuery(params.address || '')
    } else {
      navigate('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const navItems = [
    {
      id: 1,
      label: 'registrant',
      isActive: location.pathname.split('/')[3] === 'registrant',
    },
  ]

  const handleSearch = () => {
    const containsFilSubstr =
      searchQuery.slice(searchQuery.length - 3, searchQuery.length) === 'fil'
    navigate(
      `/${
        isValidAddress(searchQuery)
          ? `address/${searchQuery}/registrant`
          : `domain/${searchQuery}${containsFilSubstr ? '' : '.fil'}/register`
      }`,
    )
  }

  const handleViewOnExplorer = () => {
    window.open(`https://hyperspace.filfox.info/en/address/${searchQuery}`)
  }

  return (
    <>
      <div className="w-full bg-blue-bg bg-opacity-30 py-4">
        <div className="w-11/12 lg:w-8/12 mx-auto flex items-center justify-between">
          <div className="mr-auto ml-0 w-full md:w-9/12 lg:w-6/12 flex space-x-3">
            <Input
              className="h-10 w-11/12 text-base lg:text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>

          <span
            className="lg:block hidden cursor-pointer underline text-sm text-primary-text"
            onClick={handleViewOnExplorer}
          >
            View on explorer
          </span>
        </div>
      </div>
      <div className="w-11/12 lg:w-8/12 mx-auto flex justify-start space-x-8 pt-5 pb-4 border-b border-gray-border">
        {navItems.map((navItem) => (
          <Link
            key={navItem.id}
            to={`/address/${params.address}/${navItem.label}`}
            className={`capitalize text-lg ${
              navItem.isActive ? 'font-semibold text-white' : 'text-slate-400'
            }`}
          >
            {navItem.label}
          </Link>
        ))}
      </div>
      <div className="w-11/12 lg:w-8/12 mx-auto">
        <Outlet context={[searchQuery]} />
      </div>
    </>
  )
}

export default Domain
