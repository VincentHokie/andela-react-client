import React from 'react';

let Paginate = props => {

	return (

		<li className={props.page == props.chosen_page ? "active" : ""}>
			<a href="#" data-page-number={props.page} onClick={props.page_selected}>{props.page}</a>
		</li>

	);
}

export default Paginate