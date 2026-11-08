import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DocumentChartBarIcon,
  ClockIcon,
  DocumentCurrencyRupeeIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/outline";

import SidebarHeader from "./SidebarHeader";
import SidebarFooter from "./SidebarFooter";
import { useThemeContext } from "../../../context/ThemeContext";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const theme = useThemeContext();

  const [isMobile, setIsMobile] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false); // ✅ still needed

  const mainNavLinks = [
    {
      name: "Reports",
      icon: <DocumentChartBarIcon className="w-5 h-5" />,
      path: "/",
      onClick: () => {
        navigate("/");
        if (isMobile) setIsSidebarOpen(false);
      },
    },
    {
      name: "History",
      icon: <ClockIcon className="w-5 h-5" />,
      path: "/history",
      onClick: () => {
        navigate("/history");
        if (isMobile) setIsSidebarOpen(false);
      },
    },
    {
      name: "Invoices",
      icon: <DocumentCurrencyRupeeIcon className="w-5 h-5" />,
      path: "/invoices",
      onClick: () => {
        navigate("/invoices");
        if (isMobile) setIsSidebarOpen(false);
      },
    },
    {
      name: "Create Templates",
      icon: <SquaresPlusIcon className="w-5 h-5" />,
      path: "/templates",
      onClick: () => {
        navigate("templates");
        if (isMobile) setIsSidebarOpen(false);
      },
    },
    // {
    //   name: "Patients",
    //   icon: <UserPlusIcon className="w-5 h-5" />,
    //   path: "/patients",
    //   onClick: () => {
    //     navigate("/patients");
    //     if (isMobile) setIsSidebarOpen(false);
    //   },
    // },
  ];

  // const handleProfileItemClick = (item) => {
  //   navigate(item.path);
  //   setMenuOpen(false);
  //   if (isMobile) setIsSidebarOpen(false);
  // };

  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth < 768;
      setIsMobile(isNowMobile);
      if (!isNowMobile) {
        // setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsSidebarOpen]);

  return (
    <div
      className={`flex flex-col fixed top-0 left-0 h-full z-40 bg-gray-light2 dark:bg-primary-dark border-r border-gray-light dark:border-gray-dark transition-all duration-300 ease-in-out ${
        isMobile
          ? isSidebarOpen
            ? "translate-x-0 w-full"
            : "-translate-x-full w-full"
          : isSidebarOpen
          ? "w-60 relative"
          : "w-16 relative"
      }`}
    >
      <SidebarHeader
        isMobile={isMobile}
        isSidebarOpen={isSidebarOpen}
        onCloseMobileSidebar={() => setIsSidebarOpen(false)}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        mainNavLinks={mainNavLinks}
        pathname={pathname}
      />

      <div className="flex-grow"></div>

      <SidebarFooter
        isSidebarOpen={isSidebarOpen}
        theme={theme}
        // menuOpen={menuOpen}
        // setMenuOpen={setMenuOpen}
        // profileLinks={profileLinks}
        // onProfileItemClick={handleProfileItemClick}
        showFeedbackModal={showFeedbackModal}
        setShowFeedbackModal={setShowFeedbackModal}
      />
    </div>
  );
};

export default Sidebar;
