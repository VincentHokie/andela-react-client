import React, { Component } from 'react';

import { Redirect, Link } from 'react-router-dom';

import './css/view-shopping-list.css';

import Navigation from "./navigation.component.js"
import ListItem from "./list_item.component.js"
import List from "./list.component.js"
import Paginate from "./paginator.component.js"

import FlashMsg from "./flash_msg.component.js"

import FormError from "./forms/form_error.component.js"

var GLOBAL = require("../globals.js")

var vex = require('vex-js')
vex.defaultOptions.className = 'vex-theme-os'

var btoa = require('btoa')

class ShoppingLists extends Component {

  constructor() {
    super();
    this.state = {
      name: '', amount: 1, search_word_list: false, search_word_item: false,
      name_error: false, amount_error: '',
      general_msg: false, loading: false,
      logged_in: false, list_data: [], item_data: [],
      show_add_item: false, chosen_list: false, chosen_list_id: false,
      small_screen: false, hide_items: false, flash: false, user_username: false, token: false,
      lists_per_page: 5, items_per_page: 5, showing_all_items: false, showing_all_lists: false,
      num_of_records_lists: 1, num_of_records_items: 1,
      getting_lists : false, getting_items : false,
      list_page_selected : 1, item_page_selected : 1
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleListSelect = this.handleListSelect.bind(this);
    this.toggleShowItemForm = this.toggleShowItemForm.bind(this);
    this.handleBackButtonOnItems = this.handleBackButtonOnItems.bind(this);
    this.pushNavigation = this.pushNavigation.bind(this);
    this.numberOfListsPerPageChange = this.numberOfListsPerPageChange.bind(this);
    this.numberOfItemsPerPageChange = this.numberOfItemsPerPageChange.bind(this);
    this.list_page_selected = this.list_page_selected.bind(this);
    this.item_page_selected = this.item_page_selected.bind(this);
    this.getLists = this.getLists.bind(this);
    this.getItems = this.getItems.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handleItemSearchSubmit = this.handleItemSearchSubmit.bind(this);


  }

  componentWillMount() {

    //set global info and window refresh/ page change
    GLOBAL.setGlobals(this);

  }

  getLists(limit, page, q = "") {

    if (q && q != "")
      q = "&q=" + q
    else
      q = ""

    this.setState({ getting_lists : true });

    //get user shopping list objects from database
    fetch(GLOBAL.baseUrl + '/v1/shoppinglists?limit=' + limit + '&page=' + page + q, {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + btoa(this.state.token + ':x')
      }
    })      // returns a promise object
      .then((resp) => {
        this.setState({ general_msg: false })
        this.setState({ getting_lists : false })
        return resp.json()
      })
      .then((data) => {

        if (data["error"]) {
          this.setState({ general_msg: data["error"] })
          return true;
        }

        this.setState({ list_data: data["lists"] });
        this.setState({ num_of_records_lists: data["count"] });
        this.setState({ loading: false })

      }) // still returns a promise object, U need to chain it again
      .catch((error) => {
        this.setState({ loading: false })
        this.setState({ general_msg: "Check your internet connection and try again" })
      });

  }

  getItems(list_id, limit, page, q = "") {

    if (q && q != "")
      q = "&q=" + q
    else
      q = ""

      this.setState({ getting_items : true })

    //get user shopping list item objects from database
    fetch(GLOBAL.baseUrl + '/v2/shoppinglists/' + list_id + '/items?limit=' + limit + '&page=' + page + q, {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + btoa(this.state.token + ':x')
      }
    })      // returns a promise object
      .then((resp) => {
        this.setState({ getting_items : false })
        return resp.json();
      })
      .then((data) => {

        if (data["error"]) {
          this.setState({ general_msg: data["error"] })
          return true;
        }

        //we got item objects back, populate component state
        this.setState({ item_data: data["items"] });
        this.setState({ num_of_records_items: data["count"] });

        this.setState({ loading: false });

      }) // still returns a promise object, U need to chain it again
      .catch((error) => {
        this.setState({ loading: false })
        this.setState({ general_msg: "Check your internet connection and try again" })
      });

  }

  componentDidMount() {

    this.setState({ loading: true })

    this.setState({ general_msg: "Loading your updated shopping lists.." })

    //show a flash message if it exists in the globals module
    if (this.state.flash) {

      this.setState({ general_msg: this.state.flash });
      this.setState({ flash: false });

    }

    //update screen size state
    this.setState({ small_screen: window.innerWidth < 768 ? true : false });
    this.getLists(5, 1);

  }

  list_page_selected(event) {
    this.setState({ list_page_selected : event.target.getAttribute("data-page-number") })
    this.getLists(this.state.lists_per_page, event.target.getAttribute("data-page-number"), this.state.search_word_list);
  }

  item_page_selected(event) {
    this.setState({ item_page_selected : event.target.getAttribute("data-page-number") })
    this.getItems(this.state.chosen_list_id, this.state.items_per_page, event.target.getAttribute("data-page-number"), this.state.search_word_item);
  }

  numberOfListsPerPageChange(event) {
    this.setState({ lists_per_page: parseInt(event.target.value) });
    this.setState({ showing_all_lists: event.target.value == "all" ? true : false })

    this.getLists(parseInt(event.target.value), 1, this.state.search_word_list);

  }

  numberOfItemsPerPageChange(event) {
    this.setState({ items_per_page: event.target.value });
    this.setState({ showing_all_items: event.target.value == "all" ? true : false })

    this.getItems(this.state.chosen_list_id, parseInt(event.target.value), 1, this.state.search_word_item);

  }

  pushNavigation(event) {
    this.props.history.push(event.target.getAttribute("href"))
  }

  handleSubmit(e) {

    //prevent browser refresh on submit
    if (e)
      e.preventDefault();

    var formData = new FormData();
    var data = ["name", "amount"];
    var thiz = this;

    //reset error variables
    this.setState({ name_error: false })
    this.setState({ general_msg: false })
    this.setState({ loading: true })


    for (var name in data)
      formData.append(data[name], this.state[data[name]]);

    fetch(GLOBAL.baseUrl + '/v1/shoppinglists/' + this.state.chosen_list_id + '/items', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(this.state.token + ':x')
      },
      body: formData
    })      // returns a promise object
      .then((resp) => resp.text())
      .then(function (data) {

        thiz.setState({ loading: false })

        data = JSON.parse(data)

        if (data["error"]) {

          data = data["error"];

          //if the error is not a json object, create a general messge..otherwise, its a form error
          if (typeof data !== "object") {
            thiz.setState({ general_msg: data })
            return true;
          }

          var fields = ["name", "amount"];
          for (var field in fields) {
            field = fields[field];
            if (data[field])
              thiz.setState({ [field + "_error"]: data[field][0] })
          }
        } else {

          thiz.setState({ general_msg: "You have successfully created the item : " + thiz.state.name + " into list : " + thiz.state.chosen_list })
          var current_items = thiz.state.item_data;
          current_items.push(data)

          thiz.setState({ item_data: current_items })
          thiz.setState({ name: '' })
          thiz.setState({ amount: '' })


        }


      }) // still returns a promise object, U need to chain it again
      .catch(function (error) {
        thiz.setState({ loading: false })
        thiz.setState({ general_msg: "Check your internet connection and try again" })
      });

  }

  handleSearchSubmit(event) {
    event.preventDefault()
    this.getLists(this.state.lists_per_page, 1, this.state.search_word_list)
  }

  handleItemSearchSubmit(event) {
    event.preventDefault()
    this.getItems(this.state.chosen_list_id, this.state.items_per_page, 1, this.state.search_word_item);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  toggleShowItemForm(event) {
    this.setState({ show_add_item: !this.state.show_add_item })
  }

  handleBackButtonOnItems(event) {
    this.setState({ hide_items: !this.state.hide_items })
  }

  handleListSelect(event) {
    this.setState({ chosen_list: event.target.getAttribute("data-listname") })
    this.setState({ chosen_list_id: event.target.id })

    //on a mobile phone, completely hide the list panel and show the list items
    if (this.state.small_screen) {
      this.setState({ hide_items: !this.state.hide_items })
    }

    this.getItems(event.target.id, this.state.items_per_page, 1, this.state.search_word_item);

  }


  render() {

    // Map through lists and return linked lists
    const listNode = this.state.list_data ? this.state.list_data.map((list) => {
      return (<List chosen={this.state.chosen_list_id} thisone={list.list_id} list={list} handleListSelect={this.handleListSelect} key={list.list_id} pushNavigation={this.pushNavigation} />)
    }) : "";

    // Map through items and return linked items
    const itemNode = this.state.item_data ? this.state.item_data.map((item) => {
      return (<ListItem chosen={this.state.chosen_list_id} item={item} key={item.item_id} list={item.list_id} pushNavigation={this.pushNavigation} />)
    }) : "";

    // Create list pagination
    const pagination_rows_lists = [];
    var pages = Math.ceil(this.state.num_of_records_lists / this.state.lists_per_page)

    for (var i = 0; i < pages; i++) {
      pagination_rows_lists.push(<Paginate page={ i + 1 } key={ i + 1 } page_selected={ this.list_page_selected } chosen_page={ this.state.list_page_selected } />);
    }

    // Create item pagination
    const pagination_rows_items = [];
    var pages = Math.ceil(this.state.num_of_records_items / this.state.items_per_page)

    for (var i = 0; i < pages; i++) {
      pagination_rows_items.push(<Paginate page={ i + 1 } key={ i + 1 } page_selected={ this.item_page_selected } chosen_page={ this.state.item_page_selected } />);
    }

    return (

      <div className="sh-list-container">

        <Navigation username={this.state.user_username} parent={this} pushNavigation={this.pushNavigation} />

        {this.state.general_msg ? <FlashMsg msg={this.state.general_msg} /> : null}

        <div className="col-xs-12">

          <div className={this.state.hide_items ? "panel panel-default col-sm-6 col-xs-12 hideSomething" : "panel panel-default col-sm-6 col-xs-12"} id="list-panel">

            <div className="panel-heading col-xs-12" style={{ marginBottom: "15px" }}>
              <h4 className="col-xs-10">Shopping lists <img src='/static/images/loading.gif' alt="loading gif" className={ !this.state.getting_lists ? "hideSomething" : "col-xs-1" } style={{ padding: '0' }} /></h4>

              <a href="/shopping-list/new" className="btn btn-success col-xs-2" style={{ padding: '10px 0' }} onClick={this.pushNavigation}>
                <i className="fa fa fa-plus-circle"></i>
              </a>

            </div>

            <div className="col-xs-12">

              <div className="col-xs-5 col-xs-offset-1">
                <div className="form-group">
                  <select className="form-control" name="select_lists_per_page" onChange={this.numberOfListsPerPageChange}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="all">All</option>
                  </select>
                </div>
              </div>


              <form onSubmit={this.handleSearchSubmit} className="form">
                <div className="col-xs-5 col-xs-offset-1">
                  <div className="form-group">
                    <input placeholder="Search word" className="form-control" name="search_word_list" onChange={this.handleChange} />
                  </div>
                </div>
              </form>

            </div>

            <div className="panel-body col-xs-12">

              <h5>Click a shopping list to see its items</h5>

              {listNode}

            </div>

            <div className={this.state.showing_all_lists ? "hidden-lg hidden-md hidden-sm hidden-xs" : "panel-footer col-xs-12"}>
              <ul className="pagination" style={{ margin: "0" }}>
                {pagination_rows_lists}
              </ul>
            </div>

          </div>


          <div className={this.state.hide_items ? "panel panel-default col-sm-5 col-sm-offset-1 col-xs-12" : "panel panel-default col-sm-5 col-sm-offset-1 col-xs-12 hidden-xs"} id="list-items-panel">

            <div className="panel-heading col-xs-12" style={{ marginBottom: "15px" }}>

              <button className="btn hidden-md hidden-lg hidden-sm col-xs-1" onClick={this.handleBackButtonOnItems} id="back-to-lists" style={{ padding: '10px 0' }}><i className="fa fa-arrow-circle-left"></i></button>

              <h4 className="col-xs-10">Shopping list items <img src='/static/images/loading.gif' alt="loading gif" className={ !this.state.getting_items ? "hideSomething" : "col-xs-1"} style={{ padding: '0' }} /> </h4>

              <button id="create-shopping-list-item" onClick={this.toggleShowItemForm} className="btn btn-success col-sm-2 col-xs-1" style={{ padding: '10px 0' }}><i className="fa fa fa-plus-circle"></i></button>

            </div>

            <div className="panel-body">

              <div className={ !this.state.chosen_list_id ? "hideSomething" : "col-xs-12"}>

                <div className="col-xs-5 col-xs-offset-1">
                  <div className="form-group">
                    <select className="form-control" name="select_items_per_page" onChange={this.numberOfItemsPerPageChange}>
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="all">All</option>
                    </select>
                  </div>
                </div>

                <form onSubmit={this.handleItemSearchSubmit} className="form">
                  <div className="col-xs-5 col-xs-offset-1">
                    <div className="form-group">
                      <input placeholder="Search word" className="form-control" name="search_word_item" onChange={this.handleChange} />
                    </div>
                  </div>
                </form>

              </div>

              <h4 className="col-xs-12">Shopping list - <span id="list-name">{this.state.chosen_list ? this.state.chosen_list : null}</span></h4>
              <h4 className="col-xs-12">Items</h4>

              <div className={this.state.show_add_item ? 'well well-sm col-xs-12 showAddItemForm' : 'well well-sm col-xs-12'} id="new-item-form">

                <h5>Enter shopping list item to add below!</h5>

                <form onSubmit={this.handleSubmit} id="addItemForm" className="form">

                  <div className="row">

                    <div className="col-xs-6">
                      <div className="form-group">

                        {this.state.name_error ? <FormError error={this.state.name_error} /> : null}
                        <input type="text" placeholder="Shopping List Item Name" name="name" className="form-control" required="required" autoFocus onChange={this.handleChange} disabled={this.state.loading ? "disabled" : false} value={this.state.name} />

                      </div>
                    </div>

                    <div className="col-xs-6">
                      <div className="form-group">

                        {this.state.amount_error ? <FormError error={this.state.amount_error} /> : null}
                        <input type="number" min="1" placeholder="Shopping List Item Amount" name="amount" className="form-control" required="required" onChange={this.handleChange} value={this.state.amount} disabled={this.state.loading ? "disabled" : false} />

                      </div>
                    </div>


                    <div className="col-xs-12">
                      <button className={this.state.loading ? "btn btn-md btn-sign-up col-xs-11" : "btn btn-md btn-sign-up col-xs-12"}
                        disabled={this.state.loading || !this.state.chosen_list ? "disabled" : false} type="submit">Create Item</button>
                      {this.state.loading ? <img src='/static/images/loading.gif' alt="loading gif" className="col-xs-1" /> : null}
                    </div>


                  </div>

                </form>

              </div>


              <ul className="list-group col-xs-12">

                {itemNode}

              </ul>

            </div>

            <div className={this.state.showing_all_items || !this.state.chosen_list_id ? "hidden-lg hidden-md hidden-sm hidden-xs" : "panel-footer col-xs-12"}>
              <ul className="pagination" style={{ margin: "0" }}>
                {pagination_rows_items}
              </ul>
            </div>

          </div>

        </div>

      </div>

    );

  }
}


export default ShoppingLists
