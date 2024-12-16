import React, {Component} from "react";
import {Button,ButtonToolbar, Pagination} from 'react-bootstrap';
import {AddPoModal} from './AddPoModal';
import { EditPoModal } from './EditPoModal';
import Header from './Header';

export class Purchaseorder extends Component{
    constructor(props){
      super(props);
      this.state = {
        pos:[], 
        addModalShow:false, 
        editModalShow:false,
        currentPage: 1,
        itemsPerPage: 6,
        searchQuery: ''
      }
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
  formatCurrency(value) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

    handleSearch = (query) => {
        this.setState({ searchQuery: query, currentPage: 1 });
    }

    render(){
      const {pos, poid, doe, pocusid, pocusname, poprodname, pocity, postate, poqty, currentPage, itemsPerPage, searchQuery} = this.state;
      let addModalClose=()=>this.setState({addModalShow:false});
      let editModalClose=()=>this.setState({editModalShow:false});

      const filteredPos = pos.filter(po =>
        po.ProductName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        po.SupplierName.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const currentItems = filteredPos.slice(indexOfFirstItem, indexOfLastItem);
      const totalPages = Math.ceil(filteredPos.length / itemsPerPage);

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
          <div className=" text-nowrap">
              <Header onSearch={this.handleSearch} OpenSidebar={this.props.OpenSidebar} />
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
      <th scope="col">Qty</th>
      <th scope="col">TotalValue</th>
      <th scope="col">Options</th>
    </tr>
  </thead>
  <tbody>
    {currentItems.map(po=>(
    <tr key={po.OrderId}>
      <td>{po.OrderId}</td>
      <td>{po.DateofEntry}</td>
      <td>{po.SupplierId}</td>
      <td>{po.SupplierName}</td>
      <td>{po.ProductName}</td>
      <td>{po.cityAddress}</td>
      <td>{po.stateAddress}</td>
      <td>{po.Qty}</td>
      <td> {this.formatCurrency(po.ValuePrice)}</td>
      <td>
        <ButtonToolbar className="row">
            <div className="col-12 d-flex justify-content-start" style={{ gap: '5px' }}>
                <Button className="mr-2" variant="info" 
                                onClick={()=>this.setState({editModalShow:true,
                                    poid:po.OrderId, doe:po.DateofEntry, pocusid:po.SupplierId,
                                    pocusname:po.SupplierName, poprodname:po.ProductName,
                                    pocity: po.cityAddress, postate:po.stateAddress, poqty:po.Qty})}>Edit</Button>
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
                                poqty = {poqty}/>
        </ButtonToolbar>
      </td>
    </tr>))}
   
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