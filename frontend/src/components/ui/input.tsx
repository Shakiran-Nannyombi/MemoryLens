import React from "react";
import { cn } from "../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** REQ-016: Always-visible label required above the input */
  label?: string;
  /** Optional wrapper className */
  wrapperClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, id, wrapperClassName, ...props }, ref) => {
    // Generate a stable id for label association if none provided
    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className={cn("flex flex-col", wrapperClassName)}>
        {label && (
          // REQ-016: always-visible label element (no placeholder-only labels)
          <label
            htmlFor={inputId}
            className="block font-label-lg text-label-lg text-on-surface-variant mb-1"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          className={cn(
            // REQ-010, REQ-016: Stitch tokens — touch target height, surface container bg,
            // outline-variant border, rounded corners, focus border-primary, body typography
            "h-touch-target-min bg-surface-container-low border-2 border-outline-variant rounded-lg px-4 focus:border-primary focus:outline-none transition-colors w-full font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/60 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
