import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/layout-ui/SearchBar";
import ContactReport from "./ContactReport";
import DropdownFilter from "../../components/layout-ui/Button/DropdownFilter";

export default function Contact() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    isRead: null,
    contactType: "",
    requestType: "",
  });

  const statusOptions = [
    { label: "Read", value: true },
    { label: "Unread", value: false },
  ];

  const contactTypeOptions = [
    { label: "CENTER", value: "CENTER" },
    { label: "RADIOLOGIST", value: "RADIOLOGIST" },
  ];

  const requestTypeOptions = [
    { label: "DEMO", value: "DEMO" },
    { label: "QUERY", value: "QUERY" },
  ];

  // Build a memoized "query" for the data grid (raw YYYY-MM-DD)
  const query = useMemo(
    () => ({
      ...(filters.isRead !== null && { isRead: filters.isRead }),
      ...(filters.contactType && { contactType: filters.contactType }),
      ...(filters.requestType && { requestType: filters.requestType }),
    }),
    [filters]
  );

  // Single handler for filter changes
  const onFilterChange = (key) => (value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <div className="py-2">
        <div className="flex flex-col xl:flex-row gap-2">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search contact by name"
          />
          <div className="flex flex-col md:flex-row gap-2">
            <DropdownFilter
              label="Status"
              options={statusOptions}
              value={filters.isRead}
              onChange={onFilterChange("isRead")}
              buttonProps={{ size: "md" }}
            />
            <DropdownFilter
              label="Contact"
              options={contactTypeOptions}
              value={filters.contactType}
              onChange={onFilterChange("contactType")}
              buttonProps={{ size: "md" }}
            />
            <DropdownFilter
              label="Request"
              options={requestTypeOptions}
              value={filters.requestType}
              onChange={onFilterChange("requestType")}
              buttonProps={{ size: "md" }}
            />
          </div>
        </div>
      </div>
      <div>
        <ContactReport searchQuery={searchQuery} filterQuery={query} />
      </div>
    </>
  );
}
