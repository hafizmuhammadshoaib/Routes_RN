import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import { combineEpics, createEpicMiddleware } from "redux-observable";
import { createLogger } from 'redux-logger';
// reducers
import authReducer from './Reducer/AuthReducer';
import dbReducer from './Reducer/DatabaseReducer';

// epics

import AuthEpic from './Epics/AuthEpics/AuthEpic';
import DBEpic from './Epics/DBEpic/DBEpic';


// const persistedState = loadState();
const loggerMiddleware = createLogger();
// Application Reducers
const rootReducer = combineReducers({
  authReducer,
  dbReducer
});

export const rootEpic = combineEpics(
  // more epics functions go here
  AuthEpic.signIn,
  AuthEpic.signUp
);

const epicMiddleware = createEpicMiddleware(rootEpic);

const createStoreWithMiddleware = applyMiddleware(epicMiddleware, loggerMiddleware);

export let store = createStore(
  rootReducer,
  createStoreWithMiddleware,
);
store.subscribe(() => {
  // saveState(store.getState());
});
