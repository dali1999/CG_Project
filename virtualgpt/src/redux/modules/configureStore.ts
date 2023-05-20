import { createStore, applyMiddleware,compose } from "redux";
import { rootReducer } from "./reducer";
import createSagaMiddleware from "redux-saga";

export default function configureStore() {

  const store = createStore(rootReducer);

  return store;
}