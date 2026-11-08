import React, { useState, useEffect } from "react";
import Sidebar from "../layout-ui/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import TopBar from "../layout-ui/Sidebar/Topbar";
import {
  ArrowRightEndOnRectangleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import Header from "./Header";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth < 768);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Check if screen is mobile size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Close menu when clicking outside

  return (
    <div className="flex h-screen  dark:bg-black">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static w-64 bg-white dark:bg-gray-dark shadow-lg transition-transform duration-300 ease-in-out z-20`}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Top Bar */}
        <TopBar
          onOpenSidebar={() => setIsSidebarOpen(true)}
          className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-dark shadow-md flex items-center px-4 md:px-6 z-10 md:ml-64"
          aria-label="Toggle Sidebar"
        >
          {/* Rixura and Name */}
          <div className="flex-1 block md:hidden">
            <Header setIsSidebarOpen={setIsSidebarOpen} />
          </div>
        </TopBar>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-2">
          {/* Rixura and Name */}
          <div className="hidden md:block">
            <Header setIsSidebarOpen={setIsSidebarOpen} />

            {/* Separation Line */}
            <hr className="my-1 border-t border-gray dark:border-gray-light -mx-2 sm:-mx-2 md:-mx-2" />
          </div>

          {/* Child Routes Content */}
          <div>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
