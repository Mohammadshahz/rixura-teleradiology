import { useState } from "react";

const MultiTabs = ({ tabs = [], actions = null }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full max-w-full">
      {/* Tabs Navigation */}
      <div
        className={`flex md:items-center flex-col gap-2 md:flex-row space-x-2 not-[]:md:items-center px-2 
          ${window.innerWidth < 768 ? "md:overflow-x-auto" : ""}`}
      >
        {/* Tab Containers */}
        <div className="flex flex-nowrap space-x-2 overflow-x-auto">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`whitespace-nowrap rounded-lg px-3 py-2 h-fit transition-all
                ${
                  activeTab === index
                    ? "bg-gray-light dark:bg-gray-light2 text-black font-medium"
                    : "bg-transparent hover:bg-gray-light2 dark:hover:bg-gray-light hover:text-black"
                }
                sm:text-sm md:text-base cursor-pointer`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* Wrapper for optional actions */}
        {actions && <div className="!ml-0">{actions}</div>}
      </div>

      <hr className="border-t border-gray my-2" />

      {/* Content Area */}
      <div className="py-1 max-w-full overflow-x-auto">
        {tabs[activeTab]?.component}
      </div>
    </div>
  );
};

export default MultiTabs;
