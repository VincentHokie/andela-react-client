import React from 'react';
import { shallow, mount, render } from 'enzyme';

import CreateShoppingList from '../create_shopping_list.component.jsx';

import App from '../../App.js';

import { BrowserRouter, MemoryRouter } from 'react-router-dom'

var GLOBAL = require("../../globals.js")

var fetchMock = require("fetch-mock");

describe('Create Shopping list', () => {
  let wrapper;

  it('wraps content in a div with .col-xs-12 class if user is logged in', () => {

    GLOBAL.LOGGED_IN = true
    wrapper = shallow(<CreateShoppingList />)
    expect(wrapper.find('.container.col-xs-12').length).toEqual(1);

  });

  it('wraps content in a Redirect is not logged in', () => {

    GLOBAL.LOGGED_IN = false
    wrapper = shallow(<CreateShoppingList />)
    expect(wrapper.find('Redirect').length).toEqual(1);

  });

  describe('Behaviour', () => {
  	
    beforeEach(() => GLOBAL.LOGGED_IN = true )

    it('if the theres processing going on, the input is not editable', () => {

      wrapper = shallow(<CreateShoppingList />)

      wrapper.setState({ loading: false });
      expect(wrapper.find('input').prop("disabled")).toEqual(false);

      wrapper.setState({ loading: true });
      expect(wrapper.find('input').prop("disabled")).toEqual("disabled");
      
    })

    it('if the theres a form error, the error should show', () => {
      
      wrapper = shallow(<CreateShoppingList />)

      wrapper.setState({ name_error: false });
      expect(wrapper.find('FormError').length).toEqual(0);

      wrapper.setState({ name_error: "Error" });
      expect(wrapper.find('FormError').length).toEqual(1);
      
    })

    it('if the theres a flash message, expect the .message class, otherwise dont', () => {

      wrapper = shallow(<CreateShoppingList />)
      
      wrapper.setState({ general_msg: false });
      expect(wrapper.find('FlashMsg').length).toEqual(0);

      wrapper.setState({ general_msg: "A flash message" });
      expect(wrapper.find('FlashMsg').length).toEqual(1);
      
    })

    describe('Flash Message Behaviour', () => {
    
    beforeEach(() => {
      GLOBAL.LOGGED_IN = true;
      GLOBAL.FLASH = "Message"
      wrapper = mount(<BrowserRouter><CreateShoppingList /></BrowserRouter>)
    })

    it('if the theres processing going on, the input is not editable', () => {

      expect(wrapper.find('.alert.message').length).toEqual(1);
      expect(wrapper.find('.alert.message').html()).toContain("Message");
      
    })

  })

  describe('API interaction Behaviour', () => {
    
    beforeEach(() => {
      GLOBAL.LOGGED_IN = true;
    })

    it('form submission done properly and success responses are handled properly', async () => {

      fetchMock.post("https://andela-flask-api.herokuapp.com/shoppinglists", {
        status: 200,
        body: { success:"Were here" }
      })

      wrapper = shallow(<CreateShoppingList />)

      var input = wrapper.find('input');
      input.simulate("change", {target: {value: "vince@gmail.com"}});

      wrapper.find('form').simulate("submit", { preventDefault() {} });
      wrapper.setState({ general_msg: "Were here"});

      await

      
      wrapper.update();
      expect( wrapper.find("FlashMsg").length ).toEqual(1);

      expect(fetchMock.called()).toEqual(true);
      expect(fetchMock.lastUrl()).toEqual("https://andela-flask-api.herokuapp.com/shoppinglists");

    })


    it('form submission done properly and error responses are handled properly', async () => {
      
      fetchMock.post("https://andela-flask-api.herokuapp.com/shoppinglists", {
        status: 200,
        body: { error:"Were here" }
      })
      
      wrapper = shallow(<CreateShoppingList />)

      var input = wrapper.find('input');
      input.simulate("change", {target: {value: "vince@gmail.com"}});

      wrapper.find('form').simulate("submit", { preventDefault() {} });
      wrapper.setState({ general_msg: "Were here"});

      await

      
      wrapper.update();
      expect( wrapper.find("FlashMsg").length ).toEqual(1);

      expect(fetchMock.called()).toEqual(true);
      expect(fetchMock.lastUrl()).toEqual("https://andela-flask-api.herokuapp.com/shoppinglists");

    })


    it('form submission done properly and form error message responses are handled properly', async () => {
      
      fetchMock.post("https://andela-flask-api.herokuapp.com/shoppinglists", {
        status: 200,
        body: { error: { name : ["Were here"] } }
      })

      wrapper = shallow(<CreateShoppingList />)

      var input = wrapper.find('input');
      input.simulate("change", {target: {value: "vince@gmail.com"}});

      wrapper.find('form').simulate("submit", { preventDefault() {} });
      wrapper.setState({ name_error: "Were here"});

      await

      
      wrapper.update();
      expect( wrapper.find("FormError").length ).toEqual(1);

      expect(fetchMock.called()).toEqual(true);
      expect(fetchMock.lastUrl()).toEqual("https://andela-flask-api.herokuapp.com/shoppinglists");

    })

    it('form submission done properly and form error message responses are handled properly', async () => {
      
      fetchMock.post("https://andela-flask-api.herokuapp.com/shoppinglists", {
        status: 200,
        body: "Unauthorized access"
      })

      wrapper = shallow(<CreateShoppingList />)

      var input = wrapper.find('input');
      input.simulate("change", {target: {value: "vince@gmail.com"}});

      wrapper.find('form').simulate("submit", { preventDefault() {} });
      wrapper.setState({ general_msg: "Unauthorized access"});

      await

      
      wrapper.update();
      expect( wrapper.find("FlashMsg").length ).toEqual(1);

      expect(fetchMock.called()).toEqual(true);
      expect(fetchMock.lastUrl()).toEqual("https://andela-flask-api.herokuapp.com/shoppinglists");

    })

    afterEach(() => {
      expect(fetchMock.calls().unmatched).toEqual([]);
      fetchMock.restore();
    })

  })

  })

  


})