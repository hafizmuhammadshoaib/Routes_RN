import React, { Component } from 'react';
import { Text, View, Dimensions, ScrollView } from 'react-native';
const { height, width } = Dimensions.get("window");
import { Input, Item, Button } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons"

export default class SignIn extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <ScrollView contentContainerStyle={{ height: height - 100, width, backgroundColor: "#fff" }} style={{ backgroundColor: "#fff" }} keyboardDismissMode="interactive" keyboardShouldPersistTaps="interactive" >
                <View style={{ flex: 1, alignItems: "center", backgroundColor: "#fff", }} >
                    <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }} >


                        <Ionicons name="md-person" size={80} color="#2FCC71" style={{ borderRadius: width / 5, }} />
                    </View>
                    <View style={{ flex: 0.5, justifyContent: "space-around", }} >
                        <View style={{ flex: 0.18, width: width * 0.9, flexDirection: "row", alignItems: "center", borderRadius: width / 9, shadowOffset: { width: 10, height: 10, }, shadowColor: '#EBECF2', shadowOpacity: 1.0, elevation: 8 }} >

                            <MaterialCommunityIcons name="email-outline" size={20} color="#2FCC71" style={{ marginLeft: 15 }} />
                            <Input placeholder="Email" style={{ alignSelf: "center", marginLeft: 10 }} />

                        </View>
                        <View style={{ flex: 0.18, width: width * 0.9, flexDirection: "row", alignItems: "center", borderRadius: width / 9, shadowOffset: { width: 10, height: 10, }, shadowColor: '#EBECF2', shadowOpacity: 1.0, elevation: 8 }} >

                            <Ionicons name="ios-lock" size={20} color="#2FCC71" style={{ marginLeft: 15 }} />
                            <Input placeholder="Password" secureTextEntry style={{ alignSelf: "center", marginLeft: 10 }} />

                        </View>
                    </View>
                    <View style={{ flex: 0.3, justifyContent: "center" }}  >
                        <Button style={{ borderRadius: width / 9, width: width * 0.4, justifyContent: "center", backgroundColor: "#2FCC71", alignSelf: "center" }} ><Text style={{ color: "#fff" }}  >Login</Text></Button>
                    </View>
                </View >
            </ScrollView>

        )
    }
}   