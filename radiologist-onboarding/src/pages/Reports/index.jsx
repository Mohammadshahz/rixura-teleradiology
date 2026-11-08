import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MultiTabs from "../../components/layout-ui/MultiTabs";
import Button from "../../components/layout-ui/Button";
import DateInput from "../../components/layout-ui/Calendar";
import UnassignedReports from "./UnassignedReports";
import HistoryReports from "./HistoryReports";
import AssignedReports from "./AssignedReports";
import CompletedReports from "./CompletedReports";
import AllReports from "./AllReports";
import SearchBar from "../../components/layout-ui/SearchBar";
import ActiveInactiveSwitch from "../../components/ActiveInactiveSwitch";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

const Reports = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(true);

  const handleToggle = () => {
    setIsActive((prev) => !prev);
  };

  const tabs = [
    { label: "Unassigned", component: <UnassignedReports /> },
    { label: "Accepted", component: <AssignedReports /> },
    { label: "Reported", component: <CompletedReports /> },
    // { label: "History", component: <HistoryReports /> },
    // { label: "All", component: <AllReports /> },
  ];
  return (
    <div>
      {/* <h1 className="text-2xl font-bold mb-4">Reports</h1> */}

      <div>
        <MultiTabs
          tabs={tabs}
          actions={
            <div className="flex flex-wrap items-center space-x-2">
              <SearchBar
                className="md:min-w-[25rem]"
                placeholder="Search Center or Patient by Name, ID, or Details..."
              />
              <Button
                startIcon={<ArrowPathIcon width={"1rem"} height={"1rem"} />}
                onClick={() => navigate("")}
              >
                Refetch
              </Button>
              <ActiveInactiveSwitch
                isActive={isActive}
                onToggle={handleToggle}
              />
              {/* <Button onClick={() => navigate("/reports/add")}>
                Add Reports
              </Button> */}
            </div>
          }
        />
      </div>
    </div>
  );
};

export default Reports;
