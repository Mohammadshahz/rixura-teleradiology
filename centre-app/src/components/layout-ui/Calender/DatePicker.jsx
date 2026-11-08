import React, { useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import "./DatePickerStyles.css";

const CalendarPicker = ({ selectedDate, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const datePickerRef = useRef(null);

  const handleDateChange = (date) => {
    onChange(date);
    setIsOpen(false);
  };

  return (
    <div className="relative w-[180px]"> {/* Fixed width to prevent overlap */}
      <DatePicker
        ref={datePickerRef}
        selected={selectedDate}
        onChange={handleDateChange}
        onInputClick={() => setIsOpen(true)}
        open={isOpen}
        onClickOutside={() => setIsOpen(false)}
        dateFormat="dd-MM-yyyy"
        readOnly
        className={`
          border border-gray-300 rounded-md pr-10 pl-3 py-2 text-sm
          focus:outline-none bg-white cursor-pointer
          dark:bg-gray-800 dark:border-gray-600 dark:text-white
          w-full
        `}
        placeholderText="Select date"
        popperPlacement="bottom-start"
        popperClassName="react-datepicker-dark"
        wrapperClassName="react-datepicker-wrapper"
        calendarClassName="react-datepicker-dark"
        dayClassName={() => "react-datepicker__day"}
        weekDayClassName={() => "react-datepicker__day-name"}
        renderCustomHeader={({ monthDate, decreaseMonth, increaseMonth }) => (
          <div className="react-datepicker__header react-datepicker__header--custom">
            <button
              onClick={decreaseMonth}
              className="p-1 rounded hover:bg-gray-100 dark:hover:!bg-gray-700 dark:!text-gray-300"
            >
              {"<"}
            </button>
            <span className="react-datepicker__current-month">
              {monthDate.toLocaleString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button
              onClick={increaseMonth}
              className="p-1 rounded hover:bg-gray-100 dark:hover:!bg-gray-700 dark:!text-gray-300"
            >
              {">"}
            </button>
          </div>
        )}
      />
      <CalendarDaysIcon
        className="h-5 w-5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer dark:text-gray-400"
        onClick={() => setIsOpen(true)}
      />
    </div>
  );
};

export default CalendarPicker;