import actionTypes from '../../actionTypes';

export default class DBActions {
    static getBusRoute(token, busName) {
        return {
            type: actionTypes.GET_BUS_ROUTE_PROG,
            payload: { token: "Bearer " + token, busName }
        }
    }
    static clearRoute() {
        return {
            type: actionTypes.CLEAR_ROUTE
        }
    }
    static clearError() {
        return {
            type: actionTypes.CLEAR_ERROR
        }
    }
    static getBusInfo(token, page) {
        return {
            type: actionTypes.GET_BUS_INFO_PROG,
            payload: { token: "Bearer " + token, page }

        }
    }
    static clearInfo() {
        return {
            type: actionTypes.CLEAR_INFO
        }
    }
    static getLiveTrackInfo(token, busName) {
        let date = `${new Date().getFullYear()},${new Date().getMonth()},${new Date().getDate()}`;
        console.log("date****", date);
        let hour = new Date().getHours();

        let dayLight;
        if ((hour >= 7) && (hour <= 11)) {
            dayLight = "morning";
        } else if (hour >= 4 && hour <= 6) {
            dayLight = "evening";
        }
        console.log("daylight", dayLight);
        return {
            type: actionTypes.LIVE_TRACK_INFO_PROG,
            payload: { token: "Bearer " + token, busName, date, dayLight }
        }
    }
    static setStopLocation(token, email, lat, lng) {
        return {
            type: actionTypes.SET_STOP_LOCATION_PROG,
            payload: { token: "Bearer " + token, email, lat, lng }
        }
    }
    static getAllBusInfo(token) {
        return {
            type: actionTypes.GET_ALL_BUS_INFO_PROG,
            payload: { token: "Bearer " + token }
        }
    }
    static updateBusName(token, email, busName) {
        return {
            type: actionTypes.UPDATE_BUS_NAME_PROG,
            payload: { token: "Bearer " + token, email, busName }
        }
    }
    static callSuccessFlag() {
        return {
            type: actionTypes.CALL_SUCCESS_FLAG_FALSE
        }
    }
    static getTimeAndDistance(origin, destination) {
        return {
            type: actionTypes.GET_TIME_AND_DISTANCE_PROG,
            payload: { origin, destination }
        }
    }
}