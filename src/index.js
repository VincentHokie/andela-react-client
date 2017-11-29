import React from 'react';
import ReactDOM from 'react-dom';
import "./styles/css/index.css";
import App from "./components/main/App";

//import routing components
import { BrowserRouter } from 'react-router-dom'

ReactDOM.render(
	<BrowserRouter>
		<App />
	</BrowserRouter>
	, document.getElementById('root'));
