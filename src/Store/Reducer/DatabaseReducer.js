import actionTypes from '../actionTypes';
import { startWith } from 'rxjs/operator/startWith';


let INITIAL_STATE = {
    isProgress: false,
    isError: false,
    errorText: "",


}

export default function dbReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        default:
            return state;
    }
}