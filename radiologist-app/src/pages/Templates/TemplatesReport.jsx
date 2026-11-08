import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ServerPaginationDataGrid from "../../components/Layout/Tables/ServerPaginationDataGrid";
import { templateBaseUrl, templatesUrl } from "../../utils/urls";
import Button from "../../components/layout-ui/Button";
import { PencilIcon } from "@heroicons/react/24/solid";
import { useSelector } from "react-redux";

const TemplatesReport = ({ searchQuery }) => {
  const navigate = useNavigate();

  const userId = useSelector((state) => state.auth.user?.id);

  const query = useMemo(
    () => ({ title: searchQuery, radiologistId: userId }),
    [searchQuery, userId]
  );

  const handleEditClick = (data) => {
    navigate(`/templates/edit/${data.id}`);
  };

  const columns = [
    {
      field: "title",
      headerName: "Template Title",
      filter: "agTextColumnFilter",
      resizable: false,
    },
    {
      field: "type",
      headerName: "Type",
      filter: "agTextColumnFilter",
      resizable: false,
    },
    {
      field: "createdAt",
      headerName: "Date",
      filter: "agTextColumnFilter",
      valueGetter: (params) =>
        new Date(params.data.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      resizable: false,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      filter: "agDateColumnFilter",
      resizable: false,
      valueGetter: (params) =>
        new Date(params.data.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
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
              e.stopPropagation();
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
      <ServerPaginationDataGrid
        columns={columns}
        height="calc(100vh - 10.5rem)"
        url={templateBaseUrl}
        query={query}
      />
    </div>
  );
};

export default TemplatesReport;
