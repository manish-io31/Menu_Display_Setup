import { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMenuRequest,
  toggleItemSelection,
  selectAllItems,
  removeAllItems,
  updateTheme,
  updateItemDetails,
  reorderCategories,
  reorderCategoryItems,
} from "../../redux/Authactions";
import { MenuState } from "../../redux/Authreducer";
import { useNavigate } from "react-router-dom";
import { calculateCapacityStatistics } from "../../utils/capacityCalculator";
import MenuCard from "../../components/MenuCard/MenuCard";
import PageHeader from "../../components/PageHeader/PageHeader";
import Modal from "../../components/Modal/Modal";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import "./ItemMapping.css";

// --- Sortable Components ---

const SortableItem = ({
  id,
  children,
  data,
}: {
  id: string | number;
  children: React.ReactNode;
  data?: any;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, data });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 999 : "auto",
    position: "relative" as "relative",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

// Sortable Category Wrapper
// We only want the HEADER to be the drag handle, so we split listeners.
const SortableCategory = ({
  id,
  children,
  headerContent,
  onToggleCollapse,
  collapsed,
  onRemoveCategory,
}: {
  id: string;
  children: React.ReactNode;
  headerContent: React.ReactNode;
  itemCount: number;
  onToggleCollapse: () => void;
  collapsed: boolean;
  onRemoveCategory: () => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, data: { type: "category" } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    border: isDragging ? "2px dashed #ccc" : "none",
    marginBottom: "10px",
    background: "#fff",
    borderRadius: "6px",
  };

  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`im-group-section ${collapsed ? "collapsed" : ""}`}
    >
      <div className="im-group-header">
        {/* Drag Handle Area */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            cursor: "grab",
          }}
          {...attributes}
          {...listeners}
        >
          {headerContent}
        </div>

        {/* Actions Area */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Category Dropdown */}
          <div style={{ position: "relative" }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown(!showDropdown);
              }}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: "1.1em",
                padding: "0 5px",
              }}
            >
              ⋮
            </button>
            {showDropdown && (
              <>
                <div
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 999,
                  }}
                  onClick={() => setShowDropdown(false)}
                />
                <div className="im-item-dropdown" style={{ minWidth: "180px" }}>
                  <button
                    onClick={() => {
                      onToggleCollapse();
                      setShowDropdown(false);
                    }}
                  >
                    {collapsed ? "▼ Expand Category" : "▲ Collapse Category"}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Direct Remove Icon for Category */}
          <button
            className="im-direct-remove-btn"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveCategory();
            }}
            title="Remove Category"
          >
            ⊖
          </button>
        </div>
      </div>

      {!collapsed && <div className="im-group-body">{children}</div>}
    </div>
  );
};

function ItemMapping() {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const { loading, menu, theme } = useSelector((state: MenuState) => state);
  const [selectedCategoryName, setSelectedCategoryName] = useState<
    string | null
  >(null);
  // Modal State
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowPreviewModal(false);
    };
    if (showPreviewModal) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [showPreviewModal]);

  // Collapsed Categories State
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(
    new Set(),
  );

  const toggleCategoryCollapse = (category: string) => {
    const newSet = new Set(collapsedCategories);
    if (newSet.has(category)) {
      newSet.delete(category);
    } else {
      newSet.add(category);
    }
    setCollapsedCategories(newSet);
  };

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;
    if (active.id === over.id) return;

    const activeData = active.data.current;

    // 1. Category Sorting
    if (activeData?.type === "category") {
      const oldIndex = menu.findIndex((c) => `cat-${c.category}` === active.id);
      const newIndex = menu.findIndex((c) => `cat-${c.category}` === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        dispatch(reorderCategories(oldIndex, newIndex));
      }
      return;
    }

    // 2. Item Sorting
    // Existing logic, but we need to find the category first.
    // active.id is 'item-ID'.
    const itemId = String(active.id).replace("item-", "");
    const overId = String(over.id).replace("item-", "");

    // Find Category of active item
    const activeCategory = menu.find((c) =>
      c.items.some((i) => String(i.id) === itemId),
    );
    const overCategory = menu.find((c) =>
      c.items.some((i) => String(i.id) === overId),
    );

    if (!activeCategory || !overCategory) return;

    if (activeCategory.category === overCategory.category) {
      const fullList = activeCategory.items;
      const oldIndex = fullList.findIndex((i) => String(i.id) === itemId);
      const newIndex = fullList.findIndex((i) => String(i.id) === overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        dispatch(
          reorderCategoryItems(activeCategory.category, oldIndex, newIndex),
        );
      }
    }
  };

  // Edit Mode State
  const [editingItemId, setEditingItemId] = useState<number | string | null>(
    null,
  );
  const [editValues, setEditValues] = useState<{
    displayName: string;
    displayPrice: string;
    isAvailable: boolean;
  } | null>(null);

  useEffect(() => {
    dispatch(fetchMenuRequest());
  }, [dispatch]);

  useEffect(() => {
    if (menu.length > 0 && !selectedCategoryName) {
      setSelectedCategoryName(menu[0].category);
    }
  }, [menu, selectedCategoryName]);

  const handleToggleSelection = (id: number | string) => {
    dispatch(toggleItemSelection(id));
  };

  const handleSelectAll = (shouldSelect: boolean) => {
    if (selectedCategoryName) {
      dispatch(selectAllItems(selectedCategoryName, shouldSelect));
    }
  };

  const handleRemoveAll = () => {
    dispatch(removeAllItems());
  };

  const selectedCategory = useMemo(
    () => menu.find((c) => c.category === selectedCategoryName),
    [menu, selectedCategoryName],
  );

  // Sync capacity when theme settings that affect it change
  useEffect(() => {
    const stats = calculateCapacityStatistics(theme, menu);
    if (stats.totalCapacity !== theme.approxItemsVisible) {
      dispatch(updateTheme({ approxItemsVisible: stats.totalCapacity }));
    }
  }, [
    theme.fontSizeScale,
    theme.orientation,
    theme.showLogo,
    theme.showFooter,
    theme.showUnavailable,
    menu,
    dispatch,
  ]);

  const capacity = theme.approxItemsVisible;
  const totalSelectedCount = useMemo(() => {
    let count = 0;
    menu.forEach((cat) => {
      cat.items.forEach((item) => {
        if (item.isSelected && (theme.showUnavailable || item.isAvailable)) {
          count++;
        }
      });
    });
    return count;
  }, [menu, theme.showUnavailable]);

  // Capacity Logic: ZERO MISMATCH GUARANTEE
  const itemsLeft = capacity - totalSelectedCount;
  const isCapacityReached = itemsLeft <= 0;
  const isOverCapacity = itemsLeft < 0;

  // Capacity visual feedback
  const capacityState = isOverCapacity
    ? "danger"
    : itemsLeft <= 5
      ? "warning"
      : "safe";

  // Group items that are SELECTED and visible based on 'showUnavailable' toggle
  const selectedItemsGrouped = useMemo(() => {
    const grouped: { category: string; items: any[] }[] = [];
    menu.forEach((cat) => {
      // Filter: Must be Selected AND (ShowUnavailable=True OR Item=Available)
      const visibleItems = cat.items.filter(
        (i) => i.isSelected && (theme.showUnavailable || i.isAvailable),
      );

      if (visibleItems.length > 0) {
        grouped.push({ category: cat.category, items: visibleItems });
      }
    });
    return grouped;
  }, [menu, theme.showUnavailable]);

  /* Removed manual calculation to use memoized totalSelectedCount */

  const isAllSelected = useMemo(() => {
    if (!selectedCategory) return false;
    return (
      selectedCategory.items.length > 0 &&
      selectedCategory.items.every((i) => i.isSelected)
    );
  }, [selectedCategory]);

  const startEditing = (item: any) => {
    setEditingItemId(item.id);
    setEditValues({
      displayName: item.displayName || item.name,
      displayPrice: item.displayPrice || item.price.toString(),
      isAvailable: item.isAvailable,
    });
  };

  const saveEditing = () => {
    if (editingItemId && editValues) {
      dispatch(updateItemDetails(editingItemId, editValues));
      setEditingItemId(null);
      setEditValues(null);
    }
  };

  const cancelEditing = () => {
    setEditingItemId(null);
    setEditValues(null);
  };

  const handleContinue = () => {
    // Capacity Validation
    if (isOverCapacity) {
      alert(
        `You have selected ${totalSelectedCount} items, but only ${capacity} will fit. Please remove ${Math.abs(itemsLeft)} items to continue.`,
      );
      return;
    }

    // Collect all items under Selected Items for Display
    // Helper to match exactly what is shown:
    const structuredData: any[] = [];

    selectedItemsGrouped.forEach((group) => {
      group.items.forEach((item) => {
        structuredData.push({
          category: group.category,
          itemName: item.displayName || item.name,
          price: item.displayPrice || item.price,
          isAvailable: item.isAvailable,
        });
      });
    });

    console.log("SELECTED ITEMS FOR DISPLAY", structuredData);
    navigate("/upload-images");
  };

  // Scale Calculation for Preview
  const [previewScale, setPreviewScale] = useState(1);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateScale = () => {
      if (showPreviewModal && previewContainerRef.current) {
        const containerWidth = previewContainerRef.current.offsetWidth;
        const boardWidth = theme.orientation === "portrait" ? 720 : 1280;
        const newScale = (containerWidth - 40) / boardWidth;
        setPreviewScale(Math.min(newScale, 1));
      }
    };

    if (showPreviewModal) {
      const timer = setTimeout(updateScale, 100);
      window.addEventListener("resize", updateScale);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", updateScale);
      };
    }
  }, [showPreviewModal, theme.orientation]);

  if (loading) return <div className="loading-screen">Loading items...</div>;

  return (
    <div className="preview-layout-container">
      <PageHeader title="Display signage" currentStep={3} />

      <div className="item-mapping-grid">
        {/* COLUMN 1: Categories */}
        <div className="im-col-categories">
          <h3 className="im-col-header">CATEGORIES</h3>
          <div className="im-category-list">
            {menu.map((cat) => (
              <div
                key={cat.category}
                className={`im-category-item ${selectedCategoryName === cat.category ? "active" : ""}`}
                onClick={() => setSelectedCategoryName(cat.category)}
              >
                <span
                  className={`im-cat-name ${selectedCategoryName === cat.category ? "active-text" : ""}`}
                >
                  {cat.category}
                </span>
                <span className="im-cat-count">({cat.items.length})</span>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMN 2: Items Selection */}
        <div className="im-col-items">
          {selectedCategory ? (
            <>
              <div className="im-col-header-row">
                <label className="im-select-all-label">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    disabled={!isAllSelected && isCapacityReached}
                  />
                  Select all items
                </label>
                <button
                  className="im-clear-btn"
                  onClick={() => handleSelectAll(false)}
                >
                  × Clear category selection
                </button>
              </div>

              <div className="im-items-grid">
                {selectedCategory.items.map((item) => (
                  <div
                    key={item.id}
                    className={`im-item-card ${item.isSelected ? "selected" : ""}`}
                    onClick={() => {
                      if (!item.isSelected && isCapacityReached) return;
                      handleToggleSelection(item.id);
                    }}
                  >
                    <div className="im-card-header">
                      <span className="im-item-name" title={item.name}>
                        {item.name}
                      </span>
                      <div className="im-arrow">→</div>
                    </div>
                    <div className="im-card-footer">
                      <span className="im-item-price">
                        {item.isAvailable ? (
                          `₹${item.price.toFixed(2)}`
                        ) : (
                          <span className="im-badge-soldout-card">
                            Sold Out
                          </span>
                        )}
                      </span>

                      {/* Visual Checkbox */}
                      <div
                        className={`im-checkbox ${item.isSelected ? "checked" : ""} ${!item.isSelected && isCapacityReached ? "disabled" : ""}`}
                      >
                        {item.isSelected && "✓"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="im-empty-state">
              Select a category to view items
            </div>
          )}
        </div>

        {/* COLUMN 3: Selected Items List & Editing */}
        <div className="im-col-status">
          <div className={`im-status-header-row ${capacityState}`}>
            <span className="im-status-title">SELECTED ITEMS FOR DISPLAY</span>
            <span className={`im-items-left ${capacityState}`}>
              {isOverCapacity
                ? `Overflow: ${Math.abs(itemsLeft)}`
                : `Items left: ${itemsLeft}`}
            </span>
          </div>

          <div className="im-status-subheader-row">
            <span className="im-added-count">
              Added items: {totalSelectedCount}
            </span>
            {isOverCapacity && (
              <span className="capacity-error-text">
                ⚠️ Reduce {Math.abs(itemsLeft)} items to fit!
              </span>
            )}
            {totalSelectedCount > 0 && (
              <button className="im-remove-all-btn" onClick={handleRemoveAll}>
                Remove all <span className="minus-circle">⊖</span>
              </button>
            )}
          </div>

          <div className="im-selected-list">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={selectedItemsGrouped.map((g) => `cat-${g.category}`)}
                strategy={verticalListSortingStrategy}
              >
                {selectedItemsGrouped.length > 0 ? (
                  selectedItemsGrouped.map((group) => (
                    <SortableCategory
                      key={group.category}
                      id={`cat-${group.category}`}
                      headerContent={
                        <>
                          :: {group.category} ({group.items.length})
                        </>
                      }
                      itemCount={group.items.length}
                      onToggleCollapse={() =>
                        toggleCategoryCollapse(group.category)
                      }
                      collapsed={collapsedCategories.has(group.category)}
                      onRemoveCategory={() =>
                        dispatch(selectAllItems(group.category, false))
                      }
                    >
                      <SortableContext
                        items={group.items.map((i) => `item-${i.id}`)}
                        strategy={verticalListSortingStrategy}
                      >
                        {group.items.map((item) => {
                          const isEditing = editingItemId === item.id;
                          const itemIdStr = `item-${item.id}`;

                          return (
                            <SortableItem
                              key={item.id}
                              id={itemIdStr}
                              data={{ type: "item" }}
                            >
                              <div
                                className={`im-selected-item-row grouped ${!item.isAvailable ? "sold-out-row" : ""}`}
                              >
                                {/* Drag Handle */}
                                <div
                                  className="im-drag-handle"
                                  style={{
                                    cursor: "grab",
                                    marginRight: "8px",
                                    color: "#ccc",
                                    fontSize: "1.2em",
                                  }}
                                >
                                  ⠿
                                </div>

                                {isEditing ? (
                                  <div className="im-edit-mode">
                                    <div className="im-edit-inputs">
                                      <input
                                        className="im-edit-input"
                                        value={editValues?.displayName}
                                        onChange={(e) =>
                                          setEditValues((prev) =>
                                            prev
                                              ? {
                                                  ...prev,
                                                  displayName: e.target.value,
                                                }
                                              : null,
                                          )
                                        }
                                        placeholder="Name"
                                      />
                                      <input
                                        className="im-edit-input-price"
                                        value={editValues?.displayPrice}
                                        onChange={(e) =>
                                          setEditValues((prev) =>
                                            prev
                                              ? {
                                                  ...prev,
                                                  displayPrice: e.target.value,
                                                }
                                              : null,
                                          )
                                        }
                                        placeholder="Price"
                                      />
                                    </div>
                                    <div className="im-edit-actions">
                                      <button
                                        className="im-save-btn"
                                        onClick={saveEditing}
                                      >
                                        ✓
                                      </button>
                                      <button
                                        className="im-cancel-btn"
                                        onClick={cancelEditing}
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="im-selected-item-text">
                                      {item.foodType && (
                                        <span
                                          className={`im-food-type-icon ${item.foodType.toLowerCase() === "veg" ? "veg" : "non-veg"}`}
                                          title={item.foodType}
                                        >
                                          <span className="dot"></span>
                                        </span>
                                      )}
                                      <span
                                        className={`im-selected-name ${!item.isAvailable ? "text-strike" : ""}`}
                                      >
                                        {item.displayName || item.name}
                                      </span>
                                      {!item.isAvailable && (
                                        <span className="im-badge-soldout">
                                          Sold Out
                                        </span>
                                      )}
                                    </div>
                                    <div
                                      className="im-selected-item-right"
                                      style={{ gap: "8px" }}
                                    >
                                      {/* Availability Toggle */}
                                      <button
                                        className={`im-toggle-btn ${item.isAvailable ? "on" : "off"}`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          dispatch(
                                            updateItemDetails(item.id, {
                                              isAvailable: !item.isAvailable,
                                            }),
                                          );
                                        }}
                                        title={
                                          item.isAvailable
                                            ? "Click to Mark Sold Out"
                                            : "Click to Mark Available"
                                        }
                                      >
                                        {item.isAvailable
                                          ? "AVAIL"
                                          : "SOLD OUT"}
                                      </button>

                                      <span className="im-selected-price">
                                        ₹{item.displayPrice || item.price}
                                      </span>

                                      {/* Direct Edit Icon */}
                                      <button
                                        className="im-direct-edit-btn"
                                        onClick={() => startEditing(item)}
                                        title="Edit Item"
                                      >
                                        ✎
                                      </button>

                                      {/* Direct Remove Icon */}
                                      <button
                                        className="im-direct-remove-btn"
                                        onClick={() =>
                                          handleToggleSelection(item.id)
                                        }
                                        title="Remove Item"
                                      >
                                        ⊖
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </SortableItem>
                          );
                        })}
                      </SortableContext>
                    </SortableCategory>
                  ))
                ) : (
                  <div className="im-info-card-centered">
                    <p>
                      Selected font size allows Approx.{" "}
                      <strong>{capacity} items</strong> in total for better
                      visibility.
                    </p>
                  </div>
                )}
              </SortableContext>
            </DndContext>
          </div>

          <div className="im-footer-toggle">
            {isCapacityReached && (
              <div
                style={{
                  marginBottom: "10px",
                  padding: "8px",
                  background: "#e29313ff",
                  color: "#e65100",
                  borderRadius: "4px",
                  fontSize: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                ⚠️ Selected Items for Display limit reached
              </div>
            )}
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={theme.showUnavailable ?? true}
                onChange={(e) =>
                  dispatch(updateTheme({ showUnavailable: e.target.checked }))
                }
              />
              Show unavailable items in display
            </label>
          </div>
        </div>
      </div>

      <div className="footer-actions">
        <div className="action-buttons right-aligned">
          <button
            className="btn-secondary-outline"
            onClick={() => setShowPreviewModal(true)}
          >
            PREVIEW
          </button>
          <button
            className="btn-secondary-outline"
            onClick={() => navigate(-1)}
          >
            BACK
          </button>
          <button
            className="btn-continue"
            disabled={totalSelectedCount === 0}
            onClick={handleContinue}
          >
            CONTINUE
          </button>
        </div>
      </div>

      {/* PREVIEW MODAL */}
      <Modal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        className="preview-modal"
      >
        <div className="im-modal-preview-container" ref={previewContainerRef}>
          <div
            className="im-scaled-preview"
            style={{
              transform: `scale(${previewScale})`,
              width: theme.orientation === "portrait" ? "720px" : "1280px",
              height: theme.orientation === "portrait" ? "1280px" : "720px",
              transformOrigin: "top left",
            }}
          >
            <MenuCard
              theme={theme}
              previewMode={false} // Only show selected items
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ItemMapping;
