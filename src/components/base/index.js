import React, { Component } from 'react';

var GLOBAL = require("../../globals.js")

class BaseComponent extends Component {

  constructor() {
    super();
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
        flash: false
      });

    }

  }

  pushNavigation = (event) => {
    this.props.history.push(event.target.getAttribute("href"))
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

}


export default BaseComponent