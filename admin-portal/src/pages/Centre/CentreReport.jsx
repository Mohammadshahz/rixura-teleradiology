import { useNavigate } from "react-router-dom";
import Button from "../../components/layout-ui/Button";
import {
  KeyIcon,
  PencilIcon,
  ReceiptRefundIcon,
} from "@heroicons/react/24/outline";
import ServerPaginationDataGrid from "../../components/Layout/Tables/ServerPaginationDataGrid";
import { centerUrl } from "../../utils/urls";
import { useMemo } from "react";
import { toast } from "react-toastify";

const CentreReport = ({ searchQuery }) => {
  const navigate = useNavigate();

  const query = useMemo(() => ({ name: searchQuery }), [searchQuery]);

  const handleEditClick = (data) => {
    const id = data?.users[0]?.id;
    if (!id) {
      toast.error("Error center data is missing");
      return;
    }
    navigate(`/center/edit/${data.id}`, {
      state: { userId: data.users[0].id },
    });
  };

  const handleResetClick = (data) => {
    const id = data?.users[0]?.id;
    if (!id) {
      toast.error("Error center data is missing");
      return;
    }
    navigate("reset-password", {
      state: { id: data.id, type: "center" },
    });
  };

  const handleInvoiceClick = (data) => {
    const id = data?.users[0]?.id;
    if (!id) {
      toast.error("Error center data is missing");
      return;
    }
    navigate(`invoice/${data.users[0].id}`);
  };

  const columns = [
    {
      field: "name",
      headerName: "Center Name",
      filter: "agTextColumnFilter",
    },
    {
      field: "code",
      headerName: "Center Code",
      resizable: false,
      filter: "agTextColumnFilter",
    },
    {
      field: "Name",
      headerName: "Name",
      valueGetter: (params) => params.data?.users?.[0]?.name || "N/A",
      resizable: false,
      filter: "agTextColumnFilter",
    },
    {
      field: "users[0].email",
      headerName: "Email",
      valueGetter: (params) => params.data?.users?.[0]?.email || "N/A",
      resizable: false,
      filter: "agTextColumnFilter",
    },
    {
      field: "users[0].mobileNumber",
      headerName: "Mobile Number",
      valueGetter: (params) => params.data?.users?.[0]?.mobileNumber || "N/A",
      resizable: false,
      filter: "agTextColumnFilter",
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
              e.stopPropagation(); // Prevent row/cell selection
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
              // handleEditClick(params.data);
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
        url={centerUrl}
        query={query}
      />
    </div>
  );
};

export default CentreReport;
