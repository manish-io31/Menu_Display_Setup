import {
  FETCH_MENU_REQUEST,
  FETCH_MENU_SUCCESS,
  FETCH_MENU_FAILURE,
  TOGGLE_ITEM_AVAILABILITY,
  UPDATE_THEME,
  SELECT_ALL_ITEMS,
  REMOVE_ALL_ITEMS,
} from "./Authconstant";
import { MenuCategory, ThemeConfig } from "../types";

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

export const fetchMenuSuccess = (data: MenuCategory[]): FetchMenuSuccessAction => ({
  type: FETCH_MENU_SUCCESS,
  payload: data,
});

export const fetchMenuFailure = (error: string): FetchMenuFailureAction => ({
  type: FETCH_MENU_FAILURE,
  payload: error,
});

export const toggleItemAvailability = (itemId: number | string): ToggleItemAvailabilityAction => ({
  type: TOGGLE_ITEM_AVAILABILITY,
  payload: itemId,
});

export const updateTheme = (theme: Partial<ThemeConfig>): UpdateThemeAction => ({
  type: UPDATE_THEME,
  payload: theme,
});

export const selectAllItems = (category: string, shouldSelect: boolean): SelectAllItemsAction => ({
  type: SELECT_ALL_ITEMS,
  payload: { category, shouldSelect },
});

export const removeAllItems = (): RemoveAllItemsAction => ({
  type: REMOVE_ALL_ITEMS,
});

export const toggleItemSelection = (id: number | string): ToggleItemSelectionAction => ({
  type: "TOGGLE_ITEM_SELECTION",
  payload: id,
});

export const updateItemDetails = (id: number | string, updates: any): UpdateItemDetailsAction => ({
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

export const reorderCategoryItems = (category: string, fromIndex: number, toIndex: number): ReorderCategoryItemsAction => ({
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

export const reorderCategories = (fromIndex: number, toIndex: number): ReorderCategoriesAction => ({
  type: "REORDER_CATEGORIES",
  payload: { fromIndex, toIndex },
});

export type AuthActionTypes =
  | FetchMenuRequestAction
  | FetchMenuSuccessAction
  | FetchMenuFailureAction
  | ToggleItemAvailabilityAction
  | UpdateThemeAction
  | SelectAllItemsAction
  | RemoveAllItemsAction
  | ToggleItemSelectionAction
  | UpdateItemDetailsAction
  | ReorderCategoryItemsAction
  | ReorderCategoriesAction;
