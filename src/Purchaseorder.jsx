import React, {Component} from "react";
import {Button,ButtonToolbar} from 'react-bootstrap';
import {AddPoModal} from './AddPoModal';
import { EditPoModal } from './EditPoModal';

export class Purchaseorder extends Component{
    constructor(props){
      super(props);
      this.state = {pos:[], addModalShow:false, editModalShow:false}
    }  

    refreshList(){
      fetch(`${import.meta.env.VITE_API}purchaseorder`)
        .then(response=> response.json())
        .then(data =>{
            this.setState({pos:data});
        });
    }

    componentDidMount(){
      this.refreshList();
    }

    componentDidUpdate(){
      this.refreshList();
    }

    deletePo(poid){
      if(window.confirm("Are you sure?")){
          fetch(`${import.meta.env.VITE_API}purchaseorder/${poid}`, {
              method:'DELETE',
              header: {'Accept':'application.json',
                  'Content-Type':'application/json'
              }
          })
      }
  }

    render(){
      const {pos, poid, doe, pocusid, pocusname, poprodname, pocity, postate, poprice} = this.state;
      let addModalClose=()=>this.setState({addModalShow:false});
      let editModalClose=()=>this.setState({editModalShow:false});
        return(
            <div className=" text-nowrap">
                <table class="table w-auto">
  <thead>
    <tr>
      <th scope="col">Order Id</th>
      <th className="w-auto" >Date</th>
      <th scope="col">Supplier Id</th>
      <th scope="col">Supplier Name</th>
      <th scope="col">Product</th>
      <th scope="col">City</th>
      <th scope="col">State</th>
      <th scope="col">Value</th>
      <th scope="col">Options</th>
    </tr>
  </thead>
  <tbody>
    {pos.map(po=>(
    <tr key={po.OrderId}>
      <td>{po.OrderId}</td>
      <td>{po.DateofEntry}</td>
      <td>{po.CustomerId}</td>
      <td>{po.CustomerName}</td>
      <td>{po.ProductName}</td>
      <td>{po.cityAddress}</td>
      <td>{po.stateAddress}</td>
      <td>{po.valuePrice}</td>
      <td>
        <ButtonToolbar className="row">
            <div className="col-12 d-flex justify-content-start" style={{ gap: '5px' }}>
                <Button className="mr-2" variant="info" 
                                onClick={()=>this.setState({editModalShow:true,
                                    poid:po.OrderId, doe:po.DateofEntry, pocusid:po.CustomerId,
                                    pocusname:po.CustomerName, poprodname:po.ProductName,
                                    pocity: po.cityAddress, postate:po.stateAddress, poprice:po.valuePrice})}>Edit</Button>
                <Button  variant='danger' onClick={()=>this.deletePo(po.OrderId)}>
                                    Delete
                                </Button>
            </div>

            <EditPoModal show={this.state.editModalShow}
                                onHide = {editModalClose}
                                poid = {poid} 
                                doe = {doe}
                                pocusid = {pocusid}
                                pocusname = {pocusname} 
                                poprodname = {poprodname}
                                pocity = {pocity}
                                postate = {postate}
                                poprice = {poprice}/>
        </ButtonToolbar>
      </td>
    </tr>))}
   
  </tbody>
</table>
<ButtonToolbar>
            <Button variant="primary"
            onClick={()=>this.setState({addModalShow:true})}>
                Add PO
            </Button>

            <AddPoModal show={this.state.addModalShow}
                    onHide={addModalClose}/>
        </ButtonToolbar>
            </div>
        )
    }
    
}

export default Purchaseorder