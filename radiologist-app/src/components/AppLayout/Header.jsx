import {
  ArrowRightEndOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import ConfirmationModal from "../layout-ui/Modal/ConfirmationModal";
import { logout } from "../../store/auth.slice";
import {
  logo,
  logoWhite,
  logoMobileWhite,
  logoMobileColor,
} from "../../assets";

const Header = ({ setIsSidebarOpen }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false); // ✅ For logout confirm
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ctx = useSelector((state) => state.auth);

  const profileLinks = [
    {
      name: "My profile",
      icon: <UserIcon className="w-5 h-5" />,
      path: "/profile",
    },
    {
      name: "Sign out",
      icon: <ArrowRightEndOnRectangleIcon className="w-5 h-5" />,
      action: "signout",
    },
  ];

  const handleProfileItemClick = (item) => {
    if (item.name === "Sign out") {
      setShowLogoutConfirmModal(true); // ✅ Show modal instead
      return;
    }
    navigate(item.path);
    setMenuOpen(false);
  };

  const handleConfirmLogout = () => {
    dispatch(logout());
    setShowLogoutConfirmModal(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const profileMenu = document.getElementById("profile-menu-container");
      if (menuOpen && profileMenu && !profileMenu.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <>
      <div className="flex items-center justify-between -ml-2 md:ml-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {/* 🌞 Light Theme, Desktop */}
            <img
              src={logo}
              alt="Rixura Logo"
              className="hidden md:block dark:hidden w-28 h-10 object-contain"
            />

            {/* 🌚 Dark Theme, Desktop */}
            <img
              src={logoWhite}
              alt="Rixura Logo Dark"
              className="hidden md:dark:block w-28 h-10 object-contain"
            />

            {/* 🌞 Light Theme, Mobile */}
            <img
              src={logoMobileColor}
              alt="Rixura Mobile Logo"
              className="block md:hidden dark:hidden w-20 h-8 object-contain"
            />

            {/* 🌚 Dark Theme, Mobile */}
            <img
              src={logoMobileWhite}
              alt="Rixura Mobile Logo Dark"
              className="hidden dark:block md:dark:hidden w-20 h-8 object-contain"
            />
          </div>

          {/* <span className="text-lg sm:text-xl font-semibold text-black dark:text-white hidden md:inline">
            Rixura
          </span> */}
        </div>
        <div id="profile-menu-container " className="relative z-20">
          <div
            className="flex items-center px-2 justify-between cursor-pointer space-x-3  py-1.5 rounded-full hover:bg-gray-light2 dark:hover:bg-gray-dark transition-all duration-150 ease-in-out"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-haspopup="true"
            aria-expanded={menuOpen}
          >
            <div className="flex items-center ">
              <div className="flex flex-row items-center space-x-2">
                <span className="text-sm font-medium text-black dark:text-white">
                  Dr. {ctx?.user?.name}
                </span>
              </div>
            </div>
            <div className="bg-gray-light  dark:bg-gray-dark rounded-full p-1 transform transition-transform duration-200 ease-in-out hover:bg-primary-light hover:text-white">
              {menuOpen ? (
                <ChevronUpIcon className="w-4 h-4 text-gray-dark dark:text-white" />
              ) : (
                <ChevronDownIcon className="w-4 h-4 text-gray-dark dark:text-white" />
              )}
            </div>
          </div>

          {menuOpen && (
            <div className="absolute right-0 mt-2 bg-white border dark:bg-black border-gray rounded-md shadow-lg w-48 z-10 transform transition-all duration-200 ease-in-out origin-top-right">
              <ul className="py-1 text-sm text-black dark:text-gray-light">
                {profileLinks.map((item) => (
                  <li key={item.name}>
                    <button
                      onClick={() => handleProfileItemClick(item)}
                      className="flex items-center w-full px-4 py-2.5 text-left transition-colors duration-150 ease-in-out group hover:bg-primary hover:text-white cursor-pointer focus:outline-none focus:bg-primary-light focus:text-white"
                    >
                      <div className="border border-gray rounded-full p-1.5 mr-3 transition-colors duration-150 ease-in-out group-hover:border-white">
                        {item.icon}
                      </div>
                      <span>{item.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

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
    </>
  );
};

export default Header;
