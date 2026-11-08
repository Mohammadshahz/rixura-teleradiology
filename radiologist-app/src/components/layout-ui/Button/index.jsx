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
  color = "primary", // new color prop
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition focus:outline-none";

  const sizeClasses = {
    sm: "text-sm px-2 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-5 py-3",
  }[size];

  const roundedClasses = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  }[rounded];

  const colorVariants = {
    primary: {
      contained: "bg-primary text-white hover:bg-primary-dark",
      outlined:
        "border border-primary text-primary hover:bg-primary-light hover:text-white",
    },
    blue: {
      contained: "bg-blue-600 text-white hover:bg-blue-700",
      outlined:
        "border border-blue-600 text-blue-600 hover:bg-blue-100 hover:text-blue-700",
    },
    red: {
      contained: "bg-red-600 text-white hover:bg-red-700",
      outlined:
        "border border-red-600 text-red-600 hover:bg-red-100 hover:text-red-700",
    },
    green: {
      contained: "bg-green-600 text-white hover:bg-green-700",
      outlined:
        "border border-green-600 text-green-600 hover:bg-green-100 hover:text-green-700",
    },
    gray: {
      contained: "bg-gray-600 text-white hover:bg-gray-700",
      outlined:
        "border border-gray-600 text-gray-600 hover:bg-gray-100 hover:text-gray-700",
    },
  };

  const variantClasses =
    colorVariants[color]?.[variant] || colorVariants.primary[variant];

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
      !disabled && "cursor-pointer",
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
  color: PropTypes.oneOf(["primary", "blue", "red", "green", "gray"]),
};

export default Button;
