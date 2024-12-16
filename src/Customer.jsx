import React, {Component} from "react";
import {Table} from 'react-bootstrap';
import {Button,ButtonToolbar} from 'react-bootstrap';
import { AddCusModal } from './AddCusModal';
import { EditCusModal } from './EditCusModal';
import Header from './Header';
import { Pagination } from 'react-bootstrap';

export class Customer extends Component{
    constructor(props){
        super(props);
        this.state = {customers:[], filteredCustomers:[], searchQuery:'', addModalShow:false, editModalShow:false, currentPage:1, itemsPerPage:6}
        this.handleSearch = this.handleSearch.bind(this);
    }

    refreshList(){ 
        fetch(`${import.meta.env.VITE_API}customer`)
        .then(response=> response.json())
        .then(data =>{
            this.setState({customers:data});
        });
    }

    componentDidMount(){
        this.refreshList();
    }

    componentDidUpdate(){
        this.refreshList();
    }

    deleteCustomer(customerid){
        if(window.confirm("Are you sure?")){
            fetch(`${import.meta.env.VITE_API}customer/${customerid}`, {
                method:'DELETE',
                header: {'Accept':'application.json',
                    'Content-Type':'application/json'
                }
            })
        }
    }

    handleSearch(query) {
        this.setState({ searchQuery: query });
        const filtered = this.state.customers.filter(customer =>
            customer.CustomerName.toLowerCase().includes(query.toLowerCase())
        );
        this.setState({ filteredCustomers: filtered, currentPage: 1 });
    }

    render()
    {
        const {customers, filteredCustomers, searchQuery, customerid, customername, doe, cityadr, stateadr, currentPage, itemsPerPage} = this.state;
        let addModalClose=()=>this.setState({addModalShow:false});
        let editModalClose=()=>this.setState({editModalShow:false});

        const displayItems = searchQuery ? filteredCustomers : customers;

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
            <div className="text-nowrap ">
                <Header onSearch={this.handleSearch} OpenSidebar={this.props.OpenSidebar} />
                <div className="ml-5">
                    <Table className="ml-5" striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>CustomerId</th>
                                <th>CustomerName</th>
                                <th>Date of Entry</th>
                                <th>City</th>
                                <th>State</th>
                                <th>Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map(customer => (
                                <tr key={customer.CustomerId}>
                                    <td>{customer.CustomerId}</td>
                                    <td>{customer.CustomerName}</td>
                                    <td>{customer.DateofEntry}</td>
                                    <td>{customer.cityAddress}</td>
                                    <td>{customer.stateAddress}</td>
                                    <td>
                                        <ButtonToolbar className="row">
                                            <div className="col-12 d-flex justify-content-start" style={{ gap: '5px' }}>
                                                <Button className="mr-2" variant="info"
                                                    onClick={() => this.setState({
                                                        editModalShow: true,
                                                        customerid: customer.CustomerId,
                                                        customername: customer.CustomerName,
                                                        doe: customer.DateofEntry,
                                                        cityadr: customer.cityAddress,
                                                        stateadr: customer.stateAddress
                                                    })}>Edit</Button>
                                                <Button variant='danger' onClick={() => this.deleteCustomer(customer.CustomerId)}>
                                                    Delete
                                                </Button>
                                            </div>

                                            <EditCusModal show={this.state.editModalShow}
                                                onHide={editModalClose}
                                                customerid={customerid}
                                                customername={customername}
                                                doe={doe}
                                                cityadr={cityadr}
                                                stateadr={stateadr} />
                                        </ButtonToolbar>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

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
                            onClick={() => this.setState({ addModalShow: true })}>
                            Add Customer
                        </Button>

                        <AddCusModal show={this.state.addModalShow}
                            onHide={addModalClose} />
                    </ButtonToolbar>
                </div>
            </div>
        )
    }
   
}

export default Customer
