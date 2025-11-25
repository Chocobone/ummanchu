import React from "react";
import { cn } from "../../lib/utils.tsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost";
  size?: "default" | "sm" | "icon";
}

export const Button = ({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        "rounded-md font-medium transition-colors",
        variant === "default" &&
          "bg-indigo-600 text-white hover:bg-indigo-700",
        variant === "ghost" &&
          "bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700",
        size === "icon" && "p-2",
        size === "sm" && "px-3 py-1 text-sm",
        size === "default" && "px-4 py-2",
        className
      )}
      {...props}
    />
  );
};
