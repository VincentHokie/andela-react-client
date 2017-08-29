import React, { Component } from 'react';

class SignUp extends Component {
  render() {
    return (

      //<link href="{{ url_for('static', filename='css/sign-up.css') }}" rel="stylesheet" />

      <div className="container col-xs-12">

      <div className="alert alert-info message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1">
      <strong><i className="fa fa-info-circle"></i></strong> message.message
      </div>


      <img src='/static/images/shopping-list.jpg' className="col-sm-6 hidden-xs" />

      <form className="col-sm-6 col-xs-12 form-sign-up form" action="/sign-up" name="sign-up" method="post">

      <h2 className="form-heading">Andela Shopping List</h2>
      <p className="col-xs-12">Fill this in real quick and begin using our awesome features!</p>

      <div className="input-wrap">

      <div className="form-group">
        <label for="username">Username</label><br/>
        <span className="label label-danger">username error</span><br/>
        <input type="text" placeholder="Username" name="username" className="form-control" required="required" autofocus id="username" />
      </div>

      <div className="form-group">
        <label for="email">Email address</label><br/>
        <span className="label label-danger">username error</span><br/>
        <input type="email" placeholder="vince@hotmail.com" name="email" className="form-control" required="required" autofocus id="email" />
      </div>

      <div className="form-group">
        <label for="password">Password</label><br/>
        <span className="label label-danger">password error</span><br/>
        <input type="password" placeholder="Enter Password" name="password" className="form-control" required="required" id="password" />
      </div>

      <div className="form-group">
        <label for="password2">Re-Enter Password</label><br/>
        <span className="label label-danger">password2 error</span><br/>
        <input type="password" placeholder="Enter Password" name="password2" className="form-control" required="required" id="password2" />
      </div>

      <div className="checkbox">
        <label>
          <input type="checkbox" required /> I have read and agreed to the Andela Shopping list terms and conditions
        </label>
      </div>

      <button className="btn btn-md btn-sign-up btn-block" type="submit">Sign Up</button>

      </div>

      </form>

      </div>



      );
}
}

export default SignUp