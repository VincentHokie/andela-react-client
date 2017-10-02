import React from 'react';
import { shallow, mount, render } from 'enzyme';

import UpdateShoppingList from '../update_shopping_list.component.jsx';

import App from '../../App.js';

import { BrowserRouter, MemoryRouter } from 'react-router-dom'


var GLOBAL = require("../../globals.js")

var fetchMock = require("fetch-mock");

var expect = require("chai").expect;

describe('Update Shopping list', () => {
  let wrapper;

  it('wraps content in a div with .container.col-xs-12 class if user is logged in', () => {

    localStorage.setItem("globals", JSON.stringify({"logged_in":true}));
    wrapper = shallow(<UpdateShoppingList />)
    expect(wrapper.find('.container.col-xs-12').length).equal(1);

  });

  describe('Behaviour', () => {
  	
    beforeEach(() => {
      localStorage.setItem("globals", JSON.stringify({"logged_in":true}));
      wrapper = shallow(<UpdateShoppingList />);
    })

    it('if the theres processing going on, the input is not editable', () => {

      wrapper.setState({ loading: false });
      wrapper.setState({ retrieved: true });
      expect(wrapper.find('input[name="name"]').prop("disabled")).equal(false);

      wrapper.setState({ loading: true });
      expect(wrapper.find('input[name="name"]').prop("disabled")).equal("disabled");

      wrapper.setState({ loading: false });
      wrapper.setState({ retrieved: false });
      expect(wrapper.find('input[name="name"]').prop("disabled")).equal("disabled");
      
    })

    it('if the theres a form error, the error should show', () => {

      expect(wrapper.find('FormError').length).equal(0);

      wrapper.setState({ name_error: "Error" });
      expect(wrapper.find('FormError').length).equal(1);
      
    })

    it('if the theres a flash message, expect the FlashMsg component, otherwise dont', () => {

      wrapper.setState({ general_msg: false });
      expect(wrapper.find('FlashMsg').length).equal(0);

      wrapper.setState({ general_msg: "A flash message" });
      expect(wrapper.find('FlashMsg').length).equal(1);
      
    })
  })

  describe('Flash Message Behaviour', () => {
    
    beforeEach(() => {
      localStorage.setItem("globals", JSON.stringify({"flash":"Message", "logged_in":true}));

      fetchMock.get("https://andela-flask-api.herokuapp.com/shoppinglists?list_id=1", {
        status: 200,
        body: []
      })

      wrapper = mount(<MemoryRouter initialEntries={[ '/shopping-list/1/edit' ]}><App /></MemoryRouter>)
    })

    it('if theres a flash message from a previous route, display it', () => {

      expect(wrapper.find('.alert.message').length).equal(1);
      expect(wrapper.find('.alert.message').html()).contain("Message");

      fetchMock.restore()
      
    })

  })

  describe('API interaction Behaviour', () => {
    let list_data, item_data;

    beforeEach(() => {

      localStorage.setItem("globals", JSON.stringify({"logged_in":true}));
      list_data = '{"list_id": "1","name":"Honda Accord Crosstour"}';

    })

    afterEach(() => {

       expect(fetchMock.calls().unmatched).to.be.empty;
        fetchMock.restore();

    })

    it('form submission done properly and success responses are handled properly', (done) => {

      fetchMock.get("https://andela-flask-api.herokuapp.com/shoppinglists?list_id=1", {
        status: 200,
        body: list_data
      })

      wrapper = mount(<MemoryRouter initialEntries={[ '/shopping-list/1/edit' ]}><App /></MemoryRouter>)

      setTimeout(function(){

        expect(fetchMock.called()).equal(true);
        expect(fetchMock.lastUrl()).equal("https://andela-flask-api.herokuapp.com/shoppinglists?list_id=1");

        done();

      }, 100);

    })
    
    it('form submission done properly and success responses are handled properly', (done) => {

      fetchMock.get("https://andela-flask-api.herokuapp.com/shoppinglists?list_id=1", {
        status: 401,
        body: "Unauthorized access"
      })

      wrapper = mount(<MemoryRouter initialEntries={[ '/shopping-list/1/edit' ]}><App /></MemoryRouter>)
      wrapper.setState({ general_msg: "Unauthorized access"});

      setTimeout(function(){

        expect(fetchMock.called()).equal(true);
        expect(fetchMock.lastUrl()).equal("https://andela-flask-api.herokuapp.com/shoppinglists?list_id=1");

        done();

      }, 100);

    })



    it('form submission done properly and error responses are handled properly', (done) => {
      
      fetchMock.put("https://andela-flask-api.herokuapp.com/shoppinglists/1", {
        status: 200,
        body: { success:"Were here" }
      })
      
      wrapper = shallow(<UpdateShoppingList />)
      wrapper.setProps({ match: { params : {id: 1 } } });

      wrapper.find('input[name="name"]').simulate("change", {target: {value: "vince"}});

      //expect(wrapper.state().loading).equal(false);
      wrapper.find('form').simulate("submit", { preventDefault() {} });
      wrapper.setState({ general_msg: "Were here"});

      setTimeout(function(){

        expect( wrapper.find("FlashMsg").length ).equal(1);

        expect(fetchMock.called()).equal(true);
        expect(fetchMock.lastUrl()).equal("https://andela-flask-api.herokuapp.com/shoppinglists/1");

        done();

      }, 100);

    })


    it('form submission done properly and error responses are handled properly', (done) => {
      
      fetchMock.put("https://andela-flask-api.herokuapp.com/shoppinglists/1", {
        status: 200,
        body: { error:"Were here" }
      })
      
      wrapper = shallow(<UpdateShoppingList />)
      wrapper.setProps({ match: { params : {id: 1 } } });

      wrapper.find('input[name="name"]').simulate("change", {target: {value: "vince"}});

      //expect(wrapper.state().loading).equal(false);
      wrapper.find('form').simulate("submit", { preventDefault() {} });
      wrapper.setState({ general_msg: "Were here"});

      setTimeout(function(){

        expect( wrapper.find("FlashMsg").length ).equal(1);

        expect(fetchMock.called()).equal(true);
        expect(fetchMock.lastUrl()).equal("https://andela-flask-api.herokuapp.com/shoppinglists/1");

        done();

      }, 100);

    })

    it('form submission done properly and error responses are handled properly', (done) => {
      
      fetchMock.put("https://andela-flask-api.herokuapp.com/shoppinglists/1", {
        status: 200,
        body: "Unauthorized access"
      })
      
      wrapper = shallow(<UpdateShoppingList />)
      wrapper.setProps({ match: { params : {id: 1 } } });

      wrapper.find('input[name="name"]').simulate("change", {target: {value: "vince"}});

      //expect(wrapper.state().loading).equal(false);
      wrapper.find('form').simulate("submit", { preventDefault() {} });
      wrapper.setState({ general_msg: "Were here"});

      setTimeout(function(){

        expect( wrapper.find("FlashMsg").length ).equal(1);

        expect(fetchMock.called()).equal(true);
        expect(fetchMock.lastUrl()).equal("https://andela-flask-api.herokuapp.com/shoppinglists/1");

        done();

      }, 100);

    })


    it('form submission done properly and form error message responses are handled properly', (done) => {
      
      fetchMock.put("https://andela-flask-api.herokuapp.com/shoppinglists/1", {
        status: 200,
        body: { error: { name : ["Name error"] } }
      })

      wrapper = shallow(<UpdateShoppingList />)
      wrapper.setProps({ match: { params : {id: 1 } } });

      wrapper.find('input[name="name"]').simulate("change", {target: {value: "vince"}});

      //expect(wrapper.state().loading).equal(false);
      wrapper.find('form').simulate("submit", { preventDefault() {} });
      wrapper.setState({ name_error: "Name error"});

      setTimeout(function(){

        expect( wrapper.find("FormError").length ).equal(1);

        expect(fetchMock.called()).equal(true);
        expect(fetchMock.lastUrl()).equal("https://andela-flask-api.herokuapp.com/shoppinglists/1");

        done();

      }, 100);

    })

    it('form submission done properly and form error message responses are handled properly', (done) => {
      
      fetchMock.put("https://andela-flask-api.herokuapp.com/shoppinglists/1", {
        status: 200,
        body: "Unauthorized access"
      })

      wrapper = shallow(<UpdateShoppingList />)
      wrapper.setProps({ match: { params : {id: 1 } } });

      wrapper.find('input[name="name"]').simulate("change", {target: {value: "vince"}});

      //expect(wrapper.state().loading).equal(false);
      wrapper.find('form').simulate("submit", { preventDefault() {} });

      setTimeout(function(){

        expect( wrapper.state().general_msg ).equal("Check your internet connection and try again");
        expect( wrapper.find("FlashMsg").length ).equal(1);

        expect(fetchMock.called()).equal(true);
        expect(fetchMock.lastUrl()).equal("https://andela-flask-api.herokuapp.com/shoppinglists/1");

        done();

      }, 100);

    })

  })



})