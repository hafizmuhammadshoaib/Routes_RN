import React, { Component } from 'react';
import { Text, View, Dimensions, ToastAndroid, ScrollView, TouchableOpacity, AsyncStorage } from 'react-native';
const { height, width } = Dimensions.get("window");
import { Input, Item, Button, Spinner } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import AuthActions from "../../Store/Actions/AuthActions/AuthActions";
import { connect } from "react-redux";
import validator from "validator";
const mapStateToProps = state => {
    console.log(state);
    return {
        isProgress: state.authReducer["isProgress"],
        user: state.authReducer['user'],
        isError: state.authReducer["isError"],
        errorText: state.authReducer["errorText"],
        token: state.authReducer["token"],
        unmountFlag: state.authReducer["unmountFlag"],

    };
};
const mapDispatchToProps = dispatch => {
    return {
        signIn: (payload) => { dispatch(AuthActions.signIn(payload)) },
        clearError: () => dispatch(AuthActions.clearError()),
        getTokenAndUser: (token, user) => dispatch(AuthActions.getUserAndTokenFromAsyncStorage(token, user)),
        

    };
};
const _storeData = async (token, user) => {

    try {

        await AsyncStorage.setItem('token', token, (error) => console.log("error saving data", error));
        await AsyncStorage.setItem("user", JSON.stringify(user), (error) => console.log("error saving data", error))
        console.log("value saved in async storage")

    } catch (error) {
        console.log("store data error", error)
        // Error saving data
    }
}
class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = { email: "", pass: "", loading: false }

    }
    replaceScreen = (route) => {
        this.props.navigation.dispatch({
            type: 'ReplaceCurrentScreen',
            key: `${route}`,
            routeName: `${route}`,
        });
    }
    signInUser = () => {
        console.log("sign in/////");
        this.props.clearError();
        if (validator.isEmail(this.state.email) && this.state.pass.length >= 8) {


            this.props.signIn({ email: this.state.email, pass: this.state.pass });
        }
        else if (!validator.isEmail(this.state.email)) {
            ToastAndroid.show("invalid email", ToastAndroid.SHORT);
        }
        else {
            ToastAndroid.show("password length not matched", ToastAndroid.SHORT);

        }
    }
    // _storeData = async (token) => {
    //     try {
    //         await AsyncStorage.setItem('token', token);
    //     } catch (error) {
    //         // Error saving data
    //     }
    // }
    _retrieveData = async () => {
        console.log("in retreive data before await")
        try {
            const token = await AsyncStorage.getItem('token');
            const user = await AsyncStorage.getItem('user');
            console.log("in retreive data after await")

            this.setState({ loading: false })
            if (token !== null && user !== null) {
                // We have data!!
                // console.log(value);
                // this.props.navigation.navigate("mapScreen");
                this.props.getTokenAndUser(token, JSON.parse(user))
                this.replaceScreen("mapScreen")
            }
        } catch (error) {
            // Error retrieving data
            console.log("retreive data error", error)
        }
    }
    static getDerivedStateFromProps = (props, state) => {
        console.log("user", props.user)
        if (props.user && props.navigation.isFocused() && !props.unmountFlag) {
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
        // AsyncStorage.clear().then(() => {
        //     console.log("clear all async storage");
        // })
        this.setState({ loading: true })
        this._retrieveData();

    }
    componentWillUnmount() {
        console.log("component unmounted signin")
    }

    render() {
        return (
            <ScrollView contentContainerStyle={{ height: height - 100, width, backgroundColor: "#fff" }} style={{ backgroundColor: "#fff" }} keyboardDismissMode="interactive" keyboardShouldPersistTaps="handled" >
                <View pointerEvents={(this.state.loading || this.props.isProgress) ? "none" : "auto"} style={{ flex: 1, alignItems: "center", backgroundColor: "#fff", }} >
                    <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }} >


                        <Ionicons name="md-person" size={80} color="#2FCC71" style={{ borderRadius: width / 5, }} />
                    </View>
                    <View style={{ flex: 0.75, justifyContent: "space-around", }} >
                        <View style={{ flex: 0.18, width: width * 0.9, flexDirection: "row", alignItems: "center", borderRadius: width / 9, shadowOffset: { width: 10, height: 10, }, shadowColor: '#EBECF2', shadowOpacity: 1.0, elevation: 8 }} >

                            <MaterialCommunityIcons name="email-outline" size={20} color="#2FCC71" style={{ marginLeft: 15 }} />
                            <Input placeholder="Email" keyboardType={"email-address"} onChangeText={(email) => this.setState({ email })} style={{ alignSelf: "center", fontFamily: "OpenSans-Regular", marginLeft: 10 }} />

                        </View>
                        <View style={{ flex: 0.18, width: width * 0.9, flexDirection: "row", alignItems: "center", borderRadius: width / 9, shadowOffset: { width: 10, height: 10, }, shadowColor: '#EBECF2', shadowOpacity: 1.0, elevation: 8 }} >

                            <Ionicons name="ios-lock" size={20} color="#2FCC71" style={{ marginLeft: 15 }} />
                            <Input placeholder="Password" onChangeText={(pass) => this.setState({ pass })} secureTextEntry style={{ fontFamily: "OpenSans-Regular", alignSelf: "center", marginLeft: 10 }} />

                        </View>
                    </View>
                    <TouchableOpacity style={{ flex: 0.1, }} onPress={() => this.replaceScreen("signUp")} >
                        <Text style={{ fontFamily: "OpenSans-Bold", color: "#2FCC71" }} >Don't have an account?</Text>
                    </TouchableOpacity>
                    {this.props.isError ? <Text style={{ color: "red", fontFamily: "OpenSans-SemiBold" }} >{this.props.errorText}</Text> : <View />}
                    <View style={{ flex: 0.2, justifyContent: "center" }}  >
                        {this.props.isProgress || this.state.loading ? <Spinner color="#2FCC71" /> : <Button onPress={() => this.signInUser()} style={{ borderRadius: width / 9, width: width * 0.4, justifyContent: "center", backgroundColor: "#2FCC71", alignSelf: "center" }} ><Text style={{ color: "#fff", fontFamily: "OpenSans-Regular" }}  >Login</Text></Button>}
                    </View>
                </View >
            </ScrollView>

        )
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignIn);  