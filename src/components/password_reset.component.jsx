import React, { Component } from 'react';

import { Link, Redirect } from 'react-router-dom';

import FlashMsg from "./flash_msg.component.jsx"
import FormError from "./forms/form_error.component.jsx"
import FormButton from "./forms/form_button.component.jsx"

var GLOBAL = require("../globals.js")

class PasswordReset extends Component {

constructor(){
   super();
   this.state={
    password: '', password_confirm: '',
    password_error: false, password_confirm_error: false,
    general_msg : false, loading : false,
    logged_in : false
    }

    this.state.logged_in = GLOBAL.LOGGED_IN;
    
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

}

componentDidMount(){

  //show a flash message if it exists in the globals module
    if( GLOBAL.FLASH ){
      
      this.setState({ general_msg: GLOBAL.FLASH  });
      GLOBAL.FLASH = false;

    }
    
}

handleSubmit(e) {

    //prevent browser refresh on submit
    e.preventDefault();

    var formData  = new FormData();
    var data = ["password", "password_confirm"];
    var thiz = this;
    var token = this.props.match.params.token;
    
    //reset error variables
    this.setState({ password_error: false  })
    this.setState({ password_confirm_error: false  })
    this.setState({ general_msg: false  })
    this.setState({ loading: true  })


    for(var name in data) 
      formData.append(data[name], this.state[data[name]]);

  fetch('https://andela-flask-api.herokuapp.com/auth/reset-password/'+token,{
      method: 'POST',
      body: formData,
      headers: {
        "Access-Control-Allow-Origin": "*"
    }
    })      // returns a promise object
  .then((resp) => resp.json())
  .then(function(data){

    thiz.setState({ loading: false  })

    if( data["success"] ){

        data = data["success"];
        thiz.setState({ general_msg: data })

    }else if( data["error"] ){

        data = data["error"];

        //if the error is not a json object, create a general message..otherwise, its a form error
        if( typeof data !== "object" ){
          thiz.setState({ general_msg: data })
          return true;
        }

        //theres a form validation error(s), show it/them
        var fields = ["password", "password_confirm"];
        for( var field in fields ){
          field = fields[field];
          if( data[field] )
            thiz.setState({ [field+"_error"]: data[field][0] })
        }

    }
  
  }) // still returns a promise object, U need to chain it again
  .catch(function(error){
    thiz.setState({ loading: false  })
    thiz.setState({ general_msg: "Check your internet connection and try again" })
  });

}

handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
}

  render() {

    if( this.state.logged_in ){

      GLOBAL.FLASH = "You need to be logged out to reset your password!";
      return <Redirect push to="/shopping-lists" />;

    }else{

    return (
      
      <div className="container col-xs-12">

      { this.state.general_msg ? <FlashMsg msg={ this.state.general_msg } /> : null }

      <form onSubmit={this.handleSubmit} className="col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-12 form-login form">

      <h2 className="form-heading">Andela Shopping List</h2>

      <div className="input-wrap">

      { this.state.password_error ? <FormError error={ this.state.password_error } /> : null }
      <input type="password" placeholder="Enter New Password" name="password" className="form-control" required="required" onChange={this.handleChange} />

      { this.state.password_confirm_error ? <FormError error={ this.state.password_confirm_error } /> : null }
      <input type="password" placeholder="Re-Enter New Password" name="password_confirm" className="form-control" required="required" onChange={this.handleChange} />

      <FormButton loading={ this.state.loading } />

      </div>

      <p className="col-xs-8 col-xs-offset-2"><Link to="/login">Try login again</Link> if youve had a thought or <Link to="/sign-up">Sign Up</Link> </p>

      </form>

      </div>

    );
}
  }
}

export default PasswordReset