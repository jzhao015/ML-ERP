import React, { Component } from "react";
import {Modal,Button, Row, Col, Form, ModalBody} from 'react-bootstrap';

export class AddSoModal extends Component{
    constructor(props){
        super(props);
        this.state = {
            products: [{ ProductId: "", ProductName: "" }] // Initialize with one empty product row
          };
      
          // Bind functions to the component context
          this.handleSubmit = this.handleSubmit.bind(this);
          this.handleAddProduct = this.handleAddProduct.bind(this);
          this.handleRemoveProduct = this.handleRemoveProduct.bind(this);
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
    
      handleProductChange(index, field, value) {
        const newProducts = [...this.state.products];
        newProducts[index][field] = value;
        this.setState({ products: newProducts });
      }
    handleSubmit(event)
    {
        event.preventDefault();
        fetch(`${import.meta.env.VITE_API}salesorder`, {
            method: 'POST',
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

    render(){
        return(
            <div className="container">
                <Modal {...this.props}
                size="lg" aria-labelledby="contained-modal-title-vcenter"
                centered>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Add
                        </Modal.Title>
                    </Modal.Header>
                    <ModalBody>
                        <Row>
                            <Col sm={6}>
                                <Form onSubmit={this.handleSubmit}>
                                    <Form.Group controlId="SalesOrderId">
                                        <Form.Label>
                                            Order Id
                                        </Form.Label>
                                        <Form.Control type="text" name="SalesOrderId" required placeholder="OrderId"/>
                                    </Form.Group>

                                    <Form.Group controlId="CustomerId">
                                        <Form.Label>
                                            Customer Id 
                                        </Form.Label>
                                        <Form.Control type="text" name="CustomerId" required placeholder="CustomerId"/>
                                    </Form.Group>

                                    <Form.Group controlId="CustomerName">
                                        <Form.Label>
                                            Customer Name 
                                        </Form.Label>
                                        <Form.Control type="text" name="CustomerName" required placeholder="CustomerName"/>
                                    </Form.Group>

                                    <Form.Group controlId="OrderDate">
                                        <Form.Label>
                                            Order date 
                                        </Form.Label>
                                        <Form.Control type="text" name="OrderDate" required placeholder="OrderDate"/>
                                    </Form.Group>
                                    <Form.Group controlId="DeliveryDate">
                                        <Form.Label>
                                            Delivery Date 
                                        </Form.Label>
                                        <Form.Control type="text" name="DeliveryDate" required placeholder="DeliveryDate"/>
                                    </Form.Group>
                                    <Form.Label>Products</Form.Label>
                  {this.state.products.map((product, index) => (
                    <Row key={index} className="mb-2">
                      <Col>
                        <Form.Control
                          type="text"
                          placeholder="Product Id"
                          value={product.ProductId}
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
                          disabled={this.state.products.length === 1} // Disable remove if only one product
                        >
                          Remove
                        </Button>
                      </Col>
                    </Row>
                  ))}

<Button variant="success" onClick={this.handleAddProduct}>
                    + Add Product
                  </Button>
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                                </Form>
                            </Col>
                        </Row>
                    </ModalBody>
                    <Modal.Footer>
                        <Button variant="danger" onClick={this.props.onHide}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}