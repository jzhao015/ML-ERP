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
                
            </header>
            
        )
    }
}

export default Header