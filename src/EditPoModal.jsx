import React, {Component} from "react";
import {Modal,Button, Row, Col, Form} from 'react-bootstrap';


export class EditPoModal extends Component{
    constructor(props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(event){
        event.preventDefault();
        fetch(`${import.meta.env.VITE_API}purchaseorder`, {
            method: 'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                OrderId: event.target.OrderId.value,
                DateofEntry: event.target.DateofEntry.value,
                SupplierId: parseInt(event.target.SupplierId.value, 10), 
                SupplierName: event.target.SupplierName.value,
                ProductName: event.target.ProductName.value, 
                cityAddress: event.target.cityAddress.value, 
                stateAddress: event.target.stateAddress.value, 
                Qty: event.target.Qty.value
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
                            Edit
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={6}>
                                <Form onSubmit={this.handleSubmit}>

                                <Form.Group controlId="OrderId">
                                        <Form.Label>
                                            OrderId
                                        </Form.Label>
                                        <Form.Control type="text" name="OrderId" required readOnly 
                                        defaultValue={this.props.poid} placeholder="OrderId"/>
                                    </Form.Group>
                                    <Form.Group controlId="DateofEntry">
                                        <Form.Label>Date of Entry</Form.Label>
                                        <Form.Control
                                    type="date"
                                    name="DateofEntry"
                                    required
                                    defaultValue={this.props.doe}
                                    placeholder="DateofEntry"/>
                                    </Form.Group>

                                    <Form.Group controlId="SupplierId">
                                        <Form.Label>
                                            Supplier Id 
                                        </Form.Label>
                                        <Form.Control type="text" name="SupplierId" required 
                                        defaultValue={this.props.pocusid} placeholder="SupplierId"/>
                                    </Form.Group>

                                    <Form.Group controlId="SupplierName">
                                        <Form.Label>
                                            Supplier Name
                                        </Form.Label>
                                        <Form.Control type="text" name="SupplierName" required
                                        defaultValue={this.props.pocusname} placeholder="SupplierName"/>
                                    </Form.Group>

                                    <Form.Group controlId="ProductName">
                                        <Form.Label>
                                            Product Name
                                        </Form.Label>
                                        <Form.Control type="text" name="ProductName" required 
                                        defaultValue={this.props.poprodname} placeholder="ProductName"/>
                                    </Form.Group>

                                    <Form.Group controlId="cityAddress">
                                        <Form.Label>
                                            City
                                        </Form.Label>
                                        <Form.Control type="text" name="cityAddress" required 
                                        defaultValue={this.props.pocity} placeholder="cityAddress"/>
                                    </Form.Group>

                                    <Form.Group controlId="stateAddress">
                                        <Form.Label>
                                            State
                                        </Form.Label>
                                        <Form.Control type="text" name="stateAddress" required 
                                        defaultValue={this.props.postate} placeholder="stateAddress"/>
                                    </Form.Group>

                                    <Form.Group controlId="Qty">
                                        <Form.Label>
                                            Quantity
                                        </Form.Label>
                                        <Form.Control type="text" name="Qty" required 
                                        defaultValue={this.props.poqty} placeholder="valuePrice"/>
                                    </Form.Group>

                                    <Form.Group>

                        <Button variant="primary" type="submit">
                            Update
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