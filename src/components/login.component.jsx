import React, { Component } from 'react';

import { Link, Redirect } from 'react-router-dom';

import FlashMsg from "./flash_msg.component.jsx"
import FormError from "./forms/form_error.component.jsx"
import FormButton from "./forms/form_button.component.jsx"

var GLOBAL = require("../globals.js")

class Login extends Component {


constructor(){
   super();
   this.state={
    username: '', password: '',
    username_error: false, password_error: false,
    general_msg : false, loading : false,
    logged_in : false
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

}

componentWillMount(){
  this.setState({ logged_in: GLOBAL.LOGGED_IN  });
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
    var data = ["username", "password"];
    var thiz = this;

    //reset error variables
    this.setState({ username_error: false  })
    this.setState({ password_error: false  })
    this.setState({ general_msg: false  })
    this.setState({ loading: true  })


    for(var name in data) 
      formData.append(data[name], this.state[data[name]]);

  fetch('https://andela-flask-api.herokuapp.com/auth/login',{
      method: 'POST',
      body: formData
    })      // returns a promise object
  .then((resp) => resp.json())
  .then(function(data){

    thiz.setState({ loading: false  })

    if( data["success"] ){

        //if a token is sent back, the login was successful, so we set global variables to store these states
        if( data["token"] ){
          GLOBAL.LOGGED_IN = true;
          GLOBAL.TOKEN = data["token"];

          setTimeout(function(){
            thiz.setState({ logged_in: GLOBAL.LOGGED_IN  })
          }, 2000);

        }

        data = data["success"];

        thiz.setState({ general_msg: data })

    }else if( data["error"] ){

        data = data["error"];

        //if the error is not a json object, create a general messge..otherwise, its a form error
        if( typeof data !== "object" ){
          thiz.setState({ general_msg: data })
          return true;
        }

        var fields = ["username", "password"];
        for( var field in fields ){
          field = fields[field];
            if( data[field] )
              thiz.setState({ [field+"_error"] : data[field][0] })
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

      GLOBAL.FLASH = "If you'd like to login again, you have to log out first.";
      return <Redirect push to="/shopping-lists" />;

    }else{

      return (

      <div className="container col-xs-12">

      { this.state.general_msg ? <FlashMsg msg={ this.state.general_msg } /> : null }

      <form onSubmit={this.handleSubmit} className="col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-12 form-login form">

      <h2 className="form-heading">Andela Shopping List</h2>

      <div className="input-wrap">

      { this.state.username_error ? <FormError error={ this.state.username_error } /> : null }
      <input type="text" placeholder="Username" name="username" className="form-control" required="required" autoFocus onChange={this.handleChange} disabled={ this.state.loading ? "disabled" : false } />

      { this.state.password_error ? <FormError error={ this.state.password_error } /> : null }
      <input type="password" placeholder="Enter Password" name="password" className="form-control" required="required" onChange={this.handleChange} disabled={ this.state.loading ? "disabled" : false } />

      <FormButton loading={ this.state.loading } title="Log In" />

      </div>

      <p className="col-xs-8 col-xs-offset-2">or <Link to="/sign-up">Sign Up</Link> if you dont have an account already</p>

      <p className="col-xs-8 col-xs-offset-2"><Link to="/email-confirmation">Forgot your password?</Link></p>

      </form>

      </div>

      );
        
    }
    
}
}

export default Login