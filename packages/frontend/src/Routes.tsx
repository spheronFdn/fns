import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import Modals from './components/Modal/modals'
import Navbar from './components/Navbar/navbar'
import Address from './pages/Address'
import AddressRegistrant from './pages/AddressRegistrant'
import Domain from './pages/Domain'
import DomainDetail from './pages/DomainDetail'
import DomainRegister from './pages/DomainRegister'
import Home from './pages/Home'
import MyAccount from './pages/MyAccount'

const Router = () => {
  return (
    <>
      <HashRouter>
        <Modals />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/myaccount" element={<MyAccount />} />
          <Route path="/domain/:domainName" element={<Domain />}>
            <Route index path="register" element={<DomainRegister />} />
            <Route path="details" element={<DomainDetail />} />
            {/* TODO - WILL BE UPDATED WHEN PACKAGE SUPPORT FOR SUBDOMAIN IS RELEASED */}
            {/* <Route path="subdomain" element={<Subdomain />} /> */}
          </Route>
          <Route path="/address/:address" element={<Address />}>
            <Route index path="registrant" element={<AddressRegistrant />} />
          </Route>
        </Routes>
      </HashRouter>
    </>
  )
}

export default Router
