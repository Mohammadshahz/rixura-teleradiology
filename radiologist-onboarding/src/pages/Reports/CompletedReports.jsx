import React from "react";
import ServerPaginationDataGrid from "../../components/Layout/Tables/ServerPaginationDataGrid";
import Chip from "../../components/layout-ui/Chip";
import Button from "../../components/layout-ui/Button";
import { CheckCircleIcon, EyeIcon } from "@heroicons/react/16/solid";

const CompletedReports = () => {
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

    //     return <Chip value={"Completed"} />;
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
            Accept
          </Button> */}
        </div>
      ),
    },
  ];
  return (
    <div>
      <ServerPaginationDataGrid
        columns={columns}
        height="calc(100vh - 8.3rem)"
      />
    </div>
  );
};

export default CompletedReports;
