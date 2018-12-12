import React, { Component } from 'react';
import {
    Alert,
    Platform,
    StyleSheet,
    PermissionsAndroid, View, Dimensions, ScrollView, Image, FlatList, TouchableOpacity, AsyncStorage, Modal, ToastAndroid
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
const _storeData = async (user) => {

    try {

        // await AsyncStorage.setItem('token', token, (error) => console.log("error saving data", error));
        await AsyncStorage.setItem("user", JSON.stringify(user), (error) => console.log("error saving data", error))
        console.log("value saved in async storage")

    } catch (error) {
        console.log("store data error", error)
        // Error saving data
    }
}
const mapStateToProps = state => {
    console.log(state);
    return {
        isProgress: state.authReducer["isProgress"],
        user: state.authReducer['user'],
        isError: state.authReducer["isError"],
        errorText: state.authReducer["errorText"],
        token: state.authReducer["token"],
        callSuccess: state.authReducer["callSuccess"],
        allBusInfo: state.dbReducer["allBusInfo"]



    };
};
const mapDispatchToProps = dispatch => {
    return {
        updateBusName: (token, email, busName) => { dispatch(DBActions.updateBusName(token, email, busName)) },
        callSuccessFlagFalse: () => { dispatch(DBActions.callSuccessFlag()) },
    };
};

class Settings extends Component {

    constructor(props) {
        super(props);
        this.state = { showListOfBus: false }

    }
    static navigationOptions = {
        headerTitle: 'Live Tracking',
        headerTitleStyle: { fontFamily: "OpenSans-Regular", fontWeight: null, color: "#fff" }
    };
    static getDerivedStateFromProps = (props, state) => {
        console.log("user", props.user)
        if (props.callSuccess && props.navigation.isFocused()) {
            try {
                console.log("token", props.token)
                // await AsyncStorage.setItem('token', token);

                _storeData(props.user);
                ToastAndroid.show("Bus name updated successfully", ToastAndroid.SHORT);
                props.callSuccessFlagFalse();
            } catch (error) {
                // Error saving data
            }
        }
        return null;
    }
    onPressBusNameList = (busName) => {
        this.props.updateBusName(this.props.token, this.props.user.email, busName);
        this.setState({ showListOfBus: false })
    }
    render() {
        return (
            <View style={{ flex: 1 }} >
                <List>
                    <ListItem onPress={() => this.props.navigation.navigate("stopLocation")} >
                        <Body>
                            <Text style={{ fontFamily: "OpenSans-SemiBold" }} >Set Your Stop Location </Text>
                            <Text note style={{ fontFamily: "OpenSans-Light" }} >Set your pinpoint stop location</Text>
                        </Body>
                        <Right>
                            <Ionicons name="ios-arrow-dropright" size={25} color="#2FCC71" />

                        </Right>
                    </ListItem>
                    <ListItem onPress={() => { this.setState({ showListOfBus: true }) }} >
                        <Body>
                            <Text style={{ fontFamily: "OpenSans-SemiBold" }} >Update Your Bus Name</Text>
                            <Text note style={{ fontFamily: "OpenSans-Light" }} >keep your bus name up to date</Text>
                        </Body>
                        <Right>
                            <Ionicons name="ios-arrow-dropright" size={25} color="#2FCC71" />

                        </Right>
                    </ListItem>
                    {/* <ListItem>
                        <Body>
                            <Text style={{ fontFamily: "OpenSans-SemiBold" }} >Update profile</Text>
                            <Text note style={{ fontFamily: "OpenSans-Light" }} >update your name and CMSID </Text>
                        </Body>
                        <Right>
                            <Ionicons name="ios-arrow-dropright" size={25} color="#2FCC71" />

                        </Right>
                    </ListItem> */}
                    <ListItem>
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
                <Modal presentationStyle={"fullScreen"} visible={this.state.showListOfBus} onRequestClose={() => this.setState({ showListOfBus: false })}  >
                    <FlatList style={{ height, width }} data={this.props.allBusInfo} renderItem={({ item, index }) => {
                        {
                            return (this.props.user.userInfo.busName == item.bus_name
                                ?
                                (<ListItem>
                                    <Body>
                                        <Text style={{ fontFamily: "OpenSans-SemiBold", color: "#2FCC71" }} >{item.bus_name}</Text>
                                    </Body>
                                    <Right>
                                        <Ionicons name="md-checkmark" size={25} color="#2FCC71" />

                                    </Right>
                                </ListItem>)
                                :
                                (<ListItem onPress={() => this.onPressBusNameList(item.bus_name)}  >
                                    <Text style={{ fontFamily: "OpenSans-Regular" }} >{item.bus_name}</Text>
                                </ListItem>))
                        }
                    }
                    } />
                </Modal>
            </View>
        )
    }



}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Settings);  