import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class EmailConfirm extends Component {

constructor(){
   super();
   this.state={
    email: '',
    email_error: false,
    general_msg : false, loading : false
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

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
      formData.append(name, this.state[name]);

  fetch('https://andela-flask-api.herokuapp.com/auth/reset-password',{
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

        //if theres a form validation error(s) show it/them
        if( data["email"] )
          thiz.setState({ email_error : data["email"][0] })

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

      { this.state.email_error ? <span className="label label-danger">{ this.state.email_error }<br/></span> : null }
      <input type="text" placeholder="Your email address" name="email" className="form-control" required="required" autofocus />

      <div className="col-xs-12">
      { 
        this.state.loading ? 
        <button className="btn btn-md btn-login col-xs-11" disabled type="submit">Send E-Mail</button>
        :
        <button className="btn btn-md btn-login col-xs-11" type="submit">Send E-Mail</button>
      }
      { 
        this.state.loading ? 
        <img src='/static/images/loading.gif' className="col-xs-1" />
        : null 
      }
      
      </div>

      </div>

      <p className="col-xs-8 col-xs-offset-2">We will send an email to the email address you enter above, ensure you use the link within 10 minutes or it will expire.</p>

      <p className="col-xs-8 col-xs-offset-2">or try and <Link to="/login">login</Link> again</p>

      </form>

      </div>

    );
  }
}

export default EmailConfirm