import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Button from ".";

const DropdownFilter = ({
  label,
  options = [],   // default to empty array
  value,
  onChange,
  allLabel,
  className = "",
  buttonProps = {},
  fullWidth = false,
  noDefault = false, // if true, no default "All" option
}) => {
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const ref = useRef(null);
  const itemRefs = useRef([]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // When dropdown opens, set focusedIndex to selected or first
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        let idx = -1;
        if (!noDefault && value === "") {
          idx = 0;
        } else {
          idx = options.findIndex(opt => (typeof opt === "string" ? opt : opt.id ?? opt.value) === value);
          if (!noDefault) idx += 1;
        }
        setFocusedIndex(idx >= 0 ? idx : (!noDefault ? 0 : 0));
      }, 0);
    } else {
      setFocusedIndex(-1);
    }
  }, [open, value, options, noDefault]);

  // Focus the item when focusedIndex changes
  useEffect(() => {
    if (open && focusedIndex >= 0 && itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex].focus();
    }
  }, [focusedIndex, open]);

  const handleKeyDown = (e) => {
    if (!open) {
      if (["ArrowDown", "Enter", " "].includes(e.key)) {
        setOpen(true);
        e.preventDefault();
      }
      return;
    }
    const itemCount = options.length + (noDefault ? 0 : 1);
    if (e.key === "ArrowDown") {
      setFocusedIndex(i => Math.min(i + 1, itemCount - 1));
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setFocusedIndex(i => Math.max(i - 1, 0));
      e.preventDefault();
    } else if (e.key === "Enter" || e.key === " ") {
      if (focusedIndex === 0 && !noDefault) {
        onChange("");
      } else {
        const idx = focusedIndex - (!noDefault ? 1 : 0);
        if (options[idx]) onChange(typeof options[idx] === "string" ? options[idx] : options[idx].id ?? options[idx].value);
      }
      setOpen(false);
      e.preventDefault();
    } else if (e.key === "Escape") {
      setOpen(false);
      e.preventDefault();
    }
  };


  // Resolve value/label from option object or string
  const resolveVal = (opt) => (typeof opt === "string" ? opt : opt.id ?? opt.value);
  const resolveLabel = (opt) =>
    typeof opt === "string" ? opt : opt.label ?? opt.name;

  const selectedOption = options.find((opt) => resolveVal(opt) === value);
  const selectedLabel = selectedOption
    ? resolveLabel(selectedOption)
    : allLabel || `All ${label}`;

  // wrapper class adjusts block vs inline-block on fullWidth
  const wrapperClass = fullWidth ? "relative block w-full" : "relative inline-block";

  return (
    <div className={`${wrapperClass} ${className}`} ref={ref}>
      <Button
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        {...buttonProps}
      >
        <div className="flex items-center gap-1">
          <div className="flex flex-row items-center gap-1 leading-tight">
            <span className="text-sm text-current">{label}</span>
            <span className="text-sm font-semibold text-current">{selectedLabel}</span>
          </div>
          <ChevronDownIcon className="w-3 h-3 text-current" />
        </div>
      </Button>

      {open && (
        <ul
          className="absolute z-50 mt-1 w-full max-h-48 overflow-auto border rounded bg-white dark:bg-gray-900 shadow-lg"
          role="listbox"
          tabIndex={-1}
          onKeyDown={handleKeyDown}
        >
         {!noDefault && <li
             ref={el => itemRefs.current[0] = el}
             tabIndex={-1}
             role="option"
             aria-selected={value === ""}
             onClick={() => {
               onChange("");
               setOpen(false);
             }}
             className={`cursor-pointer px-3 py-1 outline-none ${
               value === ""
                 ? "bg-blue-500 text-white"
                 : focusedIndex === 0
                   ? "bg-gray-100 dark:bg-gray-700"
                   : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
             }`}
           >
             {allLabel || `All ${label}`}
           </li>}
          {options.map((opt, idx) => {
             const val = resolveVal(opt);
             const lab = resolveLabel(opt);
             const isSelected = val === value;
             const optionIndex = idx + (!noDefault ? 1 : 0);
             return (
               <li
                 key={val}
                 ref={el => itemRefs.current[optionIndex] = el}
                 tabIndex={-1}
                 role="option"
                 aria-selected={isSelected}
                 onClick={() => {
                   onChange(val);
                   setOpen(false);
                 }}
                 className={`cursor-pointer px-3 py-1 outline-none ${
                   isSelected
                     ? "bg-blue-500 text-white"
                     : focusedIndex === optionIndex
                       ? "bg-gray-100 dark:bg-gray-700"
                       : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                 }`}
               >
                 {lab}
               </li>
             );
           })}
        </ul>
      )}
    </div>
  );
};

DropdownFilter.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  allLabel: PropTypes.string,
  className: PropTypes.string,
  buttonProps: PropTypes.shape({
    variant: PropTypes.oneOf(["contained", "outlined"]),
    size: PropTypes.oneOf(["sm", "md", "lg"]),
    rounded: PropTypes.oneOf(["sm", "md", "lg", "full"]),
    fullWidth: PropTypes.bool,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    startIcon: PropTypes.node,
    endIcon: PropTypes.node,
  }),
  fullWidth: PropTypes.bool,
};

export default DropdownFilter;
