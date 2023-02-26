import React, { useContext, useEffect } from 'react'
import './App.css'
import { Toaster } from './components/UI/toaster'
import { Web3Context } from './context/web3-context'
import Router from './Routes'

function App() {
  const Web3Cntx = useContext<any>(Web3Context)
  const { connectWallet } = Web3Cntx

  useEffect(() => {
    connectWallet()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="App">
      <Router />
      <Toaster />
    </div>
  )
}

export default App
