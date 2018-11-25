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
const mapStateToProps = state => {
    console.log(state);
    return {
        isProgress_db: state.dbReducer["isProgress_db"],
        user: state.authReducer['user'],
        isError_db: state.dbReducer["isError_db"],
        errorText_db: state.dbReducer["errorText_db"],
        token: state.authReducer["token"],
        bus_route: state.dbReducer["bus_route"]


    };
};
const mapDispatchToProps = dispatch => {
    return {
        // signOut: () => dispatch(AuthActions.signOut()),
        // setUnmountFlag: (value) => dispatch(AuthActions.setUnmountFlag(value)),
        getBusRoute: (token, busName) => { dispatch(DBActions.getBusRoute(token, busName)) }
    };
};
const dataArray = [
    { title: "HU 01", bus_name: "HU 01" },
    { title: "HU 02", bus_name: "HU 02" },
    { title: "HU 38", bus_name: "HU 38" }
];
class BusRoute extends Component {
    constructor(props) {
        super(props);
    }
    static navigationOptions = {
        headerTitle: 'Bus Route',
        headerTitleStyle: { fontFamily: "OpenSans-Regular", fontWeight: null }
    };
    getDirection = (bus_name) => {
        this.props.getBusRoute(this.props.token, bus_name);
        this.props.navigation.navigate("mapScreen")

    }
    replaceScreen = (route) => {
        this.props.navigation.dispatch({
            type: 'ReplaceCurrentScreen',
            key: `${route}`,
            routeName: `${route}`,
        });
    }

    render() {
        return (
            <View style={{ flex: 1 }} >
                <FlatList data={dataArray}
                    renderItem={({ item, index }) => (
                        <ListItem onPress={() => this.getDirection(item.bus_name)} style={{ justifyContent: "space-between" }} >
                            <Text style={{ fontFamily: "OpenSans-Regular", fontSize: fontScale * 18 }} >{item.title}</Text>
                            <Ionicons name="ios-arrow-dropright" size={25} color="#2FCC71" />
                        </ListItem>

                    )}

                />

            </View>
        )
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BusRoute);  