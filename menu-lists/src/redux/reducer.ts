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
import { MenuCategory, ThemeConfig, Display, MenuItem } from "../types";
import { AuthActionTypes } from "./actions";

export interface MenuState {
  loading: boolean;
  menu: MenuCategory[];
  error: string | null;
  theme: ThemeConfig;
  saving: boolean;
  displays: Display[];
  fetchingDisplays: boolean;
}

const initialState: MenuState = {
  loading: false,
  menu: [],
  error: null,
  theme: {
    showLogo: true,
    logo: "",
    logoWidth: 150,
    unavailableTheme: "Default",
    categoryFont: "Protest Riot",
    itemFont: "Outfit",
    primary: "#FFCC00",
    secondary: "#B00000",
    backgroundType: "color",
    backgroundImage: "",
    backgroundColor: "#B00000",
    categoryFontColor: "#000000",
    itemFontColor: "#FFFFFF",
    priceFontColor: "#FFFFFF",
    orientation: "landscape",
    companyName: "Salem RR Biriyani",
    fontSizeScale: 3,
    allowScrolling: true,
    showFooter: true,
    showUnavailable: true,
    bgOpacity: 100,
    approxItemsVisible: 45,
    menuImages: ["", "", ""],
  },
  saving: false,
  displays: [],
  fetchingDisplays: false,
};

const menuReducer = (
  state = initialState,
  action: AuthActionTypes,
): MenuState => {
  switch (action.type) {
    case FETCH_MENU_REQUEST:
      return { ...state, loading: true };

    case SAVE_THEME_REQUEST:
      return { ...state, saving: true };

    case SAVE_THEME_SUCCESS:
      return { ...state, saving: false };

    case SAVE_THEME_FAILURE:
      return { ...state, saving: false };

    case FETCH_MENU_SUCCESS:
      return {
        ...state,
        loading: false,
        menu: action.payload.map((cat: MenuCategory) => ({
          ...cat,
          items: cat.items.map((item: MenuItem) => ({
            ...item,
            // Initialize isSelected to false by default (users must manually select items)
            isSelected: item.isSelected !== undefined ? item.isSelected : false,
          })),
        })),
        error: null,
      };

    case FETCH_MENU_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case TOGGLE_ITEM_AVAILABILITY:
      return {
        ...state,
        menu: state.menu.map((category) => ({
          ...category,
          items: category.items.map((item) =>
            item.id === action.payload
              ? { ...item, isAvailable: !item.isAvailable }
              : item,
          ),
        })),
      };

    case "TOGGLE_ITEM_SELECTION":
      return {
        ...state,
        menu: state.menu.map((cat) => ({
          ...cat,
          items: cat.items.map((item) =>
            item.id === action.payload
              ? { ...item, isSelected: !item.isSelected }
              : item,
          ),
        })),
      };

    case "REORDER_CATEGORY_ITEMS":
      return {
        ...state,
        menu: state.menu.map((cat) => {
          if (cat.category !== action.payload.category) return cat;

          const newItems = [...cat.items];
          const [movedItem] = newItems.splice(action.payload.fromIndex, 1);
          newItems.splice(action.payload.toIndex, 0, movedItem);

          return {
            ...cat,
            items: newItems,
          };
        }),
      };

    case "REORDER_CATEGORIES":
      const newMenu = [...state.menu];
      const [movedCategory] = newMenu.splice(action.payload.fromIndex, 1);
      newMenu.splice(action.payload.toIndex, 0, movedCategory);
      return {
        ...state,
        menu: newMenu,
      };

    case "UPDATE_ITEM_DETAILS":
      return {
        ...state,
        menu: state.menu.map((cat) => ({
          ...cat,
          items: cat.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, ...action.payload.updates }
              : item,
          ),
        })),
      };

    case UPDATE_THEME:
      return {
        ...state,
        theme: { ...state.theme, ...action.payload },
      };

    case SELECT_ALL_ITEMS:
      return {
        ...state,
        menu: state.menu.map((cat) => {
          if (cat.category !== action.payload.category) return cat;
          return {
            ...cat,
            items: cat.items.map((item) => ({
              ...item,
              isSelected: action.payload.shouldSelect,
            })),
          };
        }),
      };

    case REMOVE_ALL_ITEMS:
      return {
        ...state,
        menu: state.menu.map((cat) => ({
          ...cat,
          items: cat.items.map((item) => ({ ...item, isSelected: false })),
        })),
      };

    case FETCH_DISPLAYS_REQUEST:
      return { ...state, fetchingDisplays: true };

    case FETCH_DISPLAYS_SUCCESS:
      return { ...state, fetchingDisplays: false, displays: action.payload };

    case FETCH_DISPLAYS_FAILURE:
      return { ...state, fetchingDisplays: false, error: action.payload };

    case CREATE_DISPLAY_REQUEST:
      return { ...state, saving: true };

    case CREATE_DISPLAY_SUCCESS:
      return {
        ...state,
        saving: false,
        displays: [action.payload, ...state.displays],
      };

    case CREATE_DISPLAY_FAILURE:
      return { ...state, saving: false, error: action.payload };

    case DELETE_DISPLAY_REQUEST:
      return { ...state, saving: true };

    case DELETE_DISPLAY_SUCCESS:
      return {
        ...state,
        saving: false,
        displays: state.displays.filter((d) => d.id !== action.payload),
      };

    case DELETE_DISPLAY_FAILURE:
      return { ...state, saving: false, error: action.payload };

    default:
      return state;
  }
};

export default menuReducer;
