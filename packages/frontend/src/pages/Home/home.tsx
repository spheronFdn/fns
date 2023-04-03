import React from 'react'
import { ReactComponent as WebIcon } from '../../assets/icons/web-logo.svg'
import SearchDomain from '../../components/UI/search-domain'

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-10 mt-24">
      <h1 className="scroll-m-20 text-4xl text-white font-extrabold tracking-tight lg:text-5xl">
        <span className="hero__text">Find your personal .fil domain</span>
      </h1>
      <SearchDomain />
      <WebIcon className="front__globe__icon" />
    </div>
  )
}

export default Home
