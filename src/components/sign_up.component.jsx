import React, { Component } from 'react';

var GLOBAL = require("../globals.js")

class SignUp extends Component {

  constructor(){
   super();
   this.state={
    email: '', username: '', password: '', password2: '',
    email_error: false, username_error: false, password_error: false, password2_error: false,
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

      { 
        this.state.general_msg ? 
        <div className="alert alert-info message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1">
          <strong><i className="fa fa-info-circle"></i></strong> { this.state.general_msg }
        </div>
        : null 
      }

      


      <img src='/static/images/shopping-list.jpg' className="col-sm-6 hidden-xs" />

      <form onSubmit={this.handleSubmit} className="col-sm-6 col-xs-12 form-sign-up form" name="sign-up">

      <h2 className="form-heading">Andela Shopping List</h2>
      <p className="col-xs-12">Fill this in real quick and begin using our awesome features!</p>

      <div className="input-wrap">

      <div className="form-group">
      <label for="username">Username</label><br/>
      { this.state.username_error ? <span className="label label-danger">{ this.state.username_error }<br/></span> : null }
      <input type="text" placeholder="Username" name="username" className="form-control" required="required" autofocus id="username" onChange={this.handleChange} />
      </div>

      <div className="form-group">
      <label for="email">Email address</label><br/>
      { this.state.email_error ? <span className="label label-danger">{ this.state.email_error }<br/></span> : null }
      <input type="email" placeholder="vince@hotmail.com" name="email" className="form-control" required="required" autofocus id="email" onChange={this.handleChange} />
      </div>

      <div className="form-group">
      <label for="password">Password</label><br/>
      { this.state.password_error ? <span className="label label-danger">{ this.state.password_error }<br/></span> : null }
      <input type="password" placeholder="Enter Password" name="password" className="form-control" required="required" id="password" onChange={this.handleChange} />
      </div>

      <div className="form-group">
      <label for="password2">Re-Enter Password</label><br/>
      { this.state.password2_error ? <span className="label label-danger">{ this.state.password2_error }<br/></span> : null }
      <input type="password" placeholder="Enter Password" name="password2" className="form-control" required="required" id="password2" onChange={this.handleChange} />
      </div>

      <div className="checkbox">
      <label>
      <input type="checkbox" required /> I have read and agreed to the Andela Shopping list terms and conditions
      </label>
      </div>

      { 
        this.state.loading ? 
        <div className="col-xs-12">
        <button className="btn btn-md btn-sign-up col-xs-11" disabled type="submit">Sign Up</button>
        <img src='/static/images/loading.gif' className="col-xs-1" />
        </div>
        :
        <button className="btn btn-md btn-sign-up btn-block" type="submit">Sign Up</button>
      }

      </div>

      </form>

      </div>



      );
}
}



export default SignUp