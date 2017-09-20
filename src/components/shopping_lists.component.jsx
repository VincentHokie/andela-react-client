import React, { Component } from 'react';

import { Redirect, Link } from 'react-router-dom';

import './css/view-shopping-list.css';

import Navigation from "./navigation.component.jsx"
import ListItem from "./list_item.component.jsx"
import List from "./list.component.jsx"

import FlashMsg from "./flash_msg.component.jsx"

import FormError from "./forms/form_error.component.jsx"

var GLOBAL = require("../globals.js")

var vex = require('vex-js')
vex.defaultOptions.className = 'vex-theme-os'

var btoa = require('btoa')

class ShoppingLists extends Component {

constructor(){
   super();
   this.state= {
    name: '', amount: 1,
    name_error: false, amount_error: '',
    general_msg : false, loading : false,
    logged_in : false, list_data: [], item_data: [],
    show_add_item: false, chosen_list: false, chosen_list_id: false,
    small_screen: false, hide_items: false
  }

  this.handleSubmit = this.handleSubmit.bind(this);
  this.handleChange = this.handleChange.bind(this);
  this.handleListSelect = this.handleListSelect.bind(this);
  this.toggleShowItemForm = this.toggleShowItemForm.bind(this);
  this.handleBackButtonOnItems = this.handleBackButtonOnItems.bind(this);

  

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

  //update screen size state
  this.setState({ small_screen: window.innerWidth < 768 ? true : false  });

  var thiz = this;

  thiz.setState({ loading: true  })

  //get user shopping list objects from database
  fetch('https://andela-flask-api.herokuapp.com/shoppinglists',{
      method: 'GET',
      headers: {
         'Authorization': 'Basic '+btoa(GLOBAL.TOKEN+':x')
       }
    })      // returns a promise object
  .then((resp) => resp.text())
  .then(function(data){

    thiz.setState({ list_data: JSON.parse(data) });
    thiz.setState({ loading: false  })
  
  }) // still returns a promise object, U need to chain it again
  .catch(function(error){
    thiz.setState({ loading: false  })
    thiz.setState({ general_msg: "Check your internet connection and try again" })
  });


  //get user shopping list item objects from database
  fetch('https://andela-flask-api.herokuapp.com/shoppinglists/items',{
      method: 'GET',
      headers: {
         'Authorization': 'Basic '+btoa(GLOBAL.TOKEN+':x')
       }
    })      // returns a promise object
  .then((resp) => resp.text())
  .then(function(data){

    //we got item objects back, populate component state
    thiz.setState({ item_data: JSON.parse(data) });
    thiz.setState({ loading: false  });
  
  }) // still returns a promise object, U need to chain it again
  .catch(function(error){
    thiz.setState({ loading: false  })
    thiz.setState({ general_msg: "Check your internet connection and try again" })
  });

}

handleSubmit(e) {

    //prevent browser refresh on submit
    if(e)
      e.preventDefault();

    var formData  = new FormData();
    var data = ["name", "amount"];
    var thiz = this;

    //reset error variables
    this.setState({ name_error: false  })
    this.setState({ general_msg: false  })
    this.setState({ loading: true  })


    for(var name in data) 
      formData.append(data[name], this.state[data[name]]);

    fetch('https://andela-flask-api.herokuapp.com/shoppinglists/'+ this.state.chosen_list_id +'/items',{
      method: 'POST',
      headers: {
         'Authorization': 'Basic '+btoa(GLOBAL.TOKEN+':x')
       },
      body: formData
    })      // returns a promise object
    .then((resp) => resp.text())
    .then(function(data){

      thiz.setState({ loading: false  })
      data = JSON.parse(data)

      if( data["error"] ){

        data = data["error"];

        var fields = ["name", "amount"];
        for( var field in fields ){
          field = fields[field];
          if( data[field] )
            thiz.setState({ [field+"_error"] : data[field][0] })
        }
      }else{

        thiz.setState({ general_msg: "You have successfully created the item : " + thiz.state.name +" into list : " + thiz.state.chosen_list })
        var current_items = thiz.state.item_data;
        current_items.push(data)

        thiz.setState({ item_data: current_items })
        thiz.setState({ name: '' })
        thiz.setState({ amount: '' })


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

toggleShowItemForm(event) {
    this.setState({ show_add_item: !this.state.show_add_item  })
}

handleBackButtonOnItems(event) {
  this.setState({ hide_items: !this.state.hide_items  })
}

handleListSelect(event) {
  this.setState({ chosen_list: event.target.getAttribute("data-listname")  })
  this.setState({ chosen_list_id: event.target.id  })

  //on a mobile phone, completely hide the list panel and show the list items
  if( this.state.small_screen ){
      this.setState({ hide_items: !this.state.hide_items  })
  }
}


render() {

  if( !this.state.logged_in ){

    return <Redirect push to="/login" />;

  }else{

    // Map through lists and return linked lists
    const listNode = this.state.list_data.map((list) => {
      return ( <List chosen={ this.state.chosen_list_id } thisone={ list.list_id } list={ list } handleListSelect={ this.handleListSelect } key={ list.list_id } /> )
    });


    // Map through items and return linked items
    const itemNode = this.state.item_data.map((item) => {
      return ( <ListItem chosen={ this.state.chosen_list_id } item={ item } key={ item.item_id } list={ item.list_id } /> )
    });

return (

  <div>

  <Navigation username="Vince" />

  { this.state.general_msg ? <FlashMsg msg={ this.state.general_msg } /> : null }

  <div className="col-xs-12">

  <div className={ this.state.hide_items ? "panel panel-default col-sm-6 col-xs-12 hideSomething" : "panel panel-default col-sm-6 col-xs-12" } id="list-panel">

  <div className="panel-heading col-xs-12">
  <h4 className="col-xs-10">Shopping lists</h4>

  <a href="/shopping-list/new" className="btn btn-success col-xs-2" style={{ padding:'10px 0'  }}>
    <i className="fa fa fa-plus-circle"></i>
  </a>

  </div>

  <div className="panel-body col-xs-12">

  <h5>Click a shopping list to see its items</h5>

  { listNode }

  </div>

  </div>


  <div className={ this.state.hide_items ? "panel panel-default col-sm-5 col-sm-offset-1 col-xs-12": "panel panel-default col-sm-5 col-sm-offset-1 col-xs-12 hidden-xs" } id="list-items-panel">

  <div className="panel-heading col-xs-12">

  <button className="btn hidden-md hidden-lg hidden-sm col-xs-1" onClick={ this.handleBackButtonOnItems } id="back-to-lists" style={{ padding:'10px 0' }}><i className="fa fa-arrow-circle-left"></i></button>

  <h4 className="col-xs-10">Shopping list items</h4>

  <button id="create-shopping-list-item" onClick={ this.toggleShowItemForm } className="btn btn-success col-sm-2 col-xs-1" style={{ padding:'10px 0' }}><i className="fa fa fa-plus-circle"></i></button>

  </div>

  <div className="panel-body">

  <h4 className="col-xs-12">Shopping list - <span id="list-name">{ this.state.chosen_list ? this.state.chosen_list : null }</span></h4>
  <h4 className="col-xs-12">Items</h4>

  <div className={this.state.show_add_item ? 'well well-sm col-xs-12 showAddItemForm' :'well well-sm col-xs-12'} id="new-item-form">

  <h5>Enter shopping list item to add below!</h5>

  <form onSubmit={this.handleSubmit} id="addItemForm" className="form">

  <div className="row">

  <div className="col-xs-6">
  <div className="form-group">

  { this.state.name_error ? <FormError error={ this.state.name_error } /> : null }
  <input type="text" placeholder="Shopping List Item Name" name="name" className="form-control" required="required" autoFocus onChange={this.handleChange} disabled={ this.state.loading ? "disabled" : false } value={ this.state.name } />

  </div>
  </div>

  <div className="col-xs-6">
  <div className="form-group">

  { this.state.amount_error ? <FormError error={ this.state.amount_error } />  : null }
  <input type="number" min="1" placeholder="Shopping List Item Amount" name="amount" className="form-control" required="required" onChange={this.handleChange} value={ this.state.amount } disabled={ this.state.loading ? "disabled" : false } />

  </div>
  </div>


  <div className="col-xs-12">
  <button className={ this.state.loading ? "btn btn-md btn-sign-up col-xs-11" : "btn btn-md btn-sign-up col-xs-12" }
    disabled={  this.state.loading || !this.state.chosen_list ? "disabled" : false } type="submit">Create Item</button>
  { this.state.loading ? <img src='/static/images/loading.gif' alt="loading gif" className="col-xs-1" /> : null }
  </div>


  </div>

  </form>

  </div>


  <ul className="list-group col-xs-12">

  { itemNode }

  </ul>

  </div>

  </div>

  </div>

  </div>

  );
}
}
}


export default ShoppingLists
