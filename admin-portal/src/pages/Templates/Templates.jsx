import { useState } from "react";
import Button from "../../components/layout-ui/Button";
import DropdownFilter from "../../components/layout-ui/Button/DropdownFilter";
import SearchBar from "../../components/layout-ui/SearchBar";
import { useNavigate } from "react-router-dom";
import TemplatesReport from "./TemplatesReport";

export default function Templates() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeQuery, setTypeQuery] = useState("");
  const navigate = useNavigate();

  const statusOptions = [
    { label: "Default", value: "DEFAULT" },
    { label: "Custom", value: "CUSTOM" },
  ];
  return (
    <>
      <div className="py-2">
        <div className="flex flex-row justify-end gap-2">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search templates by title"
          />
          <DropdownFilter
            label="Type"
            options={statusOptions}
            value={typeQuery}
            onChange={setTypeQuery}
            buttonProps={{ size: "md" }}
          />
          <Button
            onClick={() => {
              navigate("/templates/add");
            }}
            className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Add Templates
          </Button>
        </div>
      </div>
      <div>
        <TemplatesReport searchQuery={searchQuery} typeQuery={typeQuery} />
      </div>
    </>
  );
}
