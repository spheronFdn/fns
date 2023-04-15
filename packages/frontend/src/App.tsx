import React, { useContext, useEffect } from 'react'
import './App.scss'
import { Toaster } from './components/UI/toaster'
import { Web3Context } from './context/web3-context'
import Router from './Routes'
import TopRibbon from './components/Navbar/top-ribbon'
import PoweredBySpheron from './components/UI/powered-by-spheron'

function App() {
  const Web3Cntx = useContext<any>(Web3Context)
  const { connectWallet } = Web3Cntx

  useEffect(() => {
    connectWallet()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="App">
      <TopRibbon />
      <Router />
      <Toaster />
      <PoweredBySpheron />
    </div>
  )
}

export default App
