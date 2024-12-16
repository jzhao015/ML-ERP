import React, {Component} from 'react'
import {NavLink} from 'react-router-dom'
import 
{BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, 
  BsListCheck, BsMenuButtonWideFill, BsFillGearFill}
 from 'react-icons/bs'

export class Sidebar extends Component{
    render()
    {
        const { openSidebarToggle, OpenSidebar } = this.props; // Destructure props
        return(
            <aside id='sidebar' className={openSidebarToggle ? "sidebar-responsive": ""}>
                <div className='sidebar-title'>
                    <div className='sidebar-brand'>
                    <BsGrid1X2Fill  className='icon_header'/> SYSTEM
                    </div>
                    <span className='icon close_icon' onClick={OpenSidebar} >X</span>
                </div>
     
                <ul className='sidebar-list'>
                    <li className='sidebar-list-item'>
                        <NavLink className='sidebar-list-item' to='/'>
                        <a href="">
                            <BsGrid1X2Fill className='icon'/> Main Dashboard
                        </a>
                        </NavLink>
                       
                    </li>
                    <li className='sidebar-list-item'>
                        <NavLink className='sidebar-list-item' to='/product'>
                        <a href="">
                                <BsFillArchiveFill className='icon'/> Product  
                        </a>
                        </NavLink>
                    </li>
                    <li className='sidebar-list-item'>
                        <NavLink className='sidebar-list-item' to='/purchaseorder'>
                        <a href="">
                            <BsFillGrid3X3GapFill className='icon'/> Purchase Order
                        </a>
                        </NavLink>
                    </li>
                    <li className='sidebar-list-item'>
                        <NavLink className='sidebar-list-item' to='/salesorder'>
                        <a href="">
                            <BsFillGrid3X3GapFill className='icon'/> Sales Order
                        </a>
                        </NavLink>
                        
                    </li>
                    <li className='sidebar-list-item'>
                        <NavLink className='sidebar-list-item' to='/customer'>
                            <a href="">
                                <BsPeopleFill className='icon'/> Customers
                             </a>
                        </NavLink>
                       
                    </li>
                    <li className='sidebar-list-item'>
                        <NavLink className= 'sidebar-list-item' to='/inventory'>
                        <a href="">
                            <BsListCheck className='icon'/> Inventory
                        </a>
                        </NavLink>
                       
                    </li>
                    <li className='sidebar-list-item'>
                        <NavLink className= 'sidebar-list-item' to='/report'>
                        <a href="">
                            <BsMenuButtonWideFill className='icon'/> Reports
                        </a>
                        </NavLink>
                        
                    </li>
                    {/* 
                    <li className='sidebar-list-item'>
                        <a href="">
                            <BsFillGearFill className='icon'/> Setting
                        </a>
                    </li> */}
                </ul>
            </aside>
        )
    }
    
}

export default Sidebar