/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { Provider } from "react-redux";

import { store } from './src/Store/index';
import MapScreen from "./src/Screens/MapScreen/MapScreen";
import { createStackNavigator } from "react-navigation"
import MyMapsView from './src/Screens/MapScreen/MyMapsView';
import SignIn from './src/Screens/SignIn/SignIn';
import SignUp from './src/Screens/SignUp/SignUp';


export default class App extends Component {
  render() {
    return (
      <Provider store={store} >
        <View style={{ flex: 1 }} >

          <RootStack />

        </View>
      </Provider>
    );
  }
}
const RootStack = createStackNavigator({
  mapScreen: MyMapsView,
  signIn: SignIn,
  signUp: SignUp
}, {
    initialRouteName: "signIn",
    navigationOptions: {
      
      headerTitle: 'Routes',
      headerTitleStyle: { fontFamily: "OpenSans-Light", fontStyle: null, },
      
    }

  })
const prevGetStateForActionRootStack = RootStack.router.getStateForAction;

RootStack.router.getStateForAction = (action, state) => {
  if (state && action.type === 'ReplaceCurrentScreen') {
    console.log("replace screen action");
    const routes = state.routes.slice(0, state.routes.length - 1);
    routes.push(action);
    return {
      ...state,
      routes,
      index: routes.length - 1,
    };
  }
  return prevGetStateForActionRootStack(action, state);
};
