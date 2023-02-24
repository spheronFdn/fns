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
    <div className="flex flex-col items-center justify-center space-y-10 mt-10">
      <h1 className="scroll-m-20 text-4xl text-white font-extrabold tracking-tight lg:text-5xl">
        Find your personal <span className="hero__text">.fil domain</span>
      </h1>
      <div className="w-4/12 flex items-center">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-11/12 mr-4"
          placeholder="Search for address or domain"
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>
    </div>
  )
}

export default Home
