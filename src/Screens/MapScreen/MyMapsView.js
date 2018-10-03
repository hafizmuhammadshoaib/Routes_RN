import React from 'react';
import {
    Alert,
    Platform,
    StyleSheet,
    PermissionsAndroid
} from 'react-native';
import MapView from 'react-native-maps'

const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;

const initialRegion = {
    latitude: -37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
}

class MyMapView extends React.Component {

    map = null;

    state = {
        region: {
            latitude: -37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        },
        ready: true,
        filteredMarkers: []
    };

    setRegion(region) {
        if (this.state.ready) {
            setTimeout(() => this.map.animateToRegion(region), 10);
        }
        //this.setState({ region });
    }

    componentDidMount() {
        console.log('Component did mount');
        this.requestPermission();
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
    getCurrentPosition() {
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
                }, { enableHighAccuracy: true, timeout: 5000, maximumAge: 10000 }
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

        const { region } = this.state;
        const { children, renderMarker, markers } = this.props;

        return (
            <MapView
                showsUserLocation
                ref={map => { this.map = map }}
                data={markers}
                initialRegion={initialRegion}
                renderMarker={renderMarker}
                onMapReady={this.onMapReady}
                showsMyLocationButton={true}
                onRegionChange={this.onRegionChange}
                onRegionChangeComplete={this.onRegionChangeComplete}
                style={StyleSheet.absoluteFill}
                textStyle={{ color: '#bc8b00' }}
                containerStyle={{ backgroundColor: 'white', borderColor: '#BC8B00' }}>

                {/* {markers.map(renderMarker)} */}

                {/* {children && children || null} */}

            </MapView>
        );
    }
}

export default MyMapView;