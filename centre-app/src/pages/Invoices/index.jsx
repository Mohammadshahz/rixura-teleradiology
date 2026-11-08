import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import ServerPaginationDataGrid from "../../components/layout-ui/Tables/ServerPaginationDataGrid";
import SearchBar from "../../components/layout-ui/SearchBar";
import DropdownFilter from "../../components/layout-ui/Buttons/DropdownFilter";
import Button from "../../components/layout-ui/Buttons";
import InvoiceModal from "../../components/layout-ui/Modals/InvoiceModal";
import { invoicesUrl } from "../../utils/urls";
import { useInvoices } from "../../hooks/useInvoices";

const statusOptions = [
  { label: "Paid", value: "PAID" },
  { label: "Pending", value: "PENDING" },
];

export default function Invoices() {
  const userId = useSelector((s) => s.auth.user.id);
  const [showModal, setShowModal] = useState(false);

  // Single object for all filters
  const [filters, setFilters] = useState({
    transactionId: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  // Build a memoized "params" object for the hook
  const params = useMemo(() => ({ ...filters, userId }), [filters, userId]);
  const { summary, loading: summaryLoading } = useInvoices(params);

  // Build a memoized "query" for the data grid (raw YYYY-MM-DD)
  const query = useMemo(
    () => ({
      userId,
      ...(filters.transactionId && { transactionId: filters.transactionId }),
      ...(filters.status && { status: filters.status }),
      ...(filters.startDate && { startDate: filters.startDate }),
      ...(filters.endDate && { endDate: filters.endDate }),
    }),
    [filters, userId]
  );

  // Single handler for filter changes
  const onFilterChange = (key) => (value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-4 space-y-4">
      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between px-2 mb-4">
        <div className="flex-1 flex flex-col md:flex-row gap-3">
          {/* <SearchBar
            className="w-full"
            placeholder="Search by Transaction ID"
            value={filters.transactionId}
            onChange={onFilterChange("transactionId")}
          /> */}
          <div className="flex flex-row gap-2">
            <DropdownFilter
              label="Status"
              options={statusOptions}
              value={filters.status}
              onChange={onFilterChange("status")}
              buttonProps={{ size: "lg" }}
            />
            <Button onClick={() => setShowModal(true)}>Generate Invoice</Button>
          </div>
        </div>

        {/* Date Filters */}
        <div className="flex gap-3">
          {["startDate", "endDate"].map((field) => (
            <div key={field} className="flex flex-col">
              <label className="text-sm font-medium mb-1">
                {field === "startDate" ? "Start Date" : "End Date"}
              </label>
              <input
                type="date"
                value={filters[field]}
                onChange={(e) => onFilterChange(field)(e.target.value)}
                className="px-1 py-1 pr-6 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary w-full
      text-gray-dark placeholder-gray-light border-gray-dark dark:bg-gray-dark dark:text-white dark:placeholder-gray-light dark:border-gray"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 shadow rounded-xl p-6 border border-gray-300">
        {summaryLoading ? (
          <div className="col-span-full text-center">Loading summary…</div>
        ) : (
          [
            { label: "Total Amount", value: summary?.totalAmount, prefix: "₹" },
            {
              label: "Pending Amount",
              value: summary?.pendingAmount,
              prefix: "₹",
            },
            { label: "Pending Count", value: summary?.pendingCount },
            { label: "Completed Count", value: summary?.completedCount },
            {
              label: "Completed Amount",
              value: summary?.completedAmount,
              prefix: "₹",
            },
            { label: "Total Reports", value: summary?.reportsCount },
          ].map(({ label, value, prefix }, i) => (
            <div key={i} className={i > 0 ? "md:border-l md:pl-4" : ""}>
              <p className="text-1xl lg:text-2xl font-bold">
                {value != null
                  ? `${prefix || ""}${value.toLocaleString()}`
                  : "-"}
              </p>
              <p className="text-xs lg:text-sm">{label}</p>
            </div>
          ))
        )}
      </div>

      {/* Invoice Modal */}
      <InvoiceModal
        show={showModal}
        onClose={() => setShowModal(false)}
        userId={userId}
      />

      {/* Data Grid */}
      <ServerPaginationDataGrid
        name="invoices"
        url={invoicesUrl}
        query={query}
        height="calc(100vh - 19rem)"
        columns={[
          {
            field: "serialNumber",
            headerName: "Serial No.",
            valueGetter: (params) => {
              // Fallback if params.api or pagination data is unavailable
              if (!params.api) return "-";

              // Get pagination details
              const pageSize = params.api.paginationGetPageSize
                ? params.api.paginationGetPageSize()
                : 10; // Default to 10 if not available
              const currentPage = params.api.paginationGetCurrentPage
                ? params.api.paginationGetCurrentPage()
                : 0; // Default to 0 if not available
              const rowIndex = params.node?.rowIndex ?? 0; // Fallback to 0 if rowIndex is undefined

              // Calculate serial number: (currentPage * pageSize) + rowIndex + 1
              return currentPage * pageSize + rowIndex + 1;
            },
            width: 100,
            sortable: false,
            filter: false,
          },
          {
            field: "createdAt",
            headerName: "Date",
            valueGetter: (p) =>
              new Date(p.data.createdAt).toLocaleDateString("en-GB"),
            filter: "agDateColumnFilter",
          },
          {
            field: "invoiceReportType",
            headerName: "Invoice Type",
            valueGetter: (p) => p.data.invoiceReportType || "-",
            filter: "agTextColumnFilter",
          },
          {
            field: "xRayType",
            headerName: "Mode/Type",
            valueGetter: (p) => p.data.xRayType || "-",
            filter: "agTextColumnFilter",
          },
          {
            field: "amount",
            headerName: "Amount",
            valueGetter: (p) => `₹ ${p.data.amount}`,
            filter: "agNumberColumnFilter",
          },
          {
            field: "status",
            headerName: "Status",
            valueGetter: (p) => p.data.status,
            filter: "agTextColumnFilter",
          },
        ]}
      />
    </div>
  );
}
