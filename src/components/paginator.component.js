import React, { Component } from 'react';

import { Link } from 'react-router-dom';

class Paginate extends Component {

	render() {

		return (

			<li className={this.props.page == this.props.chosen_page ? "active" : ""}>
				<a href="#" data-page-number={this.props.page} onClick={this.props.page_selected}>{this.props.page}</a>
			</li>

		);
	}
}

export default Paginate