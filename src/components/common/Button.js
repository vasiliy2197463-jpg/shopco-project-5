"use client";

import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  icon,
  'aria-label': ariaLabel,
}) {
  const baseStyles = "inline-flex items-center justify-center font-satoshi font-medium transition-all duration-300 rounded-pill focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-gray-700",
    outline: "bg-white border border-border text-primary hover:bg-gray-100",
    secondary: "bg-gray-bg text-primary hover:bg-gray-300",
  };

  const sizes = {
    sm: "px-5 py-2 text-sm",
    md: "px-14 py-4 text-base",
    lg: "px-16 py-4 text-base",
    full: "w-full py-4 text-base",
  };

  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`}
    >
      {children}
      {icon && <span className="ml-2 flex items-center justify-center">{icon}</span>}
    </button>
  );
}
