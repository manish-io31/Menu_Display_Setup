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
import { AuthActionTypes } from "./Authactions";

export interface MenuState {
  loading: boolean;
  menu: MenuCategory[];
  error: string | null;
  theme: ThemeConfig;
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
  },
};

const menuReducer = (
  state = initialState,
  action: AuthActionTypes,
): MenuState => {
  switch (action.type) {
    case FETCH_MENU_REQUEST:
      return { ...state, loading: true };

    case FETCH_MENU_SUCCESS:
      return {
        ...state,
        loading: false,
        menu: action.payload.map((cat) => ({
          ...cat,
          items: cat.items.map((item) => ({
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

    default:
      return state;
  }
};

export default menuReducer;
