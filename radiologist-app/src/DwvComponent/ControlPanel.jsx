import { CameraIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useReportStatusContext } from "../context/ReportStatusContext";
import Button from "../components/layout-ui/Button";
import { useEffect, useCallback } from "react";
import Chip from "../components/layout-ui/Chip/Chip";
import { toast } from "react-toastify";
import { ReportService } from "../services/Reports.service";
import useReportStatus, { STATUS } from "../hooks/useReportStatus";
import useReportBeacon from "../hooks/useReportBeacon";

const ControlPanel = ({
  reportId,
  currentStatus,
  onChangeTool,
  toolsButtons,
  dataLoaded,
  handleDownloadImage,
  fromIdleReports,
}) => {
  const navigate = useNavigate();
  const { reportGenerated } = useReportStatusContext();
  const { changeStatus, loading } = useReportStatus();
  const { triggerBeacon } = useReportBeacon(reportId, fromIdleReports);

  useEffect(() => {
    const msg = sessionStorage.getItem("toastMessage");
    if (msg && msg !== "Report sent successfully") {
      toast.success(msg);
      sessionStorage.removeItem("toastMessage");
    }
  }, []);

  const handleSendReport = async () => {
    try {
      await changeStatus(reportId, STATUS.REPORTED);
      toast.success("Report marked as REPORTED");
      sessionStorage.setItem("toastMessage", "Report sent successfully");
      navigate("/");
    } catch (err) {
      toast.error("Failed to send report. Please try again.");
    }
  };

  const resetReportStatus = useCallback(async () => {
    if (!fromIdleReports) return true;
    if (currentStatus === STATUS.ACCEPTED) {
      try {
        const success = await triggerBeacon();
        if (success) {
          await changeStatus(reportId, STATUS.IDLE);
          return true;
        }
        await Promise.all([
          changeStatus(reportId, STATUS.IDLE),
          ReportService.editReport(reportId, { radiologist: null }),
        ]);
        return true;
      } catch (err) {
        console.error("Error resetting report status:", err);
        toast.error("Failed to reset report. Please try again.");
        return false;
      }
    }
    return true;
  }, [fromIdleReports, currentStatus, reportId, triggerBeacon, changeStatus]);

  const handleBackClick = async () => {
    const success = await resetReportStatus();
    if (success) {
      if (fromIdleReports) {
        sessionStorage.setItem("refreshIdleReports", "true");
      }
      navigate("/", {
        state: { refresh: fromIdleReports, timestamp: new Date().getTime() },
      });
    }
  };

  useEffect(() => {
  const navEntries = performance.getEntriesByType("navigation");
  const isReload = navEntries.length && navEntries[0].type === "reload";

  // If it's a reload and fromIdleReports is true, redirect to home
  if (isReload && fromIdleReports) {
    window.location.replace('/');
  }
  // eslint-disable-next-line
}, [fromIdleReports]);

  return (
    <div className="relative z-[99999] bg-gray-light2 dark:!bg-[#000] py-1 px-4 flex flex-row justify-between items-start w-full border-b-2 border-gray dark:border-gray-dark">
      <div className="flex flex-col gap-1 w-full max-w-[70%]">
        <div className="flex items-center gap-3">
          <div
            className="p-1 rounded-lg hover:bg-primary-light dark:hover:bg-gray-dark cursor-pointer"
            onClick={handleBackClick}
          >
            <ChevronLeftIcon className="w-4 h-4 text-black dark:text-white" />
          </div>
          <h1 className="text-black dark:text-white text-sm">
            Rixura <sup className="text-[10px]">v1.01</sup>
          </h1>
        </div>
        <div className="flex flex-row gap-4 items-start overflow-x-auto overflow-y-hidden justify-start md:justify-end">
          <div className="flex flex-row gap-4 items-center">
            <div className="flex gap-4">{toolsButtons}</div>
            {dataLoaded && (
              <div className="flex flex-row gap-2 items-center">
                <div
                  className="flex flex-col justify-center cursor-pointer items-center gap-1"
                  onClick={handleDownloadImage}
                >
                  <div className="p-1 rounded-lg hover:bg-primary-light dark:hover:bg-gray-dark">
                    <CameraIcon className="w-6 h-6" />
                  </div>
                  <p className="text-xs">Capture</p>
                </div>
                <button
                  key="Undo"
                  disabled={!dataLoaded}
                  onClick={() => {
                    const event = new KeyboardEvent("keydown", {
                      key: "z",
                      code: "KeyZ",
                      ctrlKey: true,
                      bubbles: true,
                      cancelable: true,
                    });
                    const dwvDiv = document.getElementById("layerGroup0");
                    if (dwvDiv) {
                      dwvDiv.dispatchEvent(event);
                    } else {
                      window.dispatchEvent(event);
                    }
                  }}
                  className="cursor-pointer relative flex flex-col justify-center items-center gap-1"
                  title="Undo (Ctrl+Z)"
                  aria-label="Undo"
                  style={{ marginLeft: 8, marginRight: 8 }}
                >
                  <div className="p-1 rounded-lg hover:bg-primary-light dark:hover:bg-gray-dark">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 7v6h6" />
                      <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
                    </svg>
                  </div>
                  <p className="text-xs">Undo</p>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end justify-start gap-1 mt-1 flex-shrink-0 scale-[75%] md:scale-100">
        <div className="flex flex-row items-center gap-4">
          <div className="flex items-center gap-2">
            <p className="text-sm hidden md:inline text-gray-500 dark:text-gray-400">Status:</p>
            <Chip value={currentStatus} />
          </div>
          <p className="text-xs hidden md:inline text-gray-500 dark:text-gray-400 whitespace-nowrap">
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
        </div>
        {(currentStatus === STATUS.ACCEPTED || currentStatus === STATUS.REVERTED) && (
          <div className="mt-1">
            <Button
              color="green"
              disabled={!reportGenerated || loading}
              className={`${!reportGenerated || loading ? "cursor-not-allowed" : ""} px-6 text-sm`}
              onClick={handleSendReport}
            >
              {loading ? "Sending..." : "Send Report"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;