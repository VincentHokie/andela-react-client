import React from 'react';
import { shallow, mount, render } from 'enzyme';

import EmailConfirm from '../email_confirm.component.jsx';

import App from '../../App.js';

import { BrowserRouter, MemoryRouter } from 'react-router-dom'

var GLOBAL = require("../../globals.js")

var nock = require("nock");

describe('Create Shopping list', () => {
  let wrapper;

  it('wraps content in a div with .col-xs-12 class if user is logged in', () => {

    GLOBAL.LOGGED_IN = false
    wrapper = shallow(<EmailConfirm />)
    expect(wrapper.find('.container.col-xs-12').length).toEqual(1);

  });

  it('wraps content in a Redirect is not logged in', () => {

    GLOBAL.LOGGED_IN = true
    wrapper = shallow(<EmailConfirm />)
    expect(wrapper.find('Redirect').length).toEqual(1);

  });

  describe('Behaviour', () => {
  	
    beforeEach(() => GLOBAL.LOGGED_IN = false )
    beforeEach(() => wrapper = shallow(<EmailConfirm />))

    it('if the theres processing going on, the input is not editable', () => {

      

      wrapper.setState({ loading: false });
      expect(wrapper.find('input').prop("disabled")).toEqual(false);

      wrapper.setState({ loading: true });
      expect(wrapper.find('input').prop("disabled")).toEqual("disabled");
      
    })

    it('if the theres a form error, the error should show', () => {
      

      wrapper.setState({ email_error: false });
      expect(wrapper.find('FormError').length).toEqual(0);

      wrapper.setState({ email_error: "Error" });
      expect(wrapper.find('FormError').length).toEqual(1);
      
    })

    it('if the theres a flash message, expect the .message class, otherwise dont', () => {

      
      wrapper.setState({ general_msg: false });
      expect(wrapper.find('FlashMsg').length).toEqual(0);

      wrapper.setState({ general_msg: "A flash message" });
      expect(wrapper.find('FlashMsg').length).toEqual(1);
      
    })

    it('form submission done properly and responses are handled properly', () => {
      

      wrapper.setState({ email: "An email" });
      
      expect(wrapper.state().loading).toEqual(false);
      var email_verify = nock("https://andela-flask-api.herokuapp.com")
                      .post("/auth/reset-password")
                      .reply(200, {
                        "success":"Were here"
                      })

      wrapper.instance().handleSubmit();
      expect(wrapper.state().loading).toEqual(true);
      

      //console.log("is done?: "+email_verify.isDone() );
      // expect(wrapper.state().loading).toEqual(false);

      //console.log(console.log(email_verify))
      //console.log(wrapper.html());

      //expect(wrapper.state().general_msg).toEqual("Were here");
      //expect(wrapper.find('Link').prop("to")).toBe("/shopping-list/"+ list_object.list_id +"/edit");

    })

  })

  


})