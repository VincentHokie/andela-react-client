export const baseUrl = "http://localhost:5000"; //process.env.REACT_APP_BASE_URL;

export const setGlobals = (component) => {

    //get global variables
    let localData = JSON.parse(localStorage.getItem("globals"));

    if (localData) {

        if (localData["logged_in"])
            component.setState({ logged_in: localData["logged_in"] });

        if (localData["token"])
            component.setState({ token: localData["token"] });

        if (localData["user_username"])
            component.setState({ user_username: localData["user_username"] });

        if (localData["flash"])
            component.setState({ flash: localData["flash"] });

        //once transfer of state is complete, leave no trace
        // localStorage.setItem("globals", JSON.stringify(""));

    }

    //add a listener to listen for page change/ refresh
    window.addEventListener("beforeunload", function () {
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