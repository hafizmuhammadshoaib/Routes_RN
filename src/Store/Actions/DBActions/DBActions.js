import actionTypes from '../../actionTypes';

export default class DBActions {
    static getBusRoute(token, busName) {
        return {
            type: actionTypes.GET_BUS_ROUTE_PROG,
            payload: { token: "Bearer " + token, busName }
        }
    }
}