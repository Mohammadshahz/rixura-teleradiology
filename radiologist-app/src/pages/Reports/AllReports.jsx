import React from "react";
import ServerPaginationDataGrid from "../../components/Layout/Tables/ServerPaginationDataGrid";
import { useFetchJson } from "../../components/Layout/Tables/useFetchJson";
import Chip from "../../components/layout-ui/Chip";
import { CheckCircleIcon, EyeIcon } from "@heroicons/react/16/solid";
import Button from "../../components/layout-ui/Button";

const AllReports = () => {
  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/space-mission-data.json"
  );

  const columns = [
    {
      field: "complaint",
      headerName: "Complaint",
      resizable: false,
      filter: "agTextColumnFilter",
    },
    {
      field: "report_type",
      headerName: "Report Type",
      resizable: false,
      filter: "agTextColumnFilter",
    },
    {
      field: "radiologist",
      headerName: "Centre Name",
      filter: "agTextColumnFilter",
      flex: 1,
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
        <div className="flex gap-4 py-2">
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
            Accept
          </Button> */}
        </div>
      ),
    },
  ];

  return (
    <div>
      <ServerPaginationDataGrid
        name="unassigned-reports"
        rows={data}
        loading={loading}
        columns={columns}
        height="calc(100vh - 12.5rem)"
      />
    </div>
  );
};

export default AllReports;
