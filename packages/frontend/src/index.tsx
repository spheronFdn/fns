import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import Web3Provider from './context/web3-context'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <Web3Provider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Web3Provider>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
