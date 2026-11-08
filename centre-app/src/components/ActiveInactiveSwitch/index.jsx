import React from "react";

const ActiveInactiveSwitch = ({
  isActive,
  onToggle,
  activeText = "Active",
  inactiveText = "Inactive",
  activeColor = "bg-green-500",
  inactiveColor = "bg-gray-400",
  textColor = "text-white"
}) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer w-24 h-7">
      <input
        type="checkbox"
        checked={isActive}
        onChange={onToggle}
        className="sr-only peer"
      />
      <div
        className={`w-full h-full rounded-full transition-colors duration-300 flex items-center justify-center text-sm ${textColor}
          ${isActive ? activeColor : inactiveColor}
        `}
      >
        {isActive ? activeText : inactiveText}
      </div>
      <div
        className={`absolute left-1 top-0.4 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300
          ${isActive ? "translate-x-[4.25rem]" : ""}
        `}
      ></div>
    </label>
  );
};

export default ActiveInactiveSwitch;
