import React, { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChatIcon from "@mui/icons-material/Chat";
import PersonIcon from "@mui/icons-material/Person";
import DescriptionIcon from "@mui/icons-material/Description";
import { STATUS } from "../hooks/useReportStatus"; // adjust path if different

import ChatBox from "../components/layout-ui/Chatbox";
import PatientDetailsSidebar from "../pages/dicom/PatientDetails";
import { ReportService } from "../services/Reports.service";
import ViewReport from "../pages/dicom/ViewReport";
/**
 * Sidebar component for toggling chat, user, and settings views
 *
 * @param {Object} props
 * @param {string|null} props.activeSidebar - Currently active sidebar name
 * @param {function} props.setActiveSidebar - Setter for active sidebar
 * @param {string|null} props.lastSidebar - Last opened sidebar (used to restore)
 * @param {function} props.toggleSidebar - Toggles between sidebars
 */
const DvwActionSidebar = ({
  activeSidebar,
  setActiveSidebar,
  lastSidebar,
  currentStatus,
  toggleSidebar,
  reportId,
  setPatient = () => {},
}) => {
  const [patientData, setPatientData] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    if (!reportId) return;

    const fetchReport = async () => {
      try {
        const report = await ReportService.getReport(reportId);

        const { centerPatientNumber, name, age, gender, phoneNumber, email } =
          report.patient;

        setPatient(report.patient);

        const mappedPatient = {
          centerPatientNumber,
          name,
          age,
          gender: gender || "N/A",
          contact: phoneNumber || "N/A",
          email: email || "N/A",
        };

        setPatientData(mappedPatient);
        setReportData(report);

        setUnreadCount(report.unreadCommentsCount || 0);
      } catch (err) {
        console.error("Error mapping patient:", err);
      }
    };

    fetchReport();
  }, [reportId]);

  useEffect(() => {
    if (activeSidebar === "chat") {
      setUnreadCount(0);
    }
  }, [activeSidebar]);
  return (
    <div className="absolute right-0 flex flex-row h-full bg-gray-light2 dark:bg-primary-dark">
      {/* Sidebar Toggle Button */}
      <div className="absolute top-1/2 -left-5 transform -translate-y-1/2 bg-primary rounded-full">
        <IconButton
          onClick={() =>
            activeSidebar
              ? setActiveSidebar(null)
              : setActiveSidebar(lastSidebar)
          }
          className="rounded-full bg-white shadow-md transition"
        >
          {activeSidebar ? (
            <ChevronRightIcon className="text-gray-800" />
          ) : (
            <ChevronLeftIcon className="text-gray-800" />
          )}
        </IconButton>
      </div>

      {/* Vertical Icon Buttons */}
      <div className="flex flex-col items-center justify-start gap-4 p-2">
        <IconButton
          onClick={() => toggleSidebar("chat")}
          className="relative bg-white dark:bg-gray-700 p-3 rounded-md shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition"
        >
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] h-[1.25rem] flex items-center justify-center">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
          <ChatIcon className="text-black dark:text-white" />
        </IconButton>

        <IconButton
          onClick={() => toggleSidebar("user")}
          className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition"
        >
          <PersonIcon className="text-black dark:text-white" />
        </IconButton>

          <IconButton
            onClick={() => toggleSidebar("settings")}
            className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition"
          >
            <DescriptionIcon className="text-black dark:text-white" />
          </IconButton>
      </div>

      {/* Sidebar Panel */}
      <div
        className={`flex flex-col transition-all duration-300 ease-in-out overflow-hidden bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-xl`}
        style={{
          transitionProperty: "width, padding",
          height: "100%",
          width: activeSidebar ? "73vw" : 0,
          maxWidth: activeSidebar ? "575px" : 0,
        }}
      >
        {activeSidebar === "chat" && <ChatBox />}
        {activeSidebar === "user" && (
          <PatientDetailsSidebar patient={patientData} />
        )}
        {activeSidebar === "settings" && <ViewReport reportData={reportData} />}
      </div>
    </div>
  );
};

export default DvwActionSidebar;