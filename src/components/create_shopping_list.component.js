import React, { Component } from 'react';

import Navigation from "./navigation.component.js"
import FlashMsg from "./flash_msg.component.js"
import FormError from "./forms/form_error.component.js"
import FormButton from "./forms/form_button.component.js"
import BackButton from "./back_button.component.js"

var GLOBAL = require("../globals.js")

class CreateShoppingList extends Component {

  constructor() {
    super();
    this.state = {
      name: '',
      name_error: false,
      general_msg: false, loading: false,
      logged_in: false, flash: false, user_username: false, token: false
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.pushNavigation = this.pushNavigation.bind(this);

  }

  componentWillMount() {

    //set global info and window refresh/ page change
    GLOBAL.setGlobals(this);

  }

  componentDidMount() {

    //show a flash message if it exists in the globals module
    if (this.state.flash) {

      this.setState({ 
        general_msg: this.state.flash,
        flash: true
      });

    }

  }

  handleSubmit(e) {

    //prevent browser refresh on submit
    e.preventDefault();

    var formData = new FormData();
    var data = ["name"];

    //reset error variables
    this.setState({ 
      name_error: false,
      general_msg: false,
      loading: true
    })

    for (var name in data)
      formData.append(data[name], this.state[data[name]]);


    fetch(GLOBAL.baseUrl + '/v1/shoppinglists', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': 'Basic ' + btoa(this.state.token + ':x')
      }
    })      // returns a promise object
      .then((resp) => {
        this.setState({ loading: false })
        return resp.text()
      })
      .then((data) => {

        data = JSON.parse(data)

        if (data["error"]) {

          data = data["error"];

          //if the error is not a json object, create a general messge..otherwise, its a form error
          if (typeof data !== "object") {
            this.setState({ general_msg: data })
            return true;
          }

          // display the name form error if the name key exists
          if (data["name"])
            this.setState({ ["name_error"]: data["name"][0] })
          

        } else {
          
          this.setState({ 
            general_msg: "You have successfully created the List : " + this.state.name,
            name: ''
          })
          
        }


      }) // still returns a promise object, U need to chain it again
      .catch((error) => {
        this.setState({ general_msg: "Check your internet connection and try again" })
      });

  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  pushNavigation(event) {
    this.props.history.push(event.target.getAttribute("href"))
  }

  render() {

    return (

      <div className="container col-xs-12">

        <Navigation username={this.state.user_username} parent={this} pushNavigation={this.pushNavigation} />

        {this.state.general_msg ? <FlashMsg msg={this.state.general_msg} /> : null}

        <form onSubmit={this.handleSubmit} className="col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-12 form" name="create-shoppinglist">

          <h2 className="form-heading">New Andela Shopping list form</h2>

          <div className="input-wrap">

            <div className="col-xs-12">
              <div className="form-group">

                {this.state.name_error ? <FormError error={this.state.name_error} /> : null}
                <input type="text" placeholder="Shopping List Name" name="name" className="form-control" required="required" autoFocus onChange={this.handleChange} value={this.state.name} disabled={this.state.loading ? "disabled" : false} />

              </div>
            </div>

            <div className="col-xs-12">
              <FormButton loading={this.state.loading} title="Create Shopping List" />
            </div>

          </div>


        </form>

        <BackButton pushNavigation={this.pushNavigation} />

      </div>

    );

  }
}

export default CreateShoppingList