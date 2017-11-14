import React, { Component } from 'react';

import { Redirect } from 'react-router-dom';

import BaseComponent from "./base"
import FlashMsg from "./flashMsg.js"
import FormError from "./forms/formError.js"
import FormButton from "./forms/formButton.js"

var GLOBAL = require("../globals.js")

class SignUp extends BaseComponent {

  constructor() {
    super();
    this.state = {
      email: '', username: '', password: '', password2: '',
      email_error: false, username_error: false, password_error: false, password2_error: false,
      general_msg: false, loading: false,
      logged_in: false, flash: false, user_username: false, token: false
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.pushNavigation = this.pushNavigation.bind(this);

  }
  }
  }

  handleSubmit(e) {

    //prevent browser refresh on submit
    e.preventDefault();

    var formData = new FormData();
    var data = ["email", "username", "password", "password2"];

    //reset error variables
    this.setState({ 
      username_error: false,
      email_error: false,
      password_error: false,
      password2_error: false,
      general_msg: false,
      loading: true
    })
    
    for (var name in data)
      formData.append(data[name], this.state[data[name]]);

    fetch(GLOBAL.baseUrl + '/v1/auth/register', {
      method: 'POST',
      body: formData
    })      // returns a promise object
      .then((resp) => {
        this.setState({ loading: false })
        return resp.json()
      })
      .then((data) => {

        if (data["success"]) {

          data = data["success"];
          this.setState({ 
            general_msg: data,
            success: true,
            username: "",
            email: "",
            password: "",
            password2: ""
          })

          setTimeout(() => {
            this.props.history.push('/login')
          }, 1000);

        } else if (data["error"]) {

          data = data["error"];

          //if the error is not a json object, create a general messge..otherwise, its a form error
          if (typeof data !== "object") {
            this.setState({ general_msg: data })
            return true;
          }

          var fields = ["username", "email", "password", "password2"];
          for (var field in fields) {
            field = fields[field];
            if (data[field])
              this.setState({ [field + "_error"]: data[field][0] })
          }

        }

      }) // still returns a promise object, U need to chain it again
      .catch((error) => {
        this.setState({ general_msg: "Check your internet connection and try again" })
      });

  }

  render() {

    return (

      //<link href="{{ url_for('static', filename='css/sign-up.css') }}" rel="stylesheet" />

      <div className="container col-xs-12">

        {this.state.general_msg ? <FlashMsg msg={this.state.general_msg} /> : null}

        <img src='/static/images/shopping-list.jpg' alt="decorative shopping list" className="col-sm-6 hidden-xs" />

        <form onSubmit={this.handleSubmit} className="col-sm-6 col-xs-12 form-sign-up form" name="sign-up">

          <h2 className="form-heading">Andela Shopping List</h2>
          <p className="col-xs-12">Fill this in real quick and begin using our awesome features!</p>

          <div className="input-wrap">

            <div className="form-group">
              <label htmlFor="username">Username</label><br />
              {this.state.username_error ? <FormError error={this.state.username_error} /> : null}
              <input type="text" placeholder="Username" name="username" className="form-control" required="required" autoFocus id="username" onChange={this.handleChange} disabled={this.state.loading ? "disabled" : false} value={this.state.username} />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email address</label><br />
              {this.state.email_error ? <FormError error={this.state.email_error} /> : null}
              <input type="email" placeholder="vince@hotmail.com" name="email" className="form-control" required="required" id="email" onChange={this.handleChange} disabled={this.state.loading ? "disabled" : false} value={this.state.email} />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label><br />
              {this.state.password_error ? <FormError error={this.state.password_error} /> : null}
              <input type="password" placeholder="Enter Password" name="password" className="form-control" required="required" id="password" onChange={this.handleChange} disabled={this.state.loading ? "disabled" : false} value={this.state.password} />
            </div>

            <div className="form-group">
              <label htmlFor="password2">Re-Enter Password</label><br />
              {this.state.password2_error ? <FormError error={this.state.password2_error} /> : null}
              <input type="password" placeholder="Enter Password" name="password2" className="form-control" required="required" id="password2" onChange={this.handleChange} disabled={this.state.loading ? "disabled" : false} value={this.state.password2} />
            </div>

            <div className="checkbox">
              <label>
                <input type="checkbox" required /> I have read and agreed to the Andela Shopping list terms and conditions
      </label>
            </div>

            <FormButton loading={this.state.loading} title="Sign Up" />

          </div>

        </form>

      </div>



    );

  }
}



export default SignUp