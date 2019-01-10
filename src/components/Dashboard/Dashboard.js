import React from 'react';
import { Button } from "react-bootstrap";

import API from '../../utils/API';

export class Dashboard extends React.Component {
    constructor(props){
        super(props);
        this.disconnect.bind(this);
        this.state = {
            'groups' : [],
            'username' : localStorage.getItem('username')
        };

        this.componentDidMount.bind(this);
        this.setMood.bind(this);
    }

    componentDidMount(){
        let currentComponent = this;
        API.checkToken(localStorage.getItem('token')).then(function(data){
            console.log(data.data.user._id);
            if(data.request.status === 200){
                API.indexGroup(data.data.user._id).then(function(data){
                    console.log(data.data);
                    currentComponent.setState({ groups : data.data.query })
                },function(error){
                    console.log(error);
                    return;
                })
            }else{
                console.log(data.request.status)
            }
        },function (error) {
            console.log(error);
            return;
        })
    }

    setMood = event => {


    }

    disconnect = event => {
        API.logout();
        window.location = "/";
    }

    render() {
        const groups = this.state.groups;
        return(
            <div className="Dashboard col-md-8 justify-content-center">
                <h1>Hello {this.state.username}!</h1>
                <div className="col-md-8 text-left">

                    <ul>
                        {groups.map(activitie =>
                                <a href={'group/show/'+activitie._id}>{activitie.name}</a>
                        )}
                    </ul>
                </div>
                <Button
                    onClick={this.disconnect}
                    block
                    bsSize="large"
                    type="submit"
                >
                    Se déconnecter
                </Button>
            </div>
        )
    }
}