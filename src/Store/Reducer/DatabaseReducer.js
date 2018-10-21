import actionTypes from '../actionTypes';
import { startWith } from 'rxjs/operator/startWith';


let INITIAL_STATE = {
    isProgress_db: false,
    isError_db: false,
    errorText_db: "",
    bus_name: "",
    bus_route: [],


}

export default function dbReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case actionTypes.GET_BUS_ROUTE_PROG:
            return { ...state, isProgress_db: true };
        case actionTypes.GET_BUS_ROUTE_SUCC:
            return { ...state, isProgress_db: false, bus_name: action.payload.bus_name, bus_route: action.payload.route }
        case actionTypes.GET_BUS_ROUTE_FAIL:
            return { ...state, isProgress_db: false, isError_db: true, errorText_db: action.payload }
        default:
            return state;
    }
}