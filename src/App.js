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
import CreateShoppingList from "./components/create_shopping_list.component.jsx"
import UpdateShoppingList from "./components/update_shopping_list.component.jsx"

import UpdateShoppingListItem from "./components/update_shopping_list_item.component.jsx"

import NotFound from "./components/404.component.jsx"

var vex = require('vex-js')
vex.registerPlugin(require('vex-dialog'))
vex.defaultOptions.className = 'vex-theme-os'

var localStorage = require("jest-localstorage-mock");

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
              <Route exact path='/shopping-list/new' component={CreateShoppingList} />
              <Route exact path='/shopping-list/:id/edit' component={UpdateShoppingList} />
              <Route exact path='/shopping-list/:id/item/:item_id/edit' component={UpdateShoppingListItem} />
              <Route exact path='/email-confirmation' component={EmailConfirm} />
              <Route exact path='/password-reset/:token' component={PasswordReset} />
              <Route exact path='*' component={NotFound} />
            </Switch>
          </div>
      </div>
    );
  }
}

export default App;
