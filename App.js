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
import firebase from "react-native-firebase"

import { store } from './src/Store/index';
import SplashScreen from 'react-native-splash-screen';
import MapScreen from "./src/Screens/MapScreen/MapScreen";
import { createStackNavigator } from "react-navigation"
import MyMapsView from './src/Screens/MapScreen/MyMapsView';
import SignIn from './src/Screens/SignIn/SignIn';
import SignUp from './src/Screens/SignUp/SignUp';
import BusInfo from './src/Screens/Bus Info/BusInfo';
import BusRoute from './src/Screens/BusRoute/BusRoute';
import LiveTracking from './src/Screens/Live Tracking/LiveTracking';
import Settings from "./src/Screens/Settings/Settings";
import StopLocation from './src/Screens/StopLocation/StopLocation';
import Notifications from './src/Screens/Notifications/Notifications';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.notificationListener = null;
    this.notificationOpenedListener = null;
    const channel = new firebase.notifications.Android.Channel('test-channel', 'Test Channel', firebase.notifications.Android.Importance.Max).setVibrationPattern([500]).setDescription("all")
    // firebase.notifications().android.createChannel(channel);
    this.channel = channel;
  }
  componentDidMount() {
    SplashScreen.hide();
    this.checkPermission();
    this.createNotificationListeners();
  }
  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
  }
  createNotificationListeners = () => {
    this.notificationListener = firebase.notifications().onNotification((notification) => {
      // const { title, body } = notification;
      // alert("create notification listener" + JSON.stringify(notification));
      console.log("notification listener", notification)
      console.log("notification body", notification.body)
      // const notification = new firebase.notifications.Notification()
      //   .setNotificationId(notification.notificationId)
      //   .setTitle(notification.title)
      //   .setBody(notification.body)

      // notification.android.defaults = ["Vibrate"];
      // notification.android.setVibrate=
      // notification.android.setChannelId("test")
      //   .setBody(notification.body)
      //   .setTitle(notification.title)
      notification.android.setChannelId(this.channel.channelId).setBody(notification.body).setTitle(notification.title)



      firebase.notifications().displayNotification(notification);
    });
    // firebase.notifications().android.createChannel(this.notification);
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpened) => {
      // alert("notification opened listener" + JSON.stringify(notificationOpened.notification.title)+JSON.stringify(notificationOpened.notification));
      console.log(notificationOpened.notification);
      alert(notificationOpened.notification.body);
      alert(notificationOpened.notification.title);


    })

    firebase.notifications().getInitialNotification()
      .then(notificationOpen => {
        if (notificationOpen) {
          // const { title, body } = notificationOpen.notification;
          // this.showAlert(title, body);
          alert("initial notification" + JSON.stringify(notificationOpen.notification.body))
        }
      })
      .catch(error => {
        alert("intial notification error" + JSON.stringify(error));
      });

    this.messageListener = firebase.messaging().onMessage((message) => {
      alert("message listener" + JSON.stringify(message));
    });
  }
  checkPermission = () => {
    firebase.messaging().hasPermission()
      .then(enabled => {
        if (enabled) {
          this.getToken();
        } else {
          this.requsetPermission();
        }
      })
      .catch(error => {
        alert("permission error" + JSON.stringify(error));
      })
  }
  requsetPermission = () => {
    firebase.messaging().requestPermission()
      .then(() => {
        this.getToken();
      })
      .catch(error => {
        console.log("error in requestPermission");
      })
  }
  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  }

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
  signUp: SignUp,
  busInfo: BusInfo,
  busRoute: BusRoute,
  liveTracking: LiveTracking,
  settings: Settings,
  stopLocation: StopLocation,
  notifications: Notifications
}, {
    initialRouteName: "signIn",
    navigationOptions: {

      headerTitle: 'Routes',
      headerTitleStyle: { fontFamily: "OpenSans-Bold", fontWeight: null },

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
