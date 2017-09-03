import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class EmailConfirm extends Component {
  render() {
    return (
      
      <div className="container col-xs-12">

      { 
        this.state.general_msg ? 
        <div className="alert alert-info message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1">
          <strong><i className="fa fa-info-circle"></i></strong> { this.state.general_msg }
        </div>
        : null 
      }

      <form className="col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-12 form-login form" action="/login" method="post">

      <h2 className="form-heading">Andela Shopping List</h2>

      <div className="input-wrap">

      <span className="label label-danger">email error</span>
      <input type="text" placeholder="Your email address" name="email" className="form-control" required="required" autofocus />

      <div className="col-xs-12">
      { 
        this.state.loading ? 
        <button className="btn btn-md btn-login col-xs-11" disabled type="submit">Send E-Mail</button>
        :
        <button className="btn btn-md btn-login col-xs-11" type="submit">Send E-Mail</button>
      }
      { 
        this.state.loading ? 
        <img src='/static/images/loading.gif' className="col-xs-1" />
        : null 
      }
      
      </div>

      </div>

      <p className="col-xs-8 col-xs-offset-2">We will send an email to the email address you enter above, ensure you use the link within 10 minutes or it will expire.</p>

      <p className="col-xs-8 col-xs-offset-2">or try and <Link to="/login">login</Link> again</p>

      </form>

      </div>

    );
  }
}

export default EmailConfirm