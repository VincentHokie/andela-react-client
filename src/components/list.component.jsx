import React, { Component } from 'react';

import { Link } from 'react-router-dom';

var GLOBAL = require("../globals.js")

var vex = require('vex-js')
vex.defaultOptions.className = 'vex-theme-os'

var btoa = require('btoa')

class Item extends Component {

constructor(){
   super();
   this.state= {
    small_screen: false, loading: false
  }

   this.handleDeleteList = this.handleDeleteList.bind(this);
   this.deleteList = this.deleteList.bind(this);
}
  
componentWillMount(){
  
  //set global info and window refresh/ page change
  GLOBAL.setGlobals(this);

}

deleteList(component) {

  component.setState({ loading: true  })

  fetch('https://andela-flask-api.herokuapp.com/shoppinglists/'+component.props.thisone,{
        method: 'DELETE',
        headers: {
           'Authorization': 'Basic '+btoa(this.state.token+':x')
         }
      })      // returns a promise object
      .then((resp) => resp.json())
      .then(function(data){

        component.setState({ loading: false  })

        if( data["success"] ){

          data = data["success"];
          component.setState({ general_msg: data })

        }else if( data["error"] ){

          data = data["error"];

          //if the error is not a json object, create a general messge..otherwise, its a form error
          if( typeof data !== "object" ){
            component.setState({ general_msg: data })
            return true;
          }

        }

    }) // still returns a promise object, U need to chain it again
  .catch(function(error){
    component.setState({ loading: false  })
    component.setState({ general_msg: "Check your internet connection and try again" })
  });

}

handleDeleteList(event) {

  var listId = event.target.getAttribute('data-listid');
  var component = this;
  
  vex.dialog.defaultOptions.showCloseButton = true;
  vex.dialog.defaultOptions.escapeButtonCloses = true;
  vex.dialog.defaultOptions.overlayClosesOnClick = true;

  vex.dialog.buttons.YES.text = 'Yes'
  vex.dialog.buttons.NO.text = 'No, thank you!'

  vex.dialog.confirm({
      message: 'Are you sure you want to delete this list and all it\'s items!?',
      callback: function (value) { 
        if(value === true){ component.deleteList(component) }
      }
  });

}

render() {

  return (

      <div className="col-xs-12 shopping-list">

      <div className={ this.props.chosen == this.props.thisone ? "alert alert-default col-md-10 col-xs-12 chosen-alert" : "alert alert-default col-md-10 col-xs-12" } onClick={ this.props.handleListSelect } data-listname={ this.props.list.name } id={ this.props.list.list_id }>
      <strong>{ this.props.list.name }</strong> -  { this.props.list.date }
      </div>

      <div className="col-md-1 col-xs-8" style={{ padding:'0' }}>

      <a href={ "/shopping-list/"+ this.props.list.list_id +"/edit" } className="col-xs-12 btn btn-primary" style={{ padding:'5px 0'  }}>
        <i className="fa fa-edit"></i>
      </a>

      </div>

      <div className="col-md-1 col-xs-4 delete_form" style={{ padding:'0' }}>
        <button className="btn btn-danger col-xs-12" onClick={ this.handleDeleteList } data-listid={ this.props.list.list_id } type="button" style={{ padding:'5px 0' }}>
        <i className="fa fa-trash-o"></i>
        </button>
      </div>

      </div>


  );
}

}


export default Item