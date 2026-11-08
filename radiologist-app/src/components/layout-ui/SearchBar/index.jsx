import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

const SearchBar = ({
  name,
  value,
  onChange,
  placeholder = "Search",
  className = "",
  debounceDelay = 300,
}) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (internalValue !== value) {
        onChange(internalValue);
      }
    }, debounceDelay);

    return () => {
      clearTimeout(handler);
    };
  }, [internalValue, onChange, debounceDelay, value]);

  return (
    <div
      className={`flex flex-1 items-center rounded-md border dark:border-gray border-gray bg-slate-light2 dark:bg-gray-dark px-3 py-2 ${className}`}
    >
      <MagnifyingGlassIcon className="w-4 h-4 text-gray" />
      <input
        type="text"
        name={name}
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent border-none w-full focus:outline-none text-sm ml-2"
      />
    </div>
  );
};

export default SearchBar;
