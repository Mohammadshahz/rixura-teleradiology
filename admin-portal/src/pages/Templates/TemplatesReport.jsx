import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ServerPaginationDataGrid from "../../components/Layout/Tables/ServerPaginationDataGrid";
import { templatesUrl } from "../../utils/urls";
import Button from "../../components/layout-ui/Button";
import { PencilIcon } from "@heroicons/react/24/outline";

const TemplatesReport = ({ searchQuery, typeQuery }) => {
  const navigate = useNavigate();

  const query = useMemo(
    () => ({ title: searchQuery, type: typeQuery || null }),
    [searchQuery, typeQuery]
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
        url={templatesUrl}
        query={query}
      />
    </div>
  );
};

export default TemplatesReport;
