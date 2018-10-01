import actionTypes from '../../actionTypes';
import Firebase from 'react-native-firebase';
import { Observable } from 'rxjs';
import Auth from '../../Firebase/FirebaseAuth';
import AuthActions from '../../Actions/AuthActions/AuthActions';
import FirebaseDB from '../../Firebase/firebaseDB';

const fire = Firebase.auth();

export default class AuthEpic {
    static signinUserEpic(action$) {
        return action$.ofType(actionTypes.LOGIN_REQUEST).switchMap(({ payload }) => {
            return Observable.fromPromise(Auth.loginUser(payload))
                .switchMap(user => {
                    return Observable.fromPromise(FirebaseDB.getUserData(user)).map((userObj) => {
                        console.log(userObj)
                        let newObj = { ...user, ...userObj }
                        return {
                            type: actionTypes.LOGIN_REQUEST_SUCCEED,
                            payload: newObj
                        }
                    })
                })
                .catch(err => {
                    return Observable.of(AuthActions.authError(err.message))
                })
        })
    }

    static signupUserEpic(action$) {
        return action$.ofType(actionTypes.SIGNUP_REQUEST).switchMap(({ payload }) => {
            return Observable.fromPromise(Auth.createUser(payload))
                .switchMap((userObj) => {
                    return Observable.fromPromise(Auth.updateUserProfile({ displayName: payload.name }))
                        .map(() => {
                            // console.log("success")
                            return {
                                type: actionTypes.SIGNUP_REQUEST_SUCCEED,
                                payload
                            }
                        })
                })
                .catch(err => {
                    return Observable.of(AuthActions.authError(err.message))
                })
        })
    }

    static chekUser(action$) {
        return action$.ofType(actionTypes.CHEK_USER)

            .switchMap(() => {
                console.log("*******", "user")
                return Observable.fromPromise(new Promise((res, rej) => {
                    fire.onAuthStateChanged(user => {
                        if (user) {
                            res(user);
                        } else {
                            console.log("rej")
                            rej("null");
                        }
                    })
                }))
                    .map(user => {
                        return {
                            type: actionTypes.IS_USER_FOUND,
                            payload: user
                        }
                    }).switchMap(user => {
                        return Observable.fromPromise(FirebaseDB.getUserData(user)).map((userObj) => {
                            console.log(userObj)
                            let newObj = { ...user, ...userObj }
                            return {
                                type: actionTypes.LOGIN_REQUEST_SUCCEED,
                                payload: newObj
                            }
                        })
                    })
                    .catch(err => {
                        return Observable.of(AuthActions.authError(err.message))
                    })
            })
    }
    static singOutUserEpic(action$) {
        return action$.ofType(actionTypes.SIGNOUT_PROG).switchMap(({ payload }) => {
            console.log("logout epic");
            return Observable.fromPromise(Auth.signOutUser()).map(() => {
                setTimeout(() => {
                    replaceScreen(payload, "signIn")
                }, 200)

                return {
                    type: actionTypes.SIGNOUT_SUCC,
                    payload: null,
                }
            }).catch((error) => {
                return Observable.of(AuthActions.authError(err.message))
            })
        })
    }

}
function replaceScreen(obj, route) {

    obj.dispatch({
        type: 'ReplaceCurrentScreen',
        key: `${route}`,
        routeName: `${route}`,
    });
}