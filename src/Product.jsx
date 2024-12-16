import React, {Component} from "react";
import {Button,ButtonToolbar, Pagination} from 'react-bootstrap';
import { AddProdModal } from './AddProdModal';
import { EditProdModal } from './EditProdModal';
import Header from './Header';

export class Product extends Component{
    constructor(props){
        super(props);
        this.state = {prods:[], filteredProds: [], searchQuery: '', addModalShow:false, editModalShow:false, currentPage:1, itemsPerPage:6}
        this.handleSearch = this.handleSearch.bind(this);
    }

    refreshList(){ 
        fetch(`${import.meta.env.VITE_API}product`)
        .then(response=> response.json())
        .then(data =>{
            this.setState({prods:data});
        });
    }

    componentDidMount(){
        this.refreshList();
    }

    componentDidUpdate(){
        this.refreshList();
    }

    deleteProd(prodid){
        if(window.confirm("Are you sure?")){
            fetch(`${import.meta.env.VITE_API}product/${prodid}`, {
                method:'DELETE',
                header: {'Accept':'application.json',
                    'Content-Type':'application/json'
                }
            })
        }
    }

    handleSearch(query) {
        this.setState({ searchQuery: query });
        const filtered = this.state.prods.filter(prod =>
            prod.ProductName.toLowerCase().includes(query.toLowerCase())
        );
        this.setState({ filteredProds: filtered, currentPage: 1 });
    }

    render()
    {
        const {prods, filteredProds, searchQuery, prodid, prodname, prodcustomerid, currentPage, itemsPerPage} = this.state;
        let addModalClose=()=>this.setState({addModalShow:false});
        let editModalClose=()=>this.setState({editModalShow:false});

        const displayItems = searchQuery ? filteredProds : prods;

        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = displayItems.slice(indexOfFirstItem, indexOfLastItem);
        const totalPages = Math.ceil(displayItems.length / itemsPerPage);

        let paginationItems = [];
        for (let number = 1; number <= totalPages; number++) {
            paginationItems.push(
                <Pagination.Item 
                    key={number}
                    active={number === currentPage}
                    onClick={() => this.setState({ currentPage: number })}
                >
                    {number}
                </Pagination.Item>
            );
        }

        return(
            <div className="text-nowrap">
                <Header onSearch={this.handleSearch} OpenSidebar={this.props.OpenSidebar} />
    <div className=" ml-5">
        <div className="text-nowrap">
        <table class="table w-auto">
            <thead>
                <tr>
                    <th>ProductId</th>
                    <th>ProductName</th>
                    <th>CustomerId</th>
                    <th>Options</th>
                </tr>
            </thead>
            <tbody>
                {currentItems.map(prod => (
                    <tr key={prod.ProductId}>
                        <td>{prod.ProductId}</td>
                        <td>{prod.ProductName}</td>
                        <td>{prod.CustomerId}</td>
                        <td>

                            <ButtonToolbar className="row">
                            <div className="col-12 d-flex justify-content-start" style={{ gap: '5px' }}>
                                <Button className="mr-2" variant="info" 
                                onClick={()=>this.setState({editModalShow:true,
                                    prodid:prod.ProductId,prodname:prod.ProductName, 
                                    prodcustomerid: prod.CustomerId})}>Edit</Button>
                                <Button  variant='danger' onClick={()=>this.deleteProd(prod.ProductId)}>
                                    Delete
                                </Button>
                            </div>
                                
                                

                                <EditProdModal show={this.state.editModalShow}
                                onHide = {editModalClose}
                                prodid = {prodid} 
                                prodname = {prodname} 
                                prodcustomerid = {prodcustomerid}/>
                            </ButtonToolbar>
                            
                            
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>

        <div className="d-flex justify-content-center mt-3">
            <Pagination>
                <Pagination.First onClick={() => this.setState({ currentPage: 1 })} />
                <Pagination.Prev 
                    onClick={() => this.setState({ currentPage: Math.max(1, currentPage - 1) })}
                />
                {paginationItems}
                <Pagination.Next 
                    onClick={() => this.setState({ currentPage: Math.min(totalPages, currentPage + 1) })}
                />
                <Pagination.Last onClick={() => this.setState({ currentPage: totalPages })} />
            </Pagination>
        </div>

        <ButtonToolbar>
            <Button variant="primary"
            onClick={()=>this.setState({addModalShow:true})}>
                Add Product
            </Button>

            <AddProdModal show={this.state.addModalShow}
                    onHide={addModalClose}/>
        </ButtonToolbar>
        </div>
        
    </div>
</div>

        )
    }
   
}

export default Product