import React from "react";

const ActiveInactiveSwitch = ({ isActive, onToggle }) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={isActive}
        onChange={onToggle}
        className="sr-only peer"
      />
      <div
        className={`w-11 h-6 rounded-full transition-colors duration-300
          ${isActive ? "bg-green-500" : "bg-gray-300"}
        `}
      ></div>
      <div
        className={`
          absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300
          ${isActive ? "translate-x-full" : ""}
        `}
      ></div>
      {/* Fixed-width text to prevent layout shift */}
      <span className="w-[60px] text-sm font-medium text-right ">
        {isActive ? "Active" : "Inactive"}
      </span>
    </label>
  );
};

export default ActiveInactiveSwitch;
