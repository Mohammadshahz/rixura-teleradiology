import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MultiTabs from "../../components/layout-ui/MultiTabs";
import SearchBar from "../../components/layout-ui/SearchBar";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import Button from "../../components/layout-ui/Button";
import CompletedReports from "./CompletedReports";
import RevertedReports from "./RevertedReports";
import ReportedReports from "./ReportedReports";
import useReportForm from "../../hooks/useReportForm";
import DropdownFilter from "../../components/layout-ui/Button/DropdownFilter";
import ActiveInactiveSwitch from "../../components/ActiveInactiveSwitch";
import IdleReports from "./IdleReports";
import AcceptedReports from "./AcceptedReports";
import useUserStatus from "../../hooks/useUserStatus";

const DURATION = 20000; // 20 secs

const Reports = () => {
  const navigate = useNavigate();
  const [refetchReflector, setRefetchReflector] = useState(Math.random());
  const gridRef = useRef();
  const { xrayTypes = [], reportTypes = [] } = useReportForm(false);
  const [selectedXrayType, setSelectedXrayType] = useState("");
  const [selectedReportType, setSelectedReportType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { activeOnly, setActiveOnly, updateStatus } = useUserStatus(false);

  useEffect(() => {
    const interval = setInterval(
      () => setRefetchReflector(Math.random()),
      DURATION
    );
    return () => clearInterval(interval);
  }, []);

  // Make a fresh API call when this component mounts (which happens when returning to home page)
  useEffect(() => {
    // This effect runs when the component mounts (when navigating to the home page '/')
    // Using the same logic as the Refresh button
    const refreshData = () => {
      gridRef.current?.refetch({
        centerCode: searchQuery,
        xRayType: selectedXrayType,
        reportType: selectedReportType,
        activeOnly,
      });
    };

    // Always refresh on component mount
    refreshData();

    // Check if we have a flag in sessionStorage to refresh
    const shouldRefresh = sessionStorage.getItem("refreshIdleReports");
    if (shouldRefresh === "true") {
      // Clear the flag after we've used it
      sessionStorage.removeItem("refreshIdleReports");
    }
  }, [searchQuery, selectedXrayType, selectedReportType, activeOnly]); // Include dependencies so the correct filters are used

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
            activeOnly={activeOnly}
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
            activeOnly={activeOnly}
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
            activeOnly={activeOnly}
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
            activeOnly={activeOnly}
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
            activeOnly={activeOnly}
          />
        ),
      },
    ],
    [gridRef, selectedXrayType, selectedReportType, searchQuery, activeOnly]
  );

  return (
    <div>
      <MultiTabs
        tabs={tabs}
        actions={
          <div className="flex flex-col gap-2 md:flex-row md:items-center space-x-2">
            <SearchBar
              className="md:min-w-[16rem] flex-1"
              placeholder="Search By Centre Code"
              value={searchQuery}
              onChange={setSearchQuery}
              debounceDelay={300}
            />

            <div className="flex flex-wrap gap-2 items-center !ml-0">
              <DropdownFilter
                label="Category"
                options={xrayTypes}
                value={selectedXrayType}
                onChange={setSelectedXrayType}
                allLabel="All"
                buttonProps={{
                  variant: "contained",
                  size: "sm",
                }}
              />

              <DropdownFilter
                label="Report Type"
                options={reportTypes}
                value={selectedReportType}
                onChange={setSelectedReportType}
                allLabel="All"
                buttonProps={{
                  variant: "contained",
                  size: "sm",
                }}
              />
              <div className="flex gap-2 items-center">
                <Button
                  startIcon={<ArrowPathIcon width="1rem" height="1rem" />}
                  onClick={() =>
                    gridRef.current?.refetch({
                      centerCode: searchQuery,
                      xRayType: selectedXrayType,
                      reportType: selectedReportType,
                      activeOnly,
                    })
                  }
                  variant="contained"
                  size="sm"
                >
                  <span className="hidden md:inline">Refetch</span>
                </Button>

                <ActiveInactiveSwitch
                  isActive={activeOnly}
                  onToggle={() => {
                    const newStatus = activeOnly ? "INACTIVE" : "ACTIVE";
                    setActiveOnly(!activeOnly); // optional: immediate UI update
                    updateStatus(newStatus); // persist change
                  }}
                />
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default Reports;
