import React from 'react';
import { shallow, mount, render } from 'enzyme';

import ListItem from '../list.component.jsx';
import { BrowserRouter } from 'react-router-dom'


var fetchMock = require("fetch-mock");

var expect = require("chai").expect;

describe('Shopping list', () => {
  let wrapper;
  let list_object = {name:"A List",date:"A Date",list_id:"1"};

  it('wraps content in a div with .shopping-list class', () => {
    wrapper = render(<BrowserRouter><ListItem list={list_object} chosen="1" thisone="1" /></BrowserRouter>);
    expect(wrapper.find('.shopping-list').length).equal(1);
  });

  describe('List behaviour', () => {
  	let wrapper;

    it('if the chosen list is the same is this list, add class to it otherwise let it appear as it was', () => {

      wrapper = mount(<ListItem list={list_object} chosen="1" thisone="2" />);
      expect(wrapper.find('.chosen-alert').length).equal(0);

      wrapper = mount(<ListItem list={list_object} chosen="1" thisone="1" />);
      expect(wrapper.find('.chosen-alert').length).equal(1);
      
    })

    it('component properly uses and populates list object passed to it', () => {
      
      wrapper = mount(<ListItem list={list_object} />)
      expect(wrapper.find('.alert-default').text()).contain("A List");
      expect(wrapper.find('.alert-default').text()).contain("A Date");
      expect(wrapper.find('#'+list_object.list_id).length).equal(1);

    })

  })


  describe('API interaction Behaviour', () => {

    it('form submission done properly and success responses are handled properly', (done) => {

      fetchMock.delete("https://andela-flask-api.herokuapp.com/shoppinglists/2", {
        status: 200,
        body: JSON.stringify({ success:"The list has been successfully deleted" })
      })

      wrapper = mount(<ListItem list={list_object} chosen="1" thisone="2" />);
      wrapper.instance().deleteList(wrapper.instance());

      expect( wrapper.state().loading ).equal(true);      

      setTimeout(function(){

        expect( wrapper.state().general_msg ).equal("The list has been successfully deleted");
        expect( wrapper.state().loading ).equal(false);

        expect(fetchMock.called()).equal(true);
        expect(fetchMock.lastUrl()).equal("https://andela-flask-api.herokuapp.com/shoppinglists/2");

        done();

      }, 100);

    })


    it('form submission done properly and error responses are handled properly', (done) => {
      
      fetchMock.delete("https://andela-flask-api.herokuapp.com/shoppinglists/2", {
        status: 200,
        body: JSON.stringify({ error:"Something went wrong" })
      })
      
      wrapper = mount(<ListItem list={list_object} chosen="1" thisone="2" />);
      wrapper.instance().deleteList(wrapper.instance());

      expect( wrapper.state().loading ).equal(true);      

      setTimeout(function(){

        expect( wrapper.state().loading ).equal(false);
        expect( wrapper.state().general_msg ).equal("Something went wrong");

        expect(fetchMock.called()).equal(true);
        expect(fetchMock.lastUrl()).equal("https://andela-flask-api.herokuapp.com/shoppinglists/2");

        done();

      }, 100);

    })

    it('form submission done properly and form error message responses are handled properly', (done) => {
      
      fetchMock.delete("https://andela-flask-api.herokuapp.com/shoppinglists/2", {
        status: 200,
        body: "Unauthorized access"
      })

      wrapper = mount(<ListItem list={list_object} chosen="1" thisone="2" />);
      wrapper.instance().deleteList(wrapper.instance());

      expect( wrapper.state().loading ).equal(true);
        
      setTimeout(function(){

        expect( wrapper.state().loading ).equal(false);
        expect( wrapper.state().general_msg ).equal("Check your internet connection and try again");

        expect(fetchMock.called()).equal(true);
        expect(fetchMock.lastUrl()).equal("https://andela-flask-api.herokuapp.com/shoppinglists/2");

        done();

      }, 100);

    })

    afterEach(() => {
      expect(fetchMock.calls().unmatched).to.be.empty;
      fetchMock.restore();
    })

  })



})