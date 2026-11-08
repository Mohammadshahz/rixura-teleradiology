import { useNavigate } from "react-router-dom";
import Button from "../../components/layout-ui/Button";
import SearchBar from "../../components/layout-ui/SearchBar";
import { useState } from "react";
import RadiologistReport from "./RadiologistReport";
// import CentreReport from "./CentreReport";

export default function Radiologist() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // const handleSearchChange = (e) => {
  //   setSearchQuery(e.target.value); // Ensure state is being updated
  // };
  return (
    <>
      <div className="py-2">
        <div className="flex flex-row justify-end gap-2">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search radiologist by name"
          />
          <Button
            onClick={() => {
              navigate("/radiologist/add");
            }}
            className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Add Radiologist
          </Button>
        </div>
      </div>
      <div>
        <RadiologistReport searchQuery={searchQuery} />
      </div>
    </>
  );
}
