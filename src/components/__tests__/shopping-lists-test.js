import React from 'react';
import { shallow, mount, render } from 'enzyme';

import ShoppingLists from '../shopping_lists.component.jsx';

import App from '../../App.js';

import { BrowserRouter, MemoryRouter } from 'react-router-dom'

var GLOBAL = require("../../globals.js")

var fetchMock = require("fetch-mock");

describe('Shopping list', () => {
  let wrapper;

  // it('wraps content in a div with .col-xs-12 class if user is logged in', () => {

  //   GLOBAL.LOGGED_IN = true
  //   wrapper = shallow(<ShoppingLists />)
  //   expect(wrapper.find('.container.col-xs-12').length).toEqual(1);

  // });

  it('wraps content in a Redirect is not logged in', () => {

    GLOBAL.LOGGED_IN = false
    wrapper = shallow(<ShoppingLists />)
    expect(wrapper.find('Redirect').length).toEqual(1);

  });

  describe('Behaviour', () => {
  	
    beforeEach(() => GLOBAL.LOGGED_IN = true )
    beforeEach(() => wrapper = shallow(<ShoppingLists />))

    it('if the theres processing going on, the input is not editable', () => {

      wrapper.setState({ loading: false });
      expect(wrapper.find('input[name="name"]').prop("disabled")).toEqual(false);
      expect(wrapper.find('input[name="amount"]').prop("disabled")).toEqual(false);

      wrapper.setState({ loading: true });
      expect(wrapper.find('input[name="name"]').prop("disabled")).toEqual("disabled");
      expect(wrapper.find('input[name="amount"]').prop("disabled")).toEqual("disabled");
      
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


    it('if the theres a flash message, expect the .message class, otherwise dont', () => {

      expect(wrapper.find('.showAddItemForm').length).toEqual(0);
      wrapper.find('#create-shopping-list-item').simulate("click", { preventDefault() {} });
      expect(wrapper.find('.showAddItemForm').length).toEqual(1);
      
    })

    it('if the theres a flash message, expect the .message class, otherwise dont', () => {

      expect(wrapper.state().hide_items).toEqual(false);
      wrapper.find('#back-to-lists').simulate("click", { preventDefault() {} });
      expect(wrapper.state().hide_items).toEqual(true);
      
    })
    

    it('shopping list click event test on a small screen i.e. < 768', () => {

      expect(wrapper.state().chosen_list).toEqual(false);
      expect(wrapper.state().chosen_list_id).toEqual(false);
      expect(wrapper.state().hide_items).toEqual(false);

      wrapper.setState({ small_screen: true });
      wrapper.instance().handleListSelect({
        target: {
          id : 1,
          getAttribute() {
            return "ListName";
          }
        }
      });

      expect(wrapper.state().chosen_list).toEqual("ListName");
      expect(wrapper.state().chosen_list_id).toEqual(1);
      expect(wrapper.state().hide_items).toEqual(true);
      
    })


    it('check that the hide items property has the correct effect', () => {

      expect(wrapper.find(".hideSomething").length).toEqual(0);
      expect(wrapper.find(".hidden-xs").length).toEqual(1);
      
      wrapper.setState({ hide_items: true });

      expect(wrapper.find(".hideSomething").length).toEqual(1);
      expect(wrapper.find(".hidden-xs").length).toEqual(0);
      
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
      GLOBAL.LOGGED_IN = true;
      GLOBAL.FLASH = "Message"
      wrapper = mount(<BrowserRouter><ShoppingLists /></BrowserRouter>)
    })

    it('if the theres processing going on, the input is not editable', () => {

      expect(wrapper.find('.alert.message').length).toEqual(1);
      expect(wrapper.find('.alert.message').html()).toContain("Message");
      
    })

  })

  afterEach(() => {
       expect(fetchMock.calls().unmatched).toEqual([]);
      fetchMock.restore();
    })

  
  describe('API interaction Behaviour', () => {
    let list_data, item_data;

    beforeEach(() => {
      GLOBAL.LOGGED_IN = true;

  list_data = '[{"list_id": "1","name":"Honda Accord Crosstour"},{"list_id": "2","name":"Mercedes-Benz AMG GT Coupe"},{"list_id": "3","name":"BMW X6 SUV"},{"list_id": "4","name":"Ford Edge SUV"},{"list_id": "5","name":"Dodge Viper Coupe"}]';

  item_data = '[{"item_id":"1","name":"item 1 list 1","amount":"100","list_id":"1","checked":"false"},{"item_id":"2","name":"item 2 list 1","amount":"100","list_id":"1","checked":"false"},{"item_id":"3","name":"item 3 list 2","amount":"100","list_id":"2","checked":"false"},{"item_id":"4","name":"item 4 list 2","amount":"100","list_id":"2","checked":"false"},{"item_id":"5","name":"item 5 list 3","amount":"100","list_id":"3","checked":"false"},{"item_id":"6","name":"item 6 list 3","amount":"100","list_id":"3","checked":"false"},{"item_id":"7","name":"item 7 list 4","amount":"100","list_id":"4","checked":"false"},{"item_id":"8","name":"item 8 list 4","amount":"100","list_id":"4","checked":"false"},{"item_id":"9","name":"item 9 list 5","amount":"100","list_id":"5","checked":"false"},{"item_id":"10","name":"item 10 list 5","amount":"100","list_id":"5","checked":"false"},{"item_id":"11","name":"item 11 list 1","amount":"100","list_id":"1","checked":"true"},{"item_id":"12","name":"item 12 list 2","amount":"100","list_id":"2","checked":"true"},{"item_id":"13","name":"item 13 list 3","amount":"100","list_id":"3","checked":"true"},{"item_id":"14","name":"item 14 list 4","amount":"100","list_id":"4","checked":"true"},{"item_id":"15","name":"item 15 list 5","amount":"100","list_id":"5","checked":"true"}]';


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

      wrapper = mount(<BrowserRouter><ShoppingLists /></BrowserRouter>)

      //await
      
      wrapper = shallow(<ShoppingLists />)

      wrapper.setState({ list_data: JSON.parse(list_data) });
      wrapper.setState({ item_data: JSON.parse(item_data) });

      expect( wrapper.find("ListItem").length ).toEqual(15);
      expect( wrapper.find("Item").length ).toEqual(5);

      expect(fetchMock.called()).toEqual(true);
      expect(fetchMock.lastUrl()).toEqual("https://andela-flask-api.herokuapp.com/shoppinglists/items");

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

      wrapper = mount(<BrowserRouter><ShoppingLists /></BrowserRouter>)
      wrapper.setState({ general_msg: "Unauthorized access"});

      await
      
      wrapper.update();
      //expect( wrapper.find(".message").length ).toEqual(1);

      //console.log( wrapper.html() )
      expect(fetchMock.called()).toEqual(true);
      expect(fetchMock.lastUrl()).toEqual("https://andela-flask-api.herokuapp.com/shoppinglists/items");

    })



    it('form submission done properly and error responses are handled properly', async () => {
      
      fetchMock.post("https://andela-flask-api.herokuapp.com/shoppinglists/1/items", {
        status: 200,
        body: { success:"Were here" }
      })
      
      wrapper = shallow(<ShoppingLists />)
      wrapper.setState({ chosen_list_id: 1 });

      wrapper.find('input[name="name"]').simulate("change", {target: {value: "vince"}});
      wrapper.find('input[name="amount"]').simulate("change", {target: {value: "123"}});

      //expect(wrapper.state().loading).toEqual(false);
      wrapper.find('form').simulate("submit", { preventDefault() {} });
      wrapper.setState({ general_msg: "Were here"});

      await

      wrapper.update();
      expect( wrapper.find("FlashMsg").length ).toEqual(1);

      expect(fetchMock.called()).toEqual(true);
      expect(fetchMock.lastUrl()).toEqual("https://andela-flask-api.herokuapp.com/shoppinglists/1/items");

    })


    it('form submission done properly and error responses are handled properly', async () => {
      
      fetchMock.post("https://andela-flask-api.herokuapp.com/shoppinglists/1/items", {
        status: 200,
        body: { error:"Were here" }
      })
      
      wrapper = shallow(<ShoppingLists />)
      wrapper.setState({ chosen_list_id: 1 });

      wrapper.find('input[name="name"]').simulate("change", {target: {value: "vince"}});
      wrapper.find('input[name="amount"]').simulate("change", {target: {value: "123"}});

      //expect(wrapper.state().loading).toEqual(false);
      wrapper.find('form').simulate("submit", { preventDefault() {} });
      wrapper.setState({ general_msg: "Were here"});

      await
      
      wrapper.update();
      expect( wrapper.find("FlashMsg").length ).toEqual(1);

      expect(fetchMock.called()).toEqual(true);
      expect(fetchMock.lastUrl()).toEqual("https://andela-flask-api.herokuapp.com/shoppinglists/1/items");

    })

    it('form submission done properly and error responses are handled properly', async () => {
      
      fetchMock.post("https://andela-flask-api.herokuapp.com/shoppinglists/1/items", {
        status: 200,
        body: "Unauthorized access"
      })
      
      wrapper = shallow(<ShoppingLists />)
      wrapper.setState({ chosen_list_id: 1 });

      wrapper.find('input[name="name"]').simulate("change", {target: {value: "vince"}});
      wrapper.find('input[name="amount"]').simulate("change", {target: {value: "123"}});

      //expect(wrapper.state().loading).toEqual(false);
      wrapper.find('form').simulate("submit", { preventDefault() {} });
      wrapper.setState({ general_msg: "Were here"});

      await
      
      wrapper.update();
      expect( wrapper.find("FlashMsg").length ).toEqual(1);

      expect(fetchMock.called()).toEqual(true);
      expect(fetchMock.lastUrl()).toEqual("https://andela-flask-api.herokuapp.com/shoppinglists/1/items");

    })


    it('form submission done properly and form error message responses are handled properly', async () => {
      
      fetchMock.post("https://andela-flask-api.herokuapp.com/shoppinglists/1/items", {
        status: 200,
        body: { error: { name : ["Name error"], amount : ["Amount error"] } }
      })

      wrapper = shallow(<ShoppingLists />)
      wrapper.setState({ chosen_list_id: 1 });

      wrapper.find('input[name="name"]').simulate("change", {target: {value: "vince"}});
      wrapper.find('input[name="amount"]').simulate("change", {target: {value: "123"}});

      //expect(wrapper.state().loading).toEqual(false);
      wrapper.find('form').simulate("submit", { preventDefault() {} });
      wrapper.setState({ name_error: "Name error"});
      wrapper.setState({ amount_error: "Amount error"});

      await

      wrapper.update();
      expect( wrapper.find("FormError").length ).toEqual(2);

      expect(fetchMock.called()).toEqual(true);
      expect(fetchMock.lastUrl()).toEqual("https://andela-flask-api.herokuapp.com/shoppinglists/1/items");

    })

    it('form submission done properly and form error message responses are handled properly', async () => {
      
      fetchMock.post("https://andela-flask-api.herokuapp.com/shoppinglists/1/items", {
        status: 200,
        body: "Unauthorized access"
      })

      wrapper = shallow(<ShoppingLists />)
      wrapper.setState({ chosen_list_id: 1 });

      wrapper.find('input[name="name"]').simulate("change", {target: {value: "vince"}});
      wrapper.find('input[name="amount"]').simulate("change", {target: {value: "123"}});

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