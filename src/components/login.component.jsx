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

handleSubmit(e) {

    //prevent browser refresh on submit
    e.preventDefault();

    var formData  = new FormData();
    var data = this.state;
    var thiz = this;

    //reset error variables
    this.setState({ username_error: false  })
    this.setState({ password_error: false  })
    this.setState({ general_msg: false  })
    this.setState({ loading: true  })


    for(var name in data) 
      formData.append(name, data[name]);

  fetch('https://andela-flask-api.herokuapp.com/auth/login',{
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

        //if the error is not a json object, create a general messge..otherwise, its a form error
        if( typeof data !== "object" ){
          thiz.setState({ general_msg: data })
          return true;
        }

        var fields = ["username", "password"];
        for( var i = 0; i < fields.length; i++ ){

            if( data[fields[i]] ){

                switch (i){
                    case 0:
                        thiz.setState({ username_error: data[fields[i]][0] })
                        break;
                    case 1:
                        thiz.setState({ password_error: data[fields[i]][0] })
                        break;
                        
                }
            
            }

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

      <form onSubmit={this.handleSubmit} className="col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-12 form-login form" action="/login" method="post">

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