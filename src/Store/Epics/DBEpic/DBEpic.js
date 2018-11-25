import actionTypes from '../../actionTypes';
import { Observable } from 'rxjs';
import FirebaseDB from '../../Firebase/firebaseDB';
import DBActions from '../../Actions/DBActions/DBActions';
import service from "../../../service/http";
import { retry } from 'rxjs/operator/retry';
const BASE_URL = "http://192.168.1.104:3000"



export default class DBEpic {
    static getBusRoute(action$) {
        return action$.ofType(actionTypes.GET_BUS_ROUTE_PROG).switchMap(({ payload }) => {
            return service.get(`${BASE_URL}/busroute/${payload.busName}`, { 'authorization': payload.token, 'Content-Type': 'application/json' }).pluck("response").map(value => {
                return {
                    type: actionTypes.GET_BUS_ROUTE_SUCC,
                    payload: value
                }
            }).catch(err => {
                return Observable.of({ type: actionTypes.GET_BUS_ROUTE_FAIL, payload: err.response ? err.response.error : err.message })
            })
        })
    }
    static getBusInfo(action$) {
        return action$.ofType(actionTypes.GET_BUS_INFO_PROG).switchMap(({ payload }) => {
            return service.get(`${BASE_URL}/businfo/?page=${payload.page}`, { 'authorization': payload.token, 'Content-Type': 'application/json' }).pluck("response").map((value) => {
                return {
                    type: actionTypes.GET_BUS_INFO_SUCC,
                    payload: value
                }
            }).catch(err => {
                return Observable.of({ type: actionTypes.GET_BUS_INFO_FAIL, payload: err.response ? err.response.error : err.message })
            })
        })
    }
    static getLiveTrackInfo(action$){
        return action$.ofType(actionTypes.LIVE_TRACK_INFO_PROG).switchMap(({payload})=>{
            return service.get(`${BASE_URL}/livetracking/?bus_name=${payload.busName}&date=${payload.date}&daylight=${payload.dayLight}`,{ 'authorization': payload.token, 'Content-Type': 'application/json' }).pluck("response").map((array)=>{
                return{
                    type:actionTypes.LIVE_TRACK_INFO_SUCC,
                    payload:array
                }
            }).catch(err=>{
                return Observable.of({type:actionTypes.LIVE_TRACK_INFO_FAIL,payload:err.response ? err.response.error : err.message})
            })
        })
    }

}