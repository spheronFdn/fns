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
    console.log('X', params)
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
    navigate(
      `/${
        isValidAddress(searchQuery)
          ? `address/${searchQuery}/registrant`
          : `domain/${searchQuery}.fil/register`
      }`,
    )
  }

  return (
    <>
      <div className="w-full bg-slate-100 py-4">
        <div className="w-8/12 mx-auto flex items-center justify-between">
          <div className="mr-auto ml-0 w-6/12 flex space-x-3">
            <Input
              className="h-10 w-11/12 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button onClick={handleSearch}>Search</Button>
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
            to={`/address/${params.address}/${navItem.label}`}
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
        <Outlet context={[searchQuery]} />
      </div>
    </>
  )
}

export default Domain
