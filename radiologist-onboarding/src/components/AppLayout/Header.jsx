import {
  ArrowRightEndOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = (setIsSidebarOpen) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const profileLinks = [
    {
      name: "My profile",
      icon: <UserIcon className="w-5 h-5" />,
      path: "/profile",
    },
    {
      name: "Sign out",
      icon: <ArrowRightEndOnRectangleIcon className="w-5 h-5" />,
      path: "/login",
    },
  ];

  const handleProfileItemClick = (item) => {
    navigate(item.path);
    setMenuOpen(false);
    if (isMobile) setIsSidebarOpen(false);
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
    <div className="flex items-center justify-between ml-2">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <div className="w-4 h-4 bg-primary rounded-md sm:w-6 sm:h-6 transition-all duration-200 hover:bg-primary" />
        </div>
        <span className="text-lg sm:text-xl font-semibold text-black dark:text-white">
          Brand Logo
        </span>
      </div>
      <div id="profile-menu-container" className="relative">
        <div
          className="flex items-center justify-between cursor-pointer space-x-3 px-3 py-1.5 rounded-full hover:bg-gray-light2 dark:hover:bg-gray-dark transition-all duration-150 ease-in-out"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-haspopup="true"
          aria-expanded={menuOpen}
        >
          <div className="flex items-center">
            <div className="flex flex-row items-center space-x-2">
              <span className="text-sm font-medium text-black dark:text-white">
                Dr. Erica Fernandes
              </span>
            </div>
          </div>
          <div className="bg-gray-light dark:bg-gray-dark rounded-full p-1 transform transition-transform duration-200 ease-in-out hover:bg-primary-light hover:text-white">
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
  );
};

export default Header;
