import React from "react";
import PaginationDataGrid from "../../components/Layout/Tables/PaginationDataGrid";
import { useFetchJson } from "../../components/Layout/Tables/useFetchJson";
import Chip from "../../components/layout-ui/Chip";
import { CheckCircleIcon, EyeIcon } from "@heroicons/react/16/solid";
import Button from "../../components/layout-ui/Button";

const AssignedReports = () => {
  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/space-mission-data.json"
  );

  const columns = [
    {
      field: "",
      headerName: "Patient ID",
      resizable: false,
      filter: "agTextColumnFilter",
    },
    {
      field: "",
      headerName: "Patient Name",
      filter: "agTextColumnFilter",
    },
    {
      field: "",
      headerName: "Age/Gender",
      resizable: false,
      filter: "agTextColumnFilter",
    },
    {
      field: "",
      headerName: "Mode/Type",
      resizable: false,
      filter: "agTextColumnFilter",
    },
    {
      field: "",
      headerName: "Study/Description",
      resizable: false,
      filter: "agTextColumnFilter",
    },
    {
      field: "",
      headerName: "Date/Time",
      resizable: false,
      filter: "agTextColumnFilter",
    },
    {
      field: "",
      headerName: "Centre Code",
      resizable: false,
      filter: "agTextColumnFilter",
    },
    // {
    //   field: "status",
    //   cellRenderer: (params) => {
    //     const status = params?.data?.status;
    //     console.log({ params });

    //     return <Chip value={"Assigned"} />;
    //   },
    //   headerName: "Status",
    //   resizable: false,
    // },
    {
      field: "action",
      headerName: "Action",
      pinned: "right",
      minWidth: 230,
      resizable: false,
      cellRenderer: (params) => (
        <div className="flex gap-4 py-1">
          <Button
            onClick={(e) => {
              e.stopPropagation(); // Prevent row/cell selection
              handlePencilClick(params.data);
            }}
            size="sm"
            startIcon={<EyeIcon className="w-5 h-5" />}
          >
            View
          </Button>
          {/* <Button
            onClick={(e) => {
              e.stopPropagation(); // Prevent row/cell selection
              handlePencilClick(params.data);
            }}
            size="sm"
            startIcon={<CheckCircleIcon className="w-5 h-5" />}
          >
            Complete
          </Button> */}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PaginationDataGrid
        name="assigned-reports"
        rows={data}
        loading={loading}
        columns={columns}
        height="calc(100vh - 8.3rem)"
      />
    </div>
  );
};

export default AssignedReports;
