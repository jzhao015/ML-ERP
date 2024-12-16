import React, {Component} from "react";
import {Modal,Button, Row, Col, Form} from 'react-bootstrap';

export class EditCusModal extends Component{
    constructor(props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event){
        event.preventDefault();
        fetch(`${import.meta.env.VITE_API}customer`, {
            method: 'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                CustomerId: event.target.CustomerId.value,
                CustomerName: event.target.CustomerName.value,
                DateofEntry: event.target.DateofEntry.value,
                cityAddress: event.target.cityAddress.value, 
                stateAddress: event.target.stateAddress.value
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

    render()
    {
        return(
            <div className="container">
                <Modal {...this.props}
size="lg"
aria-labelledby="contained-modal-title-vcenter"
centered>
    <Modal.Header clooseButton>
        <Modal.Title id="contained-modal-title-vcenter">
            Edit Customer 
        </Modal.Title>
    </Modal.Header>
    <Modal.Body>
            <Row>
                <Col sm={6}>
                    <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="CustomerId">
                            <Form.Label>CustomerId</Form.Label>
                            <Form.Control type="text" name="CustomerId" required readOnly
                            defaultValue={this.props.customerid}
                        placeholder="CustomerId"/>
                        </Form.Group>

                        <Form.Group controlId="CustomerName">
                            <Form.Label>CustomerName</Form.Label>
                            <Form.Control type="text" name="CustomerName" required 
                            defaultValue={this.props.customername}
                        placeholder="CustomerName"/>
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

                        <Form.Group controlId="cityAddress">
                            <Form.Label>City</Form.Label>
                            <Form.Control type="text" name="cityAddress" required 
                            defaultValue={this.props.cityadr}
                        placeholder="cityAddress"/>
                        </Form.Group>

                        <Form.Group controlId="stateAddress">
                            <Form.Label>State</Form.Label>
                            <Form.Control type="text" name="stateAddress" required 
                            defaultValue={this.props.stateadr}
                        placeholder="stateAddress"/>
                        </Form.Group>

                        <Form.Group>
                        <Button variant="primary" type="submit">
                            Update Customer
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