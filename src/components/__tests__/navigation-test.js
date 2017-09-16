import React from 'react';
import { shallow, mount, render } from 'enzyme';

import Navigation from '../navigation.component.jsx';

import App from '../../App.js';

import { BrowserRouter, MemoryRouter } from 'react-router-dom'

var GLOBAL = require("../../globals.js")

describe('Navigation bar', () => {
  let wrapper;

  it('wraps content in a nav', () => {

    wrapper = shallow(<Navigation />)
    expect(wrapper.find('nav').length).toEqual(1);

  });

  describe('Behaviour', () => {

    it('Ensure usename properly shows', () => {

      wrapper = shallow(<Navigation username="SomeName" />)
      expect(wrapper.find("ul li a").first().text()).toContain(" Welcome  SomeName");
      
    })


    })

  })
