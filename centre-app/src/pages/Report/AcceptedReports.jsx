import React,{useMemo} from "react";
import { EyeIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import Button from "../../components/layout-ui/Buttons";
import ServerPaginationDataGrid from "../../components/layout-ui/Tables/ServerPaginationDataGrid";
import { reportUrl } from "../../utils/urls";
import StatusChip from "../../components/layout-ui/Chip/Chip";
import { useSelector } from "react-redux";

const AcceptedReports = ({ gridRef,xrayType,reportType,search}) => {
  const navigate = useNavigate();
  const centerId = useSelector((state => state.auth.centerId));

  const columns = [
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
      headerName: "Radiologist",
      field: "radiologist",
      cellRenderer: (params) => (
        <p className="text-lg pt-4">
          {params.data.radiologist?.name ?? (
            <span className="italic text-gray-dark">Unassigned</span>
          )}
        </p>
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
    // {
    //   headerName: "Centre Code",
    //   field: "center.code",
    //   cellRenderer: (params) => (
    //     <p className="text-lg">{params.data.center?.code ?? "—"}</p>
    //   ),
    // },
    // {
    //   field: "reportType",
    //   headerName: "Report Type",
    //   cellRenderer: (params) => (
    //     <p className="text-lg">{params.data.reportType}</p>
    //   ),
    // },
    {
      field: "action",
      headerName: "Action",
      minWidth: 230,
      resizable: false,
      cellRenderer: (params) => (
        <div className="flex items-center space-x-2 pt-4">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/diacom-viewer/${params.data.id}`);
            }}
            size="sm"
            startIcon={<EyeIcon className="w-5 h-5" />}
          >
            View
          </Button>
          {/* <Button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/reports/edit/${params.data.id}`);
            }}
            size="sm"
            startIcon={<PencilIcon className="w-5 h-5" />}
          >
            Edit
          </Button> */}
        </div>
      ),
    },
  ];
  const query = useMemo(
     () => ({
       status: "ACCEPTED",
       centerId,
       ...(search ? { radiologistName: search } : {}),
       ...(xrayType ? { xRayType: xrayType } : {}),
       ...(reportType ? { reportType: reportType } : {}),
     }),
     [search, xrayType, reportType]
   );

  return (
    <div>
      <ServerPaginationDataGrid
        ref={gridRef}
        name="accepted-reports"
        rowHeight={80}
        columns={columns}
        height="calc(100vh - 5.1rem)"
        url={reportUrl}
        query={query} // optional
      />
    </div>
  );
};

export default AcceptedReports;
