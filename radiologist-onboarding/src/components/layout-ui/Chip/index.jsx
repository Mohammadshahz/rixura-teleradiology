// components/StatusChip.js
import React from "react";

const statusStyles = {
  Unassigned: "bg-gray-200 text-gray-800",
  Assigned: "bg-yellow-200 text-yellow-800",
  Completed: "bg-green-200 text-green-800",
  Accepted: "bg-blue-200 text-blue-800",
  History: "bg-purple-200 text-purple-800",
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
