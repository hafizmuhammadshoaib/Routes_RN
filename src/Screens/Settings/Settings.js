import React, { Component } from 'react';
import {
    Alert,
    Platform,
    StyleSheet,
    PermissionsAndroid, View, Dimensions, ScrollView, Image, FlatList, TouchableOpacity, AsyncStorage
} from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Fab, Button, Icon, Drawer, Accordion, Card, CardItem, ListItem, List, Text, Body, Right } from "native-base";
const { height, width, fontScale, scale } = Dimensions.get("window");
import MapView from 'react-native-maps';
import Polyline from '@mapbox/polyline';
import Feather from "react-native-vector-icons/Feather";
import AuthActions from '../../Store/Actions/AuthActions/AuthActions';
import { connect } from "react-redux";
import DBActions from '../../Store/Actions/DBActions/DBActions';
import Ionicons from "react-native-vector-icons/Ionicons";

class Settings extends Component {

    constructor(props) {
        super(props);

    }
    render() {
        return (
            <View style={{ flex: 1 }} >
                <List>
                    <ListItem onPress={()=>this.props.navigation.navigate("stopLocation")} >
                        <Body>
                            <Text style={{ fontFamily: "OpenSans-SemiBold" }} >Set Your Stop Location </Text>
                            <Text note style={{ fontFamily: "OpenSans-Light" }} >Set your pinpoint stop location</Text>
                        </Body>
                        <Right>
                            <Ionicons name="ios-arrow-dropright" size={25} color="#2FCC71" />

                        </Right>
                    </ListItem>
                    <ListItem style={{}} >
                        <Body>
                            <Text style={{ fontFamily: "OpenSans-SemiBold" }} >About</Text>
                            <Text note style={{ fontFamily: "OpenSans-Light" }} >Version 1.0 </Text>
                        </Body>
                        <Right>
                            <Ionicons name="ios-arrow-dropright" size={25} color="#2FCC71" />

                        </Right>
                    </ListItem>
                    {/* <ListItem>
                        <Text>Dejan Lovren</Text>
                    </ListItem> */}
                </List>
            </View>
        )
    }



}
export default Settings;