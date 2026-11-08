import React from "react";
import PropTypes from "prop-types";

const Button = ({
  children,
  type = "button",
  className = "",
  onClick = () => {},
  variant = "contained", // 'contained' or 'outlined'
  disabled = false,
  fullWidth = false,
  size = "md",
  rounded = "md", // 'sm' | 'md' | 'lg' | 'full'
  startIcon = null,
  endIcon = null,
}) => {
  const baseClasses =
    "cursor-pointer inline-flex items-center justify-center font-medium transition focus:outline-none";

  const sizeClasses = {
    sm: "text-sm px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-5 py-3",
  }[size];

  const roundedClasses = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  }[rounded];

  // Default to neutral gray styles
  const variantClasses = {
    contained:
      "bg-primary text-white hover:bg-primary-dark dark:bg-primary-dark dark:hover:bg-primary",
    outlined:
      "border text-primary dark:text-white border-primary-light hover:bg-primary-dark dark:border-gray-400 dark:text-gray-400 dark:hover:bg-gray-700",
  }[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        baseClasses,
        sizeClasses,
        variantClasses,
        roundedClasses,
        fullWidth ? "w-full" : "",
        disabled ? "opacity-50 cursor-not-allowed" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {startIcon && <span className="mr-2 flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="ml-2 flex items-center">{endIcon}</span>}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(["button", "submit"]),
  className: PropTypes.string,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(["contained", "outlined"]),
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  rounded: PropTypes.oneOf(["sm", "md", "lg", "full"]),
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
};

export default Button;
