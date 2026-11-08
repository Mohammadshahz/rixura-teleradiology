import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import fullLogo from "../assets/White.svg";
import iconLogo from "../assets/Icon White.svg";
import { requestContact, type UserType } from "../utils/contactIntent";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = async (
    e: React.MouseEvent<HTMLAnchorElement>,
    label: string
  ) => {
    e.preventDefault();
    const id = label.toLowerCase();

    if (label === "Home" && location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setMobileOpen(false);
      return;
    }

    if (
      (label === "Services" || label === "Contact" || label === "Tutorial") &&
      location.pathname === "/"
    ) {
      const section = document.getElementById(id);
      if (section) section.scrollIntoView({ behavior: "smooth" });
      setMobileOpen(false);
      return;
    }

    if (
      label === "Home" ||
      label === "Services" ||
      label === "Contact" ||
      label === "Tutorial"
    ) {
      await navigate("/");
      setTimeout(() => {
        if (label === "Home") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          const section = document.getElementById(id);
          if (section) section.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
      setMobileOpen(false);
    }
  };

  const handleRoleClick = async (userType: UserType) => {
    setMobileOpen(false);
    requestContact(userType);

    const section = document.getElementById("contact");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      return;
    }

    // Pages without the contact section (e.g. legal pages): go home, then scroll.
    await navigate("/");
    setTimeout(() => {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Services", to: "#services" },
    { label: "Tutorial", to: "#tutorial" },   // New Tutorial link
    { label: "About", to: "/about" },
    { label: "Contact", to: "#contact" },
  ];

  return (
    <nav
      className={`fixed z-50 top-0 w-full transition-all duration-300 ${
        scrolled
          ? "bg-black/80 shadow-lg backdrop-blur-md"
          : "bg-black/20 shadow-none backdrop-blur-lg"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" onClick={(e) => handleNavClick(e, "Home")}>
          <img src={fullLogo} alt="Rixura Logo" className="h-10 w-auto hidden sm:block" />
          <img src={iconLogo} alt="Rixura Icon" className="h-12 w-auto sm:hidden" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden sm:flex space-x-8 items-center">
          {navLinks.map(({ label, to }) =>
            to.startsWith("/") ? (
              <Link
                key={label}
                to={to}
                onClick={() => setMobileOpen(false)}
                className="relative font-medium text-white transition duration-300 group hover:text-blue-300"
              >
                {label}
                <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-blue-300 transition-all duration-300 group-hover:w-full" />
              </Link>
            ) : (
              <a
                key={label}
                href={to}
                onClick={(e) => handleNavClick(e, label)}
                className="relative font-medium text-white transition duration-300 group hover:text-blue-300"
              >
                {label}
                <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-blue-300 transition-all duration-300 group-hover:w-full" />
              </a>
            )
          )}
        </div>

        {/* Action Buttons - Desktop */}
        <div className="hidden sm:flex space-x-4">
          <button
            type="button"
            onClick={() => handleRoleClick("Center")}
            className="bg-white text-blue-900 px-5 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300"
          >
            Center
          </button>
          <button
            type="button"
            onClick={() => handleRoleClick("Radiologist")}
            className="border-2 border-white/30 text-white px-5 py-2 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300"
          >
            Radiologist
          </button>
        </div>

        {/* Mobile Menu Icon */}
        <div className="sm:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-md hover:bg-white/10"
          >
            {mobileOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="sm:hidden bg-black/80 backdrop-blur-md px-6 py-4 space-y-4">
          {navLinks.map(({ label, to }) => (
            to.startsWith("/") ? (
              <Link
                key={label}
                to={to}
                onClick={() => setMobileOpen(false)}
                className="block text-white font-medium hover:text-blue-300 transition"
              >
                {label}
              </Link>
            ) : (
              <a
                key={label}
                href={to}
                onClick={(e) => handleNavClick(e, label)}
                className="block text-white font-medium hover:text-blue-300 transition"
              >
                {label}
              </a>
            )
          ))}

          <div className="pt-4 space-y-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => handleRoleClick("Center")}
              className="block w-full bg-white text-blue-900 text-center py-2 rounded-md font-semibold hover:bg-blue-50 transition"
            >
              Center
            </button>
            <button
              type="button"
              onClick={() => handleRoleClick("Radiologist")}
              className="block w-full border border-white/30 text-white text-center py-2 rounded-md font-semibold hover:bg-white/10 transition"
            >
              Radiologist
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
