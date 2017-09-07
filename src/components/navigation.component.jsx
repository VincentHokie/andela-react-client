import React, { Component } from 'react';

import { Redirect } from 'react-router-dom';

import './css/template_logged_in.css';

var vex = require('vex-js')
vex.defaultOptions.className = 'vex-theme-os'

class Navigation extends Component {

constructor(){
   super();
   this.state={ username: '' }
    this.handleLogout = this.handleLogout.bind(this);
}

handleLogout(event) {
    
    var thiz = this;

    vex.dialog.defaultOptions.showCloseButton = true;
      vex.dialog.defaultOptions.escapeButtonCloses = true;
      vex.dialog.defaultOptions.overlayClosesOnClick = true;

      vex.dialog.buttons.YES.text = 'Yes'
      vex.dialog.buttons.NO.text = 'No, thank you!'

      vex.dialog.confirm({
          message: 'Are you sure you want to log out?',
          callback: function (value) {

            if(value == true){

                fetch('https://andela-flask-api.herokuapp.com/auth/logout',{
                  method: 'POST'
                })      // returns a promise object
                .then((resp) => resp.json())
                .then(function(data){

                  thiz.setState({ loading: false  })

              }) // still returns a promise object, U need to chain it again
            .catch(function(error){
              thiz.setState({ loading: false  })
              thiz.setState({ general_msg: "Check your internet connection and try again" })
            });

            }

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
                <a className="navbar-brand" href="#">Andela Shopping List</a>
            </div>
            <div className="collapse navbar-collapse" id="myNavbar">
                <ul className="nav navbar-nav navbar-right">
                    <li><a href="#"><i className="fa fa-user"></i> Welcome  { this.props.username } </a></li>
                    <li id="logoutButton" onClick={ this.handleLogout }><a><i className="fa fa-power-off"></i> Logout</a></li>
                </ul>
            </div>
        </div>
    </nav>

      );
}
}

export default Navigation
