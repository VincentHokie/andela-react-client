import React from 'react';
import { shallow, mount, render } from 'enzyme';

import CreateShoppingList from '../shoppingList/createShoppingList';

import { BrowserRouter, MemoryRouter } from 'react-router-dom'

import chai from "chai"; let expect = chai.expect

import { baseUrl } from  "../../globals.js"
import fetchMock from "fetch-mock";
import "../../localStorage";

let wrapper;

describe('Create Shopping list', () => {

  it('CreateShoppingList wraps content in a div with .col-xs-12 class if user is logged in', () => {

    localStorage.setItem("globals", JSON.stringify({ "logged_in": true }));
    wrapper = mount(<CreateShoppingList />)
    expect(wrapper.find('.container.col-xs-12').length).equal(1);

  });

});

describe('Behaviour', () => {

  beforeEach(() => {
    localStorage.setItem("globals", JSON.stringify({ "logged_in": true }));
    wrapper = mount(<CreateShoppingList />)
  })

  it('if the theres processing going on, the input is not editable', () => {

    wrapper.setState({ loading: false });
    expect(wrapper.find('input').prop("disabled")).equal(false);

    wrapper.setState({ loading: true });
    expect(wrapper.find('input').prop("disabled")).equal("disabled");

  })

  it('if the theres a form error, the error should show', () => {

    wrapper.setState({ name_error: false });
    expect(wrapper.find('span.label').length).equal(0);

    wrapper.setState({ name_error: "Error" });
    expect(wrapper.find('span.label').length).equal(1);

  })

  it('if the theres a flash message, expect the .message class, otherwise dont', () => {

    wrapper.setState({ general_msg: false });
    expect(wrapper.find('.message').length).equal(0);

    wrapper.setState({ general_msg: "A flash message" });
    expect(wrapper.find('.message').length).equal(1);

  })
});

describe('Flash Message Behaviour', () => {

  beforeEach(() => {
    localStorage.setItem("globals", JSON.stringify({ "flash": "Message", "logged_in": true }));
    wrapper = mount(<CreateShoppingList />)
  })

  it('if a flash message comes from the previous route, it should be displayed', () => {

    expect(wrapper.state().general_msg).equal("Message");
    expect(wrapper.find('FlashMsg').length).equal(1);


  })

})

describe('API interaction Behaviour', () => {

  beforeEach(() => {
    localStorage.setItem("globals", JSON.stringify({ "logged_in": true }));
  })

  it('form submission done properly and success responses are handled properly', (done) => {

    fetchMock.post(baseUrl + "/v1/shoppinglists", {
      status: 200,
      body: { success: "Were here" }
    })

    wrapper = mount(<CreateShoppingList />)

    let input = wrapper.find('input');
    input.simulate("change", { target: { value: "vince@gmail.com", name: "name" } });

    wrapper.find('form').simulate("submit", { preventDefault() { } });

    setTimeout(function () {

      expect(wrapper.state().general_msg).equal("You have successfully created the List : vince@gmail.com");
      expect(wrapper.find("FlashMsg").length).equal(1);

      expect(fetchMock.called()).equal(true);
      expect(fetchMock.lastUrl()).equal(baseUrl + "/v1/shoppinglists");

      done();

    }, 100);

  })


  it('form submission done properly and error responses are handled properly', (done) => {

    fetchMock.post(baseUrl + "/v1/shoppinglists", {
      status: 200,
      body: { error: "Were here" }
    })

    wrapper = mount(<CreateShoppingList />)

    let input = wrapper.find('input');
    input.simulate("change", { target: { value: "vince@gmail.com", name: "name" } });

    wrapper.find('form').simulate("submit", { preventDefault() { } });

    setTimeout(function () {

      expect(wrapper.state().general_msg).equal("Were here");

      expect(wrapper.find("FlashMsg").length).equal(1);

      expect(fetchMock.called()).equal(true);
      expect(fetchMock.lastUrl()).equal(baseUrl + "/v1/shoppinglists");

      done();

    }, 100);

  })


  it('form submission done properly and form error message responses are handled properly', (done) => {

    fetchMock.post(baseUrl + "/v1/shoppinglists", {
      status: 200,
      body: { error: { name: ["Name error"] } }
    })

    wrapper = mount(<CreateShoppingList />)

    let input = wrapper.find('input');
    input.simulate("change", { target: { value: "vince@gmail.com", name: "name" } });

    wrapper.find('form').simulate("submit", { preventDefault() { } });

    setTimeout(function () {

      expect(wrapper.state().name_error).equal("Name error");

      expect(wrapper.find("FormError").length).equal(1);

      expect(fetchMock.called()).equal(true);
      expect(fetchMock.lastUrl()).equal(baseUrl + "/v1/shoppinglists");

      done();

    }, 100);

  })

  it('form submission done properly and form error message responses are handled properly', (done) => {

    fetchMock.post(baseUrl + "/v1/shoppinglists", {
      status: 200,
      body: "Unauthorized access"
    })

    wrapper = mount(<CreateShoppingList />)

    let input = wrapper.find('input');
    input.simulate("change", { target: { value: "vince@gmail.com", name: "name" } });

    wrapper.find('form').simulate("submit", { preventDefault() { } });

    setTimeout(function () {

      expect(wrapper.state().general_msg).equal("Check your internet connection and try again");
      expect(wrapper.find("FlashMsg").length).equal(1);

      expect(fetchMock.called()).equal(true);
      expect(fetchMock.lastUrl()).equal(baseUrl + "/v1/shoppinglists");

      done();

    }, 100);

  })

  afterEach(() => {
    expect(fetchMock.calls().unmatched).to.be.empty;
    fetchMock.restore();
  })

})