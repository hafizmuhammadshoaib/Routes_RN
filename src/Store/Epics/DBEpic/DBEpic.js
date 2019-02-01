import actionTypes from "../../actionTypes";
import { Observable } from "rxjs";
import FirebaseDB from "../../Firebase/firebaseDB";
import DBActions from "../../Actions/DBActions/DBActions";
import service from "../../../service/http";
import { retry } from "rxjs/operator/retry";
const BASE_URL = "https://warm-thicket-69046.herokuapp.com";

export default class DBEpic {
  static getBusRoute(action$) {
    return action$
      .ofType(actionTypes.GET_BUS_ROUTE_PROG)
      .switchMap(({ payload }) => {
        return service
          .get(`${BASE_URL}/busroute/${payload.busName}`, {
            authorization: payload.token,
            "Content-Type": "application/json"
          })
          .pluck("response")
          .map(value => {
            return {
              type: actionTypes.GET_BUS_ROUTE_SUCC,
              payload: value
            };
          })
          .catch(err => {
            return Observable.of({
              type: actionTypes.GET_BUS_ROUTE_FAIL,
              payload: err.response ? err.response.error : err.message
            });
          });
      });
  }
  static getBusInfo(action$) {
    return action$
      .ofType(actionTypes.GET_BUS_INFO_PROG)
      .switchMap(({ payload }) => {
        return service
          .get(`${BASE_URL}/businfo/?page=${payload.page}`, {
            authorization: payload.token,
            "Content-Type": "application/json"
          })
          .pluck("response")
          .map(value => {
            return {
              type: actionTypes.GET_BUS_INFO_SUCC,
              payload: value
            };
          })
          .catch(err => {
            return Observable.of({
              type: actionTypes.GET_BUS_INFO_FAIL,
              payload: err.response ? err.response.error : err.message
            });
          });
      });
  }
  static getLiveTrackInfo(action$) {
    return action$
      .ofType(actionTypes.LIVE_TRACK_INFO_PROG)
      .switchMap(({ payload }) => {
        return service
          .get(
          `${BASE_URL}/livetracking/?bus_name=${payload.busName}&date=${
          payload.date
          }&daylight=${payload.dayLight}`,
          { authorization: payload.token, "Content-Type": "application/json" }
          )
          .pluck("response")
          .map(array => {
            return {
              type: actionTypes.LIVE_TRACK_INFO_SUCC,
              payload: array
            };
          })
          .catch(err => {
            return Observable.of({
              type: actionTypes.LIVE_TRACK_INFO_FAIL,
              payload: err.response ? err.response.error : err.message
            });
          });
      });
  }

  static setStopLocaiton(action$) {
    return action$
      .ofType(actionTypes.SET_STOP_LOCATION_PROG)
      .switchMap(({ payload }) => {
        return service
          .put(
          `${BASE_URL}/userupdate/stoplocation`,
          { email: payload.email, lat: payload.lat, lng: payload.lng },
          { authorization: payload.token, "Content-Type": "application/json" }
          )
          .pluck("response")
          .map(value => {
            return {
              type: actionTypes.SET_STOP_LOCATION_SUCC,
              payload: value
            };
          })
          .catch(err => {
            return Observable.of({
              type: actionTypes.SET_STOP_LOCATION_FAIL,
              payload: err.response ? err.response.error : err.message
            });
          });
      });
  }
  static getAllBusInfo(action$) {
    return action$
      .ofType(actionTypes.GET_ALL_BUS_INFO_PROG)
      .switchMap(({ payload }) => {
        return service
          .get(`${BASE_URL}/businfo/all`, {
            authorization: payload.token,
            "Content-Type": "application/json"
          })
          .pluck("response")
          .map(value => {
            return {
              type: actionTypes.GET_ALL_BUS_INFO_SUCC,
              payload: value.info
            };
          })
          .catch(err => {
            return Observable.of({
              type: actionTypes.GET_ALL_BUS_INFO_FAIL,
              payload: err.response ? err.response.error : err.message
            });
          });
      });
  }
  static updateBusName(action$) {
    return action$
      .ofType(actionTypes.UPDATE_BUS_NAME_PROG)
      .switchMap(({ payload }) => {
        return service
          .put(
          `${BASE_URL}/userupdate/busname`,
          { email: payload.email, busName: payload.busName },
          { authorization: payload.token, "Content-Type": "application/json" }
          )
          .pluck("response")
          .map(value => {
            return {
              type: actionTypes.UPDATE_BUS_NAME_SUCC,
              payload: value
            };
          })
          .catch(err => {
            return Observable.of({
              type: actionTypes.UPDATE_BUS_NAME_FAIL,
              payload: err.response ? err.response.error : err.message
            });
          });
      });
  }
  static getTimeAndDistance(action$) {
    return action$.ofType(actionTypes.GET_TIME_AND_DISTANCE_PROG)
      .switchMap(({ payload }) => {
        // alert('eta chala')
        return service.get(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${payload.origin}&destinations=${payload.destination}&key=AIzaSyDDmyFwVLZ7Fys0sWTDMxa7h_Dyy79BXuM`)
          .pluck('response')
          .map((data) => {
            return {
              type: actionTypes.TIME_AND_DISTANCE_SUCC,
              payload: data.rows[0].elements[0]
            }
          })
          .catch(err => {
            return Observable.of({
              type: actionTypes.GET_TIME_AND_DISTANCE_FAIL,
              payload: err.message
            })
          })
      })
  }
}
