import React from 'react';
import { shallow, mount, render } from 'enzyme';

import EmailConfirm from '../email_confirm.component.jsx';

import App from '../../App.js';

import { BrowserRouter, MemoryRouter } from 'react-router-dom'


var GLOBAL = require("../../globals.js")

var fetchMock = require("fetch-mock");

var expect = require("chai").expect;

describe('Email confirmation', () => {
  let wrapper;

  it('wraps content in a div with .col-xs-12 class if user is logged in', () => {

    localStorage.setItem("globals", JSON.stringify({"logged_in":false}));
    wrapper = shallow(<EmailConfirm />)
    expect(wrapper.find('.container.col-xs-12').length).equal(1);

  });

  it('wraps content in a Redirect is not logged in', () => {

    localStorage.setItem("globals", JSON.stringify({"logged_in":true}));
    wrapper = shallow(<EmailConfirm />)
    expect(wrapper.find('Redirect').length).equal(1);

  });

  describe('State Behaviour', () => {
  	
    beforeEach(() => {
      localStorage.setItem("globals", JSON.stringify({"logged_in":false}));
      wrapper = shallow(<EmailConfirm />);
    })

    it('if the theres processing going on, the input is not editable', () => {

      wrapper.setState({ loading: false });
      expect(wrapper.find('input').prop("disabled")).equal(false);

      wrapper.setState({ loading: true });
      expect(wrapper.find('input').prop("disabled")).equal("disabled");
      
    })

    it('if the theres a form error, the error should show', () => {

      wrapper.setState({ email_error: false });
      expect(wrapper.find('FormError').length).equal(0);

      wrapper.setState({ email_error: "Error" });
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

    it('if a flash message is brough from a previous route, expect it to be shown', () => {

      localStorage.setItem("globals", JSON.stringify({"flash":"Message", "logged_in":false}));
      wrapper = mount(<EmailConfirm />)

      expect(wrapper.find('.alert.message').length).equal(1);
      expect(wrapper.find('.alert.message').html()).contain("Message");
      
    })

  })

  describe('API interaction Behaviour', () => {
    
    beforeEach(() => {
      localStorage.setItem("globals", JSON.stringify({"logged_in":false}));
    })

    it('form submission done properly and success responses are handled properly', async () => {

      fetchMock.post("https://andela-flask-api.herokuapp.com/auth/reset-password", {
        status: 200,
        body: { success:"Were here" }
      })

      wrapper = mount(<EmailConfirm />)

      var input = wrapper.find('input');
      input.simulate("change", {target: {value: "vince@gmail.com", name: "email"}});

      wrapper.find('form').simulate("submit", { preventDefault() {} });
      wrapper.setState({ general_msg: "Were here"});

      await

      setTimeout(function(){

        expect( wrapper.state().general_msg ).equal("Were here");

        expect( wrapper.find("FlashMsg").length ).equal(1);

        expect(fetchMock.called()).equal(true);
        expect(fetchMock.lastUrl()).equal("https://andela-flask-api.herokuapp.com/auth/reset-password");
        
      }, 100);      

    })


    it('form submission done properly and error responses are handled properly', async () => {
      
      fetchMock.post("https://andela-flask-api.herokuapp.com/auth/reset-password", {
        status: 200,
        body: { error:"Were here" }
      })
      
      wrapper = mount(<EmailConfirm />)

      var input = wrapper.find('input');
      input.simulate("change", {target: {value: "vince@gmail.com", name: "email"}});

      wrapper.find('form').simulate("submit", { preventDefault() {} });

      await

      setTimeout(function(){

        expect( wrapper.state().general_msg ).equal("Were here");

        expect( wrapper.find("FlashMsg").length ).equal(1);

        expect(fetchMock.called()).equal(true);
        expect(fetchMock.lastUrl()).equal("https://andela-flask-api.herokuapp.com/auth/reset-password");

      }, 100);

    })


    it('form submission done properly and form error message responses are handled properly', async () => {
      
      fetchMock.post("https://andela-flask-api.herokuapp.com/auth/reset-password", {
        status: 200,
        body: { error: { email : ["Were here"] } }
      })

      wrapper = mount(<EmailConfirm />)

      var input = wrapper.find('input');
      input.simulate("change", {target: {value: "vince@gmail.com", name: "email"}});

      wrapper.find('form').simulate("submit", { preventDefault() {} });
      wrapper.setState({ email_error: "Were here"});

      await

      setTimeout(function(){

        expect( wrapper.state().general_msg ).equal("Were here");

        expect( wrapper.find("FormError").length ).equal(1);

        expect(fetchMock.called()).equal(true);
        expect(fetchMock.lastUrl()).equal("https://andela-flask-api.herokuapp.com/auth/reset-password");

      }, 100);

    })

    it('form submission done properly and form error message responses are handled properly', async () => {
      
      fetchMock.post("https://andela-flask-api.herokuapp.com/auth/reset-password", {
        status: 200,
        body: "Unauthorized access"
      })

      wrapper = mount(<EmailConfirm />)

      var input = wrapper.find('input');
      input.simulate("change", {target: {value: "vince@gmail.com", name: "email"}});

      wrapper.find('form').simulate("submit", { preventDefault() {} });

      await

      setTimeout(function(){

        expect( wrapper.state().general_msg ).equal("Check your internet connection and try again");
        expect( wrapper.find("FlashMsg").length ).equal(1);

        expect(fetchMock.called()).equal(true);
        expect(fetchMock.lastUrl()).equal("https://andela-flask-api.herokuapp.com/auth/reset-password");

      }, 100);

    })

    afterEach(() => {
      expect(fetchMock.calls().unmatched).to.be.empty;
      fetchMock.restore();
    })

  })

  


})