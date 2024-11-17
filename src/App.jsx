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

import {BrowserRouter, Route, Routes} from 'react-router-dom'

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false)

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }
  return (
    <BrowserRouter> 
      <div className='grid-container'>
      <Header OpenSidebar={OpenSidebar}/>
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar}/>
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
    </BrowserRouter>
    
  )
}

export default App
