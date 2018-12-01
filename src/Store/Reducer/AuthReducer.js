import actionTypes from '../actionTypes';

let INITIAL_STATE = {
    isProgress: false,
    isError: false,
    errorText: "",
    user: null,
    token: "",
    unmountFlag: false,
    callSuccess: false
}

export default function authReducer(state = INITIAL_STATE, action) {
    switch (action.type) {

        case actionTypes.SIGNIN_PROG:
            return { ...state, isProgress: true, };
        case actionTypes.SIGNIN_SUCC:
            return { ...state, isProgress: false, user: action.payload.user, token: action.payload.token };
        case actionTypes.SIGNIN_FAIL:
            return { ...state, isProgress: false, isError: true, errorText: action.payload };
        case actionTypes.CLEAR_ERROR:
            return { ...state, isError: false, errorText: "" }


        case actionTypes.SIGNUP_PROG:
            return { ...state, isProgress: true, };
        case actionTypes.SIGNUP_SUCC:
            return { ...state, isProgress: false, user: action.payload.user, token: action.payload.token };
        case actionTypes.SIGNUP_FAIL:
            return { ...state, isProgress: false, isError: true, errorText: action.payload };


        case actionTypes.GET_TOKEN_AND_USER:
            return { ...state, token: action.payload.token, user: action.payload.user, unmountFlag: true }

        case actionTypes.SET_UNMOUNT_FLAG:
            return { ...state, unmountFlag: action.payload }

        case actionTypes.SIGN_OUT:
            return { ...state, token: null, user: null }
        case actionTypes.CLEAR_ERROR:
            return { ...state, isError: false, errorText: "" }



        case actionTypes.SET_STOP_LOCATION_PROG:
            return { ...state, isProgress: true, callSuccess: false };
        case actionTypes.SET_STOP_LOCATION_SUCC:
            return { ...state, isProgress: false, user: action.payload.user, callSuccess: true };
        case actionTypes.SET_STOP_LOCATION_FAIL:
            return { ...state, isProgress: false, isError: true, errorText: action.payload, callSuccess: false }


        case actionTypes.UPDATE_BUS_NAME_PROG:
            return { ...state, isProgress: true, callSuccess: false };
        case actionTypes.UPDATE_BUS_NAME_SUCC:
            return { ...state, isProgress: false, callSuccess: true, user: action.payload.user };
        case actionTypes.UPDATE_BUS_NAME_FAIL:
            return { ...state, isProgress: false, isError: true, errorText: action.payload, callSuccess: false }


        case actionTypes.CALL_SUCCESS_FLAG_FALSE:
            return { ...state, callSuccess: false }
        default:
            return state;
    }
}