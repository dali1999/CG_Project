import {  all, fork, put, call, takeLatest  } from "redux-saga/effects";


import postSaga from "./gptAsk";
//import { postSaga2 } from "./gptAsk";

export default function* rootSaga() {
  yield all([fork(postSaga)]);

}