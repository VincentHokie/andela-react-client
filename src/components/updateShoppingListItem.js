import React, { Component } from 'react';

import BaseComponent from "./base"
import Navigation from "./navigation.js"
import FlashMsg from "./flashMsg.js"
import FormError from "./forms/formError.js"
import FormButton from "./forms/formButton.js"
import BackButton from "./backButton.js"

var GLOBAL = require("../globals.js")

class UpdateShoppingListItem extends BaseComponent {

  constructor() {
    super();
    this.state = {
      name: '', amount: '',
      name_error: false, amount_error: false,
      general_msg: false, loading: false,
      logged_in: false, retrieved: false, flash: false, username: false, token: false
    }

  }

  componentDidMount() {

    //show a flash message if it exists in the globals module
    if (this.state.flash) {

      this.setState({ 
        general_msg: this.state.flash,
        flash: false
      });

    }

    this.setState({ loading: true })

    //get list item object from database
    fetch(GLOBAL.baseUrl + '/v2/shoppinglists/' + this.props.match.params.id + '/items/' + this.props.match.params.item_id, {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + btoa(this.state.token + ':x')
      }
    })      // returns a promise object
      .then((resp) => {
        this.setState({ loading: false })
        return resp.json()
      })
      .then((data) => {

        //if there is an error, create a general messge..otherwise, its a list object
        if (data["error"]) {
          this.setState({ general_msg: data["error"] })
          return true;
        }

        //we got a list item object back, populate state & therefore input field
        this.setState({ 
          name: data["name"],
          amount: data["amount"],
          retrieved: true
        })

      }) // still returns a promise object, U need to chain it again
      .catch((error) => {
        this.setState({ general_msg: "Check your internet connection and try again" })
      });


  }

  handleSubmit = (e) => {

    //prevent browser refresh on submit
    e.preventDefault();

    var formData = new FormData();
    var data = ["name", "amount"];

    //reset error variables
    this.setState({ 
      name_error: false,
      amount_error: false,
      general_msg: false,
      loading: true
    })
    
    for (var name in data)
      formData.append(data[name], this.state[data[name]]);


    fetch(GLOBAL.baseUrl + '/v1/shoppinglists/' + this.props.match.params.id + '/items/' + this.props.match.params.item_id, {
      method: 'PUT',
      headers: {
        'Authorization': 'Basic ' + btoa(this.state.token + ':x')
      },
      body: formData
    })      // returns a promise object
      .then((resp) => {
        this.setState({ loading: false })
        return resp.json()
      })
      .then((data) => {

        if (data["success"]) {

          data = data["success"];
          this.setState({ general_msg: data })

          setTimeout(() => {
            this.props.history.push('/shopping-lists')
          }, 1000);


        } else if (data["error"]) {

          data = data["error"];

          //if the error is not a json object, create a general messge..otherwise, its a form error
          if (typeof data !== "object") {
            this.setState({ general_msg: data })
            return true;
          }

          // display form errors that come from the API
          if (data["name"]){
            this.setState({ ["name_error"]: data["name"][0] })
          }

          if (data["amount"]){
            this.setState({ ["amount_error"]: data["amount"][0] })
          }
          
        }

      }) // still returns a promise object, U need to chain it again
      .catch((error) => {
        this.setState({ general_msg: "Check your internet connection and try again" })
      });

  }

  render() {

    return (

      <div className="container col-xs-12">

        <Navigation username={this.state.user_username} parent={this} pushNavigation={this.pushNavigation} />

        {this.state.general_msg ? <FlashMsg msg={this.state.general_msg} /> : null}

        <form onSubmit={this.handleSubmit} className="col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-12 form" name="create-shoppinglist">

          <h2 className="form-heading">Edit Andela Shopping List Item</h2>

          <div className="input-wrap">

            <div className="col-xs-12">
              <div className="form-group">

                {this.state.name_error ? <FormError error={this.state.name_error} /> : null}
                <input type="text" placeholder="Shopping List Item Name" name="name" className="form-control" required="required" autoFocus onChange={this.handleChange} value={this.state.name} disabled={this.state.loading || !this.state.retrieved ? "disabled" : false} />

              </div>
            </div>

            <div className="col-xs-12">
              <div className="form-group">

                {this.state.amount_error ? <FormError error={this.state.amount_error} /> : null}
                <input type="number" min="1" placeholder="Item amount" name="amount" className="form-control" required="required" onChange={this.handleChange} value={this.state.amount} disabled={this.state.loading || !this.state.retrieved ? "disabled" : false} />

              </div>
            </div>

            <div className="col-xs-12">
              <FormButton loading={this.state.loading || !this.state.retrieved} title="Update Shopping List Item" />
            </div>

          </div>


        </form>

        <BackButton pushNavigation={this.pushNavigation} />

      </div>

    );

  }
}

export default UpdateShoppingListItem