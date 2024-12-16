import { useState } from 'react'
import './App.css'
import Header from './Header'
import Sidebar from './Sidebar'
import Home from './Home'
import Product from './Product'
import Customer  from './Customer'
import Purchaseorder from './Purchaseorder'
import Salesorder from './Salesorder'
import Report from './Report'
import Inventory from './Inventory'
import Login from './Login'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false)
  const location = useLocation();

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }

  const isLoginPage = location.pathname === '/login';
  return (
    <>
      {isLoginPage ? (
        <div className="login-page d-flex justify-content-center align-items-center vh-100">
          <Routes>
            <Route path='/login' element={<Login />} />
          </Routes>
        </div>
      ) : (
        <div className='grid-container'>
          <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
          <div className='main'>
            <Routes>
              <Route path='/' element={<Home />} exact />
              <Route path='/product' element={<Product />} />
              <Route path='/customer' element={<Customer />} />
              <Route path='/purchaseorder' element={<Purchaseorder />} />
              <Route path='/salesorder' element={<Salesorder />} />
              <Route path='/report' element={<Report />} />
              <Route path='/inventory' element={<Inventory />} />
            </Routes>
          </div>
        </div>
      )}
    </>
  )
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}
