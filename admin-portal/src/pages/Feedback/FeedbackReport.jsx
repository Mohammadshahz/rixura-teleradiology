import { EyeIcon } from "@heroicons/react/24/outline";
import Button from "../../components/layout-ui/Button";
import ServerPaginationDataGrid from "../../components/Layout/Tables/ServerPaginationDataGrid";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { feedbackUrl } from "../../utils/urls";

const FeedbackReport = ({ searchQuery }) => {
  const navigate = useNavigate();

  const query = useMemo(() => ({ name: searchQuery }), [searchQuery]);

  const handleViewClick = (data) => {
    // console.log("View button clicked", data);
    navigate(`/feedback/${data.id}`);
  };

  const columns = [
    {
      field: "user.name",
      headerName: "Name",
      resizable: false,
      filter: "agTextColumnFilter",
    },
    {
      field: "user.email",
      headerName: "Email",
      filter: "agTextColumnFilter",
    },
    {
      field: "user.mobileNumber",
      headerName: "Mobile Number",
      filter: "agTextColumnFilter",
    },
    {
      field: "description",
      headerName: "Description",
      resizable: false,
      filter: "agTextColumnFilter",
    },
    {
      field: "createdAt",
      headerName: "Date",
      valueGetter: (params) =>
        new Date(params.data.createdAt).toLocaleDateString("en-IN", {
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
        height="calc(100vh - 10.5rem)"
        url={feedbackUrl}
        query={query}
      />
    </div>
  );
};

export default FeedbackReport;
