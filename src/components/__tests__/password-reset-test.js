import React from 'react';
import { shallow, mount, render } from 'enzyme';

import PasswordReset from '../password_reset.component.jsx';

import App from '../../App.js';

import { BrowserRouter, MemoryRouter } from 'react-router-dom'


var GLOBAL = require("../../globals.js")

var fetchMock = require("fetch-mock");

var expect = require("chai").expect;

describe('Password reset', () => {
  let wrapper;

  it('wraps content in a div with .col-xs-12 class if user is logged in', () => {

    localStorage.setItem("globals", JSON.stringify({"logged_in":false}));
    wrapper = shallow(<PasswordReset />)
    expect(wrapper.find('.container.col-xs-12').length).equal(1);

  });

  it('wraps content in a Redirect is not logged in', () => {

    localStorage.setItem("globals", JSON.stringify({"logged_in":true}));
    wrapper = shallow(<PasswordReset />)
    expect(wrapper.find('Redirect').length).equal(1);

  });

  describe('State Behaviour', () => {
  	
    beforeEach(() => {
      localStorage.setItem("globals", JSON.stringify({"logged_in":false}));
      wrapper = shallow(<PasswordReset />)
    })

    it('if the theres processing going on, the input is not editable', () => {

      wrapper.setState({ loading: false });
      expect(wrapper.find('input[name="password"]').prop("disabled")).equal(false);
      expect(wrapper.find('input[name="password_confirm"]').prop("disabled")).equal(false);

      wrapper.setState({ loading: true });
      expect(wrapper.find('input[name="password"]').prop("disabled")).equal("disabled");
      expect(wrapper.find('input[name="password_confirm"]').prop("disabled")).equal("disabled");
      
    })

    it('if the theres a form error, the error should show', () => {
      
      expect(wrapper.find('FormError').length).equal(0);

      wrapper.setState({ password_error: "Error" });
      expect(wrapper.find('FormError').length).equal(1);

      wrapper.setState({ password_confirm_error: "Error" });
      expect(wrapper.find('FormError').length).equal(2);
      
    })

    it('if the theres a flash message, expect the .message class, otherwise dont', () => {

      wrapper.setState({ general_msg: false });
      expect(wrapper.find('FlashMsg').length).equal(0);

      wrapper.setState({ general_msg: "A flash message" });
      expect(wrapper.find('FlashMsg').length).equal(1);
      
    })

  })

  describe('Flash Message Behaviour', () => {
    
    it('if the theres a flash message state, expect a flash message to show', () => {

      localStorage.setItem("globals", JSON.stringify({"flash":"Message", "logged_in":false}));
      wrapper = mount(<PasswordReset />)

      expect(wrapper.find('.alert.message').length).equal(1);
      expect(wrapper.find('.alert.message').text()).contain("Message");
      
    })

  })

  describe('API interaction Behaviour', () => {
    
    beforeEach(() => {
      localStorage.setItem("globals", JSON.stringify({"logged_in":false, "token":"a-real-secret"}));
    })

    it('form submission done properly and success responses are handled properly', async () => {

      fetchMock.post("https://andela-flask-api.herokuapp.com/auth/reset-password/a-real-secret", {
        status: 200,
        body: { success:"Your password has been successfully reset" }
      })

      wrapper = shallow(<PasswordReset />)
      wrapper.setProps({ match: { params : {token: "a-real-secret" } } });

      wrapper.find('input[name="password_confirm"]').simulate("change", {target: {value: "vince", name:"password"}});
      wrapper.find('input[name="password"]').simulate("change", {target: {value: "vince_password", name:"password_confirm"}});

      wrapper.find('form').simulate("submit", { preventDefault() {} });

      expect( wrapper.state().loading ).equal(true);

      await
      
      setTimeout(function(){

        expect( wrapper.state().general_msg ).equal("Your password has been successfully reset");
        expect( wrapper.state().loading ).equal(false);
        expect( wrapper.find("FlashMsg").length ).equal(1);

        expect(fetchMock.called()).equal(true);
        expect(fetchMock.lastUrl()).equal("https://andela-flask-api.herokuapp.com/auth/reset-password/a-real-secret");

      }, 100);

    })


    it('form submission done properly and error responses are handled properly', async () => {
      
      fetchMock.post("https://andela-flask-api.herokuapp.com/auth/reset-password/a-real-secret", {
        status: 200,
        body: { error:"Were here" }
      })
      
      wrapper = shallow(<PasswordReset />)
      wrapper.setProps({ match: { params : {token: "a-real-secret" } } });

      wrapper.find('input[name="password_confirm"]').simulate("change", {target: {value: "vince", name:"password"}});
      wrapper.find('input[name="password"]').simulate("change", {target: {value: "vince_password", name:"password_confirm"}});

      //expect(wrapper.state().loading).equal(false);
      wrapper.find('form').simulate("submit", { preventDefault() {} });
      expect( wrapper.state().loading ).equal(true);

      await
      
      setTimeout(function(){

        expect( wrapper.state().loading ).equal(true);
        expect( wrapper.state().general_msg ).equal("Were here");
        expect( wrapper.find("FlashMsg").length ).equal(1);

        expect(fetchMock.called()).equal(true);
        expect(fetchMock.lastUrl()).equal("https://andela-flask-api.herokuapp.com/auth/reset-password/a-real-secret");

      }, 100);

    })


    it('form submission done properly and form error message responses are handled properly', async () => {
      
      fetchMock.post("https://andela-flask-api.herokuapp.com/auth/reset-password/a-real-secret", {
        status: 200,
        body: { error: { password_confirm : ["Password confirm error"], password : ["Password error"] } }
      })

      wrapper = shallow(<PasswordReset />)
      wrapper.setProps({ match: { params : {token: "a-real-secret" } } });

      wrapper.find('input[name="password_confirm"]').simulate("change", {target: {value: "vince", name:"password_confirm"}});
      wrapper.find('input[name="password"]').simulate("change", {target: {value: "vince_password", name:"password"}});

      //expect(wrapper.state().loading).equal(false);
      wrapper.find('form').simulate("submit", { preventDefault() {} });
      expect( wrapper.state().loading ).equal(true);

      await
      
      setTimeout(function(){

        expect( wrapper.state().password_confirm_error ).equal("Password confirm error");
        expect( wrapper.state().password_error ).equal("Password error");
        expect( wrapper.state().loading ).equal(false);
        expect( wrapper.find("FormError").length ).equal(2);

        expect(fetchMock.called()).equal(true);
        expect(fetchMock.lastUrl()).equal("https://andela-flask-api.herokuapp.com/auth/reset-password/a-real-secret");

      }, 100);

    })

    it('form submission done properly and form error message responses are handled properly', async () => {
      
      fetchMock.post("https://andela-flask-api.herokuapp.com/auth/reset-password/a-real-secret", {
        status: 200,
        body: "Unauthorized access"
      })

      wrapper = shallow(<PasswordReset />)
      wrapper.setProps({ match: { params : {token: "a-real-secret" } } });

      wrapper.find('input[name="password"]').simulate("change", {target: {value: "vince", name:"password"}});
      wrapper.find('input[name="password_confirm"]').simulate("change", {target: {value: "vince_password", name:"password_confirm"}});

      //expect(wrapper.state().loading).equal(false);
      wrapper.find('form').simulate("submit", { preventDefault() {} });
      expect( wrapper.state().loading ).equal(true);

      await
      
      setTimeout(function(){

        expect( wrapper.state().general_msg ).equal("Check your internet connection and try again");
        expect( wrapper.state().loading ).equal(false);
        expect( wrapper.find("FlashMsg").length ).equal(1);

        expect(fetchMock.called()).equal(true);
        expect(fetchMock.lastUrl()).equal("https://andela-flask-api.herokuapp.com/auth/reset-password/a-real-secret");

      }, 100);

    })

    afterEach(() => {
      expect(fetchMock.calls().unmatched).to.be.empty;
      fetchMock.restore();
    })

  })

  


})