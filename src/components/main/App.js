import React, { Component } from 'react';
import "../../styles/css/App.css"

//import routing components
import { Route, Switch} from 'react-router-dom'

//import custom components
import Login from "../auth/login.js"
import EmailConfirm from "../auth/emailConfirm.js"
import PasswordReset from "../auth/passwordReset.js"
import SignUp from "../auth/signUp.js"

import ShoppingLists from "../dash/shoppingLists.js"
import CreateShoppingList from "../shoppingList/createShoppingList.js"
import UpdateShoppingList from "../shoppingList/updateShoppingList.js"

import UpdateShoppingListItem from "../shoppingListItem/updateShoppingListItem.js"

import NotFound from "../404.js"

let vex = require('vex-js')
vex.registerPlugin(require('vex-dialog'))
vex.defaultOptions.className = 'vex-theme-os'

export default props => {

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
