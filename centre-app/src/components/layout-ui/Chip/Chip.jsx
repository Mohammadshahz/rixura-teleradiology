// components/StatusChip.js
import React from "react";

const statusStyles = {
  IDLE: "bg-gray-200 text-gray-700", // Neutral / waiting
  ACCEPTED: "bg-yellow-300 text-yellow-800", // Pending or acknowledged
  REPORTED: "bg-orange-300 text-orange-800", // Something flagged, attention needed
  COMPLETED: "bg-green-300 text-green-800", // Success / done
  REVERTED: "bg-purple-300 text-purple-800", // Rolled back or restored
  CRITICAL: "bg-red-600 text-white", // Urgent / error / failure
  NORMAL: "bg-blue-100 text-blue-800", // Stable / okay
};

const Chip = ({ value }) => {
  const status = value || "Unassigned";

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        statusStyles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
};

export default Chip;
