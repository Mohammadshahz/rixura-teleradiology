import React, { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const DvwSidebar = ({ activeFile, fileList, handleFileClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <div
      className={`
        h-full transition-all duration-300
        bg-white dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700
        flex flex-col
        ${isOpen ? "w-64" : "w-12"}
      `}
    >
      {/* Header */}
      <div
        className={`
          flex items-center justify-between p-3 
          border-b border-gray-200 dark:border-gray-600
          ${isOpen ? "" : "justify-center"}
        `}
      >
        {isOpen && (
          <span className="text-md font-bold text-gray-700 dark:text-white">
            Files
          </span>
        )}
        <button
          onClick={toggleSidebar}
          className="text-gray-500 dark:text-gray-300 text-lg"
          title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? (
            <ChevronLeftIcon className="h-5 w-5" />
          ) : (
            <ChevronRightIcon className="h-5 w-5" />
          )}{" "}
        </button>
      </div>

      {/* File List */}
      {isOpen && (
        <ul className="space-y-2 p-3">
          {fileList.map((file, idx) => (
            <li
              key={idx}
              onClick={() => handleFileClick(file)}
              className={`p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
                activeFile?.name === file.name
                  ? "bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-white"
                  : "text-black dark:text-white"
              }`}
            >
              <div className="text-sm truncate">{file.name}</div>
              <div className="text-xs text-gray-500">
                {file.type.toUpperCase()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DvwSidebar;
