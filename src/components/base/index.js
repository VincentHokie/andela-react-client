import React, { Component } from 'react';
import { baseUrl } from  "../../globals.js"

class Basethis extends Component {

  constructor() {
    super();
    this.baseUrl = baseUrl;
    this.state = {flash: false}

  }

  componentWillMount() {

    //set global info and window refresh/ page change
    this.setGlobals();

  }

  componentDidMount() {

    //show a flash message if it exists in the globals module
    if (this.state.flash) {

      this.setState({ 
        general_msg: this.state.flash,
        flash: false
      });

    }

  }

  pushNavigation = (event) => {
    this.props.history.push(event.target.getAttribute("href"))
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  setGlobals = () => {
    
        //get global variables
        let localData;

        if( localStorage.getItem("globals") )
          localData = JSON.parse( localStorage.getItem("globals") );
    
        if( localData && localData["logged_in"] )
          this.setState({ logged_in: localData["logged_in"]  });
    
        if( localData && localData["token"] )
          this.setState({ token: localData["token"]  });
    
        if( localData && localData["user_username"] )
          this.setState({ user_username: localData["user_username"]  });
    
        if( localData && localData["flash"] )
          this.setState({ flash: localData["flash"]  });

        //once transfer of state is complete, leave no trace
        localStorage.setItem("globals", JSON.stringify(""));


        //add a listener to listen for page change/ refresh
        window.addEventListener("beforeunload", function(){
          localStorage.setItem("globals",
            JSON.stringify({
              logged_in: this.state.logged_in,
              token: this.state.token,
              user_username: this.state.user_username,
              flash: this.state.flash
            })
          )
        });
    
      }

}


export default Basethis