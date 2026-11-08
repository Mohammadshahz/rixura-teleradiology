import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useThemeContext } from "../../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <button
      onClick={toggleTheme}
      className="px-6 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-black dark:text-white transition"
      title="Toggle theme"
    >
      Toggler
      {/* <MoonIcon size={20} /> : <SunIcon size={20} /> */}
    </button>
  );
};

export default ThemeToggle;
