import React from 'react';
import { shallow, mount, render } from 'enzyme';

import Item from '../list_item.component.jsx';
import { BrowserRouter } from 'react-router-dom'



var fetchMock = require("fetch-mock");

var expect = require("chai").expect;

describe('Shopping list item', () => {
  let wrapper;
  let item_object = {name:"A List",amount:"1234",list_id:"1",item_id:"1"};

  it('wraps content in a div with .shopping-list-items class', () => {
    wrapper = render(<Item item={item_object} />);
    expect(wrapper.find('.shopping-list-items').length).equal(1);
  });

  describe('List item behaviour', () => {

    it('if the chosen list is the same is the list this belongs to, add class to it to show it otherwise hide it', () => {  
      
      wrapper = mount(<Item item={item_object} chosen="1" list="2" />);
      expect(wrapper.find('.showAddItemForm').length).equal(0);

      wrapper = mount(<Item item={item_object} chosen="1" list="1" />);
      expect(wrapper.find('.showAddItemForm').length).equal(1);
      
    })

    it('component properly uses and populates list item object passed to it', () => {
      
      wrapper = mount(<Item item={item_object} chosen="1" list="1" />);
      expect(wrapper.find('label.col-md-10').text()).contain("A List");
      expect(wrapper.find('label.col-md-10').text()).contain(1234);
      expect(wrapper.find('#'+ item_object.list_id).length).equal(1);

    })
    
  })


  describe('API interaction Behaviour', () => {

    it('form submission done properly and success responses are handled properly', (done) => {

      fetchMock.delete("https://andela-flask-api.herokuapp.com/shoppinglists/1/items/1", {
        status: 200,
        body: JSON.stringify({ success:"The list item has been successfully deleted" })
      })

      wrapper = mount(<Item item={item_object} chosen="1" list="1" />);
      wrapper.instance().deleteItem(wrapper.instance());

      expect( wrapper.state().loading ).equal(true);

      setTimeout(function(){

        expect( wrapper.state().general_msg ).equal("The list item has been successfully deleted");
        expect( wrapper.state().loading ).equal(false);

        expect(fetchMock.called()).equal(true);
        expect(fetchMock.lastUrl()).equal("https://andela-flask-api.herokuapp.com/shoppinglists/1/items/1");

        done();
        
      }, 100);

    })


    it('form submission done properly and error responses are handled properly', (done) => {
      
      fetchMock.delete("https://andela-flask-api.herokuapp.com/shoppinglists/1/items/1", {
        status: 200,
        body: JSON.stringify({ error:"Something went wrong" })
      })
      
      wrapper = mount(<Item item={item_object} chosen="1" list="1" />);
      wrapper.instance().deleteItem(wrapper.instance());

      expect( wrapper.state().loading ).equal(true);

      setTimeout(function(){

        expect( wrapper.state().loading ).equal(false);
        expect( wrapper.state().general_msg ).equal("Something went wrong");
        
        expect(fetchMock.called()).equal(true);
        expect(fetchMock.lastUrl()).equal("https://andela-flask-api.herokuapp.com/shoppinglists/1/items/1");

        done();
        
      }, 100);

    })

    it('form submission done properly and form error message responses are handled properly', (done) => {
      
      fetchMock.delete("https://andela-flask-api.herokuapp.com/shoppinglists/1/items/1", {
        status: 401,
        body: "Unauthorized access"
      })

      wrapper = mount(<Item item={item_object} chosen="1" list="1" />);
      wrapper.instance().deleteItem(wrapper.instance());

      expect( wrapper.state().loading ).equal(true);

      setTimeout(function(){

        expect( wrapper.state().general_msg ).equal("Check your internet connection and try again");
        expect( wrapper.state().loading ).equal(false);

        expect(fetchMock.called()).equal(true);
        expect(fetchMock.lastUrl()).equal("https://andela-flask-api.herokuapp.com/shoppinglists/1/items/1");

        done();
        
      }, 100);

    })

    afterEach(() => {
      expect(fetchMock.calls().unmatched).to.be.empty;
      fetchMock.restore();
    })

  })

})