import React from 'react';
import { shallow, mount, render } from 'enzyme';

import SignUp from '../sign_up.component.jsx';

import App from '../../App.js';

import { BrowserRouter, MemoryRouter } from 'react-router-dom'

var GLOBAL = require("../../globals.js")

var fetchMock = require("fetch-mock");

describe('Sign Up Component', () => {
  let wrapper;

  it('wraps content in a div with .col-xs-12 class if user is logged in', () => {

    GLOBAL.LOGGED_IN = false
    wrapper = shallow(<SignUp />)
    expect(wrapper.find('.container.col-xs-12').length).toEqual(1);

  });

  it('wraps content in a Redirect is not logged in', () => {

    GLOBAL.LOGGED_IN = true
    wrapper = shallow(<SignUp />)
    expect(wrapper.find('Redirect').length).toEqual(1);

  });

  describe('Behaviour', () => {
  	
    beforeEach(() => GLOBAL.LOGGED_IN = false )
    beforeEach(() => wrapper = shallow(<SignUp />))

    it('if the theres processing going on, the input is not editable', () => {

      wrapper.setState({ loading: false });
      expect(wrapper.find('input[name="username"]').prop("disabled")).toEqual(false);
      expect(wrapper.find('input[name="email"]').prop("disabled")).toEqual(false);
      expect(wrapper.find('input[name="password"]').prop("disabled")).toEqual(false);
      expect(wrapper.find('input[name="password2"]').prop("disabled")).toEqual(false);


      wrapper.setState({ loading: true });
      expect(wrapper.find('input[name="username"]').prop("disabled")).toEqual("disabled");
      expect(wrapper.find('input[name="email"]').prop("disabled")).toEqual("disabled");
      expect(wrapper.find('input[name="password"]').prop("disabled")).toEqual("disabled");
      expect(wrapper.find('input[name="password2"]').prop("disabled")).toEqual("disabled");
      
    })

    it('if the theres a form error, the error should show', () => {

      expect(wrapper.find('FormError').length).toEqual(0);

      wrapper.setState({ username_error: "Error" });
      expect(wrapper.find('FormError').length).toEqual(1);

      wrapper.setState({ email_error: "Error" });
      expect(wrapper.find('FormError').length).toEqual(2);

      wrapper.setState({ password_error: "Error" });
      expect(wrapper.find('FormError').length).toEqual(3);

      wrapper.setState({ password2_error: "Error" });
      expect(wrapper.find('FormError').length).toEqual(4);

    })

    it('if the theres a flash message, expect the .message class, otherwise dont', () => {

      wrapper.setState({ general_msg: false });
      expect(wrapper.find('FlashMsg').length).toEqual(0);

      wrapper.setState({ general_msg: "A flash message" });
      expect(wrapper.find('FlashMsg').length).toEqual(1);
      
    })

    it('form submission done properly and responses are handled properly', () => {
      
      // wrapper.setState({ email: "An email" });
      
      // expect(wrapper.state().loading).toEqual(false);

      // wrapper.instance().handleSubmit();
      // expect(wrapper.state().loading).toEqual(true);
      

      //console.log("is done?: "+email_verify.isDone() );
      // expect(wrapper.state().loading).toEqual(false);

      //console.log(console.log(email_verify))
      //console.log(wrapper.html());

      //expect(wrapper.state().general_msg).toEqual("Were here");
      //expect(wrapper.find('Link').prop("to")).toBe("/shopping-list/"+ list_object.list_id +"/edit");

    })

  })

  describe('Flash Message Behaviour', () => {
    
    beforeEach(() => {
      GLOBAL.LOGGED_IN = false;
      GLOBAL.FLASH = "Message"
      wrapper = mount(<BrowserRouter><SignUp /></BrowserRouter>)
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

      fetchMock.post("https://andela-flask-api.herokuapp.com/auth/register", {
        status: 200,
        body: { success:"Were here" }
      })

      wrapper = shallow(<SignUp />)

      wrapper.find('input[name="username"]').simulate("change", {target: {value: "vince"}});
      wrapper.find('input[name="email"]').simulate("change", {target: {value: "vince@gmail.com"}});
      wrapper.find('input[name="password"]').simulate("change", {target: {value: "vince_password"}});
      wrapper.find('input[name="password2"]').simulate("change", {target: {value: "vince_password"}});

      wrapper.find('form').simulate("submit", { preventDefault() {} });
      wrapper.setState({ general_msg: "Were here"});

      await
      
      setTimeout( () => {

        wrapper.update();
        expect( wrapper.find("FlashMsg").length ).toEqual(1);

        expect(fetchMock.called()).toEqual(true);
        expect(fetchMock.lastUrl()).toEqual("https://andela-flask-api.herokuapp.com/auth/register");

        done();
      }, 3000)
      

    })


    it('form submission done properly and error responses are handled properly', async () => {
      
      fetchMock.post("https://andela-flask-api.herokuapp.com/auth/register", {
        status: 200,
        body: { error:"Were here" }
      })
      
      wrapper = shallow(<SignUp />)

      wrapper.find('input[name="username"]').simulate("change", {target: {value: "vince"}});
      wrapper.find('input[name="email"]').simulate("change", {target: {value: "vince@gmail.com"}});
      wrapper.find('input[name="password"]').simulate("change", {target: {value: "vince_password"}});
      wrapper.find('input[name="password2"]').simulate("change", {target: {value: "vince_password"}});

      wrapper.find('form').simulate("submit", { preventDefault() {} });
      wrapper.setState({ general_msg: "Were here"});

      await
      
      wrapper.update();
      expect( wrapper.find("FlashMsg").length ).toEqual(1);

      expect(fetchMock.called()).toEqual(true);
      expect(fetchMock.lastUrl()).toEqual("https://andela-flask-api.herokuapp.com/auth/register");

    })


    it('form submission done properly and form error message responses are handled properly', async () => {
      
      fetchMock.post("https://andela-flask-api.herokuapp.com/auth/register", {
        status: 200,
        body: { error: { username : ["Username error"], email : ["Email error"], password : ["Password error"], password2 : ["Password2 error"] } }
      })

      wrapper = shallow(<SignUp />)

      wrapper.find('input[name="username"]').simulate("change", {target: {value: "vince"}});
      wrapper.find('input[name="email"]').simulate("change", {target: {value: "vince@gmail.com"}});
      wrapper.find('input[name="password"]').simulate("change", {target: {value: "vince_password"}});
      wrapper.find('input[name="password2"]').simulate("change", {target: {value: "vince_password"}});

      wrapper.find('form').simulate("submit", { preventDefault() {} });
      wrapper.setState({ username_error: "Username error"});
      wrapper.setState({ email_error: "Email error"});
      wrapper.setState({ password_error: "Password error"});
      wrapper.setState({ password2_error: "Password2 error"});

      await
      
      wrapper.update();
      expect( wrapper.find("FormError").length ).toEqual(4);

      expect(fetchMock.called()).toEqual(true);
      expect(fetchMock.lastUrl()).toEqual("https://andela-flask-api.herokuapp.com/auth/register");

    })

    it('form submission done properly and form error message responses are handled properly', async () => {
      
      fetchMock.post("https://andela-flask-api.herokuapp.com/auth/register", {
        status: 200,
        body: "Unauthorized access"
      })

      wrapper = shallow(<SignUp />)

      wrapper.find('input[name="username"]').simulate("change", {target: {value: "vince"}});
      wrapper.find('input[name="email"]').simulate("change", {target: {value: "vince@gmail.com"}});
      wrapper.find('input[name="password"]').simulate("change", {target: {value: "vince_password"}});
      wrapper.find('input[name="password2"]').simulate("change", {target: {value: "vince_password"}});

      wrapper.find('form').simulate("submit", { preventDefault() {} });
      wrapper.setState({ general_msg: "Unauthorized access"});

      await
      
      wrapper.update();
      expect( wrapper.find("FlashMsg").length ).toEqual(1);

      expect(fetchMock.called()).toEqual(true);
      expect(fetchMock.lastUrl()).toEqual("https://andela-flask-api.herokuapp.com/auth/register");

    })

    afterEach(() => {
      expect(fetchMock.calls().unmatched).toEqual([]);
      fetchMock.restore();
    })

  })


})