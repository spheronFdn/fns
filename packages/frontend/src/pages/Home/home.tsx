import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/UI/button'
import { Input } from '../../components/UI/input'
import { isValidAddress } from '../../lib/utils'

const Home = () => {
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
    <div className="flex flex-col items-center justify-center space-y-10 mt-24 md:mt-32 lg:mt-40">
      <h1 className="scroll-m-20 text-4xl text-white font-extrabold tracking-tight lg:text-5xl">
        Find your personal <span className="hero__text">.fil domain</span>
      </h1>
      <div className="w-11/12 md:w-6/12 lg:w-4/12 flex-col lg:flex-row flex items-center lg:space-y-0 space-y-6">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-11/12  h-14 text-lg lg:mr-4 lg:h-16 lg:text-xl"
          placeholder="Search for address or domain"
        />
        <Button
          onClick={handleSearch}
          className="md:h-14 md:w-20 text-lg lg:h-16 lg:w-28 lg:text-lg"
        >
          Search
        </Button>
      </div>
    </div>
  )
}

export default Home
