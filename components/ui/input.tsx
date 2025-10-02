import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "h-11 w-full rounded-full border border-[#e7dccd] bg-white px-5 text-sm text-[#6d5334] placeholder:text-[#bea789] shadow-sm transition focus:border-[#d3a06f] focus:ring-2 focus:ring-[#f0e1cb] focus-visible:outline-none",
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";
