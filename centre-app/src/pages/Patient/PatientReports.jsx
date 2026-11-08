import { useMemo } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../../components/layout-ui/Buttons";
import ServerPaginationDataGrid from "../../components/layout-ui/Tables/ServerPaginationDataGrid";
import { PatientService } from "../../services/Patient.Service";
import { patientCenterUrl } from "../../utils/urls";
import { useSelector } from "react-redux";
const PatientReports = ({ searchQuery, gender, searchBy = "name" }) => {
  const navigate = useNavigate();
  const centerId = useSelector((state) => state.auth.centerId);

  const query = useMemo(() => {
    const q = {};
    if (searchQuery) {
      q[searchBy] = searchQuery;
    }
    if (gender) q.gender = gender.toLowerCase(); // 🔧 fix here
    return q;
  }, [searchQuery, gender, searchBy]);

  const url = patientCenterUrl(centerId); // e.g. /patients/center/{centerId}

  const handleViewClick = (data) => navigate(`/diacom-viewer/${data.id}`);
  const handleEditClick = (data) => navigate(`/patients/edit/${data.id}`);
  const handleDeleteClick = async (data) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        await PatientService.deletePatient(data.id);
        toast.success("Patient deleted successfully");
        // trigger reload or refetch
        window.location.reload();
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete patient");
      }
    }
  };

  const columns = [
    {
      headerName: "Patient Details",
      minWidth: 300,
      filter: "agTextColumnFilter",
      cellRenderer: (params) => {
        const { centerPatientNumber, name, age, gender } = params.data;
        return (
          <div className="flex flex-col gap-0">
            <p className="text-gray-light text-sm font-medium dark:text-gray-dark">
              #{centerPatientNumber.toString().padStart(4, "0")}
            </p>
            <p className="text-black text-lg font-medium dark:text-white">
              {name}
            </p>
            <div className="text-black text-base dark:text-white flex items-center gap-2">
              <span>
                {age}, {gender || "N/A"}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 275,
      filter: "agTextColumnFilter",
      cellRenderer: (params) => (
        <p className="text-black truncate pt-4 text-base dark:text-white">
          {params.value || "—"}
        </p>
      ),
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      minWidth: 150,
      filter: "agTextColumnFilter",
      cellRenderer: (params) => (
        <p className="text-black pt-4 text-lg dark:text-white">
          +91{params.value}
        </p>
      ),
    },
    // { field: 'modeType', headerName: 'Mode / Type', filter: 'agTextColumnFilter' },
    // { field: 'studyDescription', headerName: 'Study / Description', filter: 'agTextColumnFilter' },
    // {
    //   field: 'createdAt',
    //   headerName: 'Date / Time',
    //   filter: 'agDateColumnFilter',
    //   valueFormatter: (params) => (params.value ? new Date(params.value).toLocaleString() : ''),
    // },
    // {
    //   field: 'historyAttached',
    //   headerName: 'History Attached',
    //   filter: 'agTextColumnFilter',
    //   cellRenderer: (params) => (params.value ? 'Yes' : 'No'),
    // },
    // { field: 'reportStatus', headerName: 'Report Status', filter: 'agTextColumnFilter' },
    // {
    //   field: 'downloadLink',
    //   headerName: 'Download',
    //   filter: 'agTextColumnFilter',
    //   cellRenderer: (params) =>
    //     params.value ? (
    //       <a href={params.value} target="_blank" rel="noopener noreferrer">Download</a>
    //     ) : (
    //       ''
    //     ),
    // },
    {
      field: "action",
      headerName: "Action",
      minWidth: 270,
      resizable: false,
      cellRenderer: (params) => (
        <div className="flex gap-2 pt-4 items-start h-full">
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
          {/* <Button
            onClick={(e) => { e.stopPropagation(); handleViewClick(params.data); }}
            size="sm"
            startIcon={<EyeIcon className="w-5 h-5" />}
          >View</Button> */}
          {/* <Button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(params.data);
            }}
            size="sm"
            variant="outlined"
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            Delete
          </Button> */}
        </div>
      ),
    },
  ];

  // const baseUrl = `${process.env.REACT_APP_BASE_URL}/patients`;
  // const url = searchQuery ? `${baseUrl}?search=${encodeURIComponent(searchQuery)}` : baseUrl;

  return (
    <>
      <ServerPaginationDataGrid
        columns={columns}
        query={query}
        url={url}
        height="calc(100vh - 8rem)"
        rowHeight={80}
      />
    </>
  );
};

export default PatientReports;
