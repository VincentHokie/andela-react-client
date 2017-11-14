import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { BrowserRouter } from 'react-router-dom'
import "./components/localStorage.js";

it('renders without crashing', () => {
  const div = document.createElement('div');
  localStorage.setItem("globals", JSON.stringify({"logged_in":false}));

  ReactDOM.render(
  	<BrowserRouter>
		<App />
	</BrowserRouter>, div);
});
