import React from 'react';
import { shallow, mount } from 'enzyme';

import NotFound from '../404.js';

import chai from "chai"; let expect = chai.expect


describe('404 error page', () => {
  let wrapper;

  it('404 page wraps content in a div with .body-404 class', () => {
    wrapper = shallow(<NotFound />);
    expect(wrapper.find('.body-404').length).equal(1);
  });

})