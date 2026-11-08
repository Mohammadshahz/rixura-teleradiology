import React, { useState, useRef, useEffect } from "react";
import { useField } from "formik";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

const FormAutocomplete = ({
  suggestions = [],
  disabled = false,
  ...props
}) => {
  const [field, meta, helpers] = useField(props);
  const { value } = field;
  const { setValue } = helpers;

  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputText, setInputText] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef();
  const listRefs = useRef([]); // 👈 new

  const handleChange = (e) => {
    const val = e.target.value;
    setInputText(val);

    const filtered = suggestions.filter((item) =>
      item.label.toLowerCase().includes(val.toLowerCase())
    );
    setFilteredSuggestions(filtered);
    setShowSuggestions(true);
    setActiveIndex(-1);
  };

  const handleSelect = (item) => {
    setInputText(item.label);
    setValue(item.id);
    setShowSuggestions(false);
    setActiveIndex(-1);
  };

  const toggleSuggestions = () => {
    if (disabled) return;
    setFilteredSuggestions(suggestions);
    setShowSuggestions(true);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
        break;

      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
        break;

      case "Enter":
        e.preventDefault();
        const selected = filteredSuggestions[activeIndex];
        if (selected && !selected.disabled) {
          handleSelect(selected);
        }
        break;

      case "Escape":
        setShowSuggestions(false);
        break;

      default:
        break;
    }
  };

  // Sync label when value (ID) changes
  useEffect(() => {
    const match = suggestions.find((s) => s.id === value);
    if (match) {
      setInputText(match.label);
    } else {
      setInputText("");
    }
  }, [value, suggestions]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll the active suggestion into view
  useEffect(() => {
    if (
      showSuggestions &&
      activeIndex >= 0 &&
      listRefs.current[activeIndex]
    ) {
      listRefs.current[activeIndex].scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [activeIndex, showSuggestions]);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <input
        {...field}
        {...props}
        value={inputText}
        disabled={disabled}
        onChange={handleChange}
        onClick={toggleSuggestions}
        onFocus={toggleSuggestions}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        className={`w-full px-3 py-2 border ${
          meta.touched && meta.error
            ? "border-red-500 focus:ring-red-400"
            : "border-gray-300 focus:ring-gray-400"
        } rounded-md focus:outline-none focus:ring-2 ${
          disabled
            ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-400 cursor-not-allowed"
            : "bg-white dark:bg-black text-black dark:text-white"
        }`}
      />

      <button
        type="button"
        onClick={toggleSuggestions}
        className="absolute top-2.5 right-2 text-gray-400 hover:text-gray-600 focus:outline-none"
      >
        <ChevronDownIcon className="w-5 h-5 pointer-events-none" />
      </button>

      {showSuggestions && filteredSuggestions.length > 0 && !disabled && (
        <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md mt-1 max-h-48 overflow-y-auto shadow-lg">
          {filteredSuggestions.map((item, idx) => (
            <li
              key={idx}
              ref={(el) => (listRefs.current[idx] = el)} // 👈 Attach ref
              onMouseDown={() => !item.disabled && handleSelect(item)}
              className={`px-4 py-2 ${
                item.disabled
                  ? "text-gray-400 cursor-not-allowed"
                  : `cursor-pointer ${
                      idx === activeIndex
                        ? "bg-gray-100 dark:bg-gray-700"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`
              }`}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}

      {meta.touched && meta.error && (
        <div className="mt-1 text-sm text-red-500">{meta.error}</div>
      )}
    </div>
  );
};

export default FormAutocomplete;
