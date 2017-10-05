import React, { Component } from 'react';
import './App.css';

//import routing components
import { Route, Switch} from 'react-router-dom'

//import custom components
import Login from "./components/login.component.js"
import EmailConfirm from "./components/email_confirm.component.js"
import PasswordReset from "./components/password_reset.component.js"
import SignUp from "./components/sign_up.component.js"

import ShoppingLists from "./components/shopping_lists.component.js"
import CreateShoppingList from "./components/create_shopping_list.component.js"
import UpdateShoppingList from "./components/update_shopping_list.component.js"

import UpdateShoppingListItem from "./components/update_shopping_list_item.component.js"

import NotFound from "./components/404.component.js"

var vex = require('vex-js')
vex.registerPlugin(require('vex-dialog'))
vex.defaultOptions.className = 'vex-theme-os'

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
