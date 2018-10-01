import actionTypes from '../actionTypes';

let INITIAL_STATE = {
    isProgress: false,
    isError: false,
    errorText: "",
    user: null
}

export default function authReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        default:
            return state;
    }
}