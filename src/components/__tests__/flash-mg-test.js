import React from 'react';
import { shallow, mount } from 'enzyme';

import FlashMsg from '../flash_msg.component.jsx';

describe('Flash Message', () => {
  let wrapper;

  it('wraps content in a div with .message class', () => {
    wrapper = shallow(<FlashMsg />);
    expect(wrapper.find('.message').length).toEqual(1);
  });

  it('has a flash message passed as an msg prop', () => {
    wrapper = mount(<FlashMsg msg="This is a flash message" />);
    expect(wrapper.find('.message').text()).toBe(" This is a flash message")
  })

})