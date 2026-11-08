// components/IconButton.js
import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

const IconButton = ({
  icon: Icon,
  title = "",
  onClick,
  size = "md",
  color = "default",
  className = "",
  ...rest
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8",
    "2xl": "w-10 h-10",
  };

  const colorClasses = {
    default: "text-gray-600 hover:text-blue-500",
    primary: "text-blue-600 hover:text-blue-800",
    danger: "text-red-600 hover:text-red-800",
    success: "text-green-600 hover:text-green-800",
    warning: "text-yellow-600 hover:text-yellow-800",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={clsx(
        "focus:outline-none transition",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      {...rest}
    >
      <Icon />
    </button>
  );
};

IconButton.propTypes = {
  icon: PropTypes.elementType.isRequired, // Pass the icon component (e.g., EyeIcon)
  title: PropTypes.string,
  onClick: PropTypes.func,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  color: PropTypes.oneOf(["default", "primary", "danger", "success", "warning"]),
  className: PropTypes.string,
};

export default IconButton;
