import React from 'react';
import { shallow, mount, render } from 'enzyme';

import Navigation from '../navigation.component.jsx';

import App from '../../App.js';

import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import fetchMock from "fetch-mock";


var GLOBAL = require("../../globals.js")

var expect = require("chai").expect;

describe('Navigation bar', () => {
  let wrapper;

  it('wraps content in a nav', () => {

    wrapper = shallow(<Navigation />)
    expect(wrapper.find('nav').length).equal(1);

  });

  describe('Behaviour', () => {

    it('Ensure usename properly shows', () => {

      wrapper = shallow(<Navigation username="SomeName" />)
      expect(wrapper.find("ul li a").first().text()).contain(" Welcome  SomeName");
      
    })


    })


  describe('API interaction Behaviour', () => {

    it('form submission done properly and success responses are handled properly', async () => {

      fetchMock.post("https://andela-flask-api.herokuapp.com/auth/logout", {
        status: 200,
        body: { success:"You have successfully logged out" }
      })

      wrapper = mount(<Navigation username="SomeName" />)
      wrapper.instance().logout(wrapper.instance());

      expect( wrapper.state().loading ).equal(true);

      await
      
      setTimeout(() => {
      
        expect( wrapper.state().general_msg ).equal("You have successfully logged out");
        expect( wrapper.state().loading ).equal(false);

        expect(fetchMock.called()).equal(true);
        expect(fetchMock.lastUrl()).equal("https://andela-flask-api.herokuapp.com/auth/logout");

      }, 1000)

    })


    it('form submission done properly and error responses are handled properly', async () => {
      
      fetchMock.post("https://andela-flask-api.herokuapp.com/auth/logout", {
        status: 200,
        body: { error:"Something went wrong" }
      })
      
      wrapper = mount(<Navigation username="SomeName" />)
      wrapper.instance().logout(wrapper.instance());

      expect( wrapper.state().loading ).equal(true);

      await
      
      setTimeout(function(){

        expect( wrapper.state().loading ).equal(true);
        expect( wrapper.state().general_msg ).equal("Something went wrong");
        expect( wrapper.find(".message").length ).equal(1);

        expect(fetchMock.called()).equal(true);
        expect(fetchMock.lastUrl()).equal("https://andela-flask-api.herokuapp.com/auth/logout");

      }, 100);

    })

    it('form submission done properly and form error message responses are handled properly', async () => {
      
      fetchMock.post("https://andela-flask-api.herokuapp.com/auth/logout", {
        status: 401,
        body: "Unauthorized access"
      })

      wrapper = mount(<Navigation username="SomeName" />)
      wrapper.instance().logout(wrapper.instance());

      expect( wrapper.state().loading ).equal(true);

      await
      
      setTimeout(function(){

        expect( wrapper.state().general_msg ).equal("Check your internet connection and try again");
        expect( wrapper.state().loading ).equal(false);
        expect( wrapper.find(".message").length ).equal(1);

        expect(fetchMock.called()).equal(true);
        expect(fetchMock.lastUrl()).equal("https://andela-flask-api.herokuapp.com/auth/logout");

      }, 100);

    })

    afterEach(() => {
      expect(fetchMock.calls().unmatched).to.be.empty;
      fetchMock.restore();
    })

  })


})
