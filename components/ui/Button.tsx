"use client";

import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  full?: boolean;
}

export default function Button({
  variant = "primary",
  full = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const base =
    "px-4 py-2 rounded-xl font-bold transition-all duration-150 text-sm";

  const variants = {
    primary: "bg-[#9FE870] text-[#0A2342] hover:bg-[#b4f28b]",
    secondary:
      "border border-[#9FE870] text-[#9FE870] hover:bg-[#9FE87022]",
    ghost: "text-[#9FE870] hover:text-white",
  };

  return (
    <button
      className={clsx(
        base,
        variants[variant],
        full && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
