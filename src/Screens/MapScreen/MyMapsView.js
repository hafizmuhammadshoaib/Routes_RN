import React from 'react';
import {
    Alert,
    Platform,
    StyleSheet,
    PermissionsAndroid, View, Dimensions, Image, FlatList, Text, TouchableOpacity, AsyncStorage
} from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Fab, Button, Icon, Drawer } from "native-base";
const { height, width, fontScale, scale } = Dimensions.get("window");
import MapView, { Marker } from 'react-native-maps';
import Polyline from '@mapbox/polyline';
import Feather from "react-native-vector-icons/Feather";
import busRoute from "./busroutes";
import AuthActions from '../../Store/Actions/AuthActions/AuthActions';
import { connect } from "react-redux";
import DBActions from '../../Store/Actions/DBActions/DBActions';
import Ionicons from "react-native-vector-icons/Ionicons";
import SocketIOClient from 'socket.io-client';
import firebase from "react-native-firebase";
const drawerDataArray = [{ name: "Live Tracking", icon: require("../../../assets/images/gps-route.png"), route: (ref) => { ref.closeDrawer(); ref.props.navigation.navigate("liveTracking"); } },
{ name: "Bus Route", icon: require("../../../assets/images/route.png"), route: (ref) => { ref.closeDrawer(); ref.props.navigation.navigate("busRoute") } },
{ name: "Bus Info", icon: require("../../../assets/images/info.png"), route: (ref) => { ref.closeDrawer(); ref.props.navigation.navigate("busInfo") } },
{ name: "Notification", icon: require("../../../assets/images/notification.png"), route: (ref) => { ref.closeDrawer(); ref.props.navigation.navigate("notificationsView") } },
{ name: "ETA", icon: require("../../../assets/images/clockwise.png"), },
{ name: "Settings", icon: require("../../../assets/images/settings-2.png"), route: (ref) => { ref.closeDrawer(); ref.props.navigation.navigate("settings") } }];
let ref;
const mapStateToProps = state => {
    console.log(state);
    return {
        isProgress_db: state.dbReducer["isProgress_db"],
        user: state.authReducer['user'],
        isError_db: state.dbReducer["isError_db"],
        errorText_db: state.dbReducer["errorText_db"],
        token: state.authReducer["token"],
        bus_route: state.dbReducer["bus_route"],
        allBusInfo: state.dbReducer["allBusInfo"]


    };
};
const mapDispatchToProps = dispatch => {
    return {
        signOut: () => dispatch(AuthActions.signOut()),
        setUnmountFlag: (value) => dispatch(AuthActions.setUnmountFlag(value)),
        getBusRoute: (token, busName) => { dispatch(DBActions.getBusRoute(token, busName)) },
        clearRoute: () => { dispatch(DBActions.clearRoute()) },
        clearError: () => { dispatch(DBActions.clearError()) },
        getAllBusInfo: (token) => { dispatch(DBActions.getAllBusInfo(token)) }
    };
};

const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;


const initialRegion = {
    latitude: -37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
}

class MyMapView extends React.Component {
    constructor(props) {
        super(props);
        ref = this;
        this.map = null;
        console.log(this.props, "props on map")
        this.socket = SocketIOClient("https://warm-thicket-69046.herokuapp.com", {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 99999,
            transports: ['websocket']
        });
        this.state = {
            region: {
                latitude: -37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            start_location: null,
            end_location: null,
            ready: true,
            filteredMarkers: [],
            coords: [],
            distance: 0,
            curr_location: false,
            curr_location_lat: 0,
            curr_location_lng: 0,
            curr_location_bus_name: "",
            curr_bus_no_of_students: 0
        };
        this.drawer = null;

        firebase.messaging().subscribeToTopic(`/topics/${this.props.user && this.props.user._id}`);

    }


    setRegion(region) {
        if (this.state.ready) {
            setTimeout(() => { this.map && this.map.animateToRegion(region) }, 400);
        }
        //this.setState({ region });
    }

    componentDidMount() {
        console.log('Component did mount');
        this.requestPermission();
        // this.getDirections();
        // this.props.getBusRoute(this.props.token, "HU_2");
        this.props.navigation.setParams({ "openDrawer": this.openDrawer });
        this.props.getAllBusInfo(this.props.token);

        // this.socket.on("HU 03", (object) => {
        //     alert("yes listening")
        // })

    }

    closeDrawer = () => {
        if (this.drawer)
            this.drawer._root.close()
    };

    openDrawer = () => {
        if (this.drawer)
            this.drawer._root.open()
    };
    trackLocation = (object) => {

        this.setState({ curr_location: true, curr_location_bus_name: object.bus_name, curr_location_lat: Number(object.lat), curr_location_lng: Number(object.lng) });
        this.setRegion({ latitude: Number(object.lat), longitude: Number(object.lng), latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA, })

    }
    currentNumberOfStudents = (object) => {
        this.setState({ curr_bus_no_of_students: object && object.numberOfStudents })
    }
    static navigationOptions = ({ navigation, }) => {

        console.log("open drawer function", navigation.getParam("openDrawer"));
        // console.log("open drawer function", navigation.getParam("eventName"));
        console.log("ref.trackLocation", ref && ref.trackLocation)
        let eventName = navigation.getParam("eventName");
        if (eventName && eventName.length > 0) {
            ref && ref.socket.removeAllListeners();
            console.log("event name inside if", eventName)
            ref && ref.socket.on(eventName, ref.trackLocation)
            ref && ref.socket.on(`att${eventName}`, ref.currentNumberOfStudents)
        }



        return {

            headerLeft: (
                <TouchableOpacity onPress={navigation.getParam("openDrawer")} style={{ marginLeft: 12, backgroundColor: "transparent" }} ><Icon name="menu" style={{ color: "#fff" }} /></TouchableOpacity>
            ),
        }

    };

    requestPermission = async () => {
        try {

            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                this.getCurrentPosition();
            } else {
                alert("not granted")
            }
        } catch (err) {
            alert(err);
        }
    }

    getCurrentPosition = () => {
        try {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const region = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    };
                    this.setRegion(region);
                },
                (error) => {
                    //TODO: better design
                    switch (error.code) {
                        case 1:
                            if (Platform.OS === "ios") {
                                Alert.alert("", "To locate your location enable permission for the application in Settings - Privacy - Location");
                            } else {
                                Alert.alert("", "To locate your location enable permission for the application in Settings - Apps - Routes - Location");
                            }
                            break;
                        default:
                            Alert.alert("", "Failed to detect your location");
                    }
                }, { enableHighAccuracy: true, timeout: 15000, }
            );
        } catch (e) {
            alert(e.message || "");
        }
    };

    onMapReady = (e) => {
        if (!this.state.ready) {
            this.setState({ ready: true });
        }
    };

    onRegionChange = (region) => {
        console.log('onRegionChange', region);
    };

    onRegionChangeComplete = (region) => {
        console.log('onRegionChangeComplete', region);
    };
    replaceScreen = (route) => {
        this.props.navigation.dispatch({
            type: 'ReplaceCurrentScreen',
            key: `${route}`,
            routeName: `${route}`,
        });
    }
    signOut = () => {
        firebase.messaging().unsubscribeFromTopic(`/topics/${this.props.user && this.props.user._id}`)
        this.props.signOut();
        this.props.setUnmountFlag(false);
        AsyncStorage.clear().then(() => {
            this.replaceScreen("signIn");
        }).catch(err => {
            console.log("error", err);
        })
    }

    render() {

        // const { region } = this.state;
        // const { children, renderMarker, markers } = this.props;
        console.log("state:::", this.state)

        return (
            <Drawer
                panOpenMask={20}
                panCloseMask={40}
                ref={(ref) => { this.drawer = ref; }}
                content={<View style={{ flex: 1, backgroundColor: "#fff" }} >
                    <View style={{ flex: 0.25, backgroundColor: "#2FCC71", padding: 10 }} >
                        <View>
                            <Ionicons name="md-person" size={width / 5} color="#fff" style={{ alignSelf: "center" }} />
                        </View>

                        <View style={{ marginTop: "auto" }} >
                            <Text style={{ fontFamily: "OpenSans-Bold", color: "#fff", fontSize: fontScale * 15 }} > {this.props.user && this.props.user.name} </Text>
                            <Text style={{ fontFamily: "OpenSans-Regular", color: "#fff", fontSize: fontScale * 13 }} > {this.props.user && this.props.user.email} </Text>
                        </View>
                    </View>
                    <View style={{ flex: 0.65, }} >
                        <FlatList data={drawerDataArray} renderItem={({ item, index }) => (
                            <TouchableOpacity activeOpacity={0.6} onPress={() => { item.route && item.route(this) }} key={index} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10, padding: 10, backgroundColor: "#f9f9f9" }} >
                                <Image source={item.icon} style={{ width: width / 12, height: width / 12, marginRight: 17 }} resizeMode="contain" />
                                <Text style={{ fontFamily: "OpenSans-Regular", fontSize: fontScale * 18, marginRight: "auto" }} >{item.name}</Text>
                            </TouchableOpacity>
                        )
                        }
                        />
                    </View>
                    <View style={{ flex: 0.1, marginTop: "auto" }} >
                        <Button onPress={this.signOut} style={{ borderRadius: width / 9, width: width * 0.4, justifyContent: "center", backgroundColor: "#2FCC71", alignSelf: "center" }} ><Text style={{ color: "#fff", fontFamily: "OpenSans-Regular" }}  >Logout</Text></Button>
                    </View>
                </View>
                }
                onClose={() => this.closeDrawer()} >


                {/* //Maps View */}

                <View style={{}} >
                    {/* <View  > */}
                    <MapView
                        showsUserLocation
                        ref={map => { this.map = map }}

                        initialRegion={initialRegion}

                        onMapReady={this.onMapReady}
                        // showsMyLocationButton={true}
                        onRegionChange={this.onRegionChange}
                        onRegionChangeComplete={this.onRegionChangeComplete}
                        style={{
                            width: width,
                            height: height,
                            zIndex: -1
                        }}
                        textStyle={{ color: '#bc8b00' }}
                        containerStyle={{ backgroundColor: 'white', borderColor: '#BC8B00' }}>

                        {/* {markers.map(renderMarker)} */}

                        {/* {children && children || null} */}
                        {this.state.curr_location && <MapView.Marker
                            coordinate={{ "latitude": Number(this.state.curr_location_lat), "longitude": Number(this.state.curr_location_lng) }}
                            title={`${this.state.curr_location_bus_name} Number Of Students:${this.state.curr_bus_no_of_students}`} />}

                        {/* <MapView.Polyline
                            coordinates={this.state.coords}
                            strokeWidth={10}
                            strokeColor="cyan" /> */}
                        {/* <MapView.Polyline
                            coordinates={[{ "latitude": 24.890988, "longitude": 67.077513 }, { "latitude": 24.893365, "longitude": 67.080659 }, { "latitude": 24.915589, "longitude": 67.093708 }]}
                            strokeWidth={10}
                            strokeColor="cyan" /> */}

                        {this.props.user && this.props.user.userInfo.stopLocation.lat > 0 && <Marker title={`Your Stop`} coordinate={{ latitude: this.props.user && Number(this.props.user.userInfo.stopLocation.lat), longitude: this.props.user && Number(this.props.user.userInfo.stopLocation.lng) }} image={require("../../../assets/images/location-pin.png")} />}

                    </MapView>
                    {/* </View> */}
                    <Button style={{ backgroundColor: "#fff", width: width / 8, height: width / 8, zIndex: 10, position: "absolute", borderRadius: width / 8, top: height / 1.3, left: width / 1.2, alignItems: "center", justifyContent: "center" }} onPress={this.getCurrentPosition} ><MaterialIcons name="my-location" size={20} /></Button>

                </View >
            </Drawer>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MyMapView);  