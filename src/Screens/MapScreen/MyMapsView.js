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
import MapView from 'react-native-maps';
import Polyline from '@mapbox/polyline';
import Feather from "react-native-vector-icons/Feather";
import busRoute from "./busroutes";
import AuthActions from '../../Store/Actions/AuthActions/AuthActions';
import { connect } from "react-redux";
import DBActions from '../../Store/Actions/DBActions/DBActions';
import Ionicons from "react-native-vector-icons/Ionicons";
const drawerDataArray = [{ name: "Live Tracking", icon: require("../../../assets/images/gps-route.png") },
{ name: "Bus Route", icon: require("../../../assets/images/route.png") },
{ name: "Bus Info", icon: require("../../../assets/images/info.png") },
{ name: "Notification", icon: require("../../../assets/images/notification.png") },
{ name: "Settings", icon: require("../../../assets/images/settings-2.png") }];
let ref;
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
        signOut: () => dispatch(AuthActions.signOut()),
        setUnmountFlag: (value) => dispatch(AuthActions.setUnmountFlag(value)),
        getBusRoute: (token, busName) => { dispatch(DBActions.getBusRoute(token, busName)) }
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
            distance: 0
        };
        this.drawer = null;
    }
    getDirections = (busRoute) => {
        console.log("get directions", busRoute)
        try {
            // let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=24.933145,67.085385&destination=25.083330,67.012572&key=AIzaSyDDmyFwVLZ7Fys0sWTDMxa7h_Dyy79BXuM`)
            // let respJson = await resp.json();
            let coords = [];
            let start_location = null;
            let end_location = null;
            let distance = 0;
            busRoute.map((obj, index) => {

                let points = Polyline.decode(obj.routes[0].overview_polyline.points);
                points.forEach((point, index) => {
                    coords.push({
                        latitude: point[0],
                        longitude: point[1]
                    })
                })
                if (index == 0) {
                    start_location = obj.routes[0].legs[0].start_location
                } if (index == busRoute.length - 1) {
                    end_location = obj.routes[0].legs[0].end_location
                }
                distance += obj.routes[0].legs[0].distance.value
            })
            // console.log("legs", respJson.routes[0].legs[0])
            // this.setState({ coords: coords, start_location: respJson.routes[0].legs[0].start_location, end_location: respJson.routes[0].legs[0].end_location })
            this.setState({ coords: coords, start_location, end_location, distance: distance / 1000 })
            return coords
        } catch (error) {
            alert(error)
            return error
        }
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
        this.props.getBusRoute(this.props.token, "HU_2");
        this.props.navigation.setParams({ "openDrawer": this.openDrawer });
    }
    static getDerivedStateFromProps = (nextProps, prevState) => {
        if (nextProps.bus_route.length > 0) {
            ref.getDirections(nextProps.bus_route);
        }
        return null;
    }

    closeDrawer = () => {
        if (this.drawer)
            this.drawer._root.close()
    };

    openDrawer = () => {
        if (this.drawer)
            this.drawer._root.open()
    };
    static navigationOptions = ({ navigation }) => {

        console.log("open drawer function", navigation.getParam("openDrawer"))
        return {

            headerLeft: (
                <TouchableOpacity onPress={navigation.getParam("openDrawer")} style={{ marginLeft: 12, backgroundColor: "transparent" }} ><Icon name="menu" style={{ color: "#000" }} /></TouchableOpacity>
            ),
        }

    };

    requestPermission = async () => {
        try {

            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // alert(granted)
                // navigator.geolocation.getCurrentPosition((position) => {

                //     this.setState({
                //         latitude: position.coords.latitude,
                //         longitude: position.coords.longitude,

                //     }

                //     );
                // })
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
                            <Text style={{ fontFamily: "OpenSans-Bold", color: "#fff", fontSize: fontScale * 15 }} > {this.props.user.name} </Text>
                            <Text style={{ fontFamily: "OpenSans-Regular", color: "#fff", fontSize: fontScale * 13 }} > {this.props.user.email} </Text>
                        </View>
                    </View>
                    <View style={{ flex: 0.65, }} >
                        <FlatList data={drawerDataArray} renderItem={({ item, index }) => (
                            <TouchableOpacity activeOpacity={0.6} key={index} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10, padding: 10, backgroundColor: "#f9f9f9" }} >
                                <Image source={item.icon} style={{ width: width / 10, height: width / 10, marginRight: 17 }} resizeMode="contain" />
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
                        showsMyLocationButton={true}
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
                        {this.state.start_location && <MapView.Marker
                            coordinate={{ "latitude": this.state.start_location && this.state.start_location.lat, "longitude": this.state.start_location && this.state.start_location.lng }}
                            title={`total distance ${this.state.distance} km`} />}
                        {this.state.end_location && <MapView.Marker
                            coordinate={{ "latitude": this.state.end_location && this.state.end_location.lat, "longitude": this.state.end_location && this.state.end_location.lng }}
                            title={`total distance ${this.state.distance} km`} />}
                        <MapView.Polyline
                            coordinates={this.state.coords}
                            strokeWidth={10}
                            strokeColor="cyan" />


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