import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/navbar'
import Address from './pages/Address'
import AddressRegistrant from './pages/AddressRegistrant'
import Domain from './pages/Domain'
import DomainDetail from './pages/DomainDetail'
import DomainRegister from './pages/DomainRegister'
import Home from './pages/Home'

const Router = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/domain/:domainName" element={<Domain />}>
            <Route index path="register" element={<DomainRegister />} />
            <Route path="details" element={<DomainDetail />} />
          </Route>
          <Route path="/address/:address" element={<Address />}>
            <Route index path="registrant" element={<AddressRegistrant />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default Router
