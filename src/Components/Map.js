import React, { Component } from 'react';
import {
    Alert,
    Platform,
    StyleSheet,
    PermissionsAndroid, View, Dimensions, Image, FlatList, Text, TouchableOpacity, AsyncStorage
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Polyline from '@mapbox/polyline';
const { height, width, fontScale, scale } = Dimensions.get("window");
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;


export default class Map extends Component {
    constructor(props) {
        super(props);
        this.map = null;
        this.state = { ready: true, getDirections: this.getDirections, coords: [], start_location: null, end_location: null, distance: 0 }
    }
    setRegion(region) {
        if (this.state.ready) {
            setTimeout(() => { this.map && this.map.animateToRegion(region) }, 400);
        }
        //this.setState({ region });
    }
    getDirections = (busRoute) => {
        console.log("get directions", busRoute)
        // try {
        // let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=24.933145,67.085385&destination=25.083330,67.012572&key=AIzaSyDDmyFwVLZ7Fys0sWTDMxa7h_Dyy79BXuM`)
        // let respJson = await resp.json();
        let coords = [];
        let start_location = null;
        let end_location = null;
        let distance = 0;
        let time = 0;
        busRoute && busRoute.map((obj, index) => {

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
            distance += obj.routes[0].legs[0].distance.value;
            time += obj.routes[0].legs[0].duration.value;
        })
        // const region = {
        //     latitude: position.coords.latitude,
        //     longitude: position.coords.longitude,
        //     latitudeDelta: LATITUDE_DELTA,
        //     longitudeDelta: LONGITUDE_DELTA,
        // };
        // console.log("legs", respJson.routes[0].legs[0])
        // this.setState({ coords: coords, start_location: respJson.routes[0].legs[0].start_location, end_location: respJson.routes[0].legs[0].end_location })
        this.setState({ coords: coords, start_location, end_location, distance: distance / 1000 })
        start_location && this.setRegion({ latitude: start_location.lat, longitude: start_location.lng, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA, });
        this.props.getDistanceAndTime(distance, time)
        // return coords
        // } catch (error) {
        //     alert(error)
        //     return error
        // }
    }
    componentDidMount() {
        this.getDirections(this.props.busRoute)
    }
    render() {
        return (
            <MapView
                showsUserLocation
                ref={map => { this.map = map }}

                // initialRegion={initialRegion}

                // onMapReady={this.onMapReady}
                // showsMyLocationButton={true}
                // onRegionChange={this.onRegionChange}
                // onRegionChangeComplete={this.onRegionChangeComplete}
                style={{
                    width: width,
                    height: height * 0.9,
                    zIndex: -1
                }}
                textStyle={{ color: '#bc8b00' }}
                containerStyle={{ backgroundColor: 'white', borderColor: '#BC8B00' }}>

                {/* {markers.map(renderMarker)} */}

                {/* {children && children || null} */}
                {this.state.start_location && <Marker
                    coordinate={{ "latitude": this.state.start_location && this.state.start_location.lat, "longitude": this.state.start_location && this.state.start_location.lng }}
                    title={`total distance ${this.state.distance} km`} />}
                {this.state.end_location && <Marker
                    coordinate={{ "latitude": this.state.end_location && this.state.end_location.lat, "longitude": this.state.end_location && this.state.end_location.lng }}
                    title={`total distance ${this.state.distance} km`} />}
                {/* {this.state.curr_location && <Marker
                    coordinate={{ "latitude": this.state.curr_location_lat, "longitude": this.state.curr_location_lng }}
                    title={this.state.curr_location_bus_name} />} */}
                {this.state.coords.length > 0 && <MapView.Polyline
                    coordinates={this.state.coords}
                    strokeWidth={10}
                    strokeColor="cyan" />
                }


            </MapView>
        )
    }
}
