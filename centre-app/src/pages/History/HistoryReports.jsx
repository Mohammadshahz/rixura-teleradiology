import React, { useState, useRef, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, LockClosedIcon, XMarkIcon } from "@heroicons/react/24/outline";
import SearchBar from "../../components/layout-ui/SearchBar";
import DropdownFilter from "../../components/layout-ui/Buttons/DropdownFilter";
import Button from "../../components/layout-ui/Buttons";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import ServerPaginationDataGrid from "../../components/layout-ui/Tables/ServerPaginationDataGrid";
import useReportForm from "../../hooks/useReportForm";
import { reportUrl } from "../../utils/urls";
import StatusChip from "../../components/layout-ui/Chip/Chip";
import IconButton from "../../components/layout-ui/Buttons/IconButton";
import { useSelector } from "react-redux";
const HistoryReports = () => {
  const navigate = useNavigate();
  const gridRef = useRef();
  const { xrayTypes = [], reportTypes = [] } = useReportForm(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedXrayType, setSelectedXrayType] = useState("");
  const [selectedReportType, setSelectedReportType] = useState("");
  const [startDate, setStartDate] = useState("");
const centerId = useSelector(state => state.auth.centerId) 


  const columns = useMemo(
    () => [
      {
        headerName: "Patient Details",
        minWidth: 300,
        filter: "agTextColumnFilter",
        cellRenderer: (params) => {
          const { patient, reportType } = params.data;
          if (!patient) return "—";
          return (
            <div className="flex flex-col gap-0">
              <p className="text-gray-light text-sm font-medium dark:text-gray-dark">
                #{patient.centerPatientNumber}
              </p>
              <p className="text-slate-800 text-lg font-medium dark:text-slate-200">
                {patient.name}
              </p>
              <p className="flex items-center gap-2 text-slate-800 text-base dark:text-slate-200">
                <span>
                  {patient.age}, {patient.gender || "Others"}
                </span>
                {reportType === "CRITICAL" && <StatusChip value={reportType} />}
              </p>
            </div>
          );
        },
      },
      {
        field: "complaint",
        headerName: "Complaint",
        minWidth: 200,
        cellRenderer: (p) => (
          <p
            className="text-lg truncate max-w-[180px] pt-4"
            title={p.data.complaint}
          >
            {p.data.complaint}
          </p>
        ),
      },
      {
        field: "xRayType",
        headerName: "Mode/Type",
        cellRenderer: (p) => <p className="text-lg pt-4">{p.data.xRayType}</p>,
      },
      {
        field: "radiologist",
        headerName: "Radiologist",
        cellRenderer: (p) => (
          <p className="text-lg pt-4">
            {p.data.radiologist?.name ?? (
              <span className="italic text-gray-dark">Unassigned</span>
            )}
          </p>
        ),
      },
      {
        field: "createdAt",
        headerName: "Date/Time",
        cellRenderer: (p) => (
          <p className="text-base pt-4">
            {new Date(p.data.createdAt).toLocaleString()}
          </p>
        ),
      },
      // {
      //   field: "center.code",
      //   headerName: "Centre Code",
      //   cellRenderer: (p) => (
      //     <p className="text-lg">{p.data.center?.code ?? "—"}</p>
      //   ),
      // },
      {
        field: "action",
        headerName: "Action",
        minWidth: 180,
        cellRenderer: (p) => (
          <div className="flex items-center space-x-2 pt-4">
            <Button
              size="sm"
              startIcon={<EyeIcon className="w-5 h-5" />}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/diacom-viewer/${p.data.id}`);
              }}
            >
              View
            </Button>
          </div>
        ),
      },
    ],
    [navigate]
  );

  // Build query without filtering by status
  const query = useMemo(() => {
   let isoStartDate = "";
  let isoEndDate = "";

  if (startDate) {
    const dateObj = new Date(startDate);
    if (!isNaN(dateObj)) {
      isoStartDate = dateObj.toISOString();
    }
  }

  // Calculate yesterday's date at 23:59:59
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(23, 59, 59, 999);
  isoEndDate = yesterday.toISOString();

  return {
    ...(searchQuery ? { radiologistName: searchQuery } : {}),
    ...(selectedXrayType ? { xRayType: selectedXrayType } : {}),
    ...(selectedReportType ? { reportType: selectedReportType } : {}),
    ...(isoStartDate ? { startDate: isoStartDate } : {}),
    ...(isoEndDate ? { endDate: isoEndDate } : {}),
    ...(centerId ? { centerId: centerId } : {}),
    status: "COMPLETED",
  };
  }, [searchQuery, selectedXrayType, selectedReportType, startDate,centerId]);

  return (
    <div className="pb-2">
      <div className="flex flex-wrap justify-start gap-2 mb-2">
        <SearchBar
          className="md:min-w-[20rem] flex-1 md:flex-auto"
          placeholder="Search by Radiologist Name"
          value={searchQuery}
          onChange={setSearchQuery}
          debounceDelay={300}
        />
        <div className="relative">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-1 py-1 pr-6 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary w-full
      text-gray-dark placeholder-gray-light border-gray-dark dark:bg-gray-dark dark:text-white dark:placeholder-gray-light dark:border-gray"
            placeholder="Select Date"
          />

          {startDate && (
            <div className="absolute top-1.5 right-0.5 font-bold">
              <IconButton
                icon={XMarkIcon}
                size="lg"
                className="text-red-500 hover:text-red-700"
                onClick={() => setStartDate("")}
              >
              </IconButton>
            </div>
          )}
        </div>

        <DropdownFilter
          label="Category"
          options={xrayTypes}
          value={selectedXrayType}
          onChange={setSelectedXrayType}
          allLabel="All"
          buttonProps={{ variant: "contained", size: "md" }}
        />

        <DropdownFilter
          label="Report Type"
          options={reportTypes}
          value={selectedReportType}
          onChange={setSelectedReportType}
          allLabel="All"
          buttonProps={{ variant: "contained", size: "md" }}
        />

        <Button
          startIcon={<ArrowPathIcon width="1rem" height="1rem" />}
          onClick={() => gridRef.current?.refetch()}
        >
          Refetch
        </Button>
      </div>

      <ServerPaginationDataGrid
        ref={gridRef}
        name="history-reports"
        rowHeight={80}
        columns={columns}
        height="calc(100vh - 7.6rem)"
        url={reportUrl}
        query={query}
      />
    </div>
  );
};

export default HistoryReports;
