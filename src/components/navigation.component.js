import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import './css/template_logged_in.css';

var vex = require('vex-js')
vex.defaultOptions.className = 'vex-theme-os'

var GLOBAL = require("../globals.js")
var btoa = require('btoa')

class Navigation extends Component {

constructor(){
   super();
   this.state={ username: '' }
    this.handleLogout = this.handleLogout.bind(this);
    this.logout = this.logout.bind(this);
}

componentWillMount(){

  //set global info and window refresh/ page change
  GLOBAL.setGlobals(this);

}

logout(component){

  component.setState({ loading: true  })

  fetch('https://andela-flask-api.herokuapp.com/auth/logout',{
        method: 'POST',
        headers: {
         'Authorization': 'Basic '+btoa(this.state.token+':x')
       },
      })      // returns a promise object
      .then((resp) => resp.json())
      .then(function(data){

        component.setState({ loading: false  })

        if( data["success"] ){

          component.setState({ flash: data["success"]  })
          component.setState({ user_username: false  })
          component.setState({ logged_in: false  })
          component.setState({ token: false  })

          window.location = "/login";

        }
        else
          component.setState({ flash: data["error"]  })

    }) // still returns a promise object, U need to chain it again
  .catch(function(error){

    component.setState({ loading: false  })
    component.setState({ general_msg: "Check your internet connection and try again" })
  });

}


handleLogout(event) {
    
    var component = this;

    vex.dialog.defaultOptions.showCloseButton = true;
    vex.dialog.defaultOptions.escapeButtonCloses = true;
    vex.dialog.defaultOptions.overlayClosesOnClick = true;

    vex.dialog.buttons.YES.text = 'Yes'
    vex.dialog.buttons.NO.text = 'No, thank you!'

    vex.dialog.confirm({
        message: 'Are you sure you want to log out?',
        callback: function (value) {
          if(value === true){ component.logout(component.props.parent); }
        }
    });

}

  render() {

    return (

      <nav className="navbar navbar-default">
        <div className="container-fluid">
            <div className="navbar-header">
                <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                </button>
                <a href="/login" className="navbar-brand" onClick={ this.props.pushNavigation }>
                  Andela Shopping List
                </a>
            </div>
            <div className="collapse navbar-collapse" id="myNavbar">
                <ul className="nav navbar-nav navbar-right">
                    <li><a><i className="fa fa-user"></i> Welcome  { this.props.username } </a></li>
                    <li id="logoutButton" onClick={ this.handleLogout }><a><i className="fa fa-power-off"></i> Logout</a></li>
                </ul>
            </div>
        </div>
    </nav>

      );
}
}

export default Navigation
