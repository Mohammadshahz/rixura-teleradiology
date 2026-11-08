import { useEffect, useState } from "react";
import SearchBar from "../../components/layout-ui/SearchBar";
import ReportsReport from "./ReportsReport";
import { Formik, Form } from "formik";
import FormAutocomplete from "../../components/layout-ui/InputFields/FormAutocomplete";
import Button from "../../components/layout-ui/Button";
import DropdownFilter from "../../components/layout-ui/Button/DropdownFilter";
import { CenterService } from "../../services/Center.service";

export default function Reports() {
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState([]);
  const [centerOptions, setCenterOptions] = useState([]);
  const [selectedCenterId, setSelectedCenterId] = useState("");

  const reportStatusOptions = [
    { label: "Accepted", value: "ACCEPTED" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Reported", value: "REPORTED" },
    { label: "Reverted", value: "REVERTED" },
  ];

  useEffect(() => {
    const fetchCenter = async () => {
      try {
        const res = await CenterService.getAll();
        const options = res?.data?.map((center) => ({
          id: center.id,
          label: `${center.name} (${center.code})`,
        }));
        setCenterOptions(options);
      } catch (err) {
        console.error("Failed to fetch center", err);
      }
    };

    fetchCenter();
  }, []);

  // Handler for clearing the center selection
  const handleClear = (setFieldValue) => {
    setSelectedCenterId(""); // Reset selectedCenterId
    setFieldValue("center", ""); // Reset form field
  };

  return (
    <>
      <div className="w-full flex flex-col xl:flex-row gap-4 pt-2">
        <div className="w-full">
          <Formik
            initialValues={{ center: "" }}
            onSubmit={(value) => {
              setSelectedCenterId(value.center);
            }}
          >
            {({ setFieldValue }) => (
              <Form>
                <div className="flex gap-2">
                  <FormAutocomplete
                    name="center"
                    placeholder="Search by center name and code"
                    suggestions={centerOptions}
                  />
                  <Button type="submit">Search</Button>
                  <Button
                    type="button" // Prevent form submission
                    onClick={() => handleClear(setFieldValue)}
                  >
                    Clear
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <DropdownFilter
          label="Status"
          options={reportStatusOptions}
          value={status}
          onChange={setStatus}
          buttonProps={{ size: "md" }}
          className="w-[250px]"
        />
      </div>
      <div className="py-2">
        <div className="flex flex-row justify-end gap-2">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search reports by title"
          />
        </div>
      </div>
      <div>
        <ReportsReport
          searchQuery={searchQuery}
          status={status}
          centerId={selectedCenterId}
        />
      </div>
    </>
  );
}