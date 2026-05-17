import React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
      // REQ-010, REQ-017: primary variant with Stitch tokens, touch target, and press animation
      default:
        "bg-primary text-on-primary rounded-xl h-[56px] px-6 font-label-lg active:scale-95 duration-150 transition-colors hover:opacity-90",
      // REQ-010: destructive uses error token
      destructive:
        "bg-error text-on-error rounded-xl h-[56px] px-6 font-label-lg active:scale-95 duration-150 transition-colors hover:opacity-90",
      // REQ-010: outline variant with primary border
      outline:
        "border-2 border-primary text-primary rounded-xl h-[56px] px-6 font-label-lg active:scale-95 duration-150 transition-colors hover:bg-primary/5",
      ghost:
        "hover:bg-surface-container text-on-surface rounded-xl h-[56px] px-6 font-label-lg active:scale-95 duration-150 transition-colors",
      link: "text-primary underline-offset-4 hover:underline font-label-lg",
    };

    const sizes = {
      // h-[56px] is already set in variants for default/destructive/outline/ghost
      default: "",
      sm: "h-10 px-4 text-sm rounded-lg",
      lg: "h-[56px] px-8",
      icon: "h-12 w-12 rounded-full",
    };

    return (
      <button
        ref={ref}
        className={cn(
          // REQ-016: focus state, disabled state, flex layout
          "inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
