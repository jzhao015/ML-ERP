import React, { Component } from "react";
import { Button, ButtonToolbar } from "react-bootstrap";
import { AddSoModal } from "./AddSoModal";
import { EditSoModal } from "./EditSoModal";

export class Salesorder extends Component {
    constructor(props) {
      super(props);
      this.state = { salesorders: [], addModalShow:false, editModalShow:false };
    }
  
    refreshList() {
      fetch(`${import.meta.env.VITE_API}salesorder`)
        .then((response) => response.json())
        .then((data) => {
          this.setState({ salesorders: data });
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
          })
        }
      }
    render() {
        const {
            salesorders,          
            soid,
            socusid,
            socusname,
            orderDate,
            deliveryDate,
            productid,
            productname,
          } = this.state;
      let addModalClose=()=>this.setState({addModalShow:false});
      let editModalClose=()=>this.setState({editModalShow:false});
      // Filter out duplicate sales orders based on SalesOrderId
      const uniqueSalesOrders = salesorders.filter(
        (order, index, self) =>
          index === self.findIndex((o) => o.SalesOrderId === order.SalesOrderId)
      );
  
      return (
        <div className="text-nowrap">
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
              {uniqueSalesOrders.map((salesorder, index) => (
                <tr key={index}>
                  <td>{salesorder.SalesOrderId}</td>
                  <td>{salesorder.OrderDate}</td>
                  <td>{salesorder.CustomerName}</td>
                  <td>{salesorder.DeliveryDate}</td>
                  <td>
                  <ButtonToolbar className="row">
                    <div
                      className="col-12 d-flex justify-content-start"
                      style={{ gap: "5px" }}
                    >
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
                      soid={soid}
                      socusid={socusid}
                      socusname={socusname}
                      orderDate={orderDate}
                      deliveryDate={deliveryDate}
                      productid={productid}
                      productname = {productname}
                    />
                  </ButtonToolbar>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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




