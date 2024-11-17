import React, {Component} from 'react'
import 
 {BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsSearch, BsJustify}
 from 'react-icons/bs'

export class Header extends Component{
    render(){
        const { OpenSidebar } = this.props; // Destructure the OpenSidebar prop
        return(
            <header className='header'>
                <div className='menu-icon'>
                    <BsJustify className='icon' onClick={OpenSidebar} />
                </div>
                <div className='header-left'>
                     <BsSearch className='icon' />
                </div>
                <div className='header-right'>
                    <BsFillBellFill className='icon'/>
                    <BsFillEnvelopeFill  className='icon'/>
                    <BsPersonCircle className='icon' />
                </div>
            </header>
            
        )
    }
}

export default Header