import { ThemeConfig, MenuCategory, MenuItem } from "../types";

export interface CapacityResult {
  totalCapacity: number;
  itemsThatFit: number;
  overflowCount: number;
}

export const calculateCapacityStatistics = (
  theme: ThemeConfig,
  menu: MenuCategory[],
): CapacityResult => {
  const scale = theme.fontSizeScale || 3;
  const isPortrait = theme.orientation === "portrait";
  const numCols = isPortrait ? 2 : 3;

  // --- Strict Metrics from CSS ---
  const totalW = isPortrait ? 720 : 1280;
  const totalH = isPortrait ? 1280 : 720;

  const headerH_px = theme.showLogo ? totalH * 0.1 : 20;
  const footerH_px = theme.showFooter ? 80 : 0;
  const paddingY = 40;

  const availableGridHeight = totalH - headerH_px - footerH_px - paddingY - 10;

  const paddingX = 40 * 2;
  const gapX = 30 * (numCols - 1);
  const availableWidthPerCol = (totalW - paddingX - gapX) / numCols;

  const baseFontSize = 12 * (scale / 3);
  const charWidthFactor = 0.55;
  const avgCharsPerLine = Math.floor(
    availableWidthPerCol / (baseFontSize * charWidthFactor),
  );

  const headerNodeH = 13 * (scale / 3) + 8 + 12;
  const lineH = baseFontSize * 1.33;
  const nodePadding = 3;

  // Flatten selected items for counting
  const selectedItems: MenuItem[] = [];
  menu.forEach((cat) => {
    cat.items.forEach((item) => {
      if (item.isSelected && (theme.showUnavailable || item.isAvailable)) {
        selectedItems.push(item);
      }
    });
  });

  // Simulate MenuCard's column distribution
  let currentColHeight = 0;
  let currentCol = 0;
  let fitCount = 0;

  // We also need to account for category headers in the simulation
  const visibleCategories = menu.filter((cat) =>
    cat.items.some(
      (i) => i.isSelected && (theme.showUnavailable || i.isAvailable),
    ),
  );

  for (const cat of visibleCategories) {
    // Category Header
    if (currentColHeight + headerNodeH > availableGridHeight) {
      currentCol++;
      currentColHeight = 0;
    }
    if (currentCol >= numCols) break;
    currentColHeight += headerNodeH;

    // Items in category
    const catItems = cat.items.filter(
      (i) => i.isSelected && (theme.showUnavailable || i.isAvailable),
    );
    for (const item of catItems) {
      const lines = Math.ceil(
        (item.displayName || item.name).length / Math.max(10, avgCharsPerLine),
      );
      const h = lines * lineH + nodePadding;

      if (currentColHeight + h > availableGridHeight) {
        currentCol++;
        currentColHeight = 0;
        if (currentCol >= numCols) break;
      }

      currentColHeight += h;
      fitCount++;
    }
    if (currentCol >= numCols) break;
  }

  // Estimation of TOTAL capacity if space remains
  const remainingCols = numCols - 1 - currentCol;
  const avgItemHeight = 1.5 * lineH + nodePadding; // average 1.5 lines
  const remainingInCurrent = Math.floor(
    Math.max(0, availableGridHeight - currentColHeight) / avgItemHeight,
  );
  const inRemainingCols =
    remainingCols *
    Math.floor((availableGridHeight - headerNodeH / 2) / avgItemHeight);

  const estimatedTotal = fitCount + remainingInCurrent + inRemainingCols;

  return {
    totalCapacity: estimatedTotal,
    itemsThatFit: fitCount,
    overflowCount: Math.max(0, selectedItems.length - fitCount),
  };
};

// Legacy support
export const calculateEstimatedCapacity = (theme: ThemeConfig): number => {
  return calculateCapacityStatistics(theme, []).totalCapacity;
};
