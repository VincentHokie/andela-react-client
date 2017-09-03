import React, { Component } from 'react';

import { Link } from 'react-router-dom';

class Login extends Component {


constructor(){
   super();
   this.state={
    username: '', password: ''
    username_error: false, password_error: false,
    general_msg : false, loading : false
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

}
  render() {
    return (

      <div className="container col-xs-12">

      <div className="alert alert-info message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1">
      <strong><i className="fa fa-info-circle"></i></strong> message.message
      </div>

      <form className="col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-12 form-login form" action="/login" method="post">

      <h2 className="form-heading">Andela Shopping List</h2>

      <div className="input-wrap">

      <span className="label label-danger">username error</span>
      <input type="text" placeholder="Username" name="username" className="form-control" required="required" autofocus />

      <span className="label label-danger">password error</span>
      <input type="password" placeholder="Enter Password" name="password" className="form-control" required="required" />

      <button className="btn btn-md btn-login btn-block" type="submit">Sign in</button>

      </div>

      <p className="col-xs-8 col-xs-offset-2">or <Link to="/sign-up">Sign Up</Link> if you dont have an account already</p>

      <p className="col-xs-8 col-xs-offset-2"><Link to="/email-confirmation">Forgot your password?</Link></p>

      </form>

      </div>

      );
}
}

export default Login