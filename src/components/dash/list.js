import React from 'react';
import BaseComponent from "../base"

let vex = require('vex-js')
vex.defaultOptions.className = 'vex-theme-os'

let btoa = require('btoa')

class Item extends BaseComponent {

  constructor() {
    super();
    this.state = {
      small_screen: false, loading: false, show: true
    }

  }

  deleteList = (component) => {

    component.setState({ loading: true })
    let parent = component._reactInternalInstance._currentElement._owner._instance;

    fetch(this.baseUrl + '/v1/shoppinglists/' + component.props.thisone, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Basic ' + btoa(this.state.token + ':x')
      }
    })      // returns a promise object
      .then((resp) => {
        component.setState({ loading: false })
        return resp.json()
      })
      .then((data) => {

        if (data["success"]) {

          data = data["success"];
          parent.setState({ general_msg: data })
          component.setState({ show: false })

        } else if (data["error"]) {

          data = data["error"];

          //if the error is not a json object, create a general messge..otherwise, its a form error
          if (typeof data !== "object") {
            component.setState({ general_msg: data })
            return true;
          }

        }

      }) // still returns a promise object, U need to chain it again
      .catch((error) => {        
        component.setState({ general_msg: "Check your internet connection and try again" })
      });

  }

  handleDeleteList = (event) => {

    let listId = event.target.getAttribute('data-listid');
    let component = this;

    vex.dialog.defaultOptions.showCloseButton = true;
    vex.dialog.defaultOptions.escapeButtonCloses = true;
    vex.dialog.defaultOptions.overlayClosesOnClick = true;

    vex.dialog.buttons.YES.text = 'Yes'
    vex.dialog.buttons.NO.text = 'No, thank you!'

    vex.dialog.confirm({
      message: 'Are you sure you want to delete this list and all it\'s items!?',
      callback: function (value) {
        if (value === true) { component.deleteList(component) }
      }
    });

  }

  render() {

    return (

      <div className={this.state.show ? "col-xs-12 shopping-list" : "hidden-lg hidden-md hidden-sm hidden-xs"}>

        <div className={this.props.chosen == this.props.thisone ? "alert alert-default col-md-10 col-xs-12 chosen-alert" : "alert alert-default col-md-10 col-xs-12"} onClick={this.props.handleListSelect} data-listname={this.props.list.name} id={this.props.list.list_id}>
          <strong>{this.props.list.name}</strong> -  {this.props.list.date_time ? this.props.list.date_time[0] : this.props.list.date_time}
        </div>

        <div className="col-md-1 col-xs-8" style={{ padding: '0' }}>

          <a href={"/shopping-list/" + this.props.list.list_id + "/edit"} onClick={this.props.pushNavigation} className="col-xs-12 btn btn-primary" style={{ padding: '5px 0' }}>
            <i className="fa fa-edit"></i>
          </a>

        </div>

        <div className="col-md-1 col-xs-4 delete_form" style={{ padding: '0' }}>
          <button className="btn btn-danger col-xs-12" onClick={this.handleDeleteList} data-listid={this.props.list.list_id} type="button" style={{ padding: '5px 0' }}>
            <i className="fa fa-trash-o"></i>
          </button>
        </div>

      </div>


    );
  }

}


export default Item