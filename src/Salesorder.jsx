import React, { Component } from "react";
import { Button, ButtonToolbar, Pagination } from "react-bootstrap";
import { AddSoModal } from "./AddSoModal";
import { EditSoModal } from "./EditSoModal";
import Header from './Header';

export class Salesorder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            salesorders: [],
            filteredSalesOrders: [],
            searchQuery: '',
            addModalShow: false,
            editModalShow: false,
            currentPage: 1,
            itemsPerPage: 6
        };
        this.handleSearch = this.handleSearch.bind(this);
    }

    refreshList() {
        fetch(`${import.meta.env.VITE_API}salesorder`)
            .then((response) => response.json())
            .then((data) => {
                this.setState({ salesorders: data});
            });
    }

    componentDidMount() {
        this.refreshList();
    }

    componentDidUpdate() {
        this.refreshList();
    }

    deleteSalesOrder(orderId) {
        if (window.confirm("Are you sure?")) {
            fetch(`${import.meta.env.VITE_API}salesorder/${orderId}`, {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });
        }
    }

    handleSearch(query) {
        this.setState({ searchQuery: query });
        const filtered = this.state.salesorders.filter(order =>
            order.CustomerName.toLowerCase().includes(query.toLowerCase())
        );
        this.setState({ filteredSalesOrders: filtered, currentPage: 1 });
    }

    render() {
        const { salesorders, filteredSalesOrders, searchQuery, currentPage, itemsPerPage } = this.state;
        let addModalClose = () => this.setState({ addModalShow: false });
        let editModalClose = () => this.setState({ editModalShow: false });

        const displayItems = searchQuery ? filteredSalesOrders : salesorders;

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

        return (
            <div className="text-nowrap">
                <Header onSearch={this.handleSearch} OpenSidebar={this.props.OpenSidebar} />
                <table className="table w-auto">
                    <thead>
                        <tr>
                            <th scope="col">Order Id</th>
                            <th className="w-auto">Date</th>
                            <th scope="col">Customer Name</th>
                            <th scope="col">Delivery Date</th>
                            <th scope="col">Option</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((salesorder, index) => (
                            <tr key={index}>
                                <td>{salesorder.SalesOrderId}</td>
                                <td>{salesorder.OrderDate}</td>
                                <td>{salesorder.CustomerName}</td>
                                <td>{salesorder.DeliveryDate}</td>
                                <td>
                                    <ButtonToolbar className="row">
                                        <div className="col-12 d-flex justify-content-start" style={{ gap: "5px" }}>
                                            <Button
                                                variant="info"
                                                onClick={() =>
                                                    this.setState({
                                                        editModalShow: true,
                                                        soid: salesorder.SalesOrderId,
                                                        socusid: salesorder.CustomerId,
                                                        socusname: salesorder.CustomerName,
                                                        orderDate: salesorder.OrderDate,
                                                        deliveryDate: salesorder.DeliveryDate,
                                                        productid: salesorder.ProductId,
                                                        productname: salesorder.ProductName,
                                                    })
                                                }
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="danger"
                                                onClick={() => this.deleteSalesOrder(salesorder.SalesOrderId)}
                                            >
                                                Delete
                                            </Button>
                                        </div>

                                        <EditSoModal
                                            show={this.state.editModalShow}
                                            onHide={editModalClose}
                                            soid={this.state.soid}
                                            socusid={this.state.socusid}
                                            socusname={this.state.socusname}
                                            orderDate={this.state.orderDate}
                                            deliveryDate={this.state.deliveryDate}
                                            productid={this.state.productid}
                                            productname={this.state.productname}
                                        />
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
                    <Button
                        variant="primary"
                        onClick={() => this.setState({ addModalShow: true })}
                    >
                        Add Sales Order
                    </Button>

                    <AddSoModal show={this.state.addModalShow} onHide={addModalClose} />
                </ButtonToolbar>
            </div>
        );
    }
}

export default Salesorder;




