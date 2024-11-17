import React, {Component} from "react";
import {Modal,Button, Row, Col, Form} from 'react-bootstrap';

export class AddPoModal extends Component{
    constructor(props){
        super(props);
        this.handleSubmit =  this.handleSubmit.bind(this); 
    }

    handleSubmit(event){
        event.preventDefault();
        fetch(`${import.meta.env.VITE_API}purchaseorder`, {
            method: 'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                DateofEntry: event.target.DateofEntry.value,
                CustomerId: parseInt(event.target.CustomerId.value, 10), 
                CustomerName: event.target.CustomerName.value,
                ProductName: event.target.ProductName.value, 
                cityAddress: event.target.cityAddress.value, 
                stateAddress: event.target.stateAddress.value, 
                valuePrice: event.target.valuePrice.value
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
                <Modal 
                {...this.props}
                size="lg" aria-labelledby="contained-modal-title-vcenter"
                centered>
                    <Modal.Header clooseButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Add
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={6}>
                                <Form onSubmit={this.handleSubmit}>
                                    <Form.Group controlId="DateofEntry">
                                        <Form.Label>Date of Entry</Form.Label>
                                        <Form.Control
                                    type="date"
                                    name="DateofEntry"
                                    required
                                    placeholder="DateofEntry"/>
                                    </Form.Group>

                                    <Form.Group controlId="CustomerId">
                                        <Form.Label>
                                            Supplier Id 
                                        </Form.Label>
                                        <Form.Control type="text" name="CustomerId" required placeholder="SupplierId"/>
                                    </Form.Group>

                                    <Form.Group controlId="CustomerName">
                                        <Form.Label>
                                            Supplier Name
                                        </Form.Label>
                                        <Form.Control type="text" name="CustomerName" required placeholder="SupplierName"/>
                                    </Form.Group>

                                    <Form.Group controlId="ProductName">
                                        <Form.Label>
                                            Product Name
                                        </Form.Label>
                                        <Form.Control type="text" name="ProductName" required placeholder="ProductName"/>
                                    </Form.Group>

                                    <Form.Group controlId="cityAddress">
                                        <Form.Label>
                                            City
                                        </Form.Label>
                                        <Form.Control type="text" name="cityAddress" required placeholder="cityAddress"/>
                                    </Form.Group>

                                    <Form.Group controlId="stateAddress">
                                        <Form.Label>
                                            State
                                        </Form.Label>
                                        <Form.Control type="text" name="stateAddress" required placeholder="stateAddress"/>
                                    </Form.Group>

                                    <Form.Group controlId="valuePrice">
                                        <Form.Label>
                                            Price
                                        </Form.Label>
                                        <Form.Control type="text" name="valuePrice" required placeholder="valuePrice"/>
                                    </Form.Group>

                                    <Form.Group>
                        <Button variant="primary" type="submit">
                            Add PO
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