import React from 'react';
import { shallow, mount, render } from 'enzyme';

import SignUp from '../sign_up.component.js';

import App from '../../App.js';

import { BrowserRouter, MemoryRouter } from 'react-router-dom'

var GLOBAL = require("../../globals.js")
var fetchMock = require("fetch-mock");
var expect = require("chai").expect;
import "../localStorage.js";

var expect = require("chai").expect;

describe('Sign Up Component', () => {
  let wrapper;

  it('wraps content in a div with .container.col-xs-12 class if user is logged in', () => {

    localStorage.setItem("globals", JSON.stringify({ "logged_in": false }));
    wrapper = mount(<SignUp />)
    expect(wrapper.find('.container.col-xs-12').length).equal(1);

  });

  describe('Behaviour', () => {

    beforeEach(() => {
      localStorage.setItem("globals", JSON.stringify({ "logged_in": false }));
      wrapper = mount(<SignUp />);
    })

    it('if the theres processing going on, the input is not editable', () => {

      wrapper.setState({ loading: false });
      expect(wrapper.find('input[name="username"]').prop("disabled")).equal(false);
      expect(wrapper.find('input[name="email"]').prop("disabled")).equal(false);
      expect(wrapper.find('input[name="password"]').prop("disabled")).equal(false);
      expect(wrapper.find('input[name="password2"]').prop("disabled")).equal(false);


      wrapper.setState({ loading: true });
      expect(wrapper.find('input[name="username"]').prop("disabled")).equal("disabled");
      expect(wrapper.find('input[name="email"]').prop("disabled")).equal("disabled");
      expect(wrapper.find('input[name="password"]').prop("disabled")).equal("disabled");
      expect(wrapper.find('input[name="password2"]').prop("disabled")).equal("disabled");

    })

    it('if the theres a form error, the error should show', () => {

      expect(wrapper.find('span.label').length).equal(0);

      wrapper.setState({ username_error: "Error" });
      expect(wrapper.find('span.label').length).equal(1);

      wrapper.setState({ email_error: "Error" });
      expect(wrapper.find('span.label').length).equal(2);

      wrapper.setState({ password_error: "Error" });
      expect(wrapper.find('span.label').length).equal(3);

      wrapper.setState({ password2_error: "Error" });
      expect(wrapper.find('span.label').length).equal(4);

    })

    it('if the theres a flash message, expect the .message class, otherwise dont', () => {

      wrapper.setState({ general_msg: false });
      expect(wrapper.find('.message').length).equal(0);

      wrapper.setState({ general_msg: "A flash message" });
      expect(wrapper.find('.message').length).equal(1);

    })

  })

  describe('Flash Message Behaviour', () => {

    beforeEach(() => {
      localStorage.setItem("globals", JSON.stringify({ "flash": "Message", "logged_in": false }));
      wrapper = mount(<SignUp />)
    })

    it('if the theres a flash message from a previous route, it should be displayed', () => {

      expect(wrapper.find('.alert.message').length).equal(1);
      expect(wrapper.find('.alert.message').html()).contain("Message");

    })

  })

  describe('API interaction Behaviour', () => {

    beforeEach(() => {
      localStorage.setItem("globals", JSON.stringify({ "logged_in": false }));
    })

    it('form submission done properly and success responses are handled properly', (done) => {

      fetchMock.post(GLOBAL.baseUrl + "/v1/auth/register", {
        status: 200,
        body: { success: "Were here" }
      })

      wrapper = mount(<SignUp />)

      wrapper.find('input[name="username"]').simulate("change", { target: { value: "vince", name: "username" } });
      wrapper.find('input[name="email"]').simulate("change", { target: { value: "vince@gmail.com", name: "email" } });
      wrapper.find('input[name="password"]').simulate("change", { target: { value: "vince_password", name: "password" } });
      wrapper.find('input[name="password2"]').simulate("change", { target: { value: "vince_password", name: "password2" } });

      wrapper.find('form').simulate("submit", { preventDefault() { } });
      expect(wrapper.state().loading).equal(true);

      setTimeout(function () {

        expect(wrapper.state().general_msg).equal("Were here");
        expect(wrapper.state().loading).equal(false);
        expect(wrapper.find(".message").length).equal(1);

        expect(fetchMock.called()).equal(true);
        expect(fetchMock.lastUrl()).equal(GLOBAL.baseUrl + "/v1/auth/register");

        done();

      }, 100);

    })


    it('form submission done properly and error responses are handled properly', (done) => {

      fetchMock.post(GLOBAL.baseUrl + "/v1/auth/register", {
        status: 200,
        body: { error: "Were here" }
      })

      wrapper = mount(<SignUp />)

      wrapper.find('input[name="username"]').simulate("change", { target: { value: "vince", name: "username" } });
      wrapper.find('input[name="email"]').simulate("change", { target: { value: "vince@gmail.com", name: "email" } });
      wrapper.find('input[name="password"]').simulate("change", { target: { value: "vince_password", name: "password" } });
      wrapper.find('input[name="password2"]').simulate("change", { target: { value: "vince_password", name: "password2" } });

      wrapper.find('form').simulate("submit", { preventDefault() { } });

      setTimeout(function () {

        expect(wrapper.state().general_msg).equal("Were here");
        expect(wrapper.find(".message").length).equal(1);

        expect(wrapper.state().loading).equal(false);
        expect(fetchMock.called()).equal(true);
        expect(fetchMock.lastUrl()).equal(GLOBAL.baseUrl + "/v1/auth/register");

        done();

      }, 100);

    })


    it('form submission done properly and form error message responses are handled properly', (done) => {

      fetchMock.post(GLOBAL.baseUrl + "/v1/auth/register", {
        status: 200,
        body: { error: { username: ["Username error"], email: ["Email error"], password: ["Password error"], password2: ["Password2 error"] } }
      })

      wrapper = mount(<SignUp />)

      wrapper.find('input[name="username"]').simulate("change", { target: { value: "vince", name: "username" } });
      wrapper.find('input[name="email"]').simulate("change", { target: { value: "vince@gmail.com", name: "email" } });
      wrapper.find('input[name="password"]').simulate("change", { target: { value: "vince_password", name: "password" } });
      wrapper.find('input[name="password2"]').simulate("change", { target: { value: "vince_password", name: "password2" } });

      wrapper.find('form').simulate("submit", { preventDefault() { } });
      expect(wrapper.state().loading).equal(true);

      setTimeout(function () {

        expect(wrapper.state().loading).equal(false);

        expect(wrapper.state().username_error).equal("Username error");
        expect(wrapper.state().email_error).equal("Email error");
        expect(wrapper.state().password_error).equal("Password error");
        expect(wrapper.state().password2_error).equal("Password2 error");

        expect(wrapper.find("span.label").length).equal(4);

        expect(fetchMock.called()).equal(true);
        expect(fetchMock.lastUrl()).equal(GLOBAL.baseUrl + "/v1/auth/register");

        done();

      }, 100);

    })

    it('form submission done properly and form error message responses are handled properly', (done) => {

      fetchMock.post(GLOBAL.baseUrl + "/v1/auth/register", {
        status: 200,
        body: "Unauthorized access"
      })

      wrapper = mount(<SignUp />)

      wrapper.find('input[name="username"]').simulate("change", { target: { value: "vince", name: "username" } });
      wrapper.find('input[name="email"]').simulate("change", { target: { value: "vince@gmail.com", name: "email" } });
      wrapper.find('input[name="password"]').simulate("change", { target: { value: "vince_password", name: "password" } });
      wrapper.find('input[name="password2"]').simulate("change", { target: { value: "vince_password", name: "password2" } });

      wrapper.find('form').simulate("submit", { preventDefault() { } });
      expect(wrapper.state().loading).equal(true);

      setTimeout(function () {

        expect(wrapper.state().general_msg).equal("Check your internet connection and try again");

        expect(wrapper.state().loading).equal(false);
        expect(wrapper.find(".message").length).equal(1);

        expect(fetchMock.called()).equal(true);
        expect(fetchMock.lastUrl()).equal(GLOBAL.baseUrl + "/v1/auth/register");

        done();

      }, 100);

    })

    afterEach(() => {
      expect(fetchMock.calls().unmatched).to.be.empty;
      fetchMock.restore();
    })

  })


})