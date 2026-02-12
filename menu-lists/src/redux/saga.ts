import { call, put, takeLatest } from "redux-saga/effects";
import { FETCH_MENU_REQUEST } from "./Authconstant";
import { fetchMenuSuccess, fetchMenuFailure } from "./Authactions";
import { fetchMenuApi } from "./AuthAPI";
import { MenuResponse } from "../types";
import { AxiosResponse } from "axios";

function* fetchMenuSaga() {
  try {
    const response: AxiosResponse<MenuResponse> = yield call(fetchMenuApi);
    yield put(fetchMenuSuccess(response.data as any));
  } catch (error: any) {
    yield put(fetchMenuFailure(error.message));
  }
}

export default function* rootSaga() {
  yield takeLatest(FETCH_MENU_REQUEST, fetchMenuSaga);
}
