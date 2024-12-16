import React, {Component} from 'react'
import 
 {BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsSearch, BsJustify}
 from 'react-icons/bs'

export class Header extends Component{
    constructor(props) {
        super(props);
        this.state = {
            searchQuery: ''
        };
    }

    handleSearch = (e) => {
        this.setState({ searchQuery: e.target.value });
        if (this.props.onSearch) {
            this.props.onSearch(e.target.value);
        }
    }

    handleSearchClick = () => {
        if (this.props.onSearch) {
            this.props.onSearch(this.state.searchQuery);
        }
    }

    render(){
        const { OpenSidebar } = this.props; // Destructure the OpenSidebar prop
        return(
            <header className='header'>
                <div className='menu-icon'>
                    <BsJustify className='icon' onClick={OpenSidebar} />
                </div>
                <div className='search-container'>
                    <div className='search-wrapper'>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={this.state.searchQuery}
                            onChange={this.handleSearch}
                            className='search-input'
                        />
                        <BsSearch 
                            className='icon_header' 
                            onClick={this.handleSearchClick}
                            style={{ cursor: 'pointer' }}
                        />
                    </div>
                </div>
            </header>
            
        )
    }
}

export default Header