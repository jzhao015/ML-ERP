import React, { Component } from "react";
import { Modal, Button, Row, Col, Form, ModalBody } from "react-bootstrap";
export class AddInvModal extends Component{
    constructor(props){
        super(props);
        this.handleSubmit =  this.handleSubmit.bind(this); 
    }

    handleSubmit(event){
        event.preventDefault();
        fetch(`${import.meta.env.VITE_API}inventory`, {
            method: 'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                InventoryId: event.target.InventoryId.value,
                ProductId: parseInt(event.target.ProductId.value, 10), 
                ProductName: event.target.ProductName.value, 
                QtyInStock: event.target.QtyInStock.value, 
                CostPerUnit: event.target.CostPerUnit.value, 
                
                LastUpdated: event.target.LastUpdated.value, 
                StockStatus: event.target.StockStatus.value
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
                    <Modal.Body>
                        <Row>
                           <Col sm={6}>
                                <Form onSubmit={this.handleSubmit}>
                                    <Form.Group controlId="InventoryId">
                                        <Form.Label>
                                            Inventory Id 
                                        </Form.Label>
                                        <Form.Control type="text" name="InventoryId" readOnly placeholder="InventoryId"/>
                                    </Form.Group>
                                    <Form.Group controlId="ProductId">
                                        <Form.Label>
                                            Product Id 
                                        </Form.Label>
                                        <Form.Control type="text" name="ProductId" required placeholder="ProductId"/>
                                    </Form.Group>

                                    <Form.Group controlId="ProductName">
                                        <Form.Label>
                                            Product Name 
                                        </Form.Label>
                                        <Form.Control type="text" name="ProductName" required placeholder="ProductName"/>
                                    </Form.Group>
                                    <Form.Group controlId="QtyInStock">
                                        <Form.Label>
                                            In Stock Qty 
                                        </Form.Label>
                                        <Form.Control type="text" name="QtyInStock" required placeholder="QtyInStock"/>
                                    </Form.Group>
                                    <Form.Group controlId="CostPerUnit">
                                        <Form.Label>
                                            CostPerUnit 
                                        </Form.Label>
                                        <Form.Control type="text" name="CostPerUnit" required placeholder="CostPerUnit"/>
                                    </Form.Group>
                                    <Row className="mb-2">
                                        <Col>
                                        <Form.Group controlId="LastUpdated">
                                        <Form.Label>
                                        LastUpdated 
                                        </Form.Label>
                                        <Form.Control type="text" name="LastUpdated" required placeholder="LastUpdated"/>
                                    </Form.Group>
                                        </Col>
                                        <Col>
                                        <Form.Group controlId="StockStatus">
                                        <Form.Label>
                                        StockStatus 
                                        </Form.Label>
                                        <Form.Control type="text" name="StockStatus" required placeholder="StockStatus"/>
                                    </Form.Group>
                                        </Col>
                                    </Row>
                                    <Form.Group>
                        <Button variant="primary" type="submit">
                            Add
                        </Button>
                        </Form.Group>
                                </Form>
                           </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={this.props.onHide}>Close</Button>
                    </Modal.Footer>
                 </Modal>
            </div>
        )
    }
}