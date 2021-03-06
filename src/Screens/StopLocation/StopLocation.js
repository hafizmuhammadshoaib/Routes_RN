import React, { Component } from 'react';
import {
    Alert,
    Platform,
    StyleSheet,
    PermissionsAndroid, View, Dimensions, Image, FlatList, Text, TouchableOpacity, AsyncStorage
} from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Fab, Button, Icon, Drawer, Spinner } from "native-base";
const { height, width, fontScale, scale } = Dimensions.get("window");
import MapView from 'react-native-maps';
import Polyline from '@mapbox/polyline';
import Feather from "react-native-vector-icons/Feather";

import AuthActions from '../../Store/Actions/AuthActions/AuthActions';
import { connect } from "react-redux";
import DBActions from '../../Store/Actions/DBActions/DBActions';
import Ionicons from "react-native-vector-icons/Ionicons";
const LATITUDE_DELTA = 0.0030046550267357475;
const LONGITUDE_DELTA = 0.001863129436983968;
const initialRegion = {
    latitude: -37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
}
const mapStateToProps = state => {
    console.log(state);
    return {
        isProgress: state.authReducer["isProgress"],
        user: state.authReducer['user'],
        isError: state.authReducer["isError"],
        errorText: state.authReducer["errorText"],
        token: state.authReducer["token"],
        callSuccess: state.authReducer["callSuccess"]



    };
};
const mapDispatchToProps = dispatch => {
    return {
        setStopLocation: (token, email, lat, lng) => { dispatch(DBActions.setStopLocation(token, email, lat, lng)) },
        callSuccessFlagFalse: () => { dispatch(DBActions.callSuccessFlag()) },

    };
};
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

class StopLocation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ready: true,
            region: {
                latitude: -37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            stopCoordinate: null,
            mapMoving: false
        }
    }
    componentDidMount() {
        this.requestPermission();
    }
    static getDerivedStateFromProps = (props, state) => {
        console.log("user", props.user)
        if (props.callSuccess && props.navigation.isFocused()) {
            try {
                console.log("token", props.token)
                // await AsyncStorage.setItem('token', token);

                _storeData(props.user);
                props.navigation.goBack();
                props.callSuccessFlagFalse();

            } catch (error) {
                // Error saving data
            }
        }
        return null;
    }
    setRegion(region) {
        if (this.state.ready) {
            setTimeout(() => { this.map && this.map.animateToRegion(region) }, 400);
        }
        //this.setState({ region });
    }
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
                    this.setState({
                        stopCoordinate: {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        }
                    })
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
        this.setState({ mapMoving: true })
    };

    onRegionChangeComplete = (region) => {
        console.log('onRegionChangeComplete', region);
        this.setState({ mapMoving: false, stopCoordinate: { latitude: region.latitude, longitude: region.longitude } })
    };
    confirmHandler = () => {
        this.props.setStopLocation(this.props.token, this.props.user.email, this.state.stopCoordinate.latitude, this.state.stopCoordinate.longitude)
        // this.props.navigation.goBack();
    }
    render() {
        return (
            <View>
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


                    {/* <MapView.Marker draggable
                        coordinate={this.state.stopCoordinate}
                        onDragEnd={(e) => this.setState({ stopCoordinate: e.nativeEvent.coordinate })}
                    /> */}



                </MapView>
                <Image source={require("../../../assets/images/map-marker.png")} style={{ width: width / 8, height: width / 8, zIndex: 10, position: "absolute", borderRadius: width / 8, top: height / 2.25, left: width / 2.3, alignItems: "center", justifyContent: "center" }} resizeMode="contain" />
                {
                    this.props.isProgress && <Spinner style={{ position: "absolute", top: height / 1.8, left: width / 1.8 }} />
                }
                {!this.state.mapMoving && <View style={{ backgroundColor: "#fff", height: height / 6, width: width / 1.5, position: "absolute", top: height / 1.4, left: width / 5, justifyContent: "center", alignItems: "center" }}  >
                    <Button onPress={this.confirmHandler} style={{ alignSelf: "center", width: width / 2, backgroundColor: "#2FCC71", justifyContent: "center" }} ><Text style={{ fontFamily: "OpenSans-Regular", color: "#fff" }} >Confirm</Text></Button>
                </View>}
            </View>
        )
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StopLocation);  