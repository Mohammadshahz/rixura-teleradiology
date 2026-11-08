import React, { useEffect, useRef } from "react";
import {
  QuestionMarkCircleIcon,
  MoonIcon,
  SunIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import FeedbackModal from "../Modals/FeedbackModal";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

const SidebarFooter = ({
  isSidebarOpen,
  theme,
  menuOpen,
  setMenuOpen,
  profileLinks,
  onProfileItemClick,
  showFeedbackModal,
  setShowFeedbackModal,
}) => {
  const dropdownRef = useRef();
  const ctx = useSelector((state) => state.auth);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setMenuOpen]);

  return (
    <>
      <div className="px-4 py-2">
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="cursor-pointer flex items-center space-x-2 px-1 py-1 rounded-md w-full text-left
                         hover:bg-primary hover:text-white"
            >
              <span>
                <QuestionMarkCircleIcon className="w-5 h-5 dark:text-white" />
              </span>
              {isSidebarOpen && (
                <span className="dark:text-white">Feedback / Raise Issue</span>
              )}
            </button>
          </li>

          <li>
            <button
              onClick={theme.toggleTheme}
              className="cursor-pointer flex items-center space-x-2 px-1 py-1.5 rounded-md w-full text-left
                         hover:bg-primary hover:text-white dark:hover:bg-primary"
            >
              <span>
                {theme.theme === "dark" ? (
                  <MoonIcon className="w-5 h-5" />
                ) : (
                  <SunIcon className="w-5 h-5" />
                )}
              </span>
              {isSidebarOpen && (
                <span className="text-gray-DEFAULT dark:text-white">
                  Change Theme
                </span>
              )}
            </button>
          </li>
        </ul>
      </div>

      {/* Profile */}
      <div
        ref={dropdownRef}
        className="px-4 py-3 border-t border-gray-dark dark:border-gray-light relative"
      >
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="flex items-center space-x-3">
            {/* <img
              className="h-8 w-8 rounded-full"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="User profile"
            /> */}

            {isSidebarOpen && (
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-DEFAULT dark:text-white">
                  {ctx.user?.name || "Erica Smith"}
                </span>

                {/* <span className="text-xs text-gray-light dark:text-gray-light2">
                  {ctx.user?.email || "erica@email.com"}
                </span> */}
              </div>
            )}
          </div>
          {menuOpen ? (
            <ChevronDownIcon className="w-4 h-4 text-gray-DEFAULT cursor-pointer" />
          ) : (
            <ChevronUpIcon className="w-4 h-4 text-gray-DEFAULT cursor-pointer" />
          )}
        </div>

        {menuOpen && (
          <div className="absolute left-14 bottom-full bg-white border-0 dark:bg-black border rounded-md shadow-lg w-54 z-10">
            <ul className="py-2 text-base text-gray-DEFAULT dark:text-gray-light">
              {profileLinks.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => onProfileItemClick(item)}
                    className="flex items-center space-x-2 px-9 py-2 hover:bg-primary hover:text-white cursor-pointer w-full text-left"
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        show={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onSubmit={(feedbackText) => {}}
      />
    </>
  );
};

export default SidebarFooter;
