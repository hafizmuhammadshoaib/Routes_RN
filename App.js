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
import MapScreen from "./src/Screens/MapScreen/MapScreen";
import { createStackNavigator } from "react-navigation"
import MyMapsView from './src/Screens/MapScreen/MyMapsView';


export default class App extends Component {
  render() {
    return (
      <View style={{ flex: 1 }} >

        <RootStack />

      </View>
    );
  }
}
const RootStack = createStackNavigator({
  mapScreen: MyMapsView
}, {
    navigationOptions: {
      headerTitle: 'Routes',

    }
  })
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
