// React Grid Logic
import React from "react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
// Core CSS
import { AgGridReact } from "ag-grid-react";

ModuleRegistry.registerModules([AllCommunityModule]);

// Create new PaginationDataGrid component
const PaginationDataGrid = ({
  name,
  loading = false,
  columns,
  rows,
  rowheight,
  height = "500px",
}) => {
  // Container: Defines the grid's theme & dimensions.
  return (
    <div style={{ width: "100%", height }}>
      {/* The AG Grid component, with Row Data & Column Definition props */}
      <AgGridReact
        rowData={rows}
        rowHeight={rowheight || 80}
        pagination
        loading={loading}
        columnDefs={columns}
      />
    </div>
  );
};

export default PaginationDataGrid;
