import React from 'react';
import { shallow, mount, render } from 'enzyme';

import UpdateShoppingList from '../update_shopping_list.component.jsx';

import App from '../../App.js';

import { BrowserRouter, MemoryRouter } from 'react-router-dom'

var GLOBAL = require("../../globals.js")

var fetchMock = require("fetch-mock");

describe('Update Shopping list', () => {
  let wrapper;

  it('wraps content in a div with .col-xs-12 class if user is logged in', () => {

    GLOBAL.LOGGED_IN = true
    wrapper = shallow(<UpdateShoppingList />)
    expect(wrapper.find('.container.col-xs-12').length).toEqual(1);

  });

  it('wraps content in a Redirect is not logged in', () => {

    GLOBAL.LOGGED_IN = false
    wrapper = shallow(<UpdateShoppingList />)
    expect(wrapper.find('Redirect').length).toEqual(1);

  });

  describe('Behaviour', () => {
  	
    beforeEach(() => GLOBAL.LOGGED_IN = true )
    beforeEach(() => wrapper = shallow(<UpdateShoppingList />))

    it('if the theres processing going on, the input is not editable', () => {

      wrapper.setState({ loading: false });
      wrapper.setState({ retrieved: true });
      expect(wrapper.find('input[name="name"]').prop("disabled")).toEqual(false);

      wrapper.setState({ loading: true });
      expect(wrapper.find('input[name="name"]').prop("disabled")).toEqual("disabled");

      wrapper.setState({ loading: false });
      wrapper.setState({ retrieved: false });
      expect(wrapper.find('input[name="name"]').prop("disabled")).toEqual("disabled");
      
    })

    it('if the theres a form error, the error should show', () => {

      expect(wrapper.find('FormError').length).toEqual(0);

      wrapper.setState({ name_error: "Error" });
      expect(wrapper.find('FormError').length).toEqual(1);
      
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
      GLOBAL.LOGGED_IN = true;
      GLOBAL.FLASH = "Message"
      wrapper = mount(<MemoryRouter initialEntries={[ '/shopping-list/1/edit' ]}><App /></MemoryRouter>)
    })

    it('if the theres processing going on, the input is not editable', () => {

      expect(wrapper.find('.alert.message').length).toEqual(1);
      expect(wrapper.find('.alert.message').html()).toContain("Message");
      
    })

  })

  describe('API interaction Behaviour', () => {
    let list_data, item_data;

    beforeEach(() => {

      GLOBAL.LOGGED_IN = true;
      list_data = '{"list_id": "1","name":"Honda Accord Crosstour"}';

    })

    afterEach(() => {

       expect(fetchMock.calls().unmatched).toEqual([]);
        fetchMock.restore();

    })

    it('form submission done properly and success responses are handled properly', async () => {

      fetchMock.get("https://andela-flask-api.herokuapp.com/shoppinglists?list_id=1", {
        status: 200,
        body: list_data
      })

      wrapper = mount(<MemoryRouter initialEntries={[ '/shopping-list/1/edit' ]}><App /></MemoryRouter>)

      await
      
      wrapper.update();
      //wrapper = shallow(<UpdateShoppingList />)


      expect( wrapper.find("input").node.value ).toEqual(15);

      expect(fetchMock.called()).toEqual(true);
      expect(fetchMock.lastUrl()).toEqual("https://andela-flask-api.herokuapp.com/shoppinglists?list_id=1");

    })
    
    it('form submission done properly and success responses are handled properly', async () => {

      fetchMock.get("https://andela-flask-api.herokuapp.com/shoppinglists?list_id=1", {
        status: 401,
        body: "Unauthorized access"
      })

      wrapper = mount(<MemoryRouter initialEntries={[ '/shopping-list/1/edit' ]}><App /></MemoryRouter>)
      wrapper.setState({ general_msg: "Unauthorized access"});

      await
      
      wrapper.update();
      //expect( wrapper.find(".message").length ).toEqual(1);

      //console.log( wrapper.html() )
      expect(fetchMock.called()).toEqual(true);
      expect(fetchMock.lastUrl()).toEqual("https://andela-flask-api.herokuapp.com/shoppinglists?list_id=1");

    })



    it('form submission done properly and error responses are handled properly', async () => {
      
      fetchMock.put("https://andela-flask-api.herokuapp.com/shoppinglists/1", {
        status: 200,
        body: { success:"Were here" }
      })
      
      wrapper = shallow(<UpdateShoppingList />)
      wrapper.setProps({ match: { params : {id: 1 } } });

      wrapper.find('input[name="name"]').simulate("change", {target: {value: "vince"}});

      //expect(wrapper.state().loading).toEqual(false);
      wrapper.find('form').simulate("submit", { preventDefault() {} });
      wrapper.setState({ general_msg: "Were here"});

      await

      wrapper.update();
      expect( wrapper.find("FlashMsg").length ).toEqual(1);

      expect(fetchMock.called()).toEqual(true);
      expect(fetchMock.lastUrl()).toEqual("https://andela-flask-api.herokuapp.com/shoppinglists/1");

    })


    it('form submission done properly and error responses are handled properly', async () => {
      
      fetchMock.put("https://andela-flask-api.herokuapp.com/shoppinglists/1", {
        status: 200,
        body: { error:"Were here" }
      })
      
      wrapper = shallow(<UpdateShoppingList />)
      wrapper.setProps({ match: { params : {id: 1 } } });

      wrapper.find('input[name="name"]').simulate("change", {target: {value: "vince"}});

      //expect(wrapper.state().loading).toEqual(false);
      wrapper.find('form').simulate("submit", { preventDefault() {} });
      wrapper.setState({ general_msg: "Were here"});

      await
      
      wrapper.update();
      expect( wrapper.find("FlashMsg").length ).toEqual(1);

      expect(fetchMock.called()).toEqual(true);
      expect(fetchMock.lastUrl()).toEqual("https://andela-flask-api.herokuapp.com/shoppinglists/1");

    })

    it('form submission done properly and error responses are handled properly', async () => {
      
      fetchMock.put("https://andela-flask-api.herokuapp.com/shoppinglists/1", {
        status: 200,
        body: "Unauthorized access"
      })
      
      wrapper = shallow(<UpdateShoppingList />)
      wrapper.setProps({ match: { params : {id: 1 } } });

      wrapper.find('input[name="name"]').simulate("change", {target: {value: "vince"}});

      //expect(wrapper.state().loading).toEqual(false);
      wrapper.find('form').simulate("submit", { preventDefault() {} });
      wrapper.setState({ general_msg: "Were here"});

      await
      
      wrapper.update();
      expect( wrapper.find("FlashMsg").length ).toEqual(1);

      expect(fetchMock.called()).toEqual(true);
      expect(fetchMock.lastUrl()).toEqual("https://andela-flask-api.herokuapp.com/shoppinglists/1");

    })


    it('form submission done properly and form error message responses are handled properly', async () => {
      
      fetchMock.put("https://andela-flask-api.herokuapp.com/shoppinglists/1", {
        status: 200,
        body: { error: { name : ["Name error"] } }
      })

      wrapper = shallow(<UpdateShoppingList />)
      wrapper.setProps({ match: { params : {id: 1 } } });

      wrapper.find('input[name="name"]').simulate("change", {target: {value: "vince"}});

      //expect(wrapper.state().loading).toEqual(false);
      wrapper.find('form').simulate("submit", { preventDefault() {} });
      wrapper.setState({ name_error: "Name error"});

      await

      wrapper.update();
      expect( wrapper.find("FormError").length ).toEqual(1);

      expect(fetchMock.called()).toEqual(true);
      expect(fetchMock.lastUrl()).toEqual("https://andela-flask-api.herokuapp.com/shoppinglists/1");

    })

    it('form submission done properly and form error message responses are handled properly', async () => {
      
      fetchMock.post("https://andela-flask-api.herokuapp.com/shoppinglists/1/items", {
        status: 200,
        body: "Unauthorized access"
      })

      wrapper = shallow(<UpdateShoppingList />)
      wrapper.setProps({ match: { params : {id: 1 } } });

      wrapper.find('input[name="name"]').simulate("change", {target: {value: "vince"}});

      //expect(wrapper.state().loading).toEqual(false);
      wrapper.find('form').simulate("submit", { preventDefault() {} });
      wrapper.setState({ general_msg: "Unauthorized access"});

      await

      wrapper.update();
      expect( wrapper.find("FlashMsg").length ).toEqual(1);

      expect(fetchMock.called()).toEqual(true);
      expect(fetchMock.lastUrl()).toEqual("https://andela-flask-api.herokuapp.com/shoppinglists/1/items");

    })

  })



})