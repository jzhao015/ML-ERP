import React, {Component} from "react";
import {Table} from 'react-bootstrap';
import {Button,ButtonToolbar} from 'react-bootstrap';
import { AddProdModal } from './AddProdModal';
import { EditProdModal } from './EditProdModal';

export class Product extends Component{
    constructor(props){
        super(props);
        this.state = {prods:[], addModalShow:false, editModalShow:false}
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
    
    render()
    {
        const {prods, prodid, prodname, prodcustomerid} = this.state;
        let addModalClose=()=>this.setState({addModalShow:false});
        let editModalClose=()=>this.setState({editModalShow:false});
        return(
            <div className="mt-4 ml-5 ">
    <div className=" ml-5">
        <div className="ml-5">
        <Table className="ml-5" striped bordered hover size="sm">
            <thead>
                <tr>
                    <th>ProductId</th>
                    <th>ProductName</th>
                    <th>CustomerId</th>
                    <th>Options</th>
                </tr>
            </thead>
            <tbody>
                {prods.map(prod => (
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
        </Table>

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