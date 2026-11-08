import React from "react";
import {
  QuestionMarkCircleIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import FeedbackModal from "../Modal";

const SidebarFooter = ({
  isSidebarOpen,
  theme,
  profileLinks,
  onProfileItemClick,
  showFeedbackModal,
  setShowFeedbackModal,
}) => {
  return (
    <>
      <div className="px-4 py-2 mb-4">
        <ul className="space-y-1">
          {/* <li>
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="cursor-pointer flex items-center space-x-3 px-2 py-1.5 rounded-md w-full text-left hover:bg-primary hover:text-white dark:hover:bg-primary"
            >
              <span>
                <QuestionMarkCircleIcon className="w-5 h-5" />
              </span>
              {isSidebarOpen && <span>Feedback</span>}
            </button>
          </li> */}

          <li>
            <button
              onClick={theme.toggleTheme}
              className="cursor-pointer flex items-center space-x-3 px-2 py-1.5 rounded-md w-full text-left hover:bg-primary hover:text-white dark:hover:bg-primary"
            >
              <span>
                {theme.theme === "dark" ? (
                  <MoonIcon className="w-5 h-5" />
                ) : (
                  <SunIcon className="w-5 h-5" />
                )}
              </span>
              {isSidebarOpen && <span>Change Theme</span>}
            </button>
          </li>
        </ul>
      </div>

      {/* ✅ Feedback Modal */}
      <FeedbackModal
        show={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onSubmit={(feedbackText) => {
          // Optionally send to API or show a toast here
        }}
      />
    </>
  );
};

export default SidebarFooter;
