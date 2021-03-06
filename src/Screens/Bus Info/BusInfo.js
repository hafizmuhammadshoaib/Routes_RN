import React, { Component } from 'react';
import {
    Alert,
    Platform,
    StyleSheet,
    PermissionsAndroid, View, Dimensions, ScrollView, Image, FlatList, Text, TouchableOpacity, AsyncStorage
} from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Fab, Button, Icon, Drawer, Accordion, Card, CardItem, Spinner } from "native-base";
const { height, width, fontScale, scale } = Dimensions.get("window");
import MapView from 'react-native-maps';
import Polyline from '@mapbox/polyline';
import Feather from "react-native-vector-icons/Feather";
import AuthActions from '../../Store/Actions/AuthActions/AuthActions';
import { connect } from "react-redux";
import DBActions from '../../Store/Actions/DBActions/DBActions';
import Ionicons from "react-native-vector-icons/Ionicons";
import Communications from "react-native-communications";
const dataArray = [
    { title: "HU 01", content: "Lorem ipsum dolor sit amet" },
    { title: "HU 02", content: "Lorem ipsum dolor sit amet" },
    { title: "HU 03", content: "Lorem ipsum dolor sit amet" }
];
const mapStateToProps = state => {
    console.log(state);
    return {
        isProgress_db: state.dbReducer["isProgress_db"],
        user: state.authReducer['user'],
        isError_db: state.dbReducer["isError_db"],
        errorText_db: state.dbReducer["errorText_db"],
        token: state.authReducer["token"],
        busInfo: state.dbReducer["busInfo"],
        busInfoPage: state.dbReducer["busInfoPage"],
        busInfoHasPages: state.dbReducer["busInfoHasPages"],


    };
};
const mapDispatchToProps = dispatch => {
    return {
        // signOut: () => dispatch(AuthActions.signOut()),
        // setUnmountFlag: (value) => dispatch(AuthActions.setUnmountFlag(value)),
        getBusInfo: (token, page) => { dispatch(DBActions.getBusInfo(token, page)) },
        clearInfo: () => { dispatch(DBActions.clearInfo()) },
    };
};
const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
};
class BusInfo extends Component {
    constructor(props) {
        super(props);

    }

    static navigationOptions = {
        headerTitle: 'Bus Information',
        headerTitleStyle: { fontFamily: "OpenSans-Regular", fontWeight: null,color:"#fff" }
    };

    _renderHeader = (title, expanded) => {
        return (
            // <View
            //     style={{ flexDirection: "row", padding: 10, justifyContent: "space-between", alignItems: "center", backgroundColor: "#2FCC71",shadowOffset: { width: 10, height: 10, }, shadowColor: '#EBECF2', shadowOpacity: 1.0, elevation: 8 }}
            // >
            //     <Text style={{ fontFamily: "OpenSans-SemiBold", color: "#f5f5f5", fontSize: fontScale * 18 }}>
            //         {title.title}
            //     </Text>
            //     {expanded
            //         ? <Icon style={{ fontSize: fontScale * 18 }} name="ios-arrow-down" style={{ color: "#f5f5f5" }} />
            //         : <Icon style={{ fontSize: fontScale * 18 }} name="ios-arrow-up" style={{ color: "#f5f5f5" }} />}
            // </View>
            <Card  >
                <CardItem style={{ justifyContent: "space-between", backgroundColor: "#2FCC71" }} >
                    <Text style={{ fontFamily: "OpenSans-SemiBold", color: "#f5f5f5", fontSize: fontScale * 18, }}>
                        {title.bus_name}
                    </Text>
                    {expanded
                        ? <Icon style={{ fontSize: fontScale * 18 }} name="ios-arrow-down" style={{ color: "#f5f5f5" }} />
                        : <Icon style={{ fontSize: fontScale * 18 }} name="ios-arrow-up" style={{ color: "#f5f5f5" }} />}
                </CardItem>
            </Card>
        );
    }
    _renderContent = (content) => {
        return (
            <View style={{ height: height / 4, backgroundColor: "#fff", justifyContent: "center" }} >
                <View style={{ flexDirection: "row" }} >
                    <View style={{ height: width / 8, width: width / 8, borderRadius: width / 8, borderWidth: 1, borderColor: "#d5d5d5", justifyContent: "center", alignItems: "center", }} >

                        <Image source={require("../../../assets/images/school-bus.png")} style={{ width: width / 10, height: height / 10, }} resizeMode="contain" />
                    </View>
                    <View style={{ padding: 5 }} >
                        <Text style={{ fontFamily: "OpenSans-Regular" }} >{`Driver Name: ${content.bus_driver_name}\n`}</Text>
                        <Text style={{ fontFamily: "OpenSans-Regular" }} >{`Phone Number: ${content.bus_driver_phone}\n`}</Text>
                        <Text style={{ marginBottom: 5, fontFamily: "OpenSans-Regular" }} >{`Stop Info: ${content.stop_info}\n`}</Text>
                    </View>
                </View>
                <Button onPress={() => Communications.phonecall(content.bus_driver_phone, true)} style={{ backgroundColor: "#fff", width: width * 0.95, justifyContent: "center", }} >
                    <Text style={{ fontFamily: "OpenSans-Regular" }} >Call Driver</Text>
                    <Image source={require("../../../assets/images/call.png")} style={{ width: width / 15, height: width / 15, marginLeft: 5 }} resizeMode="contain" />
                </Button>
            </View>
        );
    }
    componentDidMount() {
        this.props.clearInfo();
        this.props.getBusInfo(this.props.token, 1);

    }
    requestPages = () => {
        console.log("req pages")
        if (this.props.busInfoHasPages) {
            this.props.getBusInfo(this.props.token, (Number(this.props.busInfoPage) + 1))
        }
    }
    render() {
        return (
            // <ScrollView contentContainerStyle={{ height: height - 80, width }} style={{ backgroundColor: "#f5f5f5" }} >

            <View style={{ flex: 1, backgroundColor: "#f5f5f5", alignItems: "center" }} >
                <FlatList data={this.props.busInfo && this.props.busInfo} renderItem={({ item, index }) => (

                    <Accordion
                        style={{ width: width * 0.95 }}
                        dataArray={[item]}
                        renderHeader={this._renderHeader}
                        renderContent={this._renderContent}
                    />

                )} ListFooterComponent={() =>
                    (<View>
                        {this.props.isProgress_db && <Spinner />}
                    </View>)
                }
                    onEndReached={this.requestPages} onEndReachedThreshold={0.5} />
            </View>
            // </ScrollView>

        )
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BusInfo);  