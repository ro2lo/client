import React, { createContext, Component } from 'react';// on importe createContext qui servira à la création d'un ou plusieurs contextes
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import API from '../../utils/API';

/**
 * `createContext` contient 2 propriétés :
 * `Provider` et `Consumer`. Nous les rendons accessibles
 * via la constante `UserContext` et on initialise une
 * propriété par défaut "name" qui sera une chaîne vide.
 * On exporte ce contexte afin qu'il soit exploitable par
 * d'autres composants par la suite via le `Consumer`
 */

export const UserContext = createContext({
    username: "",
});

export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username : "",
            email : "",
            password: ""
        }
        this.handleChange.bind(this);
        this.send.bind(this);
    }
    send = event => {
    if(this.state.email.length === 0){
        return;
    }
    if(this.state.password.length === 0){
        return;
    }
    API.login(this.state.email, this.state.password).then(function(data){
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
    <FormGroup controlId="email" bsSize="large">
        <ControlLabel>Email</ControlLabel>
        <FormControl autoFocus type="email" value={this.state.email} onChange={this.handleChange}/>
    </FormGroup>
    <FormGroup controlId="password" bsSize="large">
        <ControlLabel>Password</ControlLabel>
        <FormControl value={this.state.password} onChange={this.handleChange} type="password"/>
    </FormGroup>
        <Button
    onClick={this.send}
    block
    bsSize="large"
    type="submit"
        >
        Connexion
        </Button>
    </div>
)
}
}