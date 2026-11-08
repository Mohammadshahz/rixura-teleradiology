import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/layout-ui/SearchBar";
import DropdownFilter from "../../components/layout-ui/Button/DropdownFilter";
import Button from "../../components/layout-ui/Button";
import { invoicesUrl, invoiceSummaryUrl, userUrl } from "../../utils/urls";
import { useSelector } from "react-redux";
import axiosInstance from "../../utils/axios-instance";
import ServerPaginationDataGrid from "../../components/Layout/Tables/ServerPaginationDataGrid";
import InvoiceModal from "../../components/layout-ui/Modal/InvoiceModal";
import FormAutocomplete from "../../components/layout-ui/InputFields/FormAutocomplete";
import { Form, Formik } from "formik";
import { RadiologistService } from "../../services/Radiologist.service";
import { useInvoices } from "../../hooks/useInvoices";
import { toast } from "react-toastify";
import IconButton from "../../components/layout-ui/Button/IconButton";
import { EyeIcon } from "@heroicons/react/24/outline";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
import useUpdateInvoice from "../../hooks/useUpdateInvoice";

const statusOptions = [
  { label: "Paid", value: "PAID" },
  { label: "Pending", value: "PENDING" },
];

export default function Invoices() {
  const [showModal, setShowModal] = useState(false);

  const [userType, setUserType] = useState("");
  const [userOptions, setUserOptions] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [updatedInvoiceIds, setUpdatedInvoiceIds] = useState(new Set());
  const {
    updateInvoiceStatus,
    loading: updateLoading,
    error: updateError,
  } = useUpdateInvoice();

  const userTypeOptions = [
    { label: "Radiologist", value: "RADIOLOGIST" },
    { label: "Center", value: "CENTER" },
  ];

  // Single object for all filters
  const [filters, setFilters] = useState({
    transactionId: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  // Build a memoized "params" object for the hook
  const params = useMemo(
    () => ({ ...filters, selectedUserId }),
    [filters, selectedUserId]
  );
  const { summary, loading: summaryLoading } = useInvoices(params);

  // Build a memoized "query" for the data grid (raw YYYY-MM-DD)
  const query = useMemo(
    () => ({
      ...(selectedUserId && { userId: selectedUserId }),
      ...(filters.transactionId && { transactionId: filters.transactionId }),
      ...(filters.status && { status: filters.status }),
      ...(filters.startDate && { startDate: filters.startDate }),
      ...(filters.endDate && { endDate: filters.endDate }),
    }),
    [filters, selectedUserId]
  );

  // Single handler for filter changes
  const onFilterChange = (key) => (value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleStatusUpdate = async (invoiceId) => {
    try {
      await updateInvoiceStatus(invoiceId, "PAID");
      // Add invoice ID to the set of updated invoices
      setUpdatedInvoiceIds((prev) => new Set([...prev, invoiceId]));
      toast.success("Invoice status updated successfully");
    } catch (error) {
      toast.error("Failed to update invoice status");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const params = {
          ...(userType && { role: userType }),
        };
        const res = await RadiologistService.getAll(params);
        const options = res?.map((user) => ({
          id: user.id,
          label: `${user.name} (${user.id})`,
        }));
        setUserOptions(options);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    fetchUsers();
  }, [userType]);

  return (
    <div className="pt-2 space-y-4">
      <div className="w-full flex flex-col xl:flex-row gap-4 ">
        <div className="w-full">
          <Formik
            initialValues={{ user: "" }}
            onSubmit={(value) => {
              setSelectedUserId(value.user);
            }}
          >
            {({ setFieldValue }) => (
              <Form>
                <div className="flex gap-2">
                  <FormAutocomplete
                    name="user"
                    placeholder="Search by user name and id"
                    suggestions={userOptions}
                  />
                  <Button type="submit">Search</Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setFieldValue("user", "");
                      setSelectedUserId("");
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <DropdownFilter
          label="User Type"
          options={userTypeOptions}
          value={userType}
          onChange={setUserType}
          buttonProps={{ size: "md" }}
          className="w-[250px]"
        />
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between px-2 mb-2">
        <div className="flex-1 flex items-center gap-2">
          {/* <SearchBar
            className="w-full"
            placeholder="Search by Transaction ID"
            value={filters.transactionId}
            onChange={onFilterChange("transactionId")}
          /> */}
          <DropdownFilter
            label="Status"
            options={statusOptions}
            value={filters.status}
            onChange={onFilterChange("status")}
            buttonProps={{ size: "md" }}
          />
          <div className="flex justify-end">
            <Button
              disabled={!selectedUserId}
              onClick={() => {
                if (!selectedUserId) {
                  toast.error("Please select a user");
                  return;
                }
                setShowModal(true);
              }}
              className={!selectedUserId ? "opacity-50 cursor-not-allowed" : ""}
            >
              Generate Invoice
            </Button>
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
        userId={selectedUserId}
      />

      {/* Data Grid */}
      <ServerPaginationDataGrid
        name="invoices"
        url={invoicesUrl}
        query={query}
        height="calc(100vh - 23.1rem)"
        columns={[
          {
            field: "serialNumber",
            headerName: "Serial No.",
            valueGetter: (params) => {
              if (!params.api) return "-";
              const pageSize = params.api.paginationGetPageSize
                ? params.api.paginationGetPageSize()
                : 10;
              const currentPage = params.api.paginationGetCurrentPage
                ? params.api.paginationGetCurrentPage()
                : 0;
              const rowIndex = params.node?.rowIndex ?? 0;
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
            field: "invoice_report_type",
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
            valueGetter: (params) =>
              updatedInvoiceIds.has(params.data.id)
                ? "PAID"
                : params.data.status,
            filter: "agTextColumnFilter",
          },
          {
            field: "actions",
            headerName: "Actions",
            filter: "agTextColumnFilter",
            cellRenderer: (params) => (
              <div className="flex items-center py-2">
                {params.data.status === "PENDING" &&
                  !updatedInvoiceIds.has(params.data.id) && (
                    // <IconButton
                    //   icon={ClipboardDocumentCheckIcon}
                    //   size="lg"
                    //   color="primaryLight"
                    //   onClick={() => handleStatusUpdate(params.data.id, "PAID")}
                    //   disabled={updateLoading}
                    // />
                    <Button
                      onClick={() => handleStatusUpdate(params.data.id, "PAID")}
                      disabled={updateLoading}
                      size="sm"
                      startIcon={
                        <ClipboardDocumentCheckIcon className="w-5 h-5" />
                      }
                    >
                      Mark as Paid
                    </Button>
                  )}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
