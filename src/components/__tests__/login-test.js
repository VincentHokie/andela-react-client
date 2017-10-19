import React from 'react';
import { shallow, mount, render } from 'enzyme';

import Login from '../login.component.js';

import App from '../../App.js';

import { BrowserRouter, MemoryRouter } from 'react-router-dom'

var GLOBAL = require("../../globals.js")
var fetchMock = require("fetch-mock");
var expect = require("chai").expect;
import "../localStorage.js";

var expect = require("chai").expect;

describe('Login page', () => {
  let wrapper;

  it('wraps content in a div with .col-xs-12 class', () => {

    localStorage.setItem("globals", JSON.stringify({ "logged_in": false }));
    wrapper = shallow(<Login />)
    expect(wrapper.find('.container.col-xs-12').length).equal(1);

  });

  describe('State Behaviour', () => {

    beforeEach(() => {
      localStorage.setItem("globals", JSON.stringify({ "logged_in": false }));
      wrapper = mount(<Login />)
    })

    it('if the theres processing going on, the input is not editable', () => {

      wrapper.setState({ loading: false });
      expect(wrapper.find('input[name="username"]').prop("disabled")).equal(false);
      expect(wrapper.find('input[name="password"]').prop("disabled")).equal(false);

      wrapper.setState({ loading: true });
      expect(wrapper.find('input[name="username"]').prop("disabled")).equal("disabled");
      expect(wrapper.find('input[name="password"]').prop("disabled")).equal("disabled");

    })

    it('if the theres a form error, the error should show', () => {

      expect(wrapper.find('FormError').length).equal(0);

      wrapper.setState({ username_error: "Error" });
      expect(wrapper.find('FormError').length).equal(1);

      wrapper.setState({ password_error: "Error" });
      expect(wrapper.find('FormError').length).equal(2);

    })

    it('if the theres an error, expect the .message class, otherwise dont', () => {

      wrapper.setState({ general_msg: false });
      expect(wrapper.find('FlashMsg').length).equal(0);

      wrapper.setState({ general_msg: "A flash message" });
      expect(wrapper.find('FlashMsg').length).equal(1);

    })

  })

  describe('Flash Message Behaviour', () => {

    beforeEach(() => {
      localStorage.setItem("globals", JSON.stringify({ flash: "Message", logged_in: false }));
      wrapper = mount(<Login />)

    })

    it('if the theres a flash message, ensure it shows', () => {

      expect(wrapper.find('.alert.message').length).equal(1);
      expect(wrapper.find('.alert.message').html()).contain("Message");

    })

  })

  describe('API interaction Behaviour', () => {

    let origTO = 0;
    let history_param = { "push": function () { } };

    beforeEach(() => {
      localStorage.setItem("globals", JSON.stringify({ "logged_in": false }));
    })

    it('form submission done properly and success responses are handled properly', (done) => {

      fetchMock.post(GLOBAL.baseUrl + "/v1/auth/login", {
        status: 200,
        body: JSON.stringify({ success: "Were here", token: "a-super-sercret-access-token" })
      })

      wrapper = mount(<Login history={history_param} />)

      wrapper.find('input[name="username"]').simulate("change", { target: { value: "vince", name: "username" } });
      wrapper.find('input[name="password"]').simulate("change", { target: { value: "vince_password", name: "password" } });

      wrapper.find('form').simulate("submit", { preventDefault() { } });

      //the component is loading, errors are reset and form states are populated
      expect(wrapper.state().loading).equal(true);
      expect(wrapper.state().username).equal("vince");
      expect(wrapper.state().password).equal("vince_password");
      expect(wrapper.state().username_error).equal(false);
      expect(wrapper.state().password_error).equal(false);

      setTimeout(() => {

        //the component is finished loading, we dont have form errors and a success message is shown
        expect(wrapper.state().loading).equal(false);
        expect(wrapper.state().username_error).equal(false);
        expect(wrapper.state().password_error).equal(false);

        expect(wrapper.find(".message").length).equal(1);
        expect(wrapper.state().general_msg).equal("Were here");

        expect(fetchMock.called()).equal(true);
        expect(fetchMock.lastUrl()).equal(GLOBAL.baseUrl + "/v1/auth/login");

        done();

      }, 1500)


    })


    it('form submission done properly and error responses are handled properly', (done) => {

      fetchMock.post(GLOBAL.baseUrl + "/v1/auth/login", {
        status: 200,
        body: JSON.stringify({ error: "Were here" })
      })

      wrapper = mount(<Login />)

      wrapper.find('input[name="username"]').simulate("change", { target: { value: "vince", name: "username" } });
      wrapper.find('input[name="password"]').simulate("change", { target: { value: "vince_password", name: "password" } });

      wrapper.find('form').simulate("submit", { preventDefault() { } });

      //the component is loading, errors are reset and form states are populated
      expect(wrapper.state().loading).equal(true);

      setTimeout(() => {

        expect(wrapper.find(".message").length).equal(1);

        expect(wrapper.state().loading).equal(false);
        expect(wrapper.state().general_msg).equal("Were here");

        expect(fetchMock.called()).equal(true);
        expect(fetchMock.lastUrl()).equal(GLOBAL.baseUrl + "/v1/auth/login");

        done();

      }, 100)

    })


    it('form submission done properly and form error message responses are handled properly', (done) => {

      fetchMock.post(GLOBAL.baseUrl + "/v1/auth/login", {
        status: 200,
        body: JSON.stringify({ error: { username: ["Username error"], password: ["Password error"] } })
      })

      wrapper = mount(<Login />)

      wrapper.find('input[name="username"]').simulate("change", { target: { value: "vince", name: "username" } });
      wrapper.find('input[name="password"]').simulate("change", { target: { value: "vince_password", name: "password" } });

      wrapper.find('form').simulate("submit", { preventDefault() { } });

      expect(wrapper.state().loading).equal(true);

      setTimeout(() => {

        expect(wrapper.state().loading).equal(false);
        expect(wrapper.state().username_error).equal("Username error");
        expect(wrapper.state().password_error).equal("Password error");

        expect(wrapper.find("span.label").length).equal(2);

        expect(fetchMock.called()).equal(true);
        expect(fetchMock.lastUrl()).equal(GLOBAL.baseUrl + "/v1/auth/login");

        done();

      }, 100)

      //wrapper.update();


    })

    it('form submission done properly and unauthorized error responses are handled properly', (done) => {

      fetchMock.post(GLOBAL.baseUrl + "/v1/auth/login", {
        status: 200,
        body: "Unauthorized access"
      })

      wrapper = mount(<Login />)

      wrapper.find('input[name="username"]').simulate("change", { target: { value: "vince", name: "username" } });
      wrapper.find('input[name="password"]').simulate("change", { target: { value: "vince_password", name: "password" } });

      wrapper.find('form').simulate("submit", { preventDefault() { } });

      expect(wrapper.state().loading).equal(true);

      setTimeout(() => {

        expect(wrapper.state().loading).equal(false);
        expect(wrapper.state().general_msg).equal("Check your internet connection and try again");

        expect(wrapper.find(".message").length).equal(1);

        expect(fetchMock.called()).equal(true);
        expect(fetchMock.lastUrl()).equal(GLOBAL.baseUrl + "/v1/auth/login");

        done();

      }, 100)

    })

    afterEach(() => {
      expect(fetchMock.calls().unmatched).to.be.empty;
      fetchMock.restore();
    })

  })




})