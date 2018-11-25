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
}