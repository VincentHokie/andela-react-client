import React from 'react';
import { shallow, mount, render } from 'enzyme';

import Login from '../login.component.jsx';

import App from '../../App.js';

import { BrowserRouter, MemoryRouter } from 'react-router-dom'

var GLOBAL = require("../../globals.js")

var fetchMock = require("fetch-mock");

describe('Login page', () => {
  let wrapper;

  it('wraps content in a div with .col-xs-12 class if user is logged in', () => {

    GLOBAL.LOGGED_IN = false
    wrapper = shallow(<Login />)
    expect(wrapper.find('.container.col-xs-12').length).toEqual(1);

  });

  it('wraps content in a Redirect is not logged in', () => {

    GLOBAL.LOGGED_IN = true
    wrapper = shallow(<Login />)
    expect(wrapper.find('Redirect').length).toEqual(1);

  });

  describe('State Behaviour', () => {
  	
    beforeEach(() => GLOBAL.LOGGED_IN = false )
    beforeEach(() => wrapper = shallow(<Login />))

    it('if the theres processing going on, the input is not editable', () => {

      wrapper.setState({ loading: false });
      expect(wrapper.find('input[name="username"]').prop("disabled")).toEqual(false);
      expect(wrapper.find('input[name="password"]').prop("disabled")).toEqual(false);

      wrapper.setState({ loading: true });
      expect(wrapper.find('input[name="username"]').prop("disabled")).toEqual("disabled");
      expect(wrapper.find('input[name="password"]').prop("disabled")).toEqual("disabled");
      
    })

    it('if the theres a form error, the error should show', () => {
      
      expect(wrapper.find('FormError').length).toEqual(0);

      wrapper.setState({ username_error: "Error" });
      expect(wrapper.find('FormError').length).toEqual(1);

      wrapper.setState({ password_error: "Error" });
      expect(wrapper.find('FormError').length).toEqual(2);
      
    })

    it('if the theres a flash message, expect the .message class, otherwise dont', () => {
      
      wrapper.setState({ general_msg: false });
      expect(wrapper.find('FlashMsg').length).toEqual(0);

      wrapper.setState({ general_msg: "A flash message" });
      expect(wrapper.find('FlashMsg').length).toEqual(1);
      
    })

  })

  describe('Flash Message Behaviour', () => {
    
    beforeEach(() => {
      GLOBAL.LOGGED_IN = false;
      GLOBAL.FLASH = "Message"
      wrapper = mount(<BrowserRouter><Login /></BrowserRouter>)
    })

    it('if the theres processing going on, the input is not editable', () => {

      expect(wrapper.find('.alert.message').length).toEqual(1);
      expect(wrapper.find('.alert.message').html()).toContain("Message");
      
    })

  })

  describe('API interaction Behaviour', () => {
    
    beforeEach(() => {
      GLOBAL.LOGGED_IN = false;
    })

    it('form submission done properly and success responses are handled properly', async (done) => {

      fetchMock.post("https://andela-flask-api.herokuapp.com/auth/login", {
        status: 200,
        body: { success:"Were here", token:"a-super-sercret-access-token" }
      })

      wrapper = shallow(<Login />)

      wrapper.find('input[name="username"]').simulate("change", {target: {value: "vince"}});
      wrapper.find('input[name="password"]').simulate("change", {target: {value: "vince_password"}});

      wrapper.find('form').simulate("submit", { preventDefault() {} });
      wrapper.setState({ general_msg: "Were here"});

      await
      
      setTimeout( () => {

        wrapper.update();
        expect( wrapper.find("FlashMsg").length ).toEqual(1);

        expect(fetchMock.called()).toEqual(true);
        expect(fetchMock.lastUrl()).toEqual("https://andela-flask-api.herokuapp.com/auth/login");

        done();
      }, 3000)
      

    })


    it('form submission done properly and error responses are handled properly', async () => {
      
      fetchMock.post("https://andela-flask-api.herokuapp.com/auth/login", {
        status: 200,
        body: { error:"Were here" }
      })
      
      wrapper = shallow(<Login />)

      wrapper.find('input[name="username"]').simulate("change", {target: {value: "vince"}});
      wrapper.find('input[name="password"]').simulate("change", {target: {value: "vince_password"}});

      wrapper.find('form').simulate("submit", { preventDefault() {} });
      wrapper.setState({ general_msg: "Were here"});

      await
      
      wrapper.update();
      expect( wrapper.find("FlashMsg").length ).toEqual(1);

      expect(fetchMock.called()).toEqual(true);
      expect(fetchMock.lastUrl()).toEqual("https://andela-flask-api.herokuapp.com/auth/login");

    })


    it('form submission done properly and form error message responses are handled properly', async () => {
      
      fetchMock.post("https://andela-flask-api.herokuapp.com/auth/login", {
        status: 200,
        body: { error: { username : ["Username error"], password : ["Password error"] } }
      })

      wrapper = shallow(<Login />)

      wrapper.find('input[name="username"]').simulate("change", {target: {value: "vince"}});
      wrapper.find('input[name="password"]').simulate("change", {target: {value: "vince_password"}});

      wrapper.find('form').simulate("submit", { preventDefault() {} });
      wrapper.setState({ username_error: "Username error"});
      wrapper.setState({ password_error: "Password error"});

      await
      
      wrapper.update();
      expect( wrapper.find("FormError").length ).toEqual(2);

      expect(fetchMock.called()).toEqual(true);
      expect(fetchMock.lastUrl()).toEqual("https://andela-flask-api.herokuapp.com/auth/login");

    })

    it('form submission done properly and form error message responses are handled properly', async () => {
      
      fetchMock.post("https://andela-flask-api.herokuapp.com/auth/login", {
        status: 200,
        body: "Unauthorized access"
      })

      wrapper = shallow(<Login />)

      wrapper.find('input[name="username"]').simulate("change", {target: {value: "vince"}});
      wrapper.find('input[name="password"]').simulate("change", {target: {value: "vince_password"}});

      wrapper.find('form').simulate("submit", { preventDefault() {} });
      wrapper.setState({ general_msg: "Unauthorized access"});

      await
      
      wrapper.update();
      expect( wrapper.find("FlashMsg").length ).toEqual(1);

      expect(fetchMock.called()).toEqual(true);
      expect(fetchMock.lastUrl()).toEqual("https://andela-flask-api.herokuapp.com/auth/login");

    })

    afterEach(() => {
      expect(fetchMock.calls().unmatched).toEqual([]);
      fetchMock.restore();
    })

  })

  


})