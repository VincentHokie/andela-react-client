module.exports = {
	setGlobals : (component) => {

		//get global variables
		let localData = JSON.parse( localStorage.getItem("globals") );

		if( localData && localData["logged_in"] )
			component.setState({ logged_in: localData["logged_in"]  });

		if( localData && localData["token"] )
			component.setState({ token: localData["token"]  });

		if( localData && localData["user_username"] )
			component.setState({ user_username: localData["user_username"]  });

		if( localData && localData["flash"] )
			component.setState({ flash: localData["flash"]  });

		//add a listener to listen for page change/ refresh
		window.addEventListener("beforeunload", function(){
			localStorage.setItem("globals",
				JSON.stringify({
					logged_in: component.state.logged_in,
					token: component.state.token,
					user_username: component.state.user_username,
					flash: component.state.flash
				})
			)
		});

	}
}