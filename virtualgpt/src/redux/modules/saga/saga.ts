import {  all, fork, put, call, takeLatest  } from "redux-saga/effects";


import postSaga from "./gptAsk";

export default function* rootSaga() {
  yield all([fork(postSaga)]);

}