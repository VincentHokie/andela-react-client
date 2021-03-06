import React from 'react';
import BaseComponent from "../base"

let vex = require('vex-js')
vex.defaultOptions.className = 'vex-theme-os'

let btoa = require('btoa')

class ListItem extends BaseComponent {

  constructor() {
    super();
    this.state = { show: true }
  }

  componentDidMount() {
    this.setState({ checked: this.props.item.bought })
  }

  deleteItem = (component) => {

    component.setState({ loading: true })
    let parent = component._reactInternalInstance._currentElement._owner._instance;

    fetch(this.baseUrl + '/v1/shoppinglists/' + component.props.list + '/items/' + component.props.item.item_id, {
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

        if (data["success"])
          return data;

        throw data;

      })
      .then((data) => {

        data = data["success"];
        parent.setState({ general_msg: data })
        component.setState({ show: false })

      }) // still returns a promise object, U need to chain it again
      .catch((data) => {

        if (data["error"]) {

          data = data["error"];
          parent.setState({ general_msg: data })

          return;

        }

        parent.setState({ general_msg: "Check your internet connection and try again" })
      });


  }

  handleDeleteItem = (event) => {

    let component = this;

    vex.dialog.defaultOptions.showCloseButton = true;
    vex.dialog.defaultOptions.escapeButtonCloses = true;
    vex.dialog.defaultOptions.overlayClosesOnClick = true;

    vex.dialog.buttons.YES.text = 'Yes'
    vex.dialog.buttons.NO.text = 'No, thank you!'
    vex.dialog.confirm({
      message: 'Are you sure you want to delete this item!?',
      callback: function (value) {
        if (value === true) { component.deleteItem(component); }
      }
    });

  }

  handleItemCheckboxChange = (event) => {

    let parent = this._reactInternalInstance._currentElement._owner._instance;

    fetch(this.baseUrl + '/v1/shoppinglists/' + this.props.item.list_id + '/items/' + this.props.item.item_id + '/checkbox', {
      method: 'PUT',
      headers: {
        'Authorization': 'Basic ' + btoa(this.state.token + ':x')
      }
    })      // returns a promise object
      .then((resp) => {
        this.setState({ loading: false })
        return resp.json()
      })
      .then((data) => {

        if (data["success"]) {

          data = data["success"];
          parent.setState({ general_msg: data })
          this.setState({ checked: this.state.checked == 1 ? 0 : 1 })

        } else if (data["error"]) {

          data = data["error"];

          //if the error is not a json object, create a general messge..otherwise, its a form error
          if (typeof data !== "object") {
            this.setState({ general_msg: data })
            return true;
          }

        }

      }) // still returns a promise object, U need to chain it again
      .catch((error) => {
        this.setState({ general_msg: "Check your internet connection and try again" })
      });

  }

  render() {

    return (

      <div className={this.state.show ? "" : "hidden-lg hidden-md hidden-sm hidden-xs"}>

        <li className={this.props.chosen == this.props.list ? "list-group-item col-xs-12 shopping-list-items showAddItemForm" : "list-group-item col-xs-12 shopping-list-items"} id={this.props.item.item_id} style={{ padding: '0' }}>

          <label className="col-md-10 col-xs-12" style={{ padding: '5px 0 5px 5px' }}><input type="checkbox" onChange={this.handleItemCheckboxChange} checked={this.state.checked == "1" ? "checked" : false} /> {this.props.item.name} - UgX {this.props.item.amount} </label>

          <div className="col-md-1 col-xs-8" style={{ padding: '0' }}>

            <a href={"/shopping-list/" + this.props.item.list_id + "/item/" + this.props.item.item_id + "/edit"} onClick={this.props.pushNavigation} className="col-xs-12 btn btn-primary" style={{ padding: '5px 0' }}>
              <i className="fa fa-edit"></i>
            </a>

          </div>

          <div className="col-md-1 col-xs-4 delete_form" style={{ padding: '0' }}>
            <button className="btn btn-danger col-xs-12" onClick={this.handleDeleteItem} data-listid={this.props.item.list_id} data-itemid={this.props.item.item_id} type="button" style={{ padding: '5px 0' }}>
              <i className="fa fa-trash-o"></i>
            </button>
          </div>

        </li>

      </div>


    );
  }

}


export default ListItem