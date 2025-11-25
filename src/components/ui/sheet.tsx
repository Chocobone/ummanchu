import React from "react";
import { cn } from "../../lib/utils.tsx";

export const Sheet = ({
  children,
  open,
  onOpenChange,
}: {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) => children;

export const SheetTrigger = ({
  asChild,
  children,
}: {
  asChild?: boolean;
  children: React.ReactNode;
}) => <>{children}</>;

export const SheetContent = ({
  side = "right",
  className,
  children,
}: {
  side?: "left" | "right";
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "fixed top-0 bottom-0 w-[260px] bg-white dark:bg-neutral-900 shadow-lg z-50 p-4 transition-transform",
        side === "right" ? "right-0" : "left-0",
        className
      )}
    >
      {children}
    </div>
  );
};
