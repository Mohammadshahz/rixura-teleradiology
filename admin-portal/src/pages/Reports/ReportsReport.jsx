import { EyeIcon } from "@heroicons/react/24/outline";
import Button from "../../components/layout-ui/Button";
import ServerPaginationDataGrid from "../../components/Layout/Tables/ServerPaginationDataGrid";
import { useMemo } from "react";
import { reportsUrl } from "../../utils/urls";
import { useNavigate } from "react-router-dom";

const ReportsReport = ({ searchQuery, status, centerId }) => {
  const query = useMemo(
    () => ({
      title: searchQuery,
      status,
      ...(centerId && { centerId: centerId }),
    }),
    [searchQuery, status, centerId]
  );
  const navigate = useNavigate();

  const handleViewClick = (data) => {
    navigate(`/diacom-viewer/${data.id}`);
  };

  const columns = [
    {
      headerName: "Center Details",
      minWidth: 300,
      field: "center.name",
      filter: "agTextColumnFilter",
      cellRenderer: (params) => {
        const center = params.data.center;
        if (!center) return "—";

        return (
          <div className="flex flex-col gap-0">
            <p className="text-gray-light text-sm font-medium dark:text-gray-dark">
              #{params.data.center.code}
            </p>
            <p className="text-slate-800 text-lg font-medium dark:text-slate-200">
              {center.name}
            </p>
          </div>
        );
      },
    },
    {
      headerName: "Radiologist Details",
      minWidth: 300,
      field: "radiologist.name",
      filter: "agTextColumnFilter",
      cellRenderer: (params) => {
        const radiologist = params.data.radiologist;
        if (!radiologist) return "—";

        return (
          <div className="flex flex-col gap-0">
            <p className="text-gray-light text-sm font-medium dark:text-gray-dark">
              #{params.data.radiologist.id}
            </p>
            <p className="text-slate-800 text-lg font-medium dark:text-slate-200">
              {radiologist.name}
            </p>
          </div>
        );
      },
    },
    {
      field: "title",
      headerName: "Report Details",
      resizable: true,
      filter: "agTextColumnFilter",
      cellRenderer: (params) => {
        return (
          <div className="flex flex-col">
            <p className="text-gray-light text-xs font-medium dark:text-gray-dark">
              #{params.data.id}
            </p>
            <p className="text-slate-800 text-md font-medium dark:text-gray-light2">
              {params.data.title}
            </p>
          </div>
        );
      },
    },
    {
      field: "xRayType",
      headerName: "Mode/Type",
      filter: "agTextColumnFilter",
    },
    {
      field: "complaint",
      headerName: "Complaint",
      filter: "agTextColumnFilter",
    },
    {
      field: "reportType",
      headerName: "Report Type",
      resizable: false,
      filter: "agTextColumnFilter",
    },
    {
      field: "status",
      headerName: "Status",
      resizable: false,
      filter: "agTextColumnFilter",
    },
    {
      field: "reportedAt",
      headerName: "Reported At",
      valueGetter: (params) =>
        new Date(params.data.reportedAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      filter: "agTextColumnFilter",
    },
    {
      field: "action",
      headerName: "Action",
      minWidth: 230,
      resizable: false,
      cellRenderer: (params) => (
        <div className="flex gap-4 py-1">
          <Button
            onClick={(e) => {
              e.stopPropagation(); // Prevent row/cell selection
              handleViewClick(params.data);
            }}
            size="sm"
            startIcon={<EyeIcon className="w-5 h-5" />}
          >
            View
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div>
      <ServerPaginationDataGrid
        columns={columns}
        height="calc(100vh - 13.5rem)"
        url={reportsUrl}
        query={query}
        rowHeight={60}
      />
    </div>
  );
};

export default ReportsReport;
