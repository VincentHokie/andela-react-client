import React from 'react';
import { shallow, mount, render } from 'enzyme';

import ShoppingLists from '../dash/shoppingLists';

import { BrowserRouter, MemoryRouter } from 'react-router-dom'

var GLOBAL = require("../../globals.js")
import fetchMock from "fetch-mock";
import chai from "chai"; let expect = chai.expect
import "../../localStorage";

let wrapper, list_data, item_data;

describe('Flash Message Behaviour', () => {

  it('if the theres processing going on, the input is not editable', () => {

    localStorage.setItem("globals", JSON.stringify({ "flash": "Message", "logged_in": true }));

    fetchMock.get(GLOBAL.baseUrl + "/v1/shoppinglists?limit=5&page=1", {
      status: 200,
      body: "[]"
    })

    wrapper = mount(<ShoppingLists />)

    expect(wrapper.find('.message').length).equal(1);
    expect(wrapper.state().general_msg).equal("Message");

    expect(fetchMock.calls().unmatched).to.be.empty;
    fetchMock.restore();

  })

})

describe('API interaction Behaviour', () => {
  let list_data, item_data;

  beforeEach(() => {
    localStorage.setItem("globals", JSON.stringify({ "logged_in": true }));

    list_data = '{"lists" : [{"list_id": "1","name":"Honda Accord Crosstour"},{"list_id": "2","name":"Mercedes-Benz AMG GT Coupe"},{"list_id": "3","name":"BMW X6 SUV"},{"list_id": "4","name":"Ford Edge SUV"},{"list_id": "5","name":"Dodge Viper Coupe"}], "count":5}';

    item_data = '[{"item_id":"1","name":"item 1 list 1","amount":"100","list_id":"1","checked":"false"},{"item_id":"2","name":"item 2 list 1","amount":"100","list_id":"1","checked":"false"},{"item_id":"3","name":"item 3 list 2","amount":"100","list_id":"2","checked":"false"},{"item_id":"4","name":"item 4 list 2","amount":"100","list_id":"2","checked":"false"},{"item_id":"5","name":"item 5 list 3","amount":"100","list_id":"3","checked":"false"},{"item_id":"6","name":"item 6 list 3","amount":"100","list_id":"3","checked":"false"},{"item_id":"7","name":"item 7 list 4","amount":"100","list_id":"4","checked":"false"},{"item_id":"8","name":"item 8 list 4","amount":"100","list_id":"4","checked":"false"},{"item_id":"9","name":"item 9 list 5","amount":"100","list_id":"5","checked":"false"},{"item_id":"10","name":"item 10 list 5","amount":"100","list_id":"5","checked":"false"},{"item_id":"11","name":"item 11 list 1","amount":"100","list_id":"1","checked":"true"},{"item_id":"12","name":"item 12 list 2","amount":"100","list_id":"2","checked":"true"},{"item_id":"13","name":"item 13 list 3","amount":"100","list_id":"3","checked":"true"},{"item_id":"14","name":"item 14 list 4","amount":"100","list_id":"4","checked":"true"},{"item_id":"15","name":"item 15 list 5","amount":"100","list_id":"5","checked":"true"}]';


  })

  it('form submission done properly and success responses are handled properly', (done) => {

    fetchMock.mock(GLOBAL.baseUrl + "/v1/shoppinglists?limit=5&page=1", {
      status: 200,
      body: list_data
    })

    wrapper = mount(<ShoppingLists />)

    expect(wrapper.state().loading).equal(true);

    setTimeout(function () {

      expect(wrapper.state().loading).equal(false);

      expect(wrapper.find(".shopping-list").length).equal(wrapper.state().list_data.length);

      expect(fetchMock.called()).equal(true);
      expect(fetchMock.lastUrl()).equal(GLOBAL.baseUrl + "/v1/shoppinglists?limit=5&page=1");

      done();

    }, 100);

  })

  it('form submission done properly and success responses are handled properlyy', (done) => {

    fetchMock.get(GLOBAL.baseUrl + "/v1/shoppinglists?limit=5&page=1", {
      status: 401,
      body: "Unauthorized access"
    })

    wrapper = mount(<ShoppingLists />)
    expect(wrapper.state().loading).equal(true);

    setTimeout(function () {

      expect(wrapper.state().loading).equal(false);

      expect(wrapper.state().general_msg).equal("Check your internet connection and try again");

      expect(fetchMock.called()).equal(true);
      expect(fetchMock.lastUrl()).equal(GLOBAL.baseUrl + "/v1/shoppinglists?limit=5&page=1");

      done();

    }, 100);

  })

  it('form submission done properly and error responses are handled properly', (done) => {

    fetchMock.get(GLOBAL.baseUrl + "/v1/shoppinglists?limit=5&page=1", {
      status: 200,
      body: list_data
    })

    fetchMock.post(GLOBAL.baseUrl + "/v1/shoppinglists/1/items", {
      status: 200,
      body: { success: "Were here" }
    })

    wrapper = mount(<ShoppingLists />)
    wrapper.setState({ chosen_list_id: 1 });

    wrapper.find('input[name="name"]').simulate("change", { target: { value: "vince", name: "name" } });
    wrapper.find('input[name="amount"]').simulate("change", { target: { value: "123", name: "amount" } });

    wrapper.find('form#addItemForm').simulate("submit", { preventDefault() { } });

    expect(wrapper.state().loading).equal(true);

    setTimeout(function () {

      expect(wrapper.state().loading).equal(false);

      expect(wrapper.state().general_msg).equal("You have successfully created the item : vince into list : false");
      expect(wrapper.find(".message").length).equal(1);

      expect(fetchMock.called()).equal(true);
      expect(fetchMock.lastUrl()).equal(GLOBAL.baseUrl + "/v1/shoppinglists/1/items");

      done();

    }, 100);

  })


  it('form submission done properly and error responses are handled properly', (done) => {

    fetchMock.get(GLOBAL.baseUrl + "/v1/shoppinglists?limit=5&page=1", {
      status: 200,
      body: list_data
    })

    fetchMock.post(GLOBAL.baseUrl + "/v1/shoppinglists/1/items", {
      status: 200,
      body: { error: "Were here" }
    })

    wrapper = mount(<ShoppingLists />)
    wrapper.setState({ chosen_list_id: 1 });

    wrapper.find('input[name="name"]').simulate("change", { target: { value: "vince", name: "name" } });
    wrapper.find('input[name="amount"]').simulate("change", { target: { value: "123", name: "amount" } });

    wrapper.find('form#addItemForm').simulate("submit", { preventDefault() { } });

    expect(wrapper.state().loading).equal(true);

    setTimeout(function () {

      expect(wrapper.state().loading).equal(false);

      expect(wrapper.state().general_msg).equal("Were here");
      expect(wrapper.find(".message").length).equal(1);

      expect(fetchMock.called()).equal(true);
      expect(fetchMock.lastUrl()).equal(GLOBAL.baseUrl + "/v1/shoppinglists/1/items");

      done();

    }, 100);

  })

  it('form submission done properly and error responses are handled properly', (done) => {

    fetchMock.get(GLOBAL.baseUrl + "/v1/shoppinglists?limit=5&page=1", {
      status: 200,
      body: list_data
    })

    fetchMock.post(GLOBAL.baseUrl + "/v1/shoppinglists/1/items", {
      status: 200,
      body: "Unauthorized access"
    })

    wrapper = mount(<ShoppingLists />)
    wrapper.setState({ chosen_list_id: 1 });

    wrapper.find('input[name="name"]').simulate("change", { target: { value: "vince", name: "name" } });
    wrapper.find('input[name="amount"]').simulate("change", { target: { value: "123", name: "amount" } });

    //expect(wrapper.state().loading).equal(false);
    wrapper.find('form#addItemForm').simulate("submit", { preventDefault() { } });

    expect(wrapper.state().loading).equal(true);

    setTimeout(function () {

      expect(wrapper.state().loading).equal(false);

      expect(wrapper.state().general_msg).equal("Check your internet connection and try again");
      expect(wrapper.find(".message").length).equal(1);

      expect(fetchMock.called()).equal(true);
      expect(fetchMock.lastUrl()).equal(GLOBAL.baseUrl + "/v1/shoppinglists/1/items");

      done();

    }, 100);

  })


  it('form submission done properly and form error message responses are handled properly', (done) => {

    fetchMock.get(GLOBAL.baseUrl + "/v1/shoppinglists?limit=5&page=1", {
      status: 200,
      body: list_data
    })

    fetchMock.post(GLOBAL.baseUrl + "/v1/shoppinglists/1/items", {
      status: 200,
      body: { error: { name: ["Name error"], amount: ["Amount error"] } }
    })

    wrapper = mount(<ShoppingLists />)
    wrapper.setState({ chosen_list_id: 1 });

    wrapper.find('input[name="name"]').simulate("change", { target: { value: "vince", name: "name" } });
    wrapper.find('input[name="amount"]').simulate("change", { target: { value: "123", name: "amount" } });

    //expect(wrapper.state().loading).equal(false);
    wrapper.find('form#addItemForm').simulate("submit", { preventDefault() { } });

    expect(wrapper.state().loading).equal(true);

    setTimeout(function () {

      expect(wrapper.state().loading).equal(false);

      expect(wrapper.state().name_error).equal("Name error");
      expect(wrapper.state().amount_error).equal("Amount error");
      expect(wrapper.find("span.label").length).equal(2);

      expect(fetchMock.called()).equal(true);
      expect(fetchMock.lastUrl()).equal(GLOBAL.baseUrl + "/v1/shoppinglists/1/items");

      done();

    }, 100);

  })

  // it('form submission done properly and form error message responses are handled properly', (done) => {

  //   fetchMock.get(GLOBAL.baseUrl + "/v1/shoppinglists?limit=5&page=1", {
  //      status: 200,
  //      body: list_data
  //    })

  //   wrapper = mount(<ShoppingLists />)

  //   expect( wrapper.state().loading ).equal(true);

  //   setTimeout(function(){

  //     expect( wrapper.state().loading ).equal(false);

  //     expect( wrapper.state().general_msg ).equal("Unauthorized access");
  //     expect( wrapper.find(".message").length ).equal(1);

  //     expect(fetchMock.called()).equal(true);
  //     expect(fetchMock.lastUrl()).equal(GLOBAL.baseUrl + "/v1/shoppinglists?limit=5&page=1");

  //     done();

  //   }, 100);

  // })

  // it('form submission done properly and form error message responses are handled properly', (done) => {

  //   fetchMock.get(GLOBAL.baseUrl + "/v1/shoppinglists?limit=5&page=1", {
  //      status: 200,
  //      body: { error : "Unauthorized access"}
  //    })

  //   wrapper = mount(<ShoppingLists />)

  //   expect( wrapper.state().loading ).equal(true);

  //   setTimeout(function(){

  //     expect( wrapper.state().loading ).equal(false);

  //     expect( wrapper.state().general_msg ).equal("Unauthorized access");
  //     expect( wrapper.find(".message").length ).equal(1);

  //     expect(fetchMock.called()).equal(true);
  //     expect(fetchMock.lastUrl()).equal(GLOBAL.baseUrl + "/v1/shoppinglists?limit=5&page=1");

  //     done();

  //   }, 100);

  // })

  afterEach(() => {
    expect(fetchMock.calls().unmatched).to.be.empty;
    fetchMock.restore();
  })

})
