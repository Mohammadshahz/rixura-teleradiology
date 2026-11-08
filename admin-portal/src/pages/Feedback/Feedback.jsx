import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/layout-ui/SearchBar";
import Button from "../../components/layout-ui/Button";
import FeedbackReport from "./FeedbackReport";

export default function Feedback() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  return (
    <>
      <div className="py-2">
        <div className="flex flex-row justify-end gap-2">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search feedback by name"
          />
        </div>
      </div>
      <div>
        <FeedbackReport searchQuery={searchQuery} />
      </div>
    </>
  );
}
