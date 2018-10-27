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
}