import React from "react";
import { CalendarIcon } from "@heroicons/react/24/outline";

const DateInput = ({
  name,
  value,
  onChange,
  placeholder = "Select date",
  className = "",
  ...rest
}) => {
  return (
    <div
      className={`flex flex-1 items-center rounded-md border border-gray  dark:bg-slate-800 px-3 py-2 ${className}`}
    >
      <input
        type="date"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="appearance-none bg-transparent border-none w-full focus:outline-none text-sm"
        {...rest}
      />
    </div>
  );
};

export default DateInput;
