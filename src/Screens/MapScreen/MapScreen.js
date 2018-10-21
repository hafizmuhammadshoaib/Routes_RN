import React, { Component } from 'react';
import {
    Platform, StyleSheet, Text, View,
    Dimensions, PermissionsAndroid
} from 'react-native';

import MapView from "react-native-maps";
const { height, width, fontScale, scale } = Dimensions.get("window")


export default class MapScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            latitude: 0,
            longitude: 0,
        }
        this._map = null;

    }
    componentDidMount() {
        
        this.requestPermission();


    }
    
    requestPermission = async () => {
        try {

            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                alert(granted)
                navigator.geolocation.getCurrentPosition((position) => {

                    this.setState({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,

                    }

                    );
                }, { enableHighAccuracy: true, timeout: 5000 })

            } else {
                alert("not granted")
            }
        } catch (err) {
            alert(err);
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <MapView

                    ref={component => this._map = component}
                    style={styles.map}
                    initialRegion={{
                        latitude: this.state.latitude,
                        longitude: this.state.longitude,
                        latitudeDelta: 1,
                        longitudeDelta: 1
                    }}

                    region={{
                        latitude: this.state.latitude,
                        longitude: this.state.longitude,
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121,
                    }}

                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    showsCompass={true}

                >
                </MapView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        height: height - 100,
        width: width,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});
