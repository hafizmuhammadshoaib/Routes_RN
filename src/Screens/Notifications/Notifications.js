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

class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state = { notification: false }
    }
    render() {
        return (
            <View style={{ flex: 1 }} >
                <List>
                    <ListItem style={{ justifyContent: "space-between" }} onPress={() => { this.setState({ notification: !this.state.notification }) }} >
                        {this.state.notification ? <Ionicons name={"ios-notifications"} size={30} color={"#2FCC71"} />
                            :
                            <Ionicons name={"ios-notifications-outline"} size={30} />}

                        <Text style={{ fontFamily: "OpenSans-Regular", fontSize: fontScale * 18 }} >Notifications</Text>
                        <Switch trackColor={{ true: "#2FCC71", false: "red" }} onValueChange={(e) => { console.log("on value change"); this.setState({ notification: !this.state.notification }) }} value={this.state.notification} />
                    </ListItem>
                </List>
            </View>
        )
    }
}
export default Notifications;