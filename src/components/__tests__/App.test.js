import React from 'react';
import ReactDOM from 'react-dom';
import App from "../main/App";

import { BrowserRouter } from 'react-router-dom'
import "../../localStorage";

it('renders without crashing', () => {
  let div = document.createElement('div');
  localStorage.setItem("globals", JSON.stringify({"logged_in":false}));

  ReactDOM.render(
  	<BrowserRouter>
		<App />
	</BrowserRouter>, div);
});
