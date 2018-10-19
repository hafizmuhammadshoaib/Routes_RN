import actionTypes from "../../actionTypes";
import { Observable } from 'rxjs';
import service from "../../../service/http";


export default class Auth {
    static signIn(action$) {
        return action$.ofType(actionTypes.SIGNIN_PROG).switchMap(({ payload }) => {
            return service.post("http://192.168.1.102:3000/signIn", payload).pluck("response").map((obj) => {
                return {
                    type: actionTypes.SIGNIN_SUCC,
                    payload: obj
                }
            }).catch(err => {
                return Observable.of({ type: actionTypes.SIGNIN_FAIL, payload: err.response.error })
            })
        })
    }
    static signUp(action$) {
        return action$.ofType(actionTypes.SIGNUP_PROG).switchMap(({ payload }) => {
            return service.post("http://192.168.1.102:3000/signUp", payload).pluck("response").map((obj) => {
                return {
                    type: actionTypes.SIGNUP_SUCC,
                    payload: obj
                }
            }).catch(err => {
                return Observable.of({ type: actionTypes.SIGNUP_FAIL, payload: err.response.error })
            })
        })
    }
}