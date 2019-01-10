import React, { Component } from 'react';// on importe createContext qui servira à la création d'un ou plusieurs contextes
import { Button, FormGroup, FormControl, ControlLabel, Col,Radio, Table } from "react-bootstrap";

import {Line,Radar,Bar} from 'react-chartjs-2';


import API from '../../utils/API';



export class ShowActivity extends React.Component {
    constructor(props) {
        super(props);
        const {id} = props.match.params;
        this.state = {
            activitie : "",
            components : {
                line: Line,
                radar: Radar,
                bar: Bar,
            },
            tag : 'line',
            value : '',
            label : this.formatDate(new Date()),
            note : "",
            history : [],
            activity_id : id,
        }
        this.handleChange.bind(this);
        this.send.bind(this);


    }

    formatDate = (date) => {
    var d = date,
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        hour = d.getHours(),
        min = d.getMinutes();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-')+'T'+[hour, min].join(':');
    }

    displayFormatDate = (date) => {
    var d = date,
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        hour = d.getHours(),
        min = d.getMinutes();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('/')+'\n'+[hour, min].join('h');
    }

    componentDidMount() {
        this.makeChart();
    }

    makeChart = () =>{
        let currentComponent = this;
        API.checkToken(localStorage.getItem('token')).then(function(data){
            if(data.request.status === 200){
                console.log(currentComponent.state.activity_id);
                API.showActivity(currentComponent.state.activity_id).then(function (data) {
                    console.log(data)
                    currentComponent.setState({ activitie : data.data.activity })
                    currentComponent.setState({ history : data.data.activity.moods })
                },function (error) {
                    console.log(error);
                    return;
                })
            }
        },function (error) {
            console.log(error);
            return;
        })
    }
    send = event => {
        if(this.state.value.length === 0){
            return;
        }
        if(this.state.note.length === 0){
            this.state.note = "";
        }
        const currentComponent = this;
        var value = this.state.value;
        var note = this.state.note;
        var label = this.state.label;
        var activity = event.target.parentNode.id;
        API.checkToken(localStorage.getItem('token')).then(function(data){
            if(data.request.status === 200){
                console.log(value,activity,note);
                API.createMood(value,label,activity,note).then(function (data) {
                    console.log(data);
                    currentComponent.componentDidMount();
                },function (error) {
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
    handleChart = event => {
        this.setState({
            tag: event.target.value
        });
        this.componentDidMount()
    }
    compare = (a,b) => {
        return new Date(b.label) - new Date(a.label);
    }

    daysBetween = ( date1, date2 ) => {
        //Get 1 day in milliseconds
        var one_day=1000*60*60*24;

        // convert to date

        var d = new Date(date1),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        date1 = new Date([year, month, day].join('-'));

        var d2 = new Date(date2),
            month2 = '' + (d2.getMonth() + 1),
            day2 = '' + d2.getDate(),
            year2 = d2.getFullYear();


        date2 =  new Date([year2, month2, day2].join('-'));


        // Calculate the difference in milliseconds
        // Convert back to days and return
        return Math.round((date2-date1)/(1000*60*60*24));
    }

    render() {
        const TagName = this.state.components[this.state.tag || 'line'];
        var values = [];
        var labels = [];
        var value = 0;
        var currentDate = null;
        var currentItemLabel = null;
        var currentComponnent = this;
        if (Object.keys(this.state.history).length > 1){
            var tab = this.state.history.sort(this.compare).reverse();
            var first = tab[0]['label'];
            var last = tab[Object.keys(this.state.history).length-1]['label'];
            var diffDays = currentComponnent.daysBetween(first,last);
        }
        console.log(first,last,diffDays);
        Object.keys(this.state.history.sort(this.compare).reverse()).map(function(objectKey, index) {
            var item = currentComponnent.state.history[objectKey];
            if(currentDate == null){
                if(diffDays < 1){
                    currentDate = new Date(item.label).toISOString()
                }else{
                    currentDate = new Date(item.label).toLocaleDateString()
                }
            }

            if(diffDays < 1){
                currentItemLabel = new Date(item.label).toISOString()
            }else{
                currentItemLabel = new Date(item.label).toLocaleDateString()
            }

            if(currentDate != currentItemLabel){
                values.push(value);
                if(diffDays < 1){
                    currentDate = new Date(item.label).toISOString()
                    labels.push(currentComponnent.displayFormatDate(new Date(currentDate)))
                }else{
                    labels.push(currentDate.toLocaleString())
                    currentDate = currentItemLabel;
                }
                value = 0;
            }
            value += item.value;

            if(Object.keys(currentComponnent.state.history).length == parseInt(objectKey)+1){
                values.push(value);
                if(diffDays < 1){
                    labels.push(currentComponnent.displayFormatDate(new Date(currentDate)))
                }else{
                    labels.push(new Date(item.label).toLocaleDateString())
                }

            }
        }

    );
        values.map(function (item) {
            console.log(item);
            if(item > currentComponnent.state.activitie.max){
                currentComponnent.state.activitie.max = item
            }
        })


        const data = {
            labels: labels,
            datasets: [
                {
                    label: this.state.activitie.name,
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 1,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 3,
                    data: values
                }
            ]
        };

        return(
            <div>
            <div>
                <h1>{this.state.activitie.name}</h1>
                <ul id={this.state.activitie._id}>
                    <FormGroup controlId="value" bsSize="large">
                        <ControlLabel>Ajouter une valeur</ControlLabel>
                        <FormControl autoFocus type="number" value={this.state.value} onChange={this.handleChange}/>
                    </FormGroup>
                    <FormGroup controlId="label" bsSize="large">
                        <ControlLabel>Ajouter un label</ControlLabel>
                        <FormControl type="datetime-local" required value={this.state.label} onChange={this.handleChange}/>
                    </FormGroup>
                    <FormGroup controlId="note" bsSize="large">
                        <ControlLabel>Ajouter une note (optionnel)</ControlLabel>
                        <FormControl componentClass="textarea"  value={this.state.note} onChange={this.handleChange}/>
                    </FormGroup>
                    <Button
                        onClick={this.send}
                        block
                        bsSize="large"
                        type="submit"
                    >
                        Ajouter
                    </Button>
               </ul>
            </div>
            <div>
                <div className="col-md-12">
                    <h2 className="col-12 text-center">Chart</h2>
                    <FormGroup>
                        <Radio onChange={this.handleChart} value="line" name="radioGroup" inline>
                            Line
                        </Radio>{' '}
                        <Radio onChange={this.handleChart} value="radar" name="radioGroup" inline>
                            Radar
                        </Radio>{' '}
                        <Radio onChange={this.handleChart} value="bar"  name="radioGroup" inline>
                            Bar
                        </Radio>{' '}
                    </FormGroup>
                    <TagName data={data}
                          options={{
                              scales: {
                              yAxes: [{
                              ticks: {
                              max: this.state.activitie.max,
                              min: this.state.activitie.min
                          }
                          }]
                          },}}
                          width={50}
                          height={25} />
                </div>
                <div className="col-md-12">
                    <h2>Historique</h2>
                <Table  striped bordered condensed hover>
                    <thead>
                    <tr>
                        <td>Ajouté le</td>
                        <td>Label</td>
                        <td>Value</td>
                        <td>note</td>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.history.map((item,i) =>
                        <tr key={i}>
                            <td>{new Date(item.created_at).toLocaleDateString()}</td>
                            <td>{currentComponnent.displayFormatDate(new Date(item.label))}</td>
                            <td>{item.value}</td>
                            <td>{item.note}</td>
                        </tr>
                    ).reverse()}
                    </tbody>
                </Table>
                </div>
            </div>
            </div>
    )
    }
}