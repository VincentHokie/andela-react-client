import React from 'react';
import { shallow, mount, render } from 'enzyme';

import ShoppingLists from '../shopping_lists.component.js';

import App from '../../App.js';

import { BrowserRouter, MemoryRouter } from 'react-router-dom'

var GLOBAL = require("../../globals.js")
var fetchMock = require("fetch-mock");
var expect = require("chai").expect;
import "../localStorage.js";

var expect = require("chai").expect;
let wrapper, list_data, item_data;

describe('Shopping list', () => {

  it('wraps content in a div with .col-xs-12 class if user is logged in', () => {

    localStorage.setItem("globals", JSON.stringify({ "logged_in": true }));
    wrapper = shallow(<ShoppingLists />)
    expect(wrapper.find('.sh-list-container').length).equal(1);

  });

})

describe('Behaviour', () => {

  beforeEach(() => {
    localStorage.setItem("globals", JSON.stringify({ "logged_in": true }));

    fetchMock.get(GLOBAL.baseUrl + "/v1/shoppinglists?limit=5&page=1", {
      status: 200,
      body: []
    })

    wrapper = mount(<ShoppingLists />)

  })

  it('if the theres processing going on, the input is not editable', () => {

    wrapper.setState({ loading: false });
    expect(wrapper.find('input[name="name"]').prop("disabled")).equal(false);
    expect(wrapper.find('input[name="amount"]').prop("disabled")).equal(false);

    wrapper.setState({ loading: true });
    expect(wrapper.find('input[name="name"]').prop("disabled")).equal("disabled");
    expect(wrapper.find('input[name="amount"]').prop("disabled")).equal("disabled");

  })

  it('if the theres a form error, the error should show', () => {

    expect(wrapper.find('span.label').length).equal(0);

    wrapper.setState({ name_error: "Error" });
    expect(wrapper.find('span.label').length).equal(1);

  })

  it('if the theres a flash message, expect the FlashMsg component, otherwise dont', () => {

    wrapper.setState({ general_msg: false });
    expect(wrapper.find('.message').length).equal(0);

    wrapper.setState({ general_msg: "A flash message" });
    expect(wrapper.find('.message').length).equal(1);

  })


  it('when we click the button to add a new item, expect the form to show with a .showAddItemForm class', () => {

    expect(wrapper.find('.showAddItemForm').length).equal(0);
    wrapper.find('#create-shopping-list-item').simulate("click", { preventDefault() { } });
    expect(wrapper.find('.showAddItemForm').length).equal(1);

  })

  it('when items are showing on a small scree, clicking the back button should hide it again by changing the hide_items state', () => {

    expect(wrapper.state().hide_items).equal(false);
    wrapper.find('#back-to-lists').simulate("click", { preventDefault() { } });
    expect(wrapper.state().hide_items).equal(true);

  })


  it('shopping list click, sets the currently selected list, its ID and on a small screen hides the shopping lists', () => {

    fetchMock.get(GLOBAL.baseUrl + "/v2/shoppinglists/1/items?limit=5&page=1", {
      status: 200,
      body: []
    })

    expect(wrapper.state().chosen_list).equal(false);
    expect(wrapper.state().chosen_list_id).equal(false);
    expect(wrapper.state().hide_items).equal(false);

    wrapper.setState({ small_screen: true });
    wrapper.instance().handleListSelect({
      target: {
        id: 1,
        getAttribute() {
          return "ListName";
        }
      }
    });

    expect(wrapper.state().chosen_list).equal("ListName");
    expect(wrapper.state().chosen_list_id).equal(1);
    expect(wrapper.state().hide_items).equal(true);

  })


  it('check that the hide items property has the correct effect', () => {

    expect(wrapper.find(".panel.panel-default.hideSomething").length).equal(0);
    expect(wrapper.find(".panel.panel-default.hidden-xs").length).equal(1);

    wrapper.setState({ hide_items: true });

    expect(wrapper.find(".panel.panel-default.hideSomething").length).equal(1);
    expect(wrapper.find(".panel.panel-default.hidden-xs").length).equal(0);

  })

})
