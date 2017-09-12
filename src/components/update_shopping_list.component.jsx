import React, { Component } from 'react';

import { Redirect } from 'react-router-dom';

import Navigation from "./navigation.component.jsx"
import FlashMsg from "./flash_msg.component.jsx"

import FormError from "./forms/form_error.component.jsx"
import FormButton from "./forms/form_button.component.jsx"

var GLOBAL = require("../globals.js")

class UpdateShoppingList extends Component {


constructor(){
   super();
   this.state={
    name: '',
    name_error: false,
    general_msg : false, loading : false,
    logged_in : false, retrieved: false
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

  var thiz = this;

  thiz.setState({ loading: true  })

  //get list object from database
  fetch('https://andela-flask-api.herokuapp.com/shoppinglists?list_id='+this.props.match.params.id,{
      method: 'GET',
      headers: {
         'Authorization': 'Basic '+btoa(GLOBAL.TOKEN+':x')
       }
    })      // returns a promise object
  .then((resp) => resp.json())
  .then(function(data){

    thiz.setState({ loading: false  })

    //if the data is not a json object, create a general messge..otherwise, its a list object
    if( typeof data !== "object" ){
      thiz.setState({ general_msg: data })
      return true;
    }

    //we got a list object back, populate state & therefore input field
    thiz.setState({ name: data["name"]  })
    this.setState({ retrieved: true  });

  
  }) // still returns a promise object, U need to chain it again
  .catch(function(error){
    thiz.setState({ loading: false  })
    thiz.setState({ general_msg: "Check your internet connection and try again" })
  });

    
}

handleSubmit(e) {

    //prevent browser refresh on submit
    e.preventDefault();

    var formData  = new FormData();
    var data = ["name"];
    var thiz = this;

    //reset error variables
    this.setState({ name_error: false  })
    this.setState({ general_msg: false  })
    this.setState({ loading: true  })

    for(var name in data)
      formData.append(data[name], this.state[data[name]]);
      

  fetch('https://andela-flask-api.herokuapp.com/shoppinglists/'+this.props.match.params.id,{
      method: 'PUT',
      headers: {
         'Authorization': 'Basic '+btoa(GLOBAL.TOKEN+':x')
       },
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

        //if the error is not a json object, create a general messge..otherwise, its a form error
        if( typeof data !== "object" ){
          thiz.setState({ general_msg: data })
          return true;
        }

        var fields = ["name"];
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

    if( !this.state.logged_in ){

      GLOBAL.FLASH = "You need to log in to update a shopping list!";
      return <Redirect push to="/login" />;

    }else{

    return (

    <div className="container col-xs-12">

    <Navigation username="Vince" />
    
    { this.state.general_msg ? <FlashMsg msg={ this.state.general_msg } /> : null }

    <form onSubmit={this.handleSubmit} className="col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-12 form" name="create-shoppinglist">

        <h2 className="form-heading">Edit Andela Shopping list</h2>

        <div className="input-wrap">

            <div className="col-xs-12">
                <div className="form-group">

                    { this.state.name_error ? <FormError error={ this.state.name_error } /> : null }
                    <input type="text" placeholder="Shopping List Name" name="name" className="form-control" required="required" autoFocus onChange={this.handleChange} value={ this.state.name } disabled={ this.state.loading || !this.state.retrieved ? "disabled" : false } />

                </div>
            </div>

            <div className="col-xs-12">
              <FormButton loading={ this.state.loading || !this.state.retrieved } title="Update Shopping List" />
            </div>

        </div>


    </form>

</div>

      );
}
}
}

export default UpdateShoppingList