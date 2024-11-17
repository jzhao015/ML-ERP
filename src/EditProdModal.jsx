import React, {Component} from "react";
import {Modal,Button, Row, Col, Form} from 'react-bootstrap';

export class EditProdModal extends Component{
    constructor(props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event){
        event.preventDefault();
        fetch(`${import.meta.env.VITE_API}product`, {
            method: 'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                ProductId: event.target.ProductId.value,
                ProductName: event.target.ProductName.value,
                CustomerId: parseInt(event.target.CustomerId.value, 10)
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
            Edit Product 
        </Modal.Title>
    </Modal.Header>
    <Modal.Body>
            <Row>
                <Col sm={6}>
                    <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="ProductId">
                            <Form.Label>ProductId</Form.Label>
                            <Form.Control type="text" name="ProductId" required readOnly
                            defaultValue={this.props.prodid}
                        placeholder="ProductId"/>
                        </Form.Group>

                        <Form.Group controlId="ProductName">
                            <Form.Label>ProductName</Form.Label>
                            <Form.Control type="text" name="ProductName" required 
                            defaultValue={this.props.prodname}
                        placeholder="ProductName"/>
                        </Form.Group>

                        <Form.Group controlId="CustomerId">
                            <Form.Label>CustomerId</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="CustomerId"
                                    required
                                    defaultValue={this.props.prodcustomerid}
                                    placeholder="CustomerId"/>
                        </Form.Group>

                        <Form.Group>
                        <Button variant="primary" type="submit">
                            Update Product
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