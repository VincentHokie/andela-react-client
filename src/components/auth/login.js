import React, { Component } from 'react';

import BaseComponent from "../base"
import FlashMsg from "../misc/flashMsg"
import FormError from "../forms/formError"
import FormButton from "../forms/formButton"

class Login extends BaseComponent {


  constructor() {
    super();
    this.state = {
      username: '', password: '',
      username_error: false, password_error: false,
      general_msg: false, loading: false,
      logged_in: false, flash: false, user_username: false, token: false
    }

  }

  handleSubmit = (e) => {

    //prevent browser refresh on submit
    e.preventDefault();

    //reset error variables
    this.setState({
      username_error: false,
      password_error: false,
      general_msg: false,
      loading: true
    })

    fetch(this.baseUrl + '/v1/auth/login', {
      method: 'POST',
      body: new FormData(e.target)
    })      // returns a promise object
      .then((resp) => {
        this.setState({ loading: false })
        return resp.json();
      })
      .then((data) => {

        if (data["success"])
          return data;

        throw data;

      })
      .then((data) => {

        this.setState({ general_msg: data["success"] })

        //if a token is sent back, the login was successful, so we set global variables to store these states
        if (data["token"]) {

          this.setState({
            token: data["token"],
            user_username: this.state.username
          })
          this.state.logged_in = true;

          setTimeout(() => {
            window.dispatchEvent(new Event('beforeunload'));
            this.props.history.push('/shopping-lists')
          }, 500);

        }

      }) // still returns a promise object, U need to chain it again
      .catch((data) => {

        if (data["error"]) {

          data = data["error"];

          //if the error is not a json object, create a general messge..otherwise, its a form error
          if (typeof data !== "object") {
            this.setState({ general_msg: data })
            return true;
          }

          // show form errors if their respective keys are returned by the API
          if (data["username"])
            this.setState({ ["username_error"]: data["username"][0] })

          if (data["password"])
            this.setState({ ["password_error"]: data["password"][0] })

          return ;
          
        }

        this.setState({ general_msg: "Check your internet connection and try again" })

      });

  }

  render() {

    return (

      <div className="container col-xs-12">

        {this.state.general_msg ? <FlashMsg msg={this.state.general_msg} /> : null}

        <form onSubmit={this.handleSubmit} className="col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-12 form-login form" style={{ marginTop: "40px" }}>

          <h2 className="form-heading">Andela Shopping List</h2>

          <div className="input-wrap">

            {this.state.username_error ? <FormError error={this.state.username_error} /> : null}
            <input type="text" placeholder="Username" name="username" className="form-control" required="required" autoFocus onChange={this.handleChange} disabled={this.state.loading ? "disabled" : false} />

            {this.state.password_error ? <FormError error={this.state.password_error} /> : null}
            <input type="password" placeholder="Enter Password" name="password" className="form-control" required="required" onChange={this.handleChange} disabled={this.state.loading ? "disabled" : false} />

            <FormButton loading={this.state.loading} title="Log In" />

          </div>

          <p className="col-xs-8 col-xs-offset-2">or <a href="/sign-up" onClick={this.pushNavigation}>Sign Up</a> if you dont have an account already</p>

          <p className="col-xs-8 col-xs-offset-2"><a href="/email-confirmation" onClick={this.pushNavigation}>Forgot your password?</a></p>

        </form>

      </div>

    );

  }
}

export default Login