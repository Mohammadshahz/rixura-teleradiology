// React Grid Logic
import React, { useEffect, useState } from "react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
// Core CSS
import { AgGridReact } from "ag-grid-react";
import axios from "axios";
// import { useThemeContext } from "../../../context/ThemeContext";
import Button from "../../layout-ui/Button";

ModuleRegistry.registerModules([AllCommunityModule]);

// Create new ServerPaginationDataGrid component
const ServerPaginationDataGrid = ({
  name,
  columns,
  height = "500px",
  rowHeight,
  url,
  query = {},
}) => {
  // const { theme } = useThemeContext();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  // const url = `${_url}?page=${page}&limit=${limit}`;

  // console.log({ theme });

  useEffect(() => {
    setLoading(true);
    axios
      .get(url, { params: { page, limit, ...query } })
      .then((res) => {
        setRows(res.data.data);
        // setRows(res.data);
        setTotalPage(
          res.data.meta?.totalPages ??
            res.data.meta?.pages ??
            res.data.totalPages ??
            1
        );
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, limit, url, query]);
  // Container: Defines the grid's theme & dimensions.
  return (
    <>
      <div style={{ width: "100%", height }}>
        {/* The AG Grid component, with Row Data & Column Definition props */}
        <AgGridReact
          rowData={rows}
          // pagination
          loading={loading}
          columnDefs={columns}
          rowHeight={rowHeight}
        />
      </div>
      <div className="flex justify-end gap-4 mt-4 items-center">
        <p>
          {page} of {totalPage} pages
        </p>
        <select
          name=""
          id=""
          className="dark:bg-black"
          onChange={(e) => setLimit(Number(e.target.value))}
        >
          {[10, 25, 50, 100].map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <Button
          onClick={() => {
            setPage(page - 1);
          }}
          size="sm"
          variant="outlined"
          disabled={page === 1}
        >
          Previous
        </Button>
        <Button
          size="sm"
          disabled={page === totalPage || !totalPage}
          onClick={() => {
            setPage(page + 1);
          }}
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default ServerPaginationDataGrid;
