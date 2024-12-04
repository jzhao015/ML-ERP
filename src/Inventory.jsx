import React, {Component} from "react";
import {Button,ButtonToolbar} from 'react-bootstrap';
import {AddInvModal} from './AddInvModal';

export class Inventory extends Component{
    constructor(props){
        super(props);
        this.state = {invs:[], addModalShow:false, editModalShow:false}
      }  
    //inv for each product 
    refreshList(){
        fetch(`${import.meta.env.VITE_API}inventory`)
          .then(response=> response.json())
          .then(data =>{
              this.setState({invs:data});
          });
      }

    componentDidMount(){
        this.refreshList();
      }
  
    componentDidUpdate(){
        this.refreshList();
      }
    render(){
        const {invs} = this.state;
        let addModalClose=()=>this.setState({addModalShow:false});
        let editModalClose=()=>this.setState({editModalShow:false});
        return(
            <div className="text-nowrap">
                <table class="table w-auto">
                    <thead>
                        <tr>
                        <th scope="col">Product Id</th>
                        <th scope="col">Product Name</th>
                        <th scope="col">Qty</th>
                        <th scope="col">CostPerUnit</th>
                        <th scope="col">Total Value</th>
                        <th className="w-auto" >Last Updated</th>
                        <th scope="col">Stock Status</th>
                        <th scope="col">Option</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invs.map(inv=>(
                            <tr key={inv.InventoryId}>
                                <td>{inv.ProductId}</td>
                                <td>{inv.ProductName}</td>
                                <td>{inv.QtyInStock}</td>
                                <td>{inv.CostPerUnit}</td>
                                <td>{inv.TotalValue}</td>
                                <td>{inv.LastUpdated}</td>
                                <td>{inv.StockStatus}</td>
                                <td>Edit</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <ButtonToolbar>
            <Button variant="primary"
            onClick={()=>this.setState({addModalShow:true})}>
                Add Stock
            </Button>

            <AddInvModal show={this.state.addModalShow}
                    onHide={addModalClose}/>
        </ButtonToolbar>
            </div>
        )
    }
    
}

export default Inventory