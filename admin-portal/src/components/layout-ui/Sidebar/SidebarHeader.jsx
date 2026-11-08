import React from "react";
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const SidebarHeader = ({
  isMobile,
  isSidebarOpen,
  onCloseMobileSidebar,
  toggleSidebar,
  mainNavLinks,
  pathname,
  isSidebarOpenChange,
}) => {
  return (
    <>
      <div className="flex items-center justify-between p-4 relative">
        {isMobile ? (
          <button
            className="absolute top-4 right-4 z-50 p-2"
            onClick={onCloseMobileSidebar}
          >
            <XMarkIcon className="w-5 h-5 text-gray" />
          </button>
        ) : (
          <button
            className="absolute top-4 right-[-12px] bg-white border border-gray-300 rounded-full p-1 shadow"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? (
              <ChevronLeftIcon className="w-4 h-4 text-gray cursor-pointer" />
            ) : (
              <ChevronRightIcon className="w-4 h-4 text-gray cursor-pointer" />
            )}
          </button>
        )}
      </div>

      {/* Nav Items */}
       <nav className="mt-4">
        <ul className="space-y-1 px-3">
          {mainNavLinks.map((item) => (
            <li key={item.name}>
              <button
                onClick={item.onClick}
                className={`cursor-pointer flex items-center space-x-3 px-2 py-1.5 rounded-md w-full text-left ${
                  pathname === item.path
                    ? "bg-primary text-white dark:bg-primary"
                    : "hover:bg-primary hover:text-white dark:hover:bg-primary"
                }`}
              >
                <span>{item.icon}</span>
                {isSidebarOpen && <span>{item.name}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default SidebarHeader;
