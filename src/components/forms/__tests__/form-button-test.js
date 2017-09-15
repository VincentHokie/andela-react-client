import React from 'react';
import { shallow, mount } from 'enzyme';

import FormButton from '../form_button.component.jsx';

describe('Form Button', () => {
  let wrapper;

  it('wraps content in a div with .col-xs-12 class', () => {
    wrapper = shallow(<FormButton />);
    expect(wrapper.find('.col-xs-12').length).toEqual(1);
  });

  it('has a title of passed in title prop', () => {
    wrapper = mount(<FormButton title="Button Text" />)
    expect(wrapper.find('.btn.btn-md.btn-login').text()).toBe(" Button Text ")
  })

  describe('submit button', () => {
    beforeEach(() => wrapper = mount(<FormButton />))

    it('image is hidden when not loading is not taking place and visible when loading', () => {  
      wrapper.setProps({ loading : false });
      expect(wrapper.find('img').length).toEqual(0);
      wrapper.setProps({ loading : true });
      expect(wrapper.find('img').length).toEqual(1);
    })

    it('button allows space for a loading gif when loading is taking place, and occupies the whole space when not loading', () => {
      wrapper.setProps({ loading : false });
      expect(wrapper.find('.btn-block').length).toEqual(1);
      expect(wrapper.find('.col-xs-11').length).toEqual(0);
      wrapper.setProps({ loading : true });
      expect(wrapper.find('.btn-block').length).toEqual(0);
      expect(wrapper.find('.col-xs-11').length).toEqual(1);
    })
  })

})