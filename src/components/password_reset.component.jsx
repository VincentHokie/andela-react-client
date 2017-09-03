import React, { Component } from 'react';

import { Link } from 'react-router-dom';

var GLOBAL = require("../globals.js")

class PasswordReset extends Component {

constructor(){
   super();
   this.state={
    password: '', password_confirm: '',
    password_error: false, password_confirm_error: false,
    general_msg : false, loading : false
    }

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
    return (
      
      <div className="container col-xs-12">

      { 
        this.state.general_msg ? 
        <div className="alert alert-info message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1">
          <strong><i className="fa fa-info-circle"></i></strong> { this.state.general_msg }
        </div>
        : null 
      }

      <form onSubmit={this.handleSubmit} className="col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-12 form-login form">

      <h2 className="form-heading">Andela Shopping List</h2>

      <div className="input-wrap">

      { this.state.password_error ? <span className="label label-danger">{ this.state.password_error }<br/></span> : null }
      <input type="password" placeholder="Enter New Password" name="password" className="form-control" required="required" onChange={this.handleChange} />

      { this.state.password_confirm_error ? <span className="label label-danger">{ this.state.password_confirm_error }<br/></span> : null }
      <input type="password" placeholder="Re-Enter New Password" name="password_confirm" className="form-control" required="required" onChange={this.handleChange} />

      { 
        this.state.loading ? 
        <div className="col-xs-12">
        <button className="btn btn-md btn-login col-xs-11" disabled type="submit">Reset Password</button>
        <img src='/static/images/loading.gif' className="col-xs-1" />
        </div>
        :
        <button className="btn btn-md btn-login btn-block" type="submit">Reset Password</button>
      }

      </div>

      <p className="col-xs-8 col-xs-offset-2"><Link to="/login">Try login again</Link> if youve had a thought or <Link to="/sign-up">Sign Up</Link> </p>

      </form>

      </div>

    );
  }
}

export default PasswordReset