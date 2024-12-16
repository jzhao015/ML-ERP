import React, {Component} from "react";
import {Button,ButtonToolbar, Pagination} from 'react-bootstrap';
import {AddInvModal} from './AddInvModal';
import {EditInvModal} from './EditInvModal';
import Header from './Header';


export class Inventory extends Component{
    constructor(props){
        super(props);
        this.state = {
            invs:[], 
            filteredInvs: [], 
            searchQuery: '', 
            addModalShow:false, 
            editModalShow:false, 
            currentPage:1, 
            itemsPerPage:6
        }
        this.handleSearch = this.handleSearch.bind(this);
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

      deleteInv(invid){
        if(window.confirm("Are you sure?")){
            fetch(`${import.meta.env.VITE_API}inventory/${invid}`, {
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

    handleSearch(query) {
        this.setState({ searchQuery: query });
        const filtered = this.state.invs.filter(inv => 
            inv.ProductName.toLowerCase().includes(query.toLowerCase())
        );
        this.setState({ filteredInvs: filtered, currentPage: 1 });
    }

    render(){
        const {invs, filteredInvs, searchQuery, invid, invprodid, invprodname, invqty, invcost, invlastupdate, invst, currentPage, itemsPerPage} = this.state;
        let addModalClose=()=>this.setState({addModalShow:false});
        let editModalClose=()=>this.setState({editModalShow:false});

        // Use filteredInvs if there's a search query, otherwise use invs
        const displayItems = searchQuery ? filteredInvs : invs;

        // Calculate pagination based on displayed items
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = displayItems.slice(indexOfFirstItem, indexOfLastItem);
        const totalPages = Math.ceil(displayItems.length / itemsPerPage);

        // Create pagination items
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
                        {currentItems.map(inv=>(
                            <tr key={inv.InventoryId}>
                                <td>{inv.ProductId}</td>
                                <td>{inv.ProductName}</td>
                                <td>{inv.QtyInStock}</td>
                                <td>{this.formatCurrency(inv.CostPerUnit)}</td>
                                <td>{this.formatCurrency(inv.TotalValue)}</td>
                                <td>{inv.LastUpdated}</td>
                                <td>{inv.StockStatus}</td>
                                <td>
                                <ButtonToolbar className="row">
            <div className="col-12 d-flex justify-content-start" style={{ gap: '5px' }}>
                <Button className="mr-2" variant="info" 
                                onClick={()=>this.setState({editModalShow:true,
                                    invid:inv.InventoryId, invprodid:inv.ProductId, invprodname:inv.ProductName,
                                    invqty:inv.QtyInStock, invcost:inv.CostPerUnit,
                                    invlastupdate: inv.LastUpdated, invst:inv.StockStatus})}>Edit</Button>
                <Button  variant='danger' onClick={()=>this.deleteInv(inv.InventoryId)}>
                                    Delete
                                </Button>
            </div>

            <EditInvModal show={this.state.editModalShow}
                                onHide = {editModalClose}
                                invid = {invid} 
                                invprodid = {invprodid}
                                invprodname = {invprodname}
                                invqty = {invqty} 
                                invcost = {invcost}
                                invlastupdate = {invlastupdate}
                                invst = {invst}
                                />
        </ButtonToolbar>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Add pagination controls */}
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