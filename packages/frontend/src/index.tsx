import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import Web3Provider from './context/web3-context'
import ModalProvider from './context/modal-context'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <Web3Provider>
    <ModalProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </ModalProvider>
  </Web3Provider>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
