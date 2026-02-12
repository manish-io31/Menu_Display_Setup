import react, { useMemo, useEffect, CSSProperties } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThemeConfig, MenuItem } from "../../types";
import { fetchMenuRequest } from "../../redux/Authactions";
import "./MenuCard.css";
import { RootState, AppDispatch } from "../../redux/store";

interface MenuCardProps {
  theme?: Partial<ThemeConfig>;
  isFullPreview?: boolean;
  setIsFullPreview?: (isFull: boolean) => void;
  onItemsVisibleChange?: (count: number) => void;
  previewMode?: boolean; // New prop to force render items
}

type MenuNode =
  | { type: "header"; text: string; isPrimary: boolean }
  | { type: "item"; data: MenuItem };

function MenuCard({
  theme = {},
  isFullPreview = false,
  setIsFullPreview,
  onItemsVisibleChange,
  previewMode = false,
}: MenuCardProps) {
  const dispatch = useDispatch<AppDispatch>();

  const { loading, menu = [] } = useSelector((state: RootState) => state);

  useEffect(() => {
    if (!menu || menu.length === 0) {
      dispatch(fetchMenuRequest());
    }
  }, [dispatch, menu.length]);

  const {
    showLogo = true,
    primary = "#0072BB",
    secondary = "#EA0089",
    backgroundColor = "#222222",
    backgroundType = "color",
    backgroundImage = "",
    categoryFont = "Protest Riot",
    itemFont = "Outfit",
    categoryFontColor = "#FFFFFF",
    itemFontColor = "#FFFFFF",
    priceFontColor = "#FFFFFF",
    companyName = "",
    allowScrolling = true,
    orientation = "landscape",
    showUnavailable = true,
  } = theme;

  const dynamicStyles: CSSProperties = {
    "--bg-color": backgroundType === "color" ? backgroundColor : "transparent",
    "--bg-image":
      backgroundType === "image" && backgroundImage
        ? `url(${backgroundImage})`
        : "none",
    "--item-font": itemFont,
    "--item-color": itemFontColor,
    "--cat-font": categoryFont,
    "--cat-color": categoryFontColor,
    "--font-scale": theme.fontSizeScale || 3,
    "--primary": primary,
    "--secondary": secondary,
    "--price-color": priceFontColor,
    "--bg-opacity": (theme.bgOpacity ?? 100) / 100,
  } as CSSProperties;

  const flattenedItems = useMemo<MenuNode[]>(() => {
    if (!menu || menu.length === 0) return [];

    let flatList: MenuNode[] = [];
    menu.forEach((section, idx) => {
      const visibleCategoryItems = section.items.filter(
        (item) =>
          (previewMode || item.isSelected) &&
          (showUnavailable || item.isAvailable),
      );

      if (visibleCategoryItems.length > 0) {
        flatList.push({
          type: "header",
          text: section.category,
          isPrimary: idx % 2 === 0,
        });

        visibleCategoryItems.forEach((item) => {
          flatList.push({
            type: "item",
            data: item,
          });
        });
      }
    });
    return flatList;
  }, [menu, showUnavailable, previewMode]);

  const columns = useMemo(() => {
    const isPortrait = orientation === "portrait";
    const numCols = isPortrait ? 2 : 3;
    const scale = theme.fontSizeScale || 3;

    const totalW = isPortrait ? 720 : 1280;
    const totalH = isPortrait ? 1280 : 720;

    const headerH_px = totalH * 0.1;
    const footerH_px = 80;
    const paddingY = 40;
    const availableGridHeight =
      totalH - headerH_px - footerH_px - paddingY - 20;

    // Width Metrics
    const paddingX = 40 * 2;
    const gapX = 30 * (numCols - 1);
    const availableWidthPerCol = (totalW - paddingX - gapX) / numCols;

    // Font Metrics
    const baseFontSize = 12 * (scale / 3);
    const charWidthFactor = 0.55;
    const avgCharsPerLine = Math.floor(
      availableWidthPerCol / (baseFontSize * charWidthFactor),
    );

    const headerNodeH = 13 * (scale / 3) + 8 + 12; // Font + Padding + Margin
    const lineH = baseFontSize * 1.33;
    const nodePadding = 3;

    const getNodeHeight = (node: MenuNode) => {
      if (node.type === "header") return headerNodeH;
      const itemName = node.data.displayName || node.data.name || "";
      const lines = Math.ceil(itemName.length / Math.max(10, avgCharsPerLine));
      return lines * lineH + nodePadding;
    };

    const cols = Array.from({ length: numCols }, () => [] as MenuNode[]);

    let currentCol = 0;
    let currentColHeight = 0;

    for (const node of flattenedItems) {
      if (node.type === "item" && !node.data.name) continue; // Safety

      const h = getNodeHeight(node);

      // If adds to more than height, move to next col
      // But simple greedy might leave holes or split weirdly.
      // User logic is simple greedy.
      if (currentColHeight + h > availableGridHeight) {
        currentCol++;
        currentColHeight = 0;

        if (currentCol >= numCols) {
          break; // Stop rendering if out of space
        }
      }

      cols[currentCol].push(node);
      currentColHeight += h;
    }

    // Cleanup trailing headers in columns
    cols.forEach((col) => {
      while (col.length > 0 && col[col.length - 1].type === "header") {
        col.pop();
      }
    });

    return cols;
  }, [flattenedItems, orientation, theme.fontSizeScale]);

  useEffect(() => {
    if (onItemsVisibleChange) {
      let count = 0;
      columns.forEach((col) => {
        col.forEach((node) => {
          if (node.type === "item") count++;
        });
      });
      onItemsVisibleChange(count);
    }
  }, [columns, onItemsVisibleChange]);

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  return (
    <div
      className={`preview-board ${isFullPreview ? "full-mode" : ""} ${orientation} ${!allowScrolling ? "no-scroll" : ""} ${!showLogo ? "no-logo" : ""}`}
      style={dynamicStyles}
    >
      {!isFullPreview && setIsFullPreview && (
        <button
          className="full-preview-btn"
          onClick={() => setIsFullPreview(true)}
        >
          FULL PREVIEW
        </button>
      )}
      {isFullPreview && setIsFullPreview && (
        <button
          className="exit-full-preview-btn"
          onClick={() => setIsFullPreview(false)}
        >
          ✕ CLOSE PREVIEW
        </button>
      )}
      {showLogo && (
        <div className="preview-header">
          <img
            src={
              theme.logo ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG7_K4JPpUYrgBZuy2vZW-bGwTM_Oq-17xKw&s"
            }
            alt="logo"
            className="preview-logo"
            style={{
              width: theme.logoWidth ? `${theme.logoWidth}px` : "150px",
            }}
          />
          {companyName && (
            <h1 className="preview-company-name">{companyName}</h1>
          )}
        </div>
      )}

      <div className="preview-grid-columns">
        {columns.map((colItems, colIdx) => (
          <div className="preview-struct-column" key={colIdx}>
            {colItems.map((node, nodeIdx) => {
              if (node.type === "header") {
                return (
                  <div
                    className="category-ribbon-styled"
                    style={
                      {
                        "--ribbon-color": node.isPrimary
                          ? "var(--primary)"
                          : "var(--secondary)",
                      } as CSSProperties
                    }
                    key={`h-${colIdx}-${nodeIdx}`}
                  >
                    <span>{node.text}</span>
                  </div>
                );
              } else {
                const item = node.data;
                return (
                  <div
                    className={`preview-item-styled ${!item.isAvailable ? "sold-out" : ""}`}
                    key={`i-${colIdx}-${nodeIdx}`}
                  >
                    <span className="item-name">
                      {item.foodType && (
                        <span
                          className={`food-type-icon ${item.foodType.toLowerCase() === "veg" ? "veg" : "non-veg"}`}
                        >
                          <span className="dot"></span>
                        </span>
                      )}
                      {item.displayName || item.name}
                    </span>
                    <span className="item-price">
                      {item.isAvailable
                        ? `₹${item.displayPrice || item.price}`
                        : "Sold Out"}
                    </span>
                  </div>
                );
              }
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MenuCard;
