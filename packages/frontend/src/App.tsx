import React, { useContext, useEffect } from 'react'
import './App.css'
import { Toaster } from './components/UI/toaster'
import { Web3Context } from './context/web3-context'
import Router from './Routes'
import { ReactComponent as PoweredBySpheron } from '../src/assets/icons/powered-by-spheron.svg'
import TopRibbon from './components/Navbar/top-ribbon'

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
      <div className="powered__by__spheron">
        Powered by: <PoweredBySpheron />
      </div>
    </div>
  )
}

export default App
