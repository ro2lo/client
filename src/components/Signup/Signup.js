import React from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import API from '../../utils/API';

export class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username : "",
            email : "",
            password: "",
            cpassword: ""
        }
        this.handleChange.bind(this);
        this.send.bind(this);
    }
    send = event => {
        if(this.state.email.length === 0){
            return;
        }
        if(this.state.password.length === 0 || this.state.password !== this.state.cpassword){
            return;
        }
        var _send = {
            username: this.state.username,
            email: this.state.email,
            password: this.state.password
        }

        API.signup(_send).then(function(data){
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('username', data.data.username);
            window.location = "/dashboard"
        },function(error){
            console.log(error);
            return;
        })
    }
    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }
    render() {
        return(
            <div className="Login">
                <FormGroup controlId="username" bsSize="large">
                    <ControlLabel>Pseudo</ControlLabel>
                    <FormControl autoFocus type="email" value={this.state.username} onChange={this.handleChange}/>
                </FormGroup>
                <FormGroup controlId="email" bsSize="large">
                    <ControlLabel>Email</ControlLabel>
                    <FormControl autoFocus type="email" value={this.state.email} onChange={this.handleChange}/>
                </FormGroup>
                <FormGroup controlId="password" bsSize="large">
                    <ControlLabel>Mot de passe</ControlLabel>
                    <FormControl value={this.state.password} onChange={this.handleChange} type="password"/>
                </FormGroup>
                <FormGroup controlId="cpassword" bsSize="large">
                    <ControlLabel>Confirmer le mot de passe</ControlLabel>
                    <FormControl value={this.state.cpassword} onChange={this.handleChange} type="password"/>
                </FormGroup>
                <Button
                    onClick={this.send}
                    block
                    bsSize="large"
                    type="submit"
                >
                    Inscription
                </Button>
            </div>
        )
    }
}