import React, { useState } from "react";
import Sidebar from "../layout-ui/Sidebar";
import { Outlet } from "react-router-dom";
import TopBar from "../layout-ui/Sidebar/Topbar";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth < 768);

  return (
    <div className="flex h-screen">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="flex-1 overflow-auto">
        <TopBar onOpenSidebar={() => setIsSidebarOpen(true)} />
        <main className="p-2 md:mt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
