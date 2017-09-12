import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import FlashMsg from "./flash_msg.component.jsx"
import FormError from "./forms/form_error.component.jsx"
import FormButton from "./forms/form_button.component.jsx"

var GLOBAL = require("../globals.js")

class EmailConfirm extends Component {

constructor(){
   super();
   this.state={
    email: '',
    email_error: false,
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
    var data = ["email"];
    var thiz = this;

    //reset error variables
    this.setState({ email_error: false  })
    this.setState({ general_msg: false  })
    this.setState({ loading: true  })


    for(var name in data) 
      formData.append(data[name], this.state[data[name]]);

  fetch('https://andela-flask-api.herokuapp.com/auth/reset-password',{
      method: 'POST',
      body: formData
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

        //if theres a form validation error(s) show it/them
        if( data["email"] )
          thiz.setState({ email_error : data["email"][0] })

    
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

      { this.state.email_error ? <FormError error={ this.state.email_error } /> : null }
      <input type="text" placeholder="Your email address" name="email" className="form-control" required="required" autoFocus onChange={this.handleChange} disabled={ this.state.loading ? "disabled" : false } />

      <FormButton loading={ this.state.loading } title="Verify Email" />

      </div>

      <p className="col-xs-8 col-xs-offset-2">We will send an email to the email address you enter above, ensure you use the link within 10 minutes or it will expire.</p>

      <p className="col-xs-8 col-xs-offset-2">or try and <Link to="/login">login</Link> again</p>

      </form>

      </div>

    );
}
  }
}

export default EmailConfirm