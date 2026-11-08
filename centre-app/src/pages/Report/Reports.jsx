import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MultiTabs from "../../components/layout-ui/MultiTabs";
import SearchBar from "../../components/layout-ui/SearchBar";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import Button from "../../components/layout-ui/Buttons";
import useReportForm from "../../hooks/useReportForm";
import DropdownFilter from "../../components/layout-ui/Buttons/DropdownFilter";
import RevertedReports from "./RevertedReports";
import IdleReports from "./IdleReports";
import AcceptedReports from "./AcceptedReports";
import ReportedReports from "./ReportedReports";
import CompletedReports from "./CompletedReports";
const DURATION = 20000; // 2mins
const Reports = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(true);
  const [refetchReflector, setRefetchReflector] = useState(Math.random());

  useEffect(() => {
    const interval = setInterval(() => {
      setRefetchReflector(Math.random());
    }, DURATION);
    return () => {
      clearInterval(interval);
    };
  }, []);

  // console.log({refetchReflector});

  const gridRef = React.useRef();
  // console.log({ gridRef });
  const handleToggle = () => {
    setIsActive((prev) => !prev);
  };

  const { xrayTypes = [], reportTypes = [] } = useReportForm(false);

  const [selectedXrayType, setSelectedXrayType] = useState("");
  const [selectedReportType, setSelectedReportType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = useMemo(
    () => [
      {
        label: "Idle",
        component: (
          <IdleReports
            gridRef={gridRef}
            xrayType={selectedXrayType}
            reportType={selectedReportType}
            search={searchQuery}
          />
        ),
      },
      {
        label: "Accepted",
        component: (
          <AcceptedReports
            gridRef={gridRef}
            xrayType={selectedXrayType}
            reportType={selectedReportType}
            search={searchQuery}
          />
        ),
      },
      {
        label: "Reported",
        component: (
          <ReportedReports
            gridRef={gridRef}
            xrayType={selectedXrayType}
            reportType={selectedReportType}
            search={searchQuery}
          />
        ),
      },
      {
        label: "Reverted",
        component: (
          <RevertedReports
            gridRef={gridRef}
            xrayType={selectedXrayType}
            reportType={selectedReportType}
            search={searchQuery}
          />
        ),
      },
      {
        label: "Completed",
        component: (
          <CompletedReports
            gridRef={gridRef}
            xrayType={selectedXrayType}
            reportType={selectedReportType}
            search={searchQuery}
          />
        ),
      },
    ],
    [gridRef, selectedXrayType, selectedReportType, searchQuery]
  );

  return (
    <div>
      <MultiTabs
        tabs={tabs}
        actions={
          <div className="flex flex-col gap-2 md:flex-row md:items-center space-x-2">
            <SearchBar
              className="md:min-w-[14rem] flex-1 md:flex-0"
              placeholder="Search Radiologist by Name"
              value={searchQuery}
              onChange={setSearchQuery}
              debounceDelay={300}
            />

            <div className="flex flex-wrap gap-2 items-center justify-between !ml-0">
              <div className="flex flex-wrap gap-2 items-center">
                <DropdownFilter
                  label="Category"
                  options={xrayTypes}
                  value={selectedXrayType}
                  onChange={setSelectedXrayType}
                  allLabel="All"
                  buttonProps={{ variant: "contained", size: "md" }}
                />

                <DropdownFilter
                  label="Report Type"
                  options={reportTypes}
                  value={selectedReportType}
                  onChange={setSelectedReportType}
                  allLabel="All"
                  buttonProps={{ variant: "contained", size: "md" }}
                />
                <Button
                  startIcon={<ArrowPathIcon width="1rem" height="1rem" />}
                  onClick={() =>
                    gridRef.current?.refetch({
                      xrayType: selectedXrayType,
                      reportType: selectedReportType,
                      search: searchQuery,
                    })
                  }
                >
                  <span className="hidden md:inline">Refetch</span>
                </Button>
              </div>
              <div>
                <Button onClick={() => navigate("/reports/add")}>
                  Add Report
                </Button>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default Reports;
