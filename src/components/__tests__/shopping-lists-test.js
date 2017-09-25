import React from 'react';
import { shallow, mount, render } from 'enzyme';

import ShoppingLists from '../shopping_lists.component.jsx';

import App from '../../App.js';

import { BrowserRouter, MemoryRouter } from 'react-router-dom'


var GLOBAL = require("../../globals.js")

var fetchMock = require("fetch-mock");

var expect = require("chai").expect;

describe('Shopping list', () => {
  let wrapper;

  it('wraps content in a div with .col-xs-12 class if user is logged in', () => {

    localStorage.setItem("globals", JSON.stringify({"logged_in":true}));
    wrapper = shallow(<ShoppingLists />)
    expect(wrapper.find('.sh-list-container').length).equal(1);

  });

  it('wraps content in a Redirect is not logged in', () => {

    localStorage.setItem("globals", JSON.stringify({"logged_in":false}));
    wrapper = shallow(<ShoppingLists />)
    expect(wrapper.find('Redirect').length).equal(1);

  });

  describe('Behaviour', () => {
  	
    beforeEach(() => {
      localStorage.setItem("globals", JSON.stringify({"logged_in":true}));

      fetchMock.get("https://andela-flask-api.herokuapp.com/shoppinglists", {
        status: 200,
        body: []
      })

      fetchMock.get("https://andela-flask-api.herokuapp.com/shoppinglists/items", {
        status: 200,
        body: []
      })

      wrapper = mount(<ShoppingLists />)
    })

    it('if the theres processing going on, the input is not editable', () => {

      wrapper.setState({ loading: false });
      expect(wrapper.find('input[name="name"]').prop("disabled")).equal(false);
      expect(wrapper.find('input[name="amount"]').prop("disabled")).equal(false);

      wrapper.setState({ loading: true });
      expect(wrapper.find('input[name="name"]').prop("disabled")).equal("disabled");
      expect(wrapper.find('input[name="amount"]').prop("disabled")).equal("disabled");
      
    })

    it('if the theres a form error, the error should show', () => {

      expect(wrapper.find('span.label').length).equal(0);

      wrapper.setState({ name_error: "Error" });
      expect(wrapper.find('span.label').length).equal(1);
      
    })

    it('if the theres a flash message, expect the FlashMsg component, otherwise dont', () => {

      wrapper.setState({ general_msg: false });
      expect(wrapper.find('.message').length).equal(0);

      wrapper.setState({ general_msg: "A flash message" });
      expect(wrapper.find('.message').length).equal(1);
      
    })


    it('when we click the button to add a new item, expect the form to show with a .showAddItemForm class', () => {

      expect(wrapper.find('.showAddItemForm').length).equal(0);
      wrapper.find('#create-shopping-list-item').simulate("click", { preventDefault() {} });
      expect(wrapper.find('.showAddItemForm').length).equal(1);
      
    })

    it('when items are showing on a small scree, clicking the back button should hide it again by changing the hide_items state', () => {

      expect(wrapper.state().hide_items).equal(false);
      wrapper.find('#back-to-lists').simulate("click", { preventDefault() {} });
      expect(wrapper.state().hide_items).equal(true);
      
    })
    

    it('shopping list click, sets the currently selected list, its ID and on a small screen hides the shopping lists', () => {

      expect(wrapper.state().chosen_list).equal(false);
      expect(wrapper.state().chosen_list_id).equal(false);
      expect(wrapper.state().hide_items).equal(false);

      wrapper.setState({ small_screen: true });
      wrapper.instance().handleListSelect({
        target: {
          id : 1,
          getAttribute() {
            return "ListName";
          }
        }
      });

      expect(wrapper.state().chosen_list).equal("ListName");
      expect(wrapper.state().chosen_list_id).equal(1);
      expect(wrapper.state().hide_items).equal(true);
      
    })


    it('check that the hide items property has the correct effect', () => {

      expect(wrapper.find(".hideSomething").length).equal(0);
      expect(wrapper.find(".hidden-xs").length).equal(1);
      
      wrapper.setState({ hide_items: true });

      expect(wrapper.find(".hideSomething").length).equal(1);
      expect(wrapper.find(".hidden-xs").length).equal(0);
      
    })

  })

  describe('Flash Message Behaviour', () => {
    
    beforeEach(() => {
      localStorage.setItem("globals", JSON.stringify({"flash":"Message", "logged_in":true}));

      fetchMock.get("https://andela-flask-api.herokuapp.com/shoppinglists", {
        status: 200,
        body: []
      })

      fetchMock.get("https://andela-flask-api.herokuapp.com/shoppinglists/items", {
        status: 200,
        body: []
      })

      wrapper = mount(<ShoppingLists />)
    })

    it('if the theres processing going on, the input is not editable', () => {

      expect(wrapper.find('.message').length).equal(1);
      expect(wrapper.state().general_msg).equal("Message");
      
    })

  })

  
  describe('API interaction Behaviour', () => {
    let list_data, item_data;

    beforeEach(() => {
      localStorage.setItem("globals", JSON.stringify({"logged_in":true}));

  list_data = '[{"list_id": "1","name":"Honda Accord Crosstour"},{"list_id": "2","name":"Mercedes-Benz AMG GT Coupe"},{"list_id": "3","name":"BMW X6 SUV"},{"list_id": "4","name":"Ford Edge SUV"},{"list_id": "5","name":"Dodge Viper Coupe"}]';

  item_data = '[{"item_id":"1","name":"item 1 list 1","amount":"100","list_id":"1","checked":"false"},{"item_id":"2","name":"item 2 list 1","amount":"100","list_id":"1","checked":"false"},{"item_id":"3","name":"item 3 list 2","amount":"100","list_id":"2","checked":"false"},{"item_id":"4","name":"item 4 list 2","amount":"100","list_id":"2","checked":"false"},{"item_id":"5","name":"item 5 list 3","amount":"100","list_id":"3","checked":"false"},{"item_id":"6","name":"item 6 list 3","amount":"100","list_id":"3","checked":"false"},{"item_id":"7","name":"item 7 list 4","amount":"100","list_id":"4","checked":"false"},{"item_id":"8","name":"item 8 list 4","amount":"100","list_id":"4","checked":"false"},{"item_id":"9","name":"item 9 list 5","amount":"100","list_id":"5","checked":"false"},{"item_id":"10","name":"item 10 list 5","amount":"100","list_id":"5","checked":"false"},{"item_id":"11","name":"item 11 list 1","amount":"100","list_id":"1","checked":"true"},{"item_id":"12","name":"item 12 list 2","amount":"100","list_id":"2","checked":"true"},{"item_id":"13","name":"item 13 list 3","amount":"100","list_id":"3","checked":"true"},{"item_id":"14","name":"item 14 list 4","amount":"100","list_id":"4","checked":"true"},{"item_id":"15","name":"item 15 list 5","amount":"100","list_id":"5","checked":"true"}]';


    })

    afterEach(() => {
       expect(fetchMock.calls().unmatched).to.be.empty;
      fetchMock.restore();
    })

    it('form submission done properly and success responses are handled properly', async () => {

      fetchMock.get("https://andela-flask-api.herokuapp.com/shoppinglists", {
        status: 200,
        body: list_data
      })

      fetchMock.get("https://andela-flask-api.herokuapp.com/shoppinglists/items", {
        status: 200,
        body: item_data
      })

      wrapper = mount(<ShoppingLists />)

      expect( wrapper.state().loading ).equal(true);

      await
      
      setTimeout(function(){

        expect( wrapper.state().loading ).equal(true);

        expect( wrapper.state().list_data ).equal(JSON.parse(list_data));
        expect( wrapper.state().item_data ).equal(JSON.parse(item_data));

        expect( wrapper.find(".shopping-list-items").length ).equal(15);
        expect( wrapper.find(".shopping-list").length ).equal(5);

        expect(fetchMock.called()).equal(true);
        expect(fetchMock.lastUrl()).equal("https://andela-flask-api.herokuapp.com/shoppinglists/items");

      }, 100);

    })
    
    it('form submission done properly and success responses are handled properly', async () => {

      fetchMock.get("https://andela-flask-api.herokuapp.com/shoppinglists", {
        status: 401,
        body: "Unauthorized access"
      })

      fetchMock.get("https://andela-flask-api.herokuapp.com/shoppinglists/items", {
        status: 401,
        body: "Unauthorized access"
      })

      wrapper = mount(<ShoppingLists />)
      expect( wrapper.state().loading ).equal(true);
      

      await
      
      setTimeout(function(){

        expect( wrapper.state().loading ).equal(false);

        expect( wrapper.state().general_msg ).equal("Check your internet connection and try again");

        expect(fetchMock.called()).equal(true);
        expect(fetchMock.lastUrl()).equal("https://andela-flask-api.herokuapp.com/shoppinglists/items");

      }, 100);

    })



    it('form submission done properly and error responses are handled properly', async () => {
      
      fetchMock.post("https://andela-flask-api.herokuapp.com/shoppinglists/1/items", {
        status: 200,
        body: { success:"Were here" }
      })
      
      wrapper = shallow(<ShoppingLists />)
      wrapper.setState({ chosen_list_id: 1 });

      wrapper.find('input[name="name"]').simulate("change", {target: {value: "vince", name:"name"}});
      wrapper.find('input[name="amount"]').simulate("change", {target: {value: "123", name:"amount"}});

      //expect(wrapper.state().loading).equal(false);
      wrapper.find('form').simulate("submit", { preventDefault() {} });

      expect( wrapper.state().loading ).equal(true);

      await

      setTimeout(function(){

        expect( wrapper.state().loading ).equal(false);

        expect( wrapper.state().general_msg ).equal("Were here");
        expect( wrapper.find("FlashMsg").length ).equal(1);

        expect(fetchMock.called()).equal(true);
        expect(fetchMock.lastUrl()).equal("https://andela-flask-api.herokuapp.com/shoppinglists/1/items");

      }, 100);

    })


    it('form submission done properly and error responses are handled properly', async () => {
      
      fetchMock.post("https://andela-flask-api.herokuapp.com/shoppinglists/1/items", {
        status: 200,
        body: { error:"Were here" }
      })
      
      wrapper = shallow(<ShoppingLists />)
      wrapper.setState({ chosen_list_id: 1 });

      wrapper.find('input[name="name"]').simulate("change", {target: {value: "vince", name:"name"}});
      wrapper.find('input[name="amount"]').simulate("change", {target: {value: "123", name:"amount"}});

      //expect(wrapper.state().loading).equal(false);
      wrapper.find('form').simulate("submit", { preventDefault() {} });

      expect( wrapper.state().loading ).equal(true);

      await
      
      setTimeout(function(){

        expect( wrapper.state().loading ).equal(false);

        expect( wrapper.state().general_msg ).equal("Were here");
        expect( wrapper.find(".message").length ).equal(1);

        expect(fetchMock.called()).equal(true);
        expect(fetchMock.lastUrl()).equal("https://andela-flask-api.herokuapp.com/shoppinglists/1/items");

      }, 100);

    })

    it('form submission done properly and error responses are handled properly', async () => {
      
      fetchMock.post("https://andela-flask-api.herokuapp.com/shoppinglists/1/items", {
        status: 200,
        body: "Unauthorized access"
      })
      
      wrapper = shallow(<ShoppingLists />)
      wrapper.setState({ chosen_list_id: 1 });

      wrapper.find('input[name="name"]').simulate("change", {target: {value: "vince", name:"name"}});
      wrapper.find('input[name="amount"]').simulate("change", {target: {value: "123", name:"amount"}});

      //expect(wrapper.state().loading).equal(false);
      wrapper.find('form').simulate("submit", { preventDefault() {} });

      expect( wrapper.state().loading ).equal(true);

      await
      
      setTimeout(function(){

        expect( wrapper.state().loading ).equal(false);

        expect( wrapper.state().general_msg ).equal("Unauthorized access");
        expect( wrapper.find("FlashMsg").length ).equal(1);

        expect(fetchMock.called()).equal(true);
        expect(fetchMock.lastUrl()).equal("https://andela-flask-api.herokuapp.com/shoppinglists/1/items");

      }, 100);

    })


    it('form submission done properly and form error message responses are handled properly', async () => {
      
      fetchMock.post("https://andela-flask-api.herokuapp.com/shoppinglists/1/items", {
        status: 200,
        body: { error: { name : ["Name error"], amount : ["Amount error"] } }
      })

      wrapper = shallow(<ShoppingLists />)
      wrapper.setState({ chosen_list_id: 1 });

      wrapper.find('input[name="name"]').simulate("change", {target: {value: "vince", name:"name"}});
      wrapper.find('input[name="amount"]').simulate("change", {target: {value: "123", name:"amount"}});

      //expect(wrapper.state().loading).equal(false);
      wrapper.find('form').simulate("submit", { preventDefault() {} });
      
      expect( wrapper.state().loading ).equal(true);

      await

      setTimeout(function(){

        expect( wrapper.state().loading ).equal(false);

        expect( wrapper.state().name_error ).equal("Name error");
        expect( wrapper.state().amount_error ).equal("Amount error");
        expect( wrapper.find("FormError").length ).equal(2);

        expect(fetchMock.called()).equal(true);
        expect(fetchMock.lastUrl()).equal("https://andela-flask-api.herokuapp.com/shoppinglists/1/items");

      }, 100);

    })

    it('form submission done properly and form error message responses are handled properly', async () => {
      
      fetchMock.post("https://andela-flask-api.herokuapp.com/shoppinglists/1/items", {
        status: 200,
        body: "Unauthorized access"
      })

      wrapper = shallow(<ShoppingLists />)
      wrapper.setState({ chosen_list_id: 1 });

      wrapper.find('input[name="name"]').simulate("change", {target: {value: "vince", name:"name"}});
      wrapper.find('input[name="amount"]').simulate("change", {target: {value: "123", name:"amount"}});

      //expect(wrapper.state().loading).equal(false);
      wrapper.find('form').simulate("submit", { preventDefault() {} });
      expect( wrapper.state().loading ).equal(true);

      await

      setTimeout(function(){

        expect( wrapper.state().loading ).equal(false);

        expect( wrapper.state().general_msg ).equal("Check your internet connection and try again");
        expect( wrapper.find("FlashMsg").length ).equal(1);

        expect(fetchMock.called()).equal(true);
        expect(fetchMock.lastUrl()).equal("https://andela-flask-api.herokuapp.com/shoppinglists/1/items");

      }, 100);

    })

  })



})