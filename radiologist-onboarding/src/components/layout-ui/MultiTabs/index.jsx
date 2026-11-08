import { useState } from "react";

const MultiTabs = ({ tabs = [], actions = null }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full max-w-full">
      {/* Tabs Navigation */}
      <div
        className={`flex justify-between items-center flex-col-reverse gap-2 md:flex-row space-x-2 md:items-center px-2 
          ${window.innerWidth < 768 ? "overflow-x-auto" : ""}`}
      >
        {/* Tab Containers */}
        <div className="flex flex-nowrap space-x-2 overflow-x-auto py-1.5">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 h-fit transition-all
                ${
                  activeTab === index
                    ? "bg-gray-light text-black font-medium"
                    : "bg-transparent text-bla hover:bg-gray-light2 hover:text-black"
                }
                sm:text-sm md:text-base cursor-pointer`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* Wrapper for optional actions */}
        {actions && (
          <div className="sticky item right-0 flex flex-row justify-end gap-2 mt-2 sm:mt-0">
            {actions}
          </div>
        )}
      </div>

      <hr className="border-t border-gray my-2" />

      {/* Content Area */}
      <div className="max-w-full overflow-x-auto">
        {tabs[activeTab]?.component}
      </div>
    </div>
  );
};

export default MultiTabs;
