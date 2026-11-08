import { useNavigate } from "react-router-dom";
import Button from "../../components/layout-ui/Button";
import {
  KeyIcon,
  PencilIcon,
  ReceiptRefundIcon,
} from "@heroicons/react/24/outline";
import ServerPaginationDataGrid from "../../components/Layout/Tables/ServerPaginationDataGrid";
import { userUrl } from "../../utils/urls";
import { useMemo } from "react";

const RadiologistReport = ({ searchQuery }) => {
  const navigate = useNavigate();

  const query = useMemo(() => ({ name: searchQuery }), [searchQuery]);

  const handleEditClick = (data) => {
    navigate(`/radiologist/edit/${data.id}`);
  };

  const handleResetClick = (data) => {
    navigate("reset-password", {
      state: { id: data.id, type: "radiologist" },
    });
  };

  const handleInvoiceClick = (data) => {
    navigate(`invoice/${data.id}`);
  };

  const columns = [
    {
      field: "name",
      headerName: "Radiologist Name",
      filter: "agTextColumnFilter",
      resizable: false,
    },
    {
      field: "email",
      headerName: "Email",
      filter: "agTextColumnFilter",
      resizable: false,
    },
    {
      field: "mobileNumber",
      headerName: "Phone Number",
      filter: "agTextColumnFilter",
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
      // valueFormatter: (params) => new Date(params.value).toLocaleString(),
    },
    {
      field: "status",
      headerName: "Status",
      filter: "agTextColumnFilter",
      resizable: false,
    },
    {
      field: "action",
      headerName: "Action",
      minWidth: 400,
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
          <Button
            onClick={(e) => {
              e.stopPropagation(); // Prevent row/cell selection
              handleInvoiceClick(params.data);
            }}
            size="sm"
            startIcon={<ReceiptRefundIcon className="w-5 h-5" />}
          >
            Invoice
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation(); // Prevent row/cell selection
              handleResetClick(params.data);
            }}
            size="sm"
            startIcon={<KeyIcon className="w-5 h-5" />}
          >
            Reset Password
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
        url={userUrl}
        query={{
          role: "RADIOLOGIST",
          // fetchSignature: true,
          ...query,
        }}
      />
    </div>
  );
};

export default RadiologistReport;
