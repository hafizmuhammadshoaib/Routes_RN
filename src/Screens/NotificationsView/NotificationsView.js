import React, { Component } from 'react';
import {
    Alert,
    Platform,
    StyleSheet,
    PermissionsAndroid, View, Dimensions, Image, Switch, FlatList, Text, TouchableOpacity, AsyncStorage
} from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Fab, Button, Icon, Drawer, List, ListItem, } from "native-base";
const { height, width, fontScale, scale } = Dimensions.get("window");
import MapView from 'react-native-maps';
import Polyline from '@mapbox/polyline';
import Feather from "react-native-vector-icons/Feather";

import AuthActions from '../../Store/Actions/AuthActions/AuthActions';
import { connect } from "react-redux";
import DBActions from '../../Store/Actions/DBActions/DBActions';
import Ionicons from "react-native-vector-icons/Ionicons";
import ToggleSwitch from 'toggle-switch-react-native';

class NotificationsView extends Component {
    constructor(props) {
        super(props);
        this.state = { value: true }
    }
    static navigationOptions = {
        headerTitle: 'Notifcation',
        headerTitleStyle: { fontFamily: "OpenSans-Regular", fontWeight: null, color: "#fff" }
    };
    render() {
        return (
            <View style={{ flex: 1 }} >
                <List>
                    <ListItem style={{ justifyContent: "space-between" }} onPress={() => { this.setState({ notification: !this.state.notification }) }} >
                        {this.state.value ? <Ionicons name={"ios-notifications"} size={30} color={"#2FCC71"} />
                            :
                            <Ionicons name={"ios-notifications-outline"} size={30} color={"#e74c3c"} />}

                        <Text style={{ fontFamily: "OpenSans-Regular", fontSize: fontScale * 18 }} >Notifications</Text>
                        <ToggleSwitch
                            isOn={this.state.value}
                            onColor='#2FCC71'
                            offColor='#e74c3c'
                            size='medium'
                            onToggle={(isOn) => this.setState({ value: isOn })}
                        />
                    </ListItem>
                </List>
            </View>
        )
    }
}
export default NotificationsView;