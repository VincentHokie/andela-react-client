import React, { Component } from 'react';

import FlashMsg from "./flash_msg.component.js"
import FormError from "./forms/form_error.component.js"
import FormButton from "./forms/form_button.component.js"

var GLOBAL = require("../globals.js")

class PasswordReset extends Component {

  constructor() {
    super();
    this.state = {
      password: '', password_confirm: '',
      password_error: false, password_confirm_error: false,
      general_msg: false, loading: false,
      logged_in: false, flash: false, username: false, token: false
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.pushNavigation = this.pushNavigation.bind(this);

  }

  componentWillMount() {

    //set global info and window refresh/ page change
    GLOBAL.setGlobals(this);

  }

  componentDidMount() {

    //show a flash message if it exists in the globals module
    if (this.state.flash) {

      this.setState({ 
        general_msg: this.state.flash,
        flash: false
      });

    }

  }

  pushNavigation(event) {
    this.props.history.push(event.target.getAttribute("href"))
  }

  handleSubmit(e) {

    //prevent browser refresh on submit
    e.preventDefault();

    var formData = new FormData();
    var data = ["password", "password_confirm"];
    var token = this.props.match.params.token;

    //reset error variables
    this.setState({ 
      password_error: false,
      password_confirm_error: false,
      general_msg: false,
      loading: true
    })
    
    for (var name in data)
      formData.append(data[name], this.state[data[name]]);

    fetch(GLOBAL.baseUrl + '/v1/auth/reset-password/' + token, {
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
          this.setState({ general_msg: data })

        } else if (data["error"]) {

          data = data["error"];

          //if the error is not a json object, create a general message..otherwise, its a form error
          if (typeof data !== "object") {
            this.setState({ general_msg: data })
            return true;
          }

          //theres a form validation error(s), show it/them
          if (data["password"])
            this.setState({ ["password_error"]: data["password"][0] })

          if (data["password_confirm"])
            this.setState({ ["password_confirm_error"]: data["password_confirm"][0] })

        }

      }) // still returns a promise object, U need to chain it again
      .catch((error) => {
        this.setState({ general_msg: "Check your internet connection and try again" })
      });

  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {

    return (

      <div className="container col-xs-12">

        {this.state.general_msg ? <FlashMsg msg={this.state.general_msg} /> : null}

        <form onSubmit={this.handleSubmit} className="col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-12 form-login form">

          <h2 className="form-heading">Andela Shopping List</h2>

          <div className="input-wrap">

            {this.state.password_error ? <FormError error={this.state.password_error} /> : null}
            <input type="password" placeholder="Enter New Password" name="password" className="form-control" required="required" onChange={this.handleChange} disabled={this.state.loading ? "disabled" : false} />

            {this.state.password_confirm_error ? <FormError error={this.state.password_confirm_error} /> : null}
            <input type="password" placeholder="Re-Enter New Password" name="password_confirm" className="form-control" required="required" onChange={this.handleChange} disabled={this.state.loading ? "disabled" : false} />

            <FormButton loading={this.state.loading} title="Reset Password" />

          </div>

          <p className="col-xs-8 col-xs-offset-2"><a href="/login" onClick={this.pushNavigation}>Try login again</a> if youve had a thought or <a href="/sign-up">Sign Up</a> </p>

        </form>

      </div>

    );

  }
}

export default PasswordReset