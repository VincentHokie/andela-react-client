import React, { Component } from 'react';

import { Link } from 'react-router-dom';

class PasswordReset extends Component {
  render() {
    return (
      
      <div className="container col-xs-12">

      <div className="alert alert-info message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1">
      <strong><i className="fa fa-info-circle"></i></strong> message.message
      </div>

      <form className="col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-12 form-login form" action="/login" method="post">

      <h2 className="form-heading">Andela Shopping List</h2>

      <div className="input-wrap">

      <span className="label label-danger">password error</span>
      <input type="password" placeholder="Enter New Password" name="password" className="form-control" required="required" />

      <span className="label label-danger">password confirm error</span>
      <input type="password" placeholder="Re-Enter New Password" name="password_confirm" className="form-control" required="required" />

      <button className="btn btn-md btn-login btn-block" type="submit">Reset Password</button>

      </div>

      <p className="col-xs-8 col-xs-offset-2"><Link to="/login">Try login again</Link> if youve had a thought or <Link to="/sign-up">Sign Up</Link> </p>

      </form>

      </div>

    );
  }
}

export default PasswordReset