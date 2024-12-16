import React, {Component} from "react";
import {Button, ButtonToolbar} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Login.css'


export class Login extends Component{
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
            userId: null
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        fetch(`${import.meta.env.VITE_API}user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Username: this.state.username,
                PasswordHash: this.state.password,
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Login failed');
            }
            return response.json();
        })
        .then(data => {
            console.log('Login successful:', data);
            this.props.navigate('/home');
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    handleRegister(event) {
        event.preventDefault();
        fetch(`${import.meta.env.VITE_API}user/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                UserId: this.state.userId,
                Username: this.state.username,
                PasswordHash: this.state.password,
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Registration failed');
            }
            return response.json();
        })
        .then(data => {
            console.log('Registration successful:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    render() {
        return (
          
            <div className="login-container">
                <h2>Login</h2>
                <form onSubmit={this.handleSubmit}>
                    <input 
                        type="text" 
                        value={this.state.username} 
                        onChange={(e) => this.setState({ username: e.target.value })} 
                        placeholder="Username" 
                        required 
                    />
                    <input 
                        type="password" 
                        value={this.state.password} 
                        onChange={(e) => this.setState({ password: e.target.value })} 
                        placeholder="Password" 
                        required 
                    />
                    <div className="form-options">
                        <label>
                            <input type="checkbox" /> Show Password
                        </label>
                        <a href="/forgot-password">Forgot Password?</a>
                    </div>
                    <Button type="submit">LOGIN</Button>
                </form>
                <div className="register-link">
                    <p>Don't have an account? <a href="#" onClick={this.handleRegister}>Sign up</a></p>
                </div>
            </div>
           
        );
    }
}

const LoginWithNavigate = (props) => {
    const navigate = useNavigate();
    return <Login {...props} navigate={navigate} />;
};

export default LoginWithNavigate;