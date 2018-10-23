import React, { Component } from 'react';
import {
    Alert,
    Platform,
    StyleSheet,
    PermissionsAndroid, View, Dimensions, ScrollView, Image, FlatList, Text, TouchableOpacity, AsyncStorage
} from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Fab, Button, Icon, Drawer, Accordion, Card, CardItem, ListItem } from "native-base";
const { height, width, fontScale, scale } = Dimensions.get("window");
import MapView from 'react-native-maps';
import Polyline from '@mapbox/polyline';
import Feather from "react-native-vector-icons/Feather";
import AuthActions from '../../Store/Actions/AuthActions/AuthActions';
import { connect } from "react-redux";
import DBActions from '../../Store/Actions/DBActions/DBActions';
import Ionicons from "react-native-vector-icons/Ionicons";
const dataArray = [
    { title: "HU 01" },
    { title: "HU 02" },
    { title: "HU 03" }
];
class BusRoute extends Component {
    constructor(props) {
        super(props);
    }
    static navigationOptions = {
        headerTitle: 'Bus Route',
        headerTitleStyle: { fontFamily: "OpenSans-Regular", fontWeight: null }
    };
    render() {
        return (
            <View style={{ flex: 1 }} >
                <FlatList data={dataArray}
                    renderItem={({ item, index }) => (
                        <ListItem style={{ justifyContent: "space-between" }} >
                            <Text style={{ fontFamily: "OpenSans-Regular", fontSize: fontScale * 18 }} >{item.title}</Text>
                            <Ionicons name="ios-arrow-dropright" size={25} color="#2FCC71" />
                        </ListItem>

                    )}

                />

            </View>
        )
    }
}
export default BusRoute;