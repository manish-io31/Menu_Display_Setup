import { call, put, takeLatest } from "redux-saga/effects";
import { FETCH_MENU_REQUEST } from "./Authconstant";
import { fetchMenuSuccess, fetchMenuFailure } from "./Authactions";
import { fetchMenuApi } from "./AuthAPI";
import { MenuResponse } from "../types";
import { AxiosResponse } from "axios";

function* fetchMenuSaga() {
  try {
    const response: AxiosResponse<MenuResponse> = yield call(fetchMenuApi);
    // The API seems to return { menu: [...] }, so we need to access response.data.menu
    // Checking AuthAPI.ts: axios.get("http://localhost:3000/menu");
    // json-server usually returns the object at that endpoint.
    // If menu.json is { "menu": [...] }, then /menu returns the array directly? 
    // Wait, json-server routes based on top level keys. 
    // If db.json is { "menu": [...] }, then GET /menu returns [...] (the array).
    // Let's assume it returns the array or the object.
    // Based on menu.json: { "menu": [ ... ] }
    // GET /menu -> [ ... ]
    // So response.data is MenuCategory[]

    // Actually, let's verify what `fetchMenuSuccess` expects. It expects `MenuCategory[]`.
    // If /menu returns the array, then response.data is `MenuCategory[]`.

    yield put(fetchMenuSuccess(response.data as any));
  } catch (error: any) {
    yield put(fetchMenuFailure(error.message));
  }
}

export default function* rootSaga() {
  yield takeLatest(FETCH_MENU_REQUEST, fetchMenuSaga);
}
