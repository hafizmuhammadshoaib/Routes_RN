import actionTypes from "../../actionTypes";
import { Observable } from 'rxjs';
import service from "../../../service/http";
const BASE_URL = "https://warm-thicket-69046.herokuapp.com"

export default class Auth {
    static signIn(action$) {
        return action$.ofType(actionTypes.SIGNIN_PROG).switchMap(({ payload }) => {
            return service.post(`${BASE_URL}/signIn`, payload).pluck("response").map((obj) => {
                return {
                    type: actionTypes.SIGNIN_SUCC,
                    payload: obj
                }
            }).catch(err => {
                return Observable.of({ type: actionTypes.SIGNIN_FAIL, payload: err.response ? err.response.error : err.message })
            })
        })
    }
    static signUp(action$) {
        return action$.ofType(actionTypes.SIGNUP_PROG).switchMap(({ payload }) => {
            return service.post(`${BASE_URL}/signUp`, payload).pluck("response").map((obj) => {
                return {
                    type: actionTypes.SIGNUP_SUCC,
                    payload: obj
                }
            }).catch(err => {
                return Observable.of({ type: actionTypes.SIGNUP_FAIL, payload: err.response ? err.response.error : err.message })
            })
        })
    }
}