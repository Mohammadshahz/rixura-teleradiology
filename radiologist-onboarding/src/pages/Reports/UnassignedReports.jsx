import React from "react";
import PaginationDataGrid from "../../components/Layout/Tables/PaginationDataGrid";
import { useFetchJson } from "../../components/Layout/Tables/useFetchJson";
import Chip from "../../components/layout-ui/Chip";
import Button from "../../components/layout-ui/Button";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";

const UnassignedReports = () => {
  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/space-mission-data.json"
  );

  console.log({ data });

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

    //     return <Chip value={"Unassigned"} />;
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
        <div className="flex items-center py-1">
          <Button
            onClick={(e) => {
              e.stopPropagation(); // Prevent row/cell selection
              handlePencilClick(params.data);
            }}
            size="sm"
            startIcon={<ClipboardDocumentCheckIcon className="w-5 h-5" />}
          >
            View and Accept
          </Button>
          {/* <Button
            onClick={(e) => {
              e.stopPropagation(); // Prevent row/cell selection
              handlePencilClick(params.data);
            }}
            size="sm"
            startIcon={<CheckCircleIcon className="w-5 h-5" />}
          >
            Accept
          </Button> */}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PaginationDataGrid
        name="unassigned-reports"
        rows={data}
        loading={loading}
        columns={columns}
        height="calc(100vh - 8.3rem)"
      />
    </div>
  );
};

export default UnassignedReports;
