import React, { Component } from "react";
import { Modal, Button, Row, Col, Form, ModalBody } from "react-bootstrap";

export class EditSoModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
        products: [{ ProductId: "", ProductName: "" }] // Initialize with one empty product row
      };
    
    // Bind functions
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddProduct = this.handleAddProduct.bind(this);
    this.handleRemoveProduct = this.handleRemoveProduct.bind(this);
    //this.handleInputChange = this.handleInputChange.bind(this);
    this.handleProductChange = this.handleProductChange.bind(this);
  }

  handleAddProduct() {
    this.setState((prevState) => ({
      products: [...prevState.products, { ProductId: "", ProductName: "" }]
    }));
  }

  
  handleRemoveProduct(index) {
    this.setState((prevState) => ({
      products: prevState.products.filter((_, i) => i !== index)
    }));
  }

  /*handleInputChange(event) {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      salesOrder: {
        ...prevState.salesOrder,
        [name]: value,
      },
    }));
  }*/

    handleProductChange(index, field, value) {
        const newProducts = [...this.state.products];
        newProducts[index][field] = value;
        this.setState({ products: newProducts });
      }

  handleSubmit(event) {
    event.preventDefault();
    fetch(`${import.meta.env.VITE_API}salesorder`, {
        method: 'PUT',
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            SalesOrderId: event.target.SalesOrderId.value,
            CustomerId: event.target.CustomerId.value,
            CustomerName: event.target.CustomerName.value,
            Products: this.state.products, 
            OrderDate: event.target.OrderDate.value, 
            DeliveryDate: event.target.DeliveryDate.value
        })
    }).then(res=>res.json())
    .then((result)=>{
        console.log(result);  // Check what is being returned
        alert(JSON.stringify(result));  // Display the result as a JSON string
    },
    (error)=>{
        alert("Error")
    }
)
    
  }

  render() {
    

    return (
      <div className="container">
        <Modal {...this.props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">Edit Sales Order</Modal.Title>
          </Modal.Header>
          <ModalBody>
            <Row>
              <Col sm={12}>
                <Form onSubmit={this.handleSubmit}>
                  <Form.Group controlId="SalesOrderId">
                    <Form.Label>Order Id</Form.Label>
                    <Form.Control
                      type="text"
                      name="SalesOrderId"
                      value={this.props.soid}
                      onChange={this.handleInputChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="CustomerId">
                    <Form.Label>Customer Id</Form.Label>
                    <Form.Control
                      type="text"
                      name="CustomerId"
                      value={this.props.socusid}
                      
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="CustomerName">
                    <Form.Label>Customer Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="CustomerName"
                      value={this.props.socusname}
                      onChange={this.handleInputChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="OrderDate">
                    <Form.Label>Order Date</Form.Label>
                    <Form.Control
                      type="text"
                      name="OrderDate"
                      value={this.props.orderDate}
                      onChange={this.handleInputChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="DeliveryDate">
                    <Form.Label>Delivery Date</Form.Label>
                    <Form.Control
                      type="text"
                      name="DeliveryDate"
                      value={this.props.deliveryDate}
                      onChange={this.handleInputChange}
                      required
                    />
                  </Form.Group>

                  <Form.Label>Products</Form.Label>
                  {this.state.products.map((product, index) => (
                    <Row key={index} className="mb-2">
                      <Col>
                        <Form.Control
                          type="text"
                          placeholder="Product Id"
                          value={this.props.productid}
                          onChange={(e) =>
                            this.handleProductChange(index, "ProductId", e.target.value)
                          }
                          required
                        />
                      </Col>
                      <Col>
                        <Form.Control
                          type="text"
                          placeholder="Product Name"
                          value={product.ProductName}
                          onChange={(e) =>
                            this.handleProductChange(index, "ProductName", e.target.value)
                          }
                          required
                        />
                      </Col>
                      <Col sm={2}>
                        <Button
                          variant="danger"
                          onClick={() => this.handleRemoveProduct(index)}
                          disabled={product.length === 1}
                        >
                          Remove
                        </Button>
                      </Col>
                    </Row>
                  ))}

                  <Button variant="success" onClick={this.handleAddProduct}>
                    + Add Product
                  </Button>

                  <br />
                  <br />
                  <Button variant="primary" type="submit">
                    Update
                  </Button>
                </Form>
              </Col>
            </Row>
          </ModalBody>
          
        </Modal>
      </div>
    );
  }
}

export default EditSoModal;
