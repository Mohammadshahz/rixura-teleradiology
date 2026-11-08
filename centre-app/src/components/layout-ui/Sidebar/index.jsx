import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DocumentChartBarIcon,
  UserPlusIcon,
  ArrowRightEndOnRectangleIcon,
  UserIcon,
  ClockIcon,
  DocumentCurrencyRupeeIcon,
} from "@heroicons/react/24/outline";

import SidebarHeader from "./SidebarHeader";
import SidebarFooter from "./SidebarFooter";
import { useThemeContext } from "../../../context/ThemeContext";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/auth.slice";
import ConfirmationModal from "../Modals/ConfirmationModal";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const theme = useThemeContext();
  const dispatch = useDispatch();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false); // ✅ For logout confirm

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
      name: "Patients",
      icon: <UserPlusIcon className="w-5 h-5" />,
      path: "/patients",
      onClick: () => {
        navigate("/patients");
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
      path: "/invoice",
      onClick: () => {
        navigate("/invoice");
        if (isMobile) setIsSidebarOpen(false);
      },
    },
  ];

  const profileLinks = [
    {
      name: "My profile",
      icon: <UserIcon className="w-5 h-5 mr-2" />,
      path: "/profile",
    },
    {
      name: "Sign out",
      icon: <ArrowRightEndOnRectangleIcon className="w-5 h-5 mr-2" />,
      path: "/login", // Not used directly now
    },
  ];

  const handleProfileItemClick = (item) => {
    if (item.name === "Sign out") {
      setShowLogoutConfirmModal(true); // ✅ Show modal instead
      return;
    }
    navigate(item.path);
    setMenuOpen(false);
    if (isMobile) setIsSidebarOpen(false);
  };

  const handleConfirmLogout = () => {
    dispatch(logout());
    setShowLogoutConfirmModal(false);
    navigate("/login");
  };

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
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        profileLinks={profileLinks}
        onProfileItemClick={handleProfileItemClick}
        showFeedbackModal={showFeedbackModal}
        setShowFeedbackModal={setShowFeedbackModal}
      />

      {/* ✅ Reusable Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutConfirmModal}
        title="Confirm Logout"
        message="Are you sure you want to sign out?"
        onConfirm={handleConfirmLogout}
        onCancel={() => setShowLogoutConfirmModal(false)}
        confirmText="Logout"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Sidebar;
