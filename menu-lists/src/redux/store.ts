import { legacy_createStore as createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import menuReducer from "./Authreducer";
import rootSaga from "./saga";

const sagaMiddleware = createSagaMiddleware();

const store = createStore(menuReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof menuReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;
