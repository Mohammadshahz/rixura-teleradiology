// hooks/useReportStatus.js
import { useState } from "react";
import { ReportService } from "../services/Reports.service";
import { useSelector } from "react-redux";

export const STATUS = {
  IDLE: "IDLE",
  ACCEPTED: "ACCEPTED",
  REPORTED: "REPORTED",
  COMPLETED: "COMPLETED",
  REVERTED: "REVERTED",
};

const useReportStatus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const userId = useSelector((state) => state.auth.user.id);

  const changeStatus = async (reportId, newStatus) => {
    setLoading(true);
    setError(null);
    try {
      if (!Object.values(STATUS).includes(newStatus)) {
        throw new Error(`Invalid status: ${newStatus}`);
      }

      // Updated call with separate reportId, userId, and statusData
      const result = await ReportService.updateReportStatus(
        reportId,
        userId,
        { status: newStatus }
      );

      return result;
    } catch (err) {
      console.error("Status update failed:", err);
      setError(err);
      throw err; // rethrow for caller to handle
    } finally {
      setLoading(false);
    }
  };

  return {
    changeStatus,
    loading,
    error,
  };
};

export default useReportStatus;
