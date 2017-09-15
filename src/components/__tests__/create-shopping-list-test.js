import React from 'react';
import { shallow, mount, render } from 'enzyme';

import CreateShoppingList from '../create_shopping_list.component.jsx';

import App from '../../App.js';

import { BrowserRouter, MemoryRouter } from 'react-router-dom'

var GLOBAL = require("../../globals.js")

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

    // it('component properly uses and populates list object passed to it', () => {
      
    //   expect(wrapper.find('.alert-default').text()).toContain("A List");
    //   expect(wrapper.find('.alert-default').text()).toContain("A Date");
    //   expect(wrapper.find('#'+list_object.list_id).length).toEqual(1);
    //   expect(wrapper.find('Link').prop("to")).toBe("/shopping-list/"+ list_object.list_id +"/edit");

    // })

  })

  


})