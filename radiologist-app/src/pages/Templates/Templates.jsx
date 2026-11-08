import { useState } from "react";
import Button from "../../components/layout-ui/Button";
import SearchBar from "../../components/layout-ui/SearchBar";
import { useNavigate } from "react-router-dom";
import TemplatesReport from "./TemplatesReport";

export default function Templates() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  return (
    <>
      <div className="py-2">
        <div className="flex flex-row justify-end gap-2">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search templates by title"
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
        <TemplatesReport searchQuery={searchQuery} />
      </div>
    </>
  );
}
