import React, { Component } from 'react';

var GLOBAL = require("../globals.js")

class CreateShoppingList extends Component {


constructor(){
   super();
   this.state={
    username: '', password: '',
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
      body: formData,
      headers: {
        "Access-Control-Allow-Origin": "*"
    }
    })      // returns a promise object
  .then((resp) => resp.json())
  .then(function(data){

    thiz.setState({ loading: false  })

    if( data["success"] ){

        //if a token is sent back, the login was successful, so we set global variables to store these states
        if( data["token"] ){
          GLOBAL.LOGGED_ID = true;
          GLOBAL.TOKEN = data["token"];
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
    return (

      /* 
      --  page container      -- 
      */
    <div className="container col-xs-12">

    /* 
    --    flash message logic    -- 
    */
    { 
        this.state.general_msg ? 
        <div className="alert alert-info message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1">
          <strong><i className="fa fa-info-circle"></i></strong> { this.state.general_msg }
        </div>
        : null 
    }
    /* 
    --    flash message logic end   -- 
    */

    /* 
    --   shopping list form     -- 
    */
    <form onSubmit={this.handleSubmit} className="col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-12 form" name="create-shoppinglist">

        /* 
        --    form heading    -- 
        */
        <h2 className="form-heading">New Andela Shopping list form</h2>

        /* 
        --    input element wrapper    -- 
        */
        <div className="input-wrap">

            /* 
            --  shopping list name input logic    -- 
            */
            <div className="col-xs-12">
                <div className="form-group">

                    { this.state.username_error ? <span className="label label-danger">{ this.state.name_error }<br/></span> : null }
                    <input type="text" placeholder="Shopping List Name" name="name" className="form-control" required="required" autofocus onChange={this.handleChange} />

                </div>
            </div>
            /* 
            --  shopping list name input logic end   -- 
            */

            /* 
            --  create shopping list button    -- 
            */
            <div className="col-xs-12">
                    { 
                      this.state.loading ? 
                      <div className="col-xs-12">
                      <button type="submit" name="Submit" className="btn btn-md btn-login col-xs-1" disabled>Create Shopping List</button>
                      <img src='/static/images/loading.gif' className="col-xs-1" />
                      </div>
                      :
                      <button type="submit" name="Submit" className="btn btn-md btn-login btn-block">Create Shopping List</button>
                    }
            </div>
            /* 
            --  create shopping list button end    -- 
            */

        </div>
        /* 
        --    input element wrapper end   -- 
        */


    </form>
    /* 
    --   shopping list form end     -- 
    */

</div>
/* 
--  page container end      -- 
*/

      );
}
}

export default CreateShoppingList