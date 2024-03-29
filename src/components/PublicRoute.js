import React from 'react';
import API from '../utils/API.js';
import { Route, Redirect } from 'react-router-dom';

export const PublicRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => {
        var path = props.location.pathname;
        if(API.isAuth()===true){
            return( <Redirect to="/dashboard" /> )
        }
        else{
             return(<Component {...props} />)
        }
    }} />
)