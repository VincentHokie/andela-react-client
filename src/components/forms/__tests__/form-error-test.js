import React from 'react';
import { shallow, mount } from 'enzyme';

import FormError from '../form_error.component.jsx';

describe('Form Error', () => {
  let wrapper;

  it('wraps content in a span with .label class', () => {
    wrapper = shallow(<FormError />);
    expect(wrapper.find('.label').length).toEqual(1);
  });

  it('has an error passed as an error prop', () => {
    wrapper = mount(<FormError error="Form Error Passed" />)
    expect(wrapper.find('span.label').text()).toBe("Form Error Passed")
  })

})