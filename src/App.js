import React, { Component } from 'react';
import './App.css';

//import routing components
import { Route, Switch} from 'react-router-dom'

//import custom components
import Login from "./components/login.component.jsx"
import EmailConfirm from "./components/email_confirm.component.jsx"
import PasswordReset from "./components/password_reset.component.jsx"
import SignUp from "./components/sign_up.component.jsx"
import ShoppingLists from "./components/shopping_lists.component.jsx"

class App extends Component {
  render() {
    return (
      <div className="App">
          <div>
            <Switch>
              <Route exact path='/' component={Login} />
              <Route exact path='/login' component={Login} />
              <Route exact path='/sign-up' component={SignUp} />
              <Route exact path='/shopping-lists' component={ShoppingLists} />
              <Route exact path='/email-confirmation' component={EmailConfirm} />
              <Route exact path='/password-reset/:token' component={PasswordReset} />
              <Route exact path='*' component={PasswordReset} />
            </Switch>
          </div>
      </div>
    );
  }
}

export default App;
