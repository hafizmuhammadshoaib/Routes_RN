import actionTypes from '../../actionTypes';
import { Observable } from 'rxjs';
import FirebaseDB from '../../Firebase/firebaseDB';
import DBActions from '../../Actions/DBActions/DBActions';
import service from "../../../service/http";
const BASE_URL = "http://192.168.1.102:3000"



export default class DBEpic {
    static getBusRoute(action$) {
        return action$.ofType(actionTypes.GET_BUS_ROUTE_PROG).switchMap(({ payload }) => {
            return service.get(`${BASE_URL}/busroute/?busname=${payload.busName}`, {'authorization':payload.token,'Content-Type': 'application/json'}).pluck("response").map(value => {
                return {
                    type: actionTypes.GET_BUS_ROUTE_SUCC,
                    payload: value
                }
            }).catch(err => {
                return Observable.of({ type: actionTypes.GET_BUS_ROUTE_FAIL, payload: err.response ? err.response.error : err.message })
            })
        })
    }

}