import React from 'react';
import { shallow, mount } from 'enzyme';

import NotFound from '../404.component.jsx';

describe('404 error page', () => {
  let wrapper;

  it('wraps content in a div with .body-404 class', () => {
    wrapper = shallow(<NotFound />);
    expect(wrapper.find('.body-404').length).toEqual(1);
  });

})