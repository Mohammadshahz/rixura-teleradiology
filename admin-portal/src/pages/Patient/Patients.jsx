import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/layout-ui/SearchBar";
import PatientReports from "./PatientReports";
import Button from "../../components/layout-ui/Button";

const Patients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Ensure state is being updated
  };

  return (
    <>
      <div className="py-2">
        <div className="flex flex-row justify-end gap-2">
          <SearchBar />
          <Button
            onClick={() => {
              navigate("/patients/add");
            }}
            className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Add Patient
          </Button>
        </div>
      </div>
      <div>
        <PatientReports />
      </div>
    </>
  );
};

export default Patients;
