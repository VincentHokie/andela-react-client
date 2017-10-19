import React from 'react';
import { shallow, mount, render } from 'enzyme';

import Navigation from '../navigation.component.js';

import App from '../../App.js';

import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import fetchMock from "fetch-mock";

import "../localStorage.js";

var GLOBAL = require("../../globals.js")

var expect = require("chai").expect;

describe('Navigation bar', () => {
  let wrapper;

  beforeEach(() => {
    localStorage.setItem("globals", JSON.stringify({ "logged_in": false }));
  })

  it('wraps content in a nav', () => {

    wrapper = mount(<Navigation />)
    expect(wrapper.find('nav').length).equal(1);

  });

  describe('Behaviour', () => {

    beforeEach(() => {
      localStorage.setItem("globals", JSON.stringify({ "logged_in": false }));
    })

    it('Ensure usename properly shows', () => {

      wrapper = mount(<Navigation username="SomeName" />)
      expect(wrapper.find("ul li a").first().text()).contain(" Welcome  SomeName");

    })

  })


  describe('API interaction Behaviour', () => {

    beforeEach(() => {
      localStorage.setItem("globals", JSON.stringify({ "logged_in": false }));
    })

    it('form submission done properly and success responses are handled properly', (done) => {

      fetchMock.post(GLOBAL.baseUrl + "/v1/auth/logout", {
        status: 200,
        body: { success: "You have successfully logged out" }

      })

      wrapper = mount(<Navigation username="SomeName" />)
      wrapper.instance().logout(wrapper.instance());

      expect(wrapper.state().loading).equal(true);

      setTimeout(() => {

        //expect( wrapper.state().general_msg ).equal("You have successfully logged out");
        expect(wrapper.state().loading).equal(false);

        expect(fetchMock.called()).equal(true);
        expect(fetchMock.lastUrl()).equal(GLOBAL.baseUrl + "/v1/auth/logout");

        done();

      }, 100)

    })


    it('form submission done properly and error responses are handled properly', (done) => {

      fetchMock.post(GLOBAL.baseUrl + "/v1/auth/logout", {
        status: 200,
        body: { error: "Something went wrong" }
      })

      wrapper = mount(<Navigation username="SomeName" />)
      wrapper.instance().logout(wrapper.instance());

      expect(wrapper.state().loading).equal(true);

      setTimeout(function () {

        expect(wrapper.state().loading).equal(false);

        expect(fetchMock.called()).equal(true);
        expect(fetchMock.lastUrl()).equal(GLOBAL.baseUrl + "/v1/auth/logout");

        done();

      }, 100);

    })

    it('form submission done properly and form error message responses are handled properly', (done) => {

      fetchMock.post(GLOBAL.baseUrl + "/v1/auth/logout", {
        status: 401,
        body: "Unauthorized access"
      })

      wrapper = mount(<Navigation username="SomeName" />)
      wrapper.instance().logout(wrapper.instance());

      expect(wrapper.state().loading).equal(true);

      setTimeout(function () {

        expect(wrapper.state().general_msg).equal("Check your internet connection and try again");
        expect(wrapper.state().loading).equal(false);

        expect(fetchMock.called()).equal(true);
        expect(fetchMock.lastUrl()).equal(GLOBAL.baseUrl + "/v1/auth/logout");

        done();

      }, 100);

    })

    afterEach(() => {
      expect(fetchMock.calls().unmatched).to.be.empty;
      fetchMock.restore();
    })

  })


})
