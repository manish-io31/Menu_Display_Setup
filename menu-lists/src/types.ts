export interface MenuItem {
  id: number | string;
  name: string;
  price: number;
  foodType: "VEG" | "NON_VEG";
  isHot?: boolean;
  isAvailable: boolean;
  isSelected?: boolean; // Controls if it appears on the menu board
  displayName?: string; // Override name for display
  displayPrice?: string; // Override price for display
  category?: string;
}

export interface MenuCategory {
  category: string;
  items: MenuItem[];
}

export interface MenuResponse {
  menu: MenuCategory[];
}

export interface ThemeConfig {
  showLogo: boolean;
  logo?: string;
  logoWidth?: number;
  unavailableTheme?: string;
  categoryFont: string;
  itemFont: string;
  primary: string;
  secondary: string;
  backgroundType: "color" | "image";
  backgroundImage: string;
  backgroundColor: string;
  categoryFontColor: string;
  itemFontColor: string;
  priceFontColor: string;
  orientation: "landscape" | "portrait";
  companyName: string;
  fontSizeScale: number;
  allowScrolling: boolean;
  showFooter: boolean;
  showUnavailable?: boolean;
  bgOpacity?: number;
  approxItemsVisible: number;
  menuImages: string[];
}

export interface Display {
  id: number | string;
  name: string;
  type: string;
  orientation: "landscape" | "portrait";
  isActive: boolean;
  selectedItems: MenuItem[];
  theme: ThemeConfig;
  uploadedImages: string[];
}
