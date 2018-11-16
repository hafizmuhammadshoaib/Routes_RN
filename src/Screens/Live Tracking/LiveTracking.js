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
class LiveTracking extends Component {
    constructor(props) {
        super(props);
    }
    static navigationOptions = {
        headerTitle: 'Live Tracking',
        headerTitleStyle: { fontFamily: "OpenSans-Regular", fontWeight: null }
    };
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "#f5f5f5" }} >
                <FlatList data={dataArray}
                    renderItem={({ item, index }) => (
                        <ListItem onPress={() => { this.props.navigation.navigate("mapScreen", { eventName: item.title }) }} style={{ flex: 1, justifyContent: "space-between", backgroundColor: "#f5f5f5" }} >
                            <Text style={{ fontFamily: "OpenSans-Regular", fontSize: fontScale * 18 }} >{item.title}</Text>
                            <Button style={{ backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#2FCC71", width: width * 0.25, borderRadius: width / 5, justifyContent: "center" }}  ><Text style={{ fontFamily: "OpenSans-Regular", fontSize: fontScale * 15, color: "#2FCC71" }} >Start</Text></Button>
                        </ListItem>

                    )}

                />

            </View>
        )
    }
}
export default LiveTracking;