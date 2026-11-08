import React from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";

const TopBar = ({ onOpenSidebar, children }) => {
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-dark shadow md:hidden">
      <button onClick={onOpenSidebar}>
        <Bars3Icon className="h-6 w-6 text-gray-700 dark:text-white" />
      </button>
        {children}
    </header>
  );
};

export default TopBar;
