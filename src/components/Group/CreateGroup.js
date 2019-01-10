import React, { createContext, Component } from 'react';// on importe createContext qui servira à la création d'un ou plusieurs contextes
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import API from '../../utils/API';



export class CreateGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name : "",
        }
        this.handleChange.bind(this);
        this.send.bind(this);
    }

    send = event => {
        if(this.state.name.length === 0){
            return;
        }
        const name = this.state.name;
        API.checkToken(localStorage.getItem('token')).then(function(data){
            if(data.request.status === 200){
                API.createGroup(name, data.data.user._id).then(function(data){
                    console.log(data.data.text);
                    window.location = "/dashboard"
                },function(error){
                    console.log(error);
                    return;
                })
            }
        },function (error) {
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
            <div className="Activity">
                <FormGroup controlId="name" bsSize="large">
                    <ControlLabel>Name</ControlLabel>
                    <FormControl autoFocus type="text" value={this.state.name} onChange={this.handleChange}/>
                </FormGroup>
                <Button
                    onClick={this.send}
                    block
                    bsSize="large"
                    type="submit"
                >
                    Ajouter
                </Button>
            </div>
        )
    }
}