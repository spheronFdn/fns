import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isValidAddress } from '../../lib/utils'
import { Input } from './input'
import { ReactComponent as SearchLogo } from '../../assets/icons/search-logo.svg'
import { Button } from './button'

export default function SearchDomain() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState<string>('')

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
  return (
    <div>
      <div
        className="w-full flex-row flex items-center
        rounded-full border border-gray-border p-2"
      >
        <SearchLogo className="ml-3 hidden sm:block" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-11/12 ml-3 md:h-10 lg:h-12 border-0 bg-transparent"
          placeholder="Search for address or domain name"
        />
        <Button
          onClick={handleSearch}
          className="md:h-10 lg:h-12 md:w-20 lg:w-28 uppercase"
        >
          Search
        </Button>
      </div>
    </div>
  )
}
