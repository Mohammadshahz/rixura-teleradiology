import { EyeIcon } from "@heroicons/react/24/outline";
import Button from "../../components/layout-ui/Button";
import ServerPaginationDataGrid from "../../components/Layout/Tables/ServerPaginationDataGrid";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { contactUrl } from "../../utils/urls";

const ContactReport = ({ searchQuery, filterQuery }) => {
  const navigate = useNavigate();

  const query = useMemo(
    () => ({ search: searchQuery, ...filterQuery }),
    [searchQuery, filterQuery]
  );

  const handleViewClick = (data) => {
    // console.log("View button clicked", data);
    navigate(`/contact/${data.id}`);
  };

  const columns = [
    {
      field: "fullname",
      headerName: "Name",
      resizable: false,
      filter: "agTextColumnFilter",
    },
    {
      field: "email",
      headerName: "Email",
      filter: "agTextColumnFilter",
    },
    {
      field: "phone_number",
      headerName: "Phone Number",
      filter: "agTextColumnFilter",
    },
    {
      field: "contactType",
      headerName: "Contact Type",
      resizable: false,
      filter: "agTextColumnFilter",
    },
    {
      field: "requestType",
      headerName: "Request Type",
      filter: "agTextColumnFilter",
    },
    {
      field: "isRead",
      headerName: "Status",
      filter: "agTextColumnFilter",
      valueGetter: (params) => (params.data.isRead ? "Read" : "Unread"),
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
        url={contactUrl}
        query={query}
      />
    </div>
  );
};

export default ContactReport;
