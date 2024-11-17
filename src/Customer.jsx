import React, {Component} from "react";
import {Table} from 'react-bootstrap';
import {Button,ButtonToolbar} from 'react-bootstrap';
import { AddCusModal } from './AddCusModal';
import { EditCusModal } from './EditCusModal';

export class Customer extends Component{
    constructor(props){
        super(props);
        this.state = {customers:[], addModalShow:false, editModalShow:false}
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
    
    render()
    {
        const {customers, customerid, customername, doe, cityadr, stateadr} = this.state;
        let addModalClose=()=>this.setState({addModalShow:false});
        let editModalClose=()=>this.setState({editModalShow:false});
        return(
            <div className="mt-4 ml-5 ">
    <div className=" ml-5">
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
                {customers.map(customer => (
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
                                onClick={()=>this.setState({editModalShow:true,
                                    customerid:customer.CustomerId,customername:customer.CustomerName, 
                                    doe: customer.DateofEntry, cityadr: customer.cityAddress, stateadr:customer.stateAddress})}>Edit</Button>
                                <Button  variant='danger' onClick={()=>this.deleteCustomer(customer.CustomerId)}>
                                    Delete
                                </Button>
                            </div>
                                
                                

                                <EditCusModal show={this.state.editModalShow}
                                onHide = {editModalClose}
                                customerid = {customerid} 
                                customername = {customername} 
                                doe = {doe} 
                                cityadr = {cityadr} 
                                stateadr = {stateadr}/>
                            </ButtonToolbar>
                            
                            
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>

        <ButtonToolbar>
            <Button variant="primary"
            onClick={()=>this.setState({addModalShow:true})}>
                Add Customer
            </Button>

            <AddCusModal show={this.state.addModalShow}
                    onHide={addModalClose}/>
        </ButtonToolbar>
        </div>
        
    </div>
</div>

        )
    }
   
}

export default Customer
