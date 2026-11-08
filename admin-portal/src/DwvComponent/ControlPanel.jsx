import { CameraIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/layout-ui/Button";
import useReportStatus, { STATUS } from "../hooks/useReportStatus";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Chip from "../components/layout-ui/Chip";

const ControlPanel = ({
  reportId,
  currentStatus,
  onChangeTool,
  toolsButtons,
  dataLoaded,
  handleDownloadImage,
}) => {
  const navigate = useNavigate();
  const { changeStatus, loading } = useReportStatus();

  // Show toast message after page reload
  useEffect(() => {
    const msg = sessionStorage.getItem("toastMessage");
    if (msg) {
      toast.success(msg);
      sessionStorage.removeItem("toastMessage");
    }
  }, []);

  const handleChangeStatus = async (newStatus) => {
    try {
      await changeStatus(reportId, newStatus);
      sessionStorage.setItem("toastMessage", `Report marked as ${newStatus}`);
      window.location.reload();
    } catch (err) {
      console.error("Failed to change status:", err);
      toast.error("Failed to update status. Please try again.");
    }
  };

  return (
    <div className="relative z-[99999] bg-gray-light2 dark:!bg-[#000] py-2 md:px-2 pr-0 flex flex-row justify-between items-start w-full border-b-2 border-gray dark:border-gray-dark">
      {/* Left Section */}
      <div className="flex flex-row items-start gap-4 w-full">
        {/* Back Button */}
        <div
          className="p-1 rounded-lg hover:bg-primary-light dark:hover:bg-gray-dark cursor-pointer mt-1"
          onClick={() => navigate(-1)}
        >
          <ChevronLeftIcon className="w-4 h-4 text-black dark:text-white" />
        </div>

        {/* Title & Tool Buttons */}
        <div className="flex flex-col gap-0.5">
          <h1 className="text-black dark:text-white text-mb mb-2 pt-1">
            Rixura <sup>v1.01</sup>
          </h1>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 scale-95 px-2 md:scale-100">
          Report ID:
          <span className="text-black dark:text-white">{reportId}</span>
        </p>

        {/* Tool Buttons - Commented */}
        {/* 
          <div className="flex flex-row gap-4 items-start">
            <div className="flex flex-row gap-4 items-center">
              <div
                onChange={(_, newTool) => {
                  if (newTool) onChangeTool(newTool);
                }}
                className="flex gap-4"
              >
                {toolsButtons}
              </div>

              {dataLoaded && (
                <div
                  className="flex flex-col justify-center cursor-pointer items-center gap-1"
                  onClick={handleDownloadImage}
                >
                  <div className="p-1 rounded-lg hover:bg-primary-light dark:hover:bg-gray-dark">
                    <CameraIcon className="w-6 h-6" />
                  </div>
                  <p className="text-xs">Capture</p>
                </div>
              )}
            </div>
          </div>
          */}
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-2 scale-90 md:scale-100">
        {/* Right Section - Status Display */}
          <div className="flex flex-col md:flex-row items-end gap-2 md:mt-2">
            <p className="text-sm text-gray-500 dark:text-gray-400 hidden md:block">
              Status:
            </p>
            {/* Status Chip */}
            <Chip value={currentStatus} />
          </div>

        {/* Right Section - Action Buttons */}
        {/* {currentStatus === STATUS.REPORTED && (
          <div className="flex flex-row gap-2 mt-1 self-center">
            <Button
              className="px-6 text-sm"
              color="green"
              disabled={loading}
              onClick={() => handleChangeStatus(STATUS.COMPLETED)}
            >
              Complete
            </Button>

            {currentStatus !== STATUS.REVERTED && (
              <Button
                className="px-6 text-sm"
                color="red"
                disabled={loading}
                onClick={() => handleChangeStatus(STATUS.REVERTED)}
              >
                Revert
              </Button>
            )}
          </div>
        )} */}

        <div className="flex-col items-end mt-2 hidden md:block">
          <p className="text-xs text-gray-500 dark:text-gray-400">
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
      </div>
    </div>
  );
};

export default ControlPanel;
