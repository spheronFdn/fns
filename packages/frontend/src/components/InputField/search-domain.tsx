import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isValidAddress } from '../../lib/utils'
import { ReactComponent as SearchLogo } from '../../assets/icons/search-logo.svg'
import { Input } from './input'
import { Button } from '../UI/button'

interface IProps {
  showBtn: boolean
  classname: string
}

function SearchDomain({ showBtn, classname }: IProps) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [inputFocus, setInputFocus] = useState<boolean>(false)

  const inputRef = useRef<HTMLInputElement>(null)

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

  const handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div
      className={`${!!classname && classname}  flex items-center rounded-full
         border ${
           inputFocus
             ? 'border-blue-500'
             : 'border-gray-border hover:border-gray-300'
         }
        duration-200 ease-in-out p-3 md:p-1.5
        ${
          showBtn ? 'flex-row w-11/12 md:w-8/12 lg:w-4/12' : 'flex-row-reverse'
        }`}
    >
      <SearchLogo
        className={`mx-3 ${showBtn ? 'hidden sm:block' : 'cursor-pointer'}`}
        onClick={() => {
          if (!showBtn) handleSearch()
        }}
      />
      <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-11/12 ml-3 md:h-10 lg:h-12 border-0 bg-transparent
        sm:text-base text-sm mr-2 md:mr-3"
        placeholder="Search for address or domain name"
        ref={inputRef}
        onKeyUp={(e) => handleEnterPress(e)}
        onFocus={() => setInputFocus(true)}
        onBlur={() => setInputFocus(false)}
      />
      {showBtn && (
        <Button
          onClick={handleSearch}
          className="md:h-10 lg:h-12 md:w-20 lg:w-28 text-xs md:text-sm uppercase"
        >
          Search
        </Button>
      )}
    </div>
  )
}

export default SearchDomain
