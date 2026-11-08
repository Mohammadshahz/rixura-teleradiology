import Button from "../../components/layout-ui/Button";
import { useNavigate } from "react-router-dom";
import { PencilIcon } from "@heroicons/react/24/outline";
import ServerPaginationDataGrid from "../../components/Layout/Tables/ServerPaginationDataGrid";

const PatientReports = () => {
  const navigate = useNavigate();
  const handleViewClick = (data) => {
    navigate("/diacom-viewer/999");
  };

  const handleEditClick = (data) => {
    navigate("/patients/edit/999");
  };

  const columns = [
    {
      field: "",
      headerName: "Patient Details",
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
      headerName: "History Attached",
      resizable: false,
      filter: "agTextColumnFilter",
    },
    {
      field: "",
      headerName: "Report Status",
      resizable: false,
      filter: "agTextColumnFilter",
    },
    {
      field: "",
      headerName: "Download",
      resizable: false,
      filter: "agTextColumnFilter",
    },
    {
      field: "action",
      headerName: "Action",
      minWidth: 230,
      resizable: false,
      cellRenderer: (params) => (
        <div className="flex gap-4 py-1">
          {/* <Button
            onClick={(e) => {
              e.stopPropagation(); // Prevent row/cell selection
              handleViewClick(params.data);
            }}
            size="sm"
            startIcon={<EyeIcon className="w-5 h-5" />}
          >
            View
          </Button> */}
          <Button
            onClick={(e) => {
              e.stopPropagation(); // Prevent row/cell selection
              handleEditClick(params.data);
            }}
            size="sm"
            startIcon={<PencilIcon className="w-5 h-5" />}
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div>
      <ServerPaginationDataGrid columns={columns} height="calc(100vh - 8rem)" />
    </div>
  );
};

export default PatientReports;
