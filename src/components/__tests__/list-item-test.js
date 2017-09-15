import React from 'react';
import { shallow, mount, render } from 'enzyme';

import Item from '../list_item.component.jsx';
import { BrowserRouter } from 'react-router-dom'

describe('Shopping list item', () => {
  let wrapper;
  let item_object = {name:"A List",amount:"1234",list_id:"1",item_id:"1"};

  it('wraps content in a div with .shopping-list-items class', () => {
    wrapper = render(<BrowserRouter><Item item={item_object} /></BrowserRouter>);
    expect(wrapper.find('.shopping-list-items').length).toEqual(1);
  });

  describe('List item behaviour', () => {

    it('if the chosen list is the same is the list this belongs to, add class to it to show it otherwise hide it', () => {  
      
      wrapper = mount(<BrowserRouter><Item item={item_object} chosen="1" list="2" /></BrowserRouter>);
      expect(wrapper.find('.showAddItemForm').length).toEqual(0);

      wrapper = mount(<BrowserRouter><Item item={item_object} chosen="1" list="1" /></BrowserRouter>);
      expect(wrapper.find('.showAddItemForm').length).toEqual(1);
      
    })

    it('component properly uses and populates list item object passed to it', () => {
      
      wrapper = mount(<BrowserRouter><Item item={item_object} chosen="1" list="1" /></BrowserRouter>);
      expect(wrapper.find('label.col-md-10').text()).toContain("A List");
      expect(wrapper.find('label.col-md-10').text()).toContain(1234);
      expect(wrapper.find('#'+ item_object.list_id).length).toEqual(1);
      expect(wrapper.find('Link').prop("to")).toBe("/shopping-list/"+ item_object.list_id +"/item/"+ item_object.item_id +"/edit");

    })
    
  })

})