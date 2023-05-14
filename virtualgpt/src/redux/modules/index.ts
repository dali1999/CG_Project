import { combineReducers } from "redux";

//import test from "./test";

const rootReducer = combineReducers({
 // test,
});

export default rootReducer;

//컴포넌트에서 사용하게될 스토어에 저장된 데이터의 타입입니다.
export type RootState = ReturnType<typeof rootReducer>;