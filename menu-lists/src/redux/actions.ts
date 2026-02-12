import {
  FETCH_MENU_REQUEST,
  FETCH_MENU_SUCCESS,
  FETCH_MENU_FAILURE,
  TOGGLE_ITEM_AVAILABILITY,
  UPDATE_THEME,
  SELECT_ALL_ITEMS,
  REMOVE_ALL_ITEMS,
  SAVE_THEME_REQUEST,
  SAVE_THEME_SUCCESS,
  SAVE_THEME_FAILURE,
  CREATE_DISPLAY_REQUEST,
  CREATE_DISPLAY_SUCCESS,
  CREATE_DISPLAY_FAILURE,
  DELETE_DISPLAY_REQUEST,
  DELETE_DISPLAY_SUCCESS,
  DELETE_DISPLAY_FAILURE,
  FETCH_DISPLAYS_REQUEST,
  FETCH_DISPLAYS_SUCCESS,
  FETCH_DISPLAYS_FAILURE,
} from "./constants";
import { MenuCategory, ThemeConfig, Display } from "../types";

export interface CreateDisplayRequestAction {
  type: typeof CREATE_DISPLAY_REQUEST;
  payload: Omit<Display, "id">;
}

export interface CreateDisplaySuccessAction {
  type: typeof CREATE_DISPLAY_SUCCESS;
  payload: Display;
}

export interface CreateDisplayFailureAction {
  type: typeof CREATE_DISPLAY_FAILURE;
  payload: string;
}

export interface DeleteDisplayRequestAction {
  type: typeof DELETE_DISPLAY_REQUEST;
  payload: number | string;
}

export interface DeleteDisplaySuccessAction {
  type: typeof DELETE_DISPLAY_SUCCESS;
  payload: number | string;
}

export interface DeleteDisplayFailureAction {
  type: typeof DELETE_DISPLAY_FAILURE;
  payload: string;
}

export interface FetchDisplaysRequestAction {
  type: typeof FETCH_DISPLAYS_REQUEST;
}

export interface FetchDisplaysSuccessAction {
  type: typeof FETCH_DISPLAYS_SUCCESS;
  payload: Display[];
}

export interface FetchDisplaysFailureAction {
  type: typeof FETCH_DISPLAYS_FAILURE;
  payload: string;
}

export interface FetchMenuRequestAction {
  type: typeof FETCH_MENU_REQUEST;
}

export interface FetchMenuSuccessAction {
  type: typeof FETCH_MENU_SUCCESS;
  payload: MenuCategory[];
}

export interface FetchMenuFailureAction {
  type: typeof FETCH_MENU_FAILURE;
  payload: string;
}

export interface ToggleItemAvailabilityAction {
  type: typeof TOGGLE_ITEM_AVAILABILITY;
  payload: number | string;
}

export interface UpdateThemeAction {
  type: typeof UPDATE_THEME;
  payload: Partial<ThemeConfig>;
}

export interface SelectAllItemsAction {
  type: typeof SELECT_ALL_ITEMS;
  payload: {
    category: string;
    shouldSelect: boolean;
  };
}

export interface RemoveAllItemsAction {
  type: typeof REMOVE_ALL_ITEMS;
}

export interface SaveThemeRequestAction {
  type: typeof SAVE_THEME_REQUEST;
  payload: ThemeConfig;
}

export interface SaveThemeSuccessAction {
  type: typeof SAVE_THEME_SUCCESS;
}

export interface SaveThemeFailureAction {
  type: typeof SAVE_THEME_FAILURE;
  payload: string;
}

export interface ToggleItemSelectionAction {
  type: "TOGGLE_ITEM_SELECTION";
  payload: number | string; // id
}

export interface UpdateItemDetailsAction {
  type: "UPDATE_ITEM_DETAILS";
  payload: {
    id: number | string;
    updates: {
      displayName?: string;
      displayPrice?: string;
      isAvailable?: boolean;
    };
  };
}

export const fetchMenuRequest = (): FetchMenuRequestAction => ({
  type: FETCH_MENU_REQUEST,
});

export const fetchMenuSuccess = (
  data: MenuCategory[],
): FetchMenuSuccessAction => ({
  type: FETCH_MENU_SUCCESS,
  payload: data,
});

export const fetchMenuFailure = (error: string): FetchMenuFailureAction => ({
  type: FETCH_MENU_FAILURE,
  payload: error,
});

export const saveThemeRequest = (
  theme: ThemeConfig,
): SaveThemeRequestAction => ({
  type: SAVE_THEME_REQUEST,
  payload: theme,
});

export const saveThemeSuccess = (): SaveThemeSuccessAction => ({
  type: SAVE_THEME_SUCCESS,
});

export const saveThemeFailure = (error: string): SaveThemeFailureAction => ({
  type: SAVE_THEME_FAILURE,
  payload: error,
});

export const toggleItemAvailability = (
  itemId: number | string,
): ToggleItemAvailabilityAction => ({
  type: TOGGLE_ITEM_AVAILABILITY,
  payload: itemId,
});

export const updateTheme = (
  theme: Partial<ThemeConfig>,
): UpdateThemeAction => ({
  type: UPDATE_THEME,
  payload: theme,
});

export const selectAllItems = (
  category: string,
  shouldSelect: boolean,
): SelectAllItemsAction => ({
  type: SELECT_ALL_ITEMS,
  payload: { category, shouldSelect },
});

export const removeAllItems = (): RemoveAllItemsAction => ({
  type: REMOVE_ALL_ITEMS,
});

export const toggleItemSelection = (
  id: number | string,
): ToggleItemSelectionAction => ({
  type: "TOGGLE_ITEM_SELECTION",
  payload: id,
});

export const updateItemDetails = (
  id: number | string,
  updates: any,
): UpdateItemDetailsAction => ({
  type: "UPDATE_ITEM_DETAILS",
  payload: { id, updates },
});

export interface ReorderCategoryItemsAction {
  type: "REORDER_CATEGORY_ITEMS";
  payload: {
    category: string;
    fromIndex: number;
    toIndex: number;
  };
}

export const reorderCategoryItems = (
  category: string,
  fromIndex: number,
  toIndex: number,
): ReorderCategoryItemsAction => ({
  type: "REORDER_CATEGORY_ITEMS",
  payload: { category, fromIndex, toIndex },
});

export interface ReorderCategoriesAction {
  type: "REORDER_CATEGORIES";
  payload: {
    fromIndex: number;
    toIndex: number;
  };
}

export const reorderCategories = (
  fromIndex: number,
  toIndex: number,
): ReorderCategoriesAction => ({
  type: "REORDER_CATEGORIES",
  payload: { fromIndex, toIndex },
});

export const createDisplayRequest = (
  display: Omit<Display, "id">,
): CreateDisplayRequestAction => ({
  type: CREATE_DISPLAY_REQUEST,
  payload: display,
});

export const createDisplaySuccess = (
  display: Display,
): CreateDisplaySuccessAction => ({
  type: CREATE_DISPLAY_SUCCESS,
  payload: display,
});

export const createDisplayFailure = (
  error: string,
): CreateDisplayFailureAction => ({
  type: CREATE_DISPLAY_FAILURE,
  payload: error,
});

export const deleteDisplayRequest = (
  id: number | string,
): DeleteDisplayRequestAction => ({
  type: DELETE_DISPLAY_REQUEST,
  payload: id,
});

export const deleteDisplaySuccess = (
  id: number | string,
): DeleteDisplaySuccessAction => ({
  type: DELETE_DISPLAY_SUCCESS,
  payload: id,
});

export const deleteDisplayFailure = (
  error: string,
): DeleteDisplayFailureAction => ({
  type: DELETE_DISPLAY_FAILURE,
  payload: error,
});

export const fetchDisplaysRequest = (): FetchDisplaysRequestAction => ({
  type: FETCH_DISPLAYS_REQUEST,
});

export const fetchDisplaysSuccess = (
  displays: Display[],
): FetchDisplaysSuccessAction => ({
  type: FETCH_DISPLAYS_SUCCESS,
  payload: displays,
});

export const fetchDisplaysFailure = (
  error: string,
): FetchDisplaysFailureAction => ({
  type: FETCH_DISPLAYS_FAILURE,
  payload: error,
});

export type AuthActionTypes =
  | FetchMenuRequestAction
  | FetchMenuSuccessAction
  | FetchMenuFailureAction
  | ToggleItemAvailabilityAction
  | UpdateThemeAction
  | SelectAllItemsAction
  | RemoveAllItemsAction
  | SaveThemeRequestAction
  | SaveThemeSuccessAction
  | SaveThemeFailureAction
  | ToggleItemSelectionAction
  | UpdateItemDetailsAction
  | ReorderCategoryItemsAction
  | ReorderCategoriesAction
  | CreateDisplayRequestAction
  | CreateDisplaySuccessAction
  | CreateDisplayFailureAction
  | DeleteDisplayRequestAction
  | DeleteDisplaySuccessAction
  | DeleteDisplayFailureAction
  | FetchDisplaysRequestAction
  | FetchDisplaysSuccessAction
  | FetchDisplaysFailureAction;
