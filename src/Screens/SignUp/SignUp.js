import React, { Component } from 'react';
import { Text, View, Dimensions, ScrollView, ToastAndroid, TouchableOpacity, AsyncStorage } from 'react-native';
const { height, width } = Dimensions.get("window");
import { Input, Item, Button, Spinner, Picker, Icon, Toast } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import AuthActions from "../../Store/Actions/AuthActions/AuthActions";
import { connect } from "react-redux";
import validator from "validator";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
const busNames = ["HU-01", "HU-02", "HU-03", "HU-04", "HU-05", "HU-06"];
const mapStateToProps = state => {
    console.log(state);
    return {
        isProgress: state.authReducer["isProgress"],
        user: state.authReducer['user'],
        isError: state.authReducer["isError"],
        errorText: state.authReducer["errorText"],
        token: state.authReducer["token"]

    };
};
const mapDispatchToProps = dispatch => {
    return {
        signUp: (payload) => { dispatch(AuthActions.signUp(payload)) },
        clearError: () => dispatch(AuthActions.clearError()),
        // getTokenAndUser: (token, user) => dispatch(AuthActions.getUserAndTokenFromAsyncStorage(token, user))

    };
};
const _storeData = async (token, user) => {
    try {
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem("user", JSON.stringify(user), (error) => console.log("error saving data", error))

    } catch (error) {
        // Error saving data
    }
}
class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = { name: "", email: "", pass: "", loading: false, cms: "", userType: undefined, busName: undefined }

    }
    replaceScreen = (route) => {
        this.props.navigation.dispatch({
            type: 'ReplaceCurrentScreen',
            key: `${route}`,
            routeName: `${route}`,
        });
    }
    signUpUser = () => {
        console.log("sign Up/////");
        this.props.clearError();
        if (validator.isEmail(this.state.email) && this.state.pass.length >= 8 && this.state.name.length >= 3 && this.state.cms.length >= 7 && this.state.userType != undefined && this.state.busName != undefined) {
            let userInfo = {
                cmsId: this.state.cms,
                busName: this.state.busName,
                userType: this.state.userType,
                stopLocation: {
                    lat: 0.0000,
                    lng: 0.0000
                }
            }

            this.props.signUp({ name: this.state.name, email: this.state.email, pass: this.state.pass, userInfo });
        }
        else if (!validator.isEmail(this.state.email)) {
            ToastAndroid.show("invalid email", ToastAndroid.SHORT);
        }
        else if (!(this.state.pass.length >= 8)) {
            ToastAndroid.show("password must consists of length 8", ToastAndroid.SHORT);

        }
        else if (!(this.state.name.length >= 3)) {
            ToastAndroid.show("name must consists of length 3", ToastAndroid.SHORT);

        }
        else {
            ToastAndroid.show("please fill all fields", ToastAndroid.SHORT);
        }
    }
    onValueChangeUserType = (value) => {
        this.setState({ userType: value })
    }
    onValueChangeBusName = (value) => {
        this.setState({ busName: value })
    }
    // _retrieveData = async () => {

    //     try {
    //         const token = await AsyncStorage.getItem('token');
    //         const user = await AsyncStorage.getItem('user');
    //         this.setState({ loading: false })
    //         if (token !== null && user !== null) {
    //             // We have data!!
    //             // console.log(value);
    //             // this.props.navigation.navigate("mapScreen");
    //             this.props.getTokenAndUser(token, JSON.parse(user))
    //             this.replaceScreen("mapScreen");
    //         }
    //     } catch (error) {
    //         // Error retrieving data
    //     }
    // }
    static getDerivedStateFromProps = (props, state) => {
        console.log("user", props.user)
        if (props.user) {
            try {
                console.log("token", props.token)
                // await AsyncStorage.setItem('token', token);

                _storeData(props.token, props.user);
                props.navigation.dispatch({
                    type: 'ReplaceCurrentScreen',
                    key: `mapScreen`,
                    routeName: `mapScreen`,
                });
            } catch (error) {
                // Error saving data
            }
        }
        return null;
    }
    componentDidMount() {
        // this.setState({ loading: true })
        // this._retrieveData();

    }

    render() {
        return (
            <ScrollView contentContainerStyle={{ height: height - 100, width, backgroundColor: "#fff" }} style={{ backgroundColor: "#fff" }} keyboardDismissMode="interactive" keyboardShouldPersistTaps="handled" >
                <View pointerEvents={this.state.loading || this.props.isProgress ? "none" : "auto"} style={{ flex: 1, height, alignItems: "center", backgroundColor: "#fff", justifyContent: "space-between" }} >
                    <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }} >


                        <Ionicons name="md-person" size={80} color="#2FCC71" style={{ borderRadius: width / 5, }} />
                    </View>
                    <View style={{ flex: 1, justifyContent: "space-around", }} >
                        <View style={{ flex: 0.19, width: width * 0.9, flexDirection: "row", alignItems: "center", borderRadius: width / 9, shadowOffset: { width: 10, height: 10, }, shadowColor: '#EBECF2', shadowOpacity: 1.0, elevation: 8 }} >

                            <Ionicons name="ios-person" size={25} color="#2FCC71" style={{ marginLeft: 15 }} />
                            <Input placeholder="Name" onChangeText={(name) => this.setState({ name })} style={{ alignSelf: "center", fontFamily: "OpenSans-Regular", marginLeft: 10 }} />

                        </View>
                        <View style={{ flex: 0.19, width: width * 0.9, flexDirection: "row", alignItems: "center", borderRadius: width / 9, shadowOffset: { width: 10, height: 10, }, shadowColor: '#EBECF2', shadowOpacity: 1.0, elevation: 8 }} >

                            <MaterialCommunityIcons name="email-outline" size={20} color="#2FCC71" style={{ marginLeft: 15 }} />
                            <Input placeholder="Email" keyboardType={"email-address"} onChangeText={(email) => this.setState({ email })} style={{ alignSelf: "center", fontFamily: "OpenSans-Regular", marginLeft: 10 }} />

                        </View>
                        <View style={{ flex: 0.19, width: width * 0.9, flexDirection: "row", alignItems: "center", borderRadius: width / 9, shadowOffset: { width: 10, height: 10, }, shadowColor: '#EBECF2', shadowOpacity: 1.0, elevation: 8 }} >

                            <FontAwesome name="id-card-o" size={20} color="#2FCC71" style={{ marginLeft: 15 }} />
                            <Input placeholder="CMS Id" keyboardType={"default"} onChangeText={(cms) => this.setState({ cms })} style={{ fontFamily: "OpenSans-Regular", alignSelf: "center", marginLeft: 10 }} />

                        </View>
                        <View style={{ flex: 0.19, width: width * 0.9, flexDirection: "row", alignItems: "center", borderRadius: width / 9, shadowOffset: { width: 10, height: 10, }, shadowColor: '#EBECF2', shadowOpacity: 1.0, elevation: 8 }} >
                            <Feather name="users" size={20} color="#2FCC71" style={{ marginLeft: 15 }} />

                            <Picker
                                mode="dialog"
                                iosHeader="Select your user type"
                                iosIcon={<Icon name="ios-arrow-down-outline" />}
                                style={{ alignSelf: "center", marginLeft: 10, marginTop: 2,  }}
                                placeholder={"Select User Type"}
                                placeholderStyle={{ fontFamily: "OpenSans-Regular", fontWeight: null }}
                                selectedValue={this.state.userType}
                                textStyle={{ fontFamily: "OpenSans-Regular", fontWeight: null, fontStyle: null }}
                                itemTextStyle={{ fontFamily: "OpenSans-Regular", fontWeight: null, fontStyle: null }}
                                onValueChange={(value) => this.onValueChangeUserType(value)}
                            >
                                <Picker.Item label="Select User Type" value />
                                <Picker.Item label="Student" value="student" />
                                <Picker.Item label="Faculty" value="faculty" />
                            </Picker>

                        </View>
                        <View style={{ flex: 0.19, width: width * 0.9, flexDirection: "row", alignItems: "center", borderRadius: width / 9, shadowOffset: { width: 10, height: 10, }, shadowColor: '#EBECF2', shadowOpacity: 1.0, elevation: 8 }} >
                            <Ionicons name="ios-bus" size={20} color="#2FCC71" style={{ marginLeft: 15 }} />

                            <Picker
                                mode="dialog"
                                iosHeader="Select your Bus "
                                iosIcon={<Icon name="ios-arrow-down-outline" />}
                                style={{ alignSelf: "center", marginLeft: 10, marginTop: 2,  }}
                                placeholder={"Select User Type"}
                                placeholderStyle={{ fontFamily: "OpenSans-Regular", fontWeight: null }}
                                selectedValue={this.state.busName}
                                textStyle={{ fontFamily: "OpenSans-Regular" }}
                                itemTextStyle={{ fontFamily: "OpenSans-Regular" }}
                                onValueChange={(value) => this.onValueChangeBusName(value)}
                            >
                                <Picker.Item label="Select your Bus Name" value={undefined} />

                                {
                                    busNames.map((value, index) => {
                                        return (
                                            <Picker.Item key={index} label={value} value={value} />

                                        )
                                    })
                                }
                            </Picker>

                        </View>

                        <View style={{ flex: 0.19, width: width * 0.9, flexDirection: "row", alignItems: "center", borderRadius: width / 9, shadowOffset: { width: 10, height: 10, }, shadowColor: '#EBECF2', shadowOpacity: 1.0, elevation: 8 }} >

                            <Ionicons name="ios-lock" size={20} color="#2FCC71" style={{ marginLeft: 15 }} />
                            <Input placeholder="Password" onChangeText={(pass) => this.setState({ pass })} secureTextEntry style={{ fontFamily: "OpenSans-Regular", alignSelf: "center", marginLeft: 10 }} />

                        </View>
                    </View>
                    <TouchableOpacity style={{ flex: 0.1, marginTop: 10 }} onPress={() => this.replaceScreen('signIn')} >
                        <Text style={{ fontFamily: "OpenSans-Bold", color: "#2FCC71" }} >Already have an account?</Text>
                    </TouchableOpacity>
                    {this.props.isError ? <Text style={{ color: "red", fontFamily: "OpenSans-SemiBold" }} >{this.props.errorText}</Text> : <View />}
                    <View style={{ flex: 0.2, justifyContent: "center" }}  >
                        {this.props.isProgress || this.state.loading ? <Spinner color="#2FCC71" /> : <Button onPress={this.signUpUser} style={{ borderRadius: width / 9, width: width * 0.4, justifyContent: "center", backgroundColor: "#2FCC71", alignSelf: "center" }} ><Text style={{ color: "#fff", fontFamily: "OpenSans-Regular" }}  >SignUp</Text></Button>}
                    </View>
                </View >
            </ScrollView>

        )
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignUp);   