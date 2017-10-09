import React, { Component } from 'react';

import { Redirect } from 'react-router-dom';

import FlashMsg from "./flash_msg.component.js"
import FormError from "./forms/form_error.component.js"
import FormButton from "./forms/form_button.component.js"

var GLOBAL = require("../globals.js")

class SignUp extends Component {

  constructor(){
   super();
   this.state={
    email: '', username: '', password: '', password2: '',
    email_error: false, username_error: false, password_error: false, password2_error: false,
    general_msg : false, loading : false,
    logged_in : false, flash: false, user_username: false, token: false
    }
    
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.pushNavigation = this.pushNavigation.bind(this);

}

componentWillMount(){
  
  //set global info and window refresh/ page change
  GLOBAL.setGlobals(this);
  
}

componentDidMount(){

  //show a flash message if it exists in the globals module
  if( this.state.flash ){

    this.setState({ general_msg: this.state.flash  });
    this.setState({ flash: false  });

  }
    
}

pushNavigation(event){
    this.props.history.push(event.target.getAttribute("href"))
}

handleSubmit(e) {

    //prevent browser refresh on submit
    e.preventDefault();

    var formData  = new FormData();
    var data = ["email", "username", "password", "password2"];
    var thiz = this;

    //reset error variables
    this.setState({ username_error: false  })
    this.setState({ email_error: false  })
    this.setState({ password_error: false  })
    this.setState({ password2_error: false  })
    this.setState({ general_msg: false  })
    this.setState({ loading: true  })


    for(var name in data) 
      formData.append(data[name], this.state[data[name]]);

  fetch('https://andela-flask-api.herokuapp.com/auth/register',{
      method: 'POST',
      body: formData
    })      // returns a promise object
  .then((resp) => resp.json())
  .then(function(data){

    thiz.setState({ loading: false  })

    if( data["success"] ){

        data = data["success"];
        thiz.setState({ general_msg: data })
        thiz.setState({ success: true })

        thiz.setState({ username: ""  })
        thiz.setState({ email: ""  })
        thiz.setState({ password: ""  })
        thiz.setState({ password2: ""  })

    }else if( data["error"] ){

        data = data["error"];

        //if the error is not a json object, create a general messge..otherwise, its a form error
        if( typeof data !== "object" ){
          thiz.setState({ general_msg: data })
          return true;
        }

        var fields = ["username", "email", "password", "password2"];
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

      //<link href="{{ url_for('static', filename='css/sign-up.css') }}" rel="stylesheet" />

      <div className="container col-xs-12">

      { this.state.general_msg ? <FlashMsg msg={ this.state.general_msg } /> : null }

      <center className={ this.state.success ? "" : "hidden-lg hidden-md hidden-sm hidden-xs"} style={{ clear: "left", "margin-bottom": "20px" }}><a href='/login' className='btn btn-success' role='button' onClick={ this.pushNavigation }>Login now</a></center>

      <img src='/static/images/shopping-list.jpg' alt="decorative shopping list" className="col-sm-6 hidden-xs" />

      <form onSubmit={this.handleSubmit} className="col-sm-6 col-xs-12 form-sign-up form" name="sign-up">

      <h2 className="form-heading">Andela Shopping List</h2>
      <p className="col-xs-12">Fill this in real quick and begin using our awesome features!</p>

      <div className="input-wrap">

      <div className="form-group">
      <label htmlFor="username">Username</label><br/>
      { this.state.username_error ? <FormError error={ this.state.username_error } /> : null }
      <input type="text" placeholder="Username" name="username" className="form-control" required="required" autoFocus id="username" onChange={this.handleChange} disabled={ this.state.loading ? "disabled" : false } value={ this.state.username } />
      </div>

      <div className="form-group">
      <label htmlFor="email">Email address</label><br/>
      { this.state.email_error ? <FormError error={ this.state.email_error } /> : null }
      <input type="email" placeholder="vince@hotmail.com" name="email" className="form-control" required="required" id="email" onChange={this.handleChange} disabled={ this.state.loading ? "disabled" : false } value={ this.state.email } />
      </div>

      <div className="form-group">
      <label htmlFor="password">Password</label><br/>
      { this.state.password_error ? <FormError error={ this.state.password_error } /> : null }
      <input type="password" placeholder="Enter Password" name="password" className="form-control" required="required" id="password" onChange={this.handleChange} disabled={ this.state.loading ? "disabled" : false } value={ this.state.password } />
      </div>

      <div className="form-group">
      <label htmlFor="password2">Re-Enter Password</label><br/>
      { this.state.password2_error ? <FormError error={ this.state.password2_error } /> : null }
      <input type="password" placeholder="Enter Password" name="password2" className="form-control" required="required" id="password2" onChange={this.handleChange} disabled={ this.state.loading ? "disabled" : false } value={ this.state.password2 } />
      </div>

      <div className="checkbox">
      <label>
      <input type="checkbox" required /> I have read and agreed to the Andela Shopping list terms and conditions
      </label>
      </div>

      <FormButton loading={ this.state.loading } title="Sign Up" />

      </div>

      </form>

      </div>



      );

}
}



export default SignUp