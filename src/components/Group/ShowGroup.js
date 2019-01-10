import React, { Component } from 'react';// on importe createContext qui servira à la création d'un ou plusieurs contextes
import { Col,Radio,FormGroup } from "react-bootstrap";
import {Line,Radar,Bar} from 'react-chartjs-2';

import API from '../../utils/API';

export class ShowGroup extends React.Component {
    constructor(props) {
        super(props);
        const {id} = props.match.params;



        this.state = {
            group : "",
            components : {
            line: Line,
            radar: Radar,
            bar: Bar,
            },
            tag : 'line',
            activities : [],
            group_id : id,
        }
        this.handleChange.bind(this);
    }


    componentDidMount() {
        this.makeChart()
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

    makeChart = () => {
        let currentComponent = this;
        API.checkToken(localStorage.getItem('token')).then(function(data){
            if(data.request.status === 200){
                API.showGroup(currentComponent.state.group_id).then(function (data) {
                    currentComponent.setState({ group : data.data.group })
                    currentComponent.setState({ activities : data.data.group.activity })
                },function (error) {
                    return;
                })
            }
        },function (error) {
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
    compare = (a,b) => {
        return new Date(b) - new Date(a);
    }
    compare2 = (a,b) => {
        var date_1 = a.split('/')
        var date_2 = b.split('/')

        return new Date([date_1[2],date_1[1],date_1[0]].join('/')) - new Date([date_2[2],date_2[1],date_2[0]].join('/'));
    }
    compare3 = (a,b) => {
        var date_1 = a.split('/')
        var date_2 = b.split('/')

        return new Date([date_1[2],date_1[1],date_1[0]].join('/')) - new Date([date_2[2],date_2[1],date_2[0]].join('/'));
    }
    render() {
        var currentComponnent = this;
        var min = "";
        var max = "";
        var datasets = [];
        var labels = [];
        var allLabels = [];
        var colors = [
            'rgba(255, 0, 0, 0.5)',
            'rgba(255, 255, 0, 0.5)',
            'rgba(128, 128, 128, 0.5)',
            'rgba(255, 165, 0, 0.5)',
            'rgba(0, 0, 255, 0.5)',
        ]
        var background = [
            'rgba(255, 0, 0, 0.1)',
            'rgba(255, 255, 0, 0.1)',
            'rgba(128, 128, 128, 0.1)',
            'rgba(255, 165, 0, 0.1)',
            'rgba(0, 0, 255, 0.1)',
        ]



        Object.keys(this.state.activities).map(function(objectKey, index) {
            var value = currentComponnent.state.activities[objectKey];
            Object.keys(value.moods).map(function(objectKey, index) {
                    allLabels.push(value.moods[objectKey]['label'])
            })
        })

        if (Object.keys(allLabels).length > 1){
            var tab = allLabels.sort(this.compare).reverse();
            var first = tab[0];
            var last = tab[Object.keys(allLabels).length-1];
            var diffDays = currentComponnent.daysBetween(first,last);
        }

        Object.keys(this.state.activities).map(function(objectKey, index) {
            var value = currentComponnent.state.activities[objectKey];
            Object.keys(value.moods).map(function(objectKey, index) {
                if(diffDays < 1){
                    if (labels.includes(currentComponnent.displayFormatDate(new Date(value.moods[objectKey]['label']))) == false){
                        labels.push(currentComponnent.displayFormatDate(new Date(value.moods[objectKey]['label'])))
                    }
                }else{
                    if (labels.includes(new Date(value.moods[objectKey]['label']).toLocaleDateString()) == false){
                        labels.push(new Date(value.moods[objectKey]['label']).toLocaleDateString())
                    }
                }
            })
        })


        Object.keys(this.state.activities).map(function(objectKey, index) {
            var value = currentComponnent.state.activities[objectKey];
            if(min > value.min || min == ""){
                min = value.min;
            }
            if(max < value.max || max == ""){
                max = value.max;
            }

            var dataCheck = [];
            var data = [];

            if(diffDays < 1){

            }else{

            }

            Object.keys(labels).map(function(objectKey, index) {
                var label = labels[objectKey];
                if(!(label in dataCheck)){
                    dataCheck[label] = 0;
                }
            });

            value.moods.map((item,i) => {
                if(diffDays < 1){
                    dataCheck[currentComponnent.displayFormatDate(new Date(item.label))] += item.value;
                }else{
                    dataCheck[new Date(item.label).toLocaleDateString()] += item.value;
                }
            });

            Object.keys(dataCheck).map(function(objectKey, index) {
                data.push(dataCheck[objectKey]);
            })



            datasets.push({
                label: value.name,
                backgroundColor: background[objectKey],
                borderColor: colors[objectKey],
                pointBackgroundColor: colors[objectKey],
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: colors[objectKey],
                pointHoverBorderColor: '#fff',
                data: data
            })

        });
        if (diffDays < 1){
            labels = labels.sort(this.compare3);
        }else{
            labels = labels.sort(this.compare2);
        }
        console.log(labels)
        const data = {
            labels: labels,
            datasets: datasets
        };
        const TagName = this.state.components[this.state.tag || 'line'];

        return(
            <div>
            <div>
                <h1>{this.state.group.name}</h1>
                <a className="btn btn-primary" href={"/activity/create/"+this.state.group._id}>Ajouter</a>
                <ul id={this.state.group._id}>
                    <ul>
                        {this.state.activities.map((item,i) =>
                            <div className="col-12 text-left" key={i}>
                                <p><a href={"/activity/show/"+item._id}>{item.name}</a> - {new Date(item.created_at).toLocaleDateString()} </p>
                            </div>
                        ).reverse()}
                    </ul>
               </ul>
            </div>
            <div>
                <h2 className="col-12 text-center">Chart</h2>

                <Col mdOffset={3} md={6}>
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
                </Col>
                <Col mdOffset={1} md={10}>
                    <TagName data={data}  />
                </Col>
            </div>
            </div>
    )
    }
}