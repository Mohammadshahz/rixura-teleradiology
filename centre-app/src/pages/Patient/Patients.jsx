import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/layout-ui/SearchBar";
import Button from "../../components/layout-ui/Buttons";
import PatientReports from "./PatientReports";
import DropdownFilter from "../../components/layout-ui/Buttons/DropdownFilter";
import { useCreatePatient } from "../../hooks/usePatient";

const Patients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [searchBy, setSearchBy] = useState("name");
  const navigate = useNavigate();
  const { genderOptions } = useCreatePatient();

  // Map id→label for placeholder
  const placeholderMap = {
    name: "Name",
    centerPatientNumber: "Id",
  };

  return (
    <>
      <div className="pb-2">
        <div className="flex flex-col md:flex-row gap-2 px-2">
          <div className="flex flex-row gap-2">
            {/* 1) Include the third option here */}
            <DropdownFilter
              noDefault
              label="Search By"
              options={[
                { label: "Name", id: "name" },
                { label: "Patient Id", id: "centerPatientNumber" },
              ]}
              value={searchBy}
              onChange={setSearchBy}
              allLabel="Name"
              buttonProps={{ variant: "contained", size: "md" }}
            />

            {/* 2) Dynamic placeholder */}
            <SearchBar
              className="md:min-w-[400px]"
              placeholder={`Search by Patient ${placeholderMap[searchBy]}`}
              value={searchQuery}
              onChange={setSearchQuery}
              debounceDelay={300}
            />
          </div>

          <div className="flex flex-1 flex-row gap-2 justify-between">
            <DropdownFilter
              label="Gender"
              options={genderOptions}
              value={selectedGender}
              onChange={setSelectedGender}
              allLabel="All"
              buttonProps={{ variant: "contained", size: "md" }}
            />

            <Button
              onClick={() => navigate("/patients/add")}
              className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Add Patients
            </Button>
          </div>
        </div>
      </div>

      <PatientReports
        searchBy={searchBy}
        searchQuery={searchQuery}
        gender={selectedGender}
      />
    </>
  );
};

export default Patients;
