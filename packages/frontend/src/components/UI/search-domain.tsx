import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isValidAddress } from '../../lib/utils'
import { Input } from './input'
import { ReactComponent as SearchLogo } from '../../assets/icons/search-logo.svg'
import { Button } from './button'

interface IProps {
  showBtn: boolean
}

function SearchDomain({ showBtn }: IProps) {
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
    <div
      className={`w-11/12 md:w-6/12 lg:w-4/12 flex items-center
        rounded-full border border-gray-border p-1.5
        ${showBtn ? 'flex-row' : 'flex-row-reverse'}`}
    >
      <SearchLogo
        className={`mx-3 hidden sm:block ${showBtn ? '' : 'cursor-pointer'}`}
        onClick={() => {
          if (!showBtn) handleSearch()
        }}
      />
      <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-11/12 ml-3 md:h-10 lg:h-12 border-0 bg-transparent"
        placeholder="Search for address or domain name"
      />
      {showBtn && (
        <Button
          onClick={handleSearch}
          className="md:h-10 lg:h-12 md:w-20 lg:w-28 uppercase"
        >
          Search
        </Button>
      )}
    </div>
  )
}

export default SearchDomain
