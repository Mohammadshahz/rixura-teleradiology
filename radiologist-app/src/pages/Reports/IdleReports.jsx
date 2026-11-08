import React, { useMemo, useEffect } from "react";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../../components/layout-ui/Button";
import ServerPaginationDataGrid from "../../components/Layout/Tables/ServerPaginationDataGrid";
import { reportUrl } from "../../utils/urls";
import StatusChip from "../../components/layout-ui/Chip/Chip";
import { useSelector } from "react-redux";
import useReportStatus, { STATUS } from "../../hooks/useReportStatus";

const IdleReports = ({ search, gridRef, xrayType, reportType, activeOnly }) => {
  const centerId = useSelector((state) => state.auth.centerId);
  const { changeStatus, loading } = useReportStatus();
  const navigate = useNavigate();
  const location = useLocation();

  const baseColumns = [
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
      headerName: "Complaint",
      field: "complaint",
      minWidth: 200,
      cellRenderer: (params) => {
        const text = params.data.complaint;
        return (
          <p className="text-lg truncate max-w-[180px] pt-4" title={text}>
            {text}
          </p>
        );
      },
    },
    {
      headerName: "Mode/Type",
      field: "xRayType",
      cellRenderer: (params) => (
        <p className="text-lg pt-4">{params.data.xRayType}</p>
      ),
    },
    {
      headerName: "Date/Time",
      field: "createdAt",
      cellRenderer: (params) => {
        const date = new Date(params.data.createdAt);
        return <p className="text-base pt-4">{date.toLocaleString()}</p>;
      },
    },
    {
      headerName: "Centre Code",
      field: "center.code",
      cellRenderer: (params) => (
        <p className="text-lg pt-4">{params.data.center?.code ?? "—"}</p>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      resizable: false,
      cellRenderer: null,
    },
  ];

  const finalColumns = useMemo(() => {
    return baseColumns.map((col) =>
      col.field === "action"
        ? {
            ...col,
            cellRenderer: (params) => (
              <div className="flex items-center space-x-2 pt-4">
                <Button
                  disabled={loading || !activeOnly}
                  onClick={async () => {
                    await changeStatus(params.data.id, STATUS.ACCEPTED);
                    navigate(`/diacom-viewer/${params.data.id}`, {
                      state: { fromIdleReports: true, timestamp: Date.now() },
                    });
                  }}
                  startIcon={<ClipboardDocumentCheckIcon className="w-5 h-5" />}
                  size="sm"
                >
                  View and Accept
                </Button>
              </div>
            ),
          }
        : col
    );
  }, [activeOnly, loading, changeStatus, navigate]);

  const query = useMemo(
    () => ({
      status: "IDLE",
      centerId,
      ...(search ? { centerCode: search } : {}),
      ...(xrayType ? { xRayType: xrayType } : {}),
      ...(reportType ? { reportType: reportType } : {}),
    }),
    [search, xrayType, reportType, centerId]
  );

  return (
    <div>
      <ServerPaginationDataGrid
        ref={gridRef}
        name="idle-reports"
        rowHeight={80}
        columns={finalColumns}
        height="calc(100vh - 11rem)"
        url={reportUrl}
        query={query}
        disabled={!activeOnly}
      />
    </div>
  );
};

export default IdleReports;