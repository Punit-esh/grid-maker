import React, { useState, memo } from "react";
import { ReactComponent as Close } from "../assets/close.svg";
import GridItemList from "./GridItemList";

/**
 * `GridMaker` component
 * Allows users to create, resize, and manage a grid structure dynamically.
 * Users can add/remove rows and columns, and add items to the grid by clicking.
 */
const GridMaker = () => {
  const [columns, setColumns] = useState(["1fr", "1fr"]); // Initial column sizes
  const [rows, setRows] = useState(["1fr", "1fr"]); // Initial row sizes
  const [dragStart, setDragStart] = useState([1, 1]); // Starting point for item placement
  const [items, setItems] = useState([]); // List of items added to the grid

  /**
   * Adds a new grid dimension (row or column).
   * Limits rows and columns to a maximum of 12 each.
   * @param {string} type - Type of dimension to add ('row' or 'column').
   */
  const addGridDimension = (type) => {
    if (type === "column" && columns.length < 12) {
      setColumns([...columns, "1fr"]);
    } else if (type === "row" && rows.length < 12) {
      setRows([...rows, "1fr"]);
    }
  };

  return (
    <div className="gridmaker">
      {/* Column Controls */}
      <div
        className="grid_x_controls"
        style={{ gridTemplateColumns: columns.join(" ") }}
      >
        {columns.map((col, index) => (
          <div key={`col-${index}`} className="items">
            {/* Editable column size */}
            <input
              aria-label={`Column ${index + 1} size`}
              value={col}
              onChange={(e) =>
                setColumns((prev) =>
                  prev.map((item, i) => (i === index ? e.target.value : item))
                )
              }
            />
            {/* Delete button for column */}
            <div
              className="delete_btn"
              onClick={() =>
                setColumns((prev) => prev.filter((_, i) => i !== index))
              }
            >
              <Close />
            </div>
          </div>
        ))}
      </div>
      {/* Button to add new columns */}
      <button
        className="add_btn_column"
        onClick={() => addGridDimension("column")}
        aria-label="Add Column"
      >
        Add Column
      </button>

      {/* Row Controls */}
      <div
        className="grid_y_controls"
        style={{ gridTemplateRows: rows.join(" ") }}
      >
        {rows.map((row, index) => (
          <div key={`row-${index}`} className="items">
            {/* Editable row size */}
            <input
              aria-label={`Row ${index + 1} size`}
              value={row}
              onChange={(e) =>
                setRows((prev) =>
                  prev.map((item, i) => (i === index ? e.target.value : item))
                )
              }
            />
            {/* Delete button for row */}
            <div
              className="delete_btn"
              onClick={() =>
                setRows((prev) => prev.filter((_, i) => i !== index))
              }
            >
              <Close />
            </div>
          </div>
        ))}
      </div>
      {/* Button to add new rows */}
      <button
        className="add_btn_row"
        onClick={() => addGridDimension("row")}
        aria-label="Add Row"
      >
        Add Row
      </button>

      {/* Main Grid */}
      <div className="grid_main">
        {/* Background Grid - Defines grid structure based on rows and columns */}
        <div
          className="grid_template"
          style={{
            gridTemplateColumns: columns.join(" "),
            gridTemplateRows: rows.join(" "),
          }}
        >
          {/* Empty grid cells for item placement */}
          {[...Array(rows.length)].map((_, i) =>
            [...Array(columns.length)].map((_, j) => (
              <div
                key={`grid-${i}-${j}`}
                className="item"
                onMouseDown={() => setDragStart([i + 1.5, j + 1.5])}
                onMouseUp={() => {
                  // Define start and end coordinates for the new item
                  const end = [i + 1.5, j + 1.5];
                  const [startX, startY] = dragStart;
                  const [endX, endY] = end;

                  // Add the new item to the grid
                  setItems((prev) => [
                    ...prev,
                    {
                      name: `BOX ${prev.length + 1}`,
                      start: [
                        Math.floor(Math.min(startX, endX)),
                        Math.floor(Math.min(startY, endY)),
                      ],
                      end: [
                        Math.ceil(Math.max(startX, endX)),
                        Math.ceil(Math.max(startY, endY)),
                      ],
                    },
                  ]);
                }}
              />
            ))
          )}
        </div>

        {/* Render Added Grid Items */}
        <div
          className="grid_template float_template"
          style={{
            gridTemplateColumns: columns.join(" "),
            gridTemplateRows: rows.join(" "),
          }}
        >
          {items.map((item, index) => (
            <div
              key={item.name}
              className="item_to_show"
              aria-label={item.name}
              style={{
                gridArea: `${item.start[0]} / ${item.start[1]} / ${item.end[0]} / ${item.end[1]}`,
              }}
              box_color={item.name.replace("BOX", "") % 12}
            >
              {item.name}
              {/* Button to delete grid item */}
              <div
                className="delete_btn"
                onClick={() =>
                  setItems((prev) => prev.filter((_, i) => i !== index))
                }
              >
                <Close />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* List of items in the grid */}
      <GridItemList items={items} setitems={setItems} />
    </div>
  );
};

// Use React.memo to optimize re-renders by memoizing the component
export default memo(GridMaker);
