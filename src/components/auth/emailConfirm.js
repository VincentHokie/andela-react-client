import React, { Component } from 'react';

import FlashMsg from "../misc/flashMsg"
import FormError from "../forms/formError"
import FormButton from "../forms/formButton"
import BaseComponent from "../base"

class EmailConfirm extends BaseComponent {

  constructor() {
    super();
    this.state = {
      email: '',
      email_error: false,
      general_msg: false, loading: false,
      logged_in: false, flash: false, username: false, token: false
    }

  }

  handleSubmit = (e) => {

    //prevent browser refresh on submit
    e.preventDefault();

    //reset error variables
    this.setState({
      email_error: false,
      general_msg: false,
      loading: true
    })

    fetch(this.baseUrl + '/v1/auth/reset-password', {
      method: 'POST',
      body: new FormData(e.target)
    })      // returns a promise object
      .then((resp) => {
        this.setState({ loading: false })
        return resp.json()
      })
      .then((data) => {

        if (data["success"])
          return data;

        throw data;

      })
      .then((data) => {

        data = data["success"];
        this.setState({ general_msg: data })

      }) // still returns a promise object, U need to chain it again
      .catch((data) => {

        if (data["error"]) {

          data = data["error"];

          //if the error is not a json object, create a general message..otherwise, its a form error
          if (typeof data !== "object") {
            this.setState({ general_msg: data })
            return true;
          }

          //if theres a form validation error(s) show it/them
          if (data["email"])
            this.setState({ email_error: data["email"][0] })

          return;

        }

        this.setState({ general_msg: "Check your internet connection and try again" })
      });

  }

  render() {

    return (

      <div className="container col-xs-12">

        {this.state.general_msg ? <FlashMsg msg={this.state.general_msg} /> : null}

        <form onSubmit={this.handleSubmit} className="col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-12 form-login form">

          <h2 className="form-heading">Andela Shopping List</h2>

          <div className="input-wrap">

            {this.state.email_error ? <FormError error={this.state.email_error} /> : null}
            <input type="email" placeholder="Your email address" name="email" className="form-control" required="required" autoFocus onChange={this.handleChange} disabled={this.state.loading ? "disabled" : false} />

            <FormButton loading={this.state.loading} title="Verify Email" />

          </div>

          <p className="col-xs-8 col-xs-offset-2">We will send an email to the email address you enter above, ensure you use the link within 10 minutes or it will expire.</p>

          <p className="col-xs-8 col-xs-offset-2">or try and <a href="/login" onClick={this.pushNavigation}>login</a> again</p>

        </form>

      </div>

    );

  }
}

export default EmailConfirm