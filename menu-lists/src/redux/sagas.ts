import { call, put, takeLatest } from "redux-saga/effects";
import {
  FETCH_MENU_REQUEST,
  SAVE_THEME_REQUEST,
  CREATE_DISPLAY_REQUEST,
  FETCH_DISPLAYS_REQUEST,
  DELETE_DISPLAY_REQUEST,
} from "./constants";
import {
  fetchMenuSuccess,
  fetchMenuFailure,
  saveThemeSuccess,
  saveThemeFailure,
  fetchDisplaysSuccess,
  fetchDisplaysFailure,
  createDisplaySuccess,
  createDisplayFailure,
  deleteDisplaySuccess,
  deleteDisplayFailure,
} from "./actions";
import {
  fetchMenuApi,
  updateThemeApi,
  fetchDisplaysApi,
  createDisplayApi,
  deleteDisplayApi,
} from "./api";
import { MenuResponse, Display } from "../types";
import { AxiosResponse } from "axios";

function* fetchMenuSaga() {
  try {
    const response: AxiosResponse<MenuResponse> = yield call(fetchMenuApi);
    yield put(fetchMenuSuccess(response.data as any));
  } catch (error: any) {
    yield put(fetchMenuFailure(error.message));
  }
}

function* saveThemeSaga(action: any) {
  try {
    console.log("Initiating Save Theme Request...");
    yield call(updateThemeApi, action.payload);
    yield put(saveThemeSuccess());
    console.log("Theme Saved Successfully!");
  } catch (error: any) {
    console.error("Save Theme Failed:", error);
    let errorMessage = "Failed to save theme. Please try again.";

    if (error.response) {
      // Server responded with a status code outside 2xx range
      errorMessage = `Server Error: ${error.response.status} - ${error.response.statusText}`;
      console.error("Response Data:", error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      errorMessage =
        "Network Error: No response from server. Check if backend is running.";
    } else {
      // Something happened in setting up the request
      errorMessage = `Request Error: ${error.message}`;
    }

    yield put(saveThemeFailure(errorMessage));
    alert(errorMessage);
  }
}

function* fetchDisplaysSaga() {
  try {
    const response: AxiosResponse<Display[]> = yield call(fetchDisplaysApi);
    yield put(fetchDisplaysSuccess(response.data));
  } catch (error: any) {
    yield put(fetchDisplaysFailure(error.message));
  }
}

function* createDisplaySaga(action: any) {
  try {
    const response: AxiosResponse<Display> = yield call(
      createDisplayApi,
      action.payload,
    );
    yield put(createDisplaySuccess(response.data));
    alert("Menu screen created successfully");
    window.location.href = "/displays";
  } catch (error: any) {
    yield put(createDisplayFailure(error.message));
    alert("Failed to create display: " + error.message);
  }
}

function* deleteDisplaySaga(action: any) {
  try {
    yield call(deleteDisplayApi, action.payload);
    yield put(deleteDisplaySuccess(action.payload));
  } catch (error: any) {
    yield put(deleteDisplayFailure(error.message));
    alert("Failed to delete display: " + error.message);
  }
}

export default function* rootSaga() {
  yield takeLatest(FETCH_MENU_REQUEST, fetchMenuSaga);
  yield takeLatest(SAVE_THEME_REQUEST, saveThemeSaga);
  yield takeLatest("FETCH_DISPLAYS_REQUEST", fetchDisplaysSaga);
  yield takeLatest("CREATE_DISPLAY_REQUEST", createDisplaySaga);
  yield takeLatest("DELETE_DISPLAY_REQUEST", deleteDisplaySaga);
}
