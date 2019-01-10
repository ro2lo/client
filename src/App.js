import React, { Component } from 'react';
// import logo from './logo.svg';
import { Route, Switch } from 'react-router-dom';
import { Dashboard } from './components/Dashboard/Dashboard.js';
import { Login } from './components/Login/Login.js';
import { Signup } from './components/Signup/Signup.js';
import { CreateActivity } from './components/Activity/CreateActivity.js';
import { ShowActivity } from './components/Activity/ShowActivity.js';
import { CreateGroup } from './components/Group/CreateGroup.js';
import { ShowGroup } from './components/Group/ShowGroup.js';
import { PrivateRoute } from './components/PrivateRoute.js';
import { PublicRoute } from './components/PublicRoute.js';


import './App.css';



class App extends Component {
  render() {
    return (
        <div className="App">
          <div className="App-content">
            <Switch>
              <PublicRoute exact path="/" component={Login}/>
              <PublicRoute exact path ="/signup" component={Signup}/>
              <PrivateRoute exact path ="/group/create" component={CreateGroup}/>
              <PrivateRoute exact path ="/group/show/:id" component={ShowGroup}/>
              <PrivateRoute exact path ="/activity/create/:id" component={CreateActivity}/>
              <PrivateRoute exact path ="/activity/show/:id" component={ShowActivity}/>
              <PrivateRoute exact path ="/activity/create" component={CreateActivity}/>
              <PrivateRoute path='/dashboard' component={Dashboard} />
            </Switch>
          </div>
        </div>
    );
  }
}

export default App;
