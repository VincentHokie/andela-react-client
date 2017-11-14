import React, { Component } from 'react';
import '../styles/css/back_button.css';

class BackButton extends Component {

	render() {

		return (

			<div id="backButton" className="col-lg-offset-4 col-md-offset-3 col-sm-1 col-sm-offset-2 col-xs-2">
				<a href="/shopping-lists" className="col-xs-12 btn" onClick={this.props.pushNavigation}>
					<i className="fa fa-hand-o-left"></i>Back
		      </a>
			</div>

		);
	}
}

export default BackButton