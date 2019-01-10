import React, { createContext, Component } from 'react';// on importe createContext qui servira à la création d'un ou plusieurs contextes
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import API from '../../utils/API';

export class CreateActivity extends React.Component {
    constructor(props) {
        super(props);
        const {id} = props.match.params;
        this.state = {
            name : "",
            min : "",
            max : "",
            step : "",
            group_id : id,
            frequence : "",
        }
        this.handleChange.bind(this);
        this.send.bind(this);
    }
    send = event => {
        if(this.state.name.length === 0){
            return;
        }
        if(this.state.min.length === 0){
            return;
        }
        if(this.state.max.length === 0){
            return;
        }
        const options = [this.state.min,this.state.max,this.state.step,this.state.name,this.state.group_id]
        API.checkToken(localStorage.getItem('token')).then(function(data){
            if(data.request.status === 200){
                API.createActivity(options[0],options[1],options[2],options[3],options[4]).then(function(data){
                    console.log(data.data.text);
                    window.location = '/group/show/'+options[4]
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
                <FormGroup controlId="min" bsSize="large">
                    <ControlLabel>Min</ControlLabel>
                    <FormControl autoFocus type="number" value={this.state.min} onChange={this.handleChange}/>
                </FormGroup>
                <FormGroup controlId="max" bsSize="large">
                    <ControlLabel>Max</ControlLabel>
                    <FormControl autoFocus type="number" value={this.state.max} onChange={this.handleChange}/>
                </FormGroup>
                <FormGroup controlId="step" bsSize="large">
                    <ControlLabel>Step</ControlLabel>
                    <FormControl autoFocus type="number" value={this.state.step} onChange={this.handleChange}/>
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