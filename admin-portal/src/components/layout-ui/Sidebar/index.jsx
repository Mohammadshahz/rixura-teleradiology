import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DocumentChartBarIcon,
  BuildingOfficeIcon,
  NewspaperIcon,
  DocumentTextIcon,
  HomeIcon,
  UserGroupIcon,
  ChatBubbleBottomCenterIcon,
  DocumentDuplicateIcon,
  ChartBarIcon,
  ReceiptRefundIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

import SidebarHeader from "./SidebarHeader";
import SidebarFooter from "./SidebarFooter";
import { useThemeContext } from "../../../context/ThemeContext";
import { ContactService } from "../../../services/Contact.service";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const theme = useThemeContext();

  const [isMobile, setIsMobile] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false); // ✅ still needed

  // Inside the component
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const count = await ContactService.getCount();
        setUnreadCount(count);
      } catch (error) {
        console.error("Failed to fetch unread contact count", error);
      }
    };

    fetchUnreadCount();

    const interval = setInterval(fetchUnreadCount, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const mainNavLinks = [
    {
      name: "Dashboard",
      icon: <HomeIcon className="w-5 h-5" />,
      path: "/",
      onClick: () => {
        navigate("/");
        if (isMobile) setIsSidebarOpen(false);
      },
    },
    {
      name: "Center",
      icon: <BuildingOfficeIcon className="w-5 h-5" />,
      path: "/center",
      onClick: () => {
        navigate("center");
        if (isMobile) setIsSidebarOpen(false);
      },
    },
    {
      name: "Radiologist",
      icon: <UserGroupIcon className="w-5 h-5" />,
      path: "/radiologist",
      onClick: () => {
        navigate("radiologist");
        if (isMobile) setIsSidebarOpen(false);
      },
    },
    {
      name: "Feedback",
      icon: <ChatBubbleBottomCenterIcon className="w-5 h-5" />,
      path: "/feedback",
      onClick: () => {
        navigate("feedback");
        if (isMobile) setIsSidebarOpen(false);
      },
    },
    {
      name: "Templates",
      icon: <DocumentDuplicateIcon className="w-5 h-5" />,
      path: "/templates",
      onClick: () => {
        navigate("templates");
        if (isMobile) setIsSidebarOpen(false);
      },
    },
    {
      name: "Reports",
      icon: <ChartBarIcon className="w-5 h-5" />,
      path: "/reports",
      onClick: () => {
        navigate("reports");
        if (isMobile) setIsSidebarOpen(false);
      },
    },
    {
      name: "Invoices",
      icon: <ReceiptRefundIcon className="w-5 h-5" />,
      path: "/invoice",
      onClick: () => {
        navigate("invoice");
        if (isMobile) setIsSidebarOpen(false);
      },
    },
    {
      name: "Contact",
      icon: (
        <div className="relative">
          <EnvelopeIcon className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
      ),
      path: "/contact",
      onClick: () => {
        navigate("contact");
        if (isMobile) setIsSidebarOpen(false);
      },
    },
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
