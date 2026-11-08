// ServerPaginationDataGrid.jsx
import React, {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import { useThemeContext } from "../../../context/ThemeContext";
import Button from "../Buttons";

// Register all AG Grid community modules
ModuleRegistry.registerModules([AllCommunityModule]);

/**
 * Server-side paginated data grid component using AG Grid.
 *
 * @param {object} props - Component props
 * @param {string} props.name - Name identifier for the table
 * @param {Array} props.columns - Column definitions for AG Grid
 * @param {string} [props.height="500px"] - Grid container height
 * @param {number} [props.rowHeight] - Optional custom row height
 * @param {string} props.url - API endpoint to fetch paginated data
 * @param {object} [props.query={}] - Additional query parameters
 * @param {React.Ref} ref - Ref to expose methods to parent
 */
const ServerPaginationDataGrid = forwardRef(
  ({ name, columns, height = "500px", rowHeight, url, query = {} }, ref) => {
    const { theme } = useThemeContext();

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPage, setTotalPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);

    // Internal ref to trigger data fetching
    const fetchData = () => {
      setLoading(true);
      axios
        .get(url, { params: { page, limit, ...query } })
        .then((res) => {
          setRows(res.data.data);
          setTotalPage(res.data.meta.totalPages || res.data.meta.pages);
        })
        .catch((err) => {
          console.error("Data Fetch Error:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    // Handle ref method for external use
    useImperativeHandle(ref, () => ({
      /**
       * Refetch data manually from parent
       */
      refetch: () => {
        fetchData();
      },
    }));

    // Fetch data when pagination or query parameters change
    useEffect(() => {
      fetchData();
    }, [page, limit, query, url]);

    // Reset to first page when query changes
    useEffect(() => {
      setPage(1);
    }, [query]);

    return (
      <>
        {/* Grid Container */}
        <div style={{ width: "100%", height }}>
          <AgGridReact
            rowData={rows}
            loading={loading}
            columnDefs={columns}
            rowHeight={rowHeight}
          />
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-end gap-4 mt-4 items-center">
          <p>
            {page} of {totalPage} pages
          </p>

          <select
            className="dark:bg-black"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1); // Reset to page 1 when limit changes
            }}
          >
            {[10, 25, 50, 100].map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          <Button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            size="sm"
            variant="outlined"
            disabled={page === 1}
          >
            Previous
          </Button>

          <Button
            size="sm"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPage))}
            disabled={page === totalPage}
          >
            Next
          </Button>
        </div>
      </>
    );
  }
);

export default ServerPaginationDataGrid;
