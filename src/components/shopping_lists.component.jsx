import React, { Component } from 'react';

var GLOBAL = require("../globals.js")

class ShoppingLists extends Component {

  componentDidMount(){

  //show a flash message if it exists in the globals module
    if( GLOBAL.FLASH ){
      
      this.setState({ general_msg: GLOBAL.FLASH  });
      GLOBAL.FLASH = false;

    }
    
}

  render() {
    return (
      
      <div>

        <div className="App">
          <div className="App-header">
            <h2>Welcome shoping lists to React</h2>
          </div>
          <p className="App-intro">
            To get startedddd, edit <code>src/App.js</code> and save to reload.
          </p>
        </div>
      </div>

    );
  }
}

export default ShoppingLists
