import React from 'react';
import {
    Alert,
    Platform,
    StyleSheet,
    PermissionsAndroid, View, Dimensions, Text
} from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Fab, Button, Icon } from "native-base";
const { height, width } = Dimensions.get("window");
import MapView from 'react-native-maps';
import Polyline from '@mapbox/polyline';
import busRoute from "./busroutes"
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

        this.map = null;

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
    }
    async getDirections(startLoc, destinationLoc) {

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
            setTimeout(() => this.map.animateToRegion(region), 400);
        }
        //this.setState({ region });
    }

    componentDidMount() {
        console.log('Component did mount');
        this.requestPermission();
        this.getDirections();
    }
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

    render() {

        // const { region } = this.state;
        // const { children, renderMarker, markers } = this.props;

        return (
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
        );
    }
}

export default MyMapView;