import actionTypes from '../actionTypes';
import { startWith } from 'rxjs/operator/startWith';


let INITIAL_STATE = {
    isProgress_db: false,
    isError_db: false,
    errorText_db: "",
    busName: "",
    busRoute: [],
    busInfo: null,
    busInfoPage: null,
    busInfoHasPages: null,
    liveTrackCoord: null,
    allBusInfo: null,


}

export default function dbReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case actionTypes.GET_BUS_ROUTE_PROG:
            return { ...state, isProgress_db: true, busRoute: null, busName: "" };
        case actionTypes.GET_BUS_ROUTE_SUCC:
            return { ...state, isProgress_db: false, busName: action.payload.bus_name, busRoute: action.payload.route }
        case actionTypes.GET_BUS_ROUTE_FAIL:
            return { ...state, isProgress_db: false, isError_db: true, errorText_db: action.payload }

        case actionTypes.CLEAR_ROUTE:
            return { ...state, busName: "", busRoute: [] };

        case actionTypes.CLEAR_ERROR:
            return { ...state, isError_db: false, errorText_db: "" };



        case actionTypes.GET_BUS_INFO_PROG:
            return { ...state, isProgress_db: true };
        case actionTypes.GET_BUS_INFO_SUCC:
            return { ...state, isProgress_db: false, busInfo: state.busInfo ? [...state.busInfo, ...action.payload.info] : action.payload.info, busInfoPage: action.payload.currentPage, busInfoHasPages: action.payload.hasMorePages };
        case actionTypes.GET_BUS_INFO_FAIL:
            return { ...state, isProgress_db: false, isError_db: true, errorText_db: action.payload };

        case actionTypes.CLEAR_INFO:
            return { ...state, busInfo: [], busInfoPage: null, busInfoHasPages: null }
        case actionTypes.LIVE_TRACK_INFO_PROG:
            return { ...state, isProgress_db: true };
        case actionTypes.LIVE_TRACK_INFO_SUCC:
            return { ...state, isProgress_db: false, liveTrackCoord: action.payload, };
        case actionTypes.LIVE_TRACK_INFO_FAIL:
            return { ...state, isProgress_db: false, isError_db: true, errorText_db: action.payload }


        case actionTypes.GET_ALL_BUS_INFO_PROG:
            return { ...state, isProgress_db: true };
        case actionTypes.GET_ALL_BUS_INFO_SUCC:
            return { ...state, isProgress_db: false, allBusInfo: action.payload };
        case actionTypes.GET_ALL_BUS_INFO_FAIL:
            return { ...state, isProgress_db: false, isError_db: true, errorText_db: action.payload }

        default:
            return state;
    }
}