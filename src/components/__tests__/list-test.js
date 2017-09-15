import React from 'react';
import { shallow, mount, render } from 'enzyme';

import ListItem from '../list.component.jsx';
import { BrowserRouter } from 'react-router-dom'

describe('Shopping list', () => {
  let wrapper;
  let list_object = {name:"A List",date:"A Date",list_id:"1"};

  it('wraps content in a div with .shopping-list class', () => {
    wrapper = render(<BrowserRouter><ListItem list={list_object} chosen="1" thisone="1" /></BrowserRouter>);
    expect(wrapper.find('.shopping-list').length).toEqual(1);
  });

  describe('List behaviour', () => {
  	let wrapper;

    it('if the chosen list is the same is this list, add class to it otherwise let it appear as it was', () => {

      wrapper = mount(<BrowserRouter><ListItem list={list_object} chosen="1" thisone="2" /></BrowserRouter>);
      expect(wrapper.find('.chosen-alert').length).toEqual(0);

      wrapper = mount(<BrowserRouter><ListItem list={list_object} chosen="1" thisone="1" /></BrowserRouter>);
      expect(wrapper.find('.chosen-alert').length).toEqual(1);
      
    })

    it('component properly uses and populates list object passed to it', () => {
      
      wrapper = mount(<BrowserRouter><ListItem list={list_object} /></BrowserRouter>)
      expect(wrapper.find('.alert-default').text()).toContain("A List");
      expect(wrapper.find('.alert-default').text()).toContain("A Date");
      expect(wrapper.find('#'+list_object.list_id).length).toEqual(1);
      expect(wrapper.find('Link').prop("to")).toBe("/shopping-list/"+ list_object.list_id +"/edit");

    })

  })


})