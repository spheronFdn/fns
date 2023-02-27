import React from 'react'
import './App.css'
import { Toaster } from './components/UI/toaster'
import Router from './Routes'

function App() {
  return (
    <div className="App">
      <Router />
      <Toaster />
    </div>
  )
}

export default App
