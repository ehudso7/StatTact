import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Enhanced Label component with improved accessibility and styling options
 * 
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.htmlFor - ID of the associated form control
 * @param {React.ReactNode} props.children - Label content
 * @param {boolean} props.required - Whether the associated field is required
 * @param {boolean} props.disabled - Whether the label should appear disabled
 * @param {string} props.size - Label size: "sm", "md", "lg"
 * @param {boolean} props.srOnly - Whether the label should be visually hidden but accessible to screen readers
 * @param {string} props.variant - Label style variant: "default", "secondary", "ghost"
 */
const Label = React.forwardRef(({
  className,
  htmlFor,
  children,
  required = false,
  disabled = false,
  size = "md",
  srOnly = false,
  variant = "default",
  ...props
}, ref) => {
  // Size variations
  const sizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  // Style variants
  const variants = {
    default: "text-gray-700 dark:text-gray-300 font-medium",
    secondary: "text-gray-500 dark:text-gray-400 font-normal",
    ghost: "text-gray-400 dark:text-gray-500 font-normal",
  };

  // Required state marker
  const requiredIndicator = required && (
    <span 
      className="text-red-500 ml-1" 
      aria-hidden="true"
    >
      *
    </span>
  );

  return (
    <label
      ref={ref}
      htmlFor={htmlFor}
      className={cn(
        // Base styles
        "block",

        // Screen reader only styles
        srOnly && "sr-only",
        
        // Size and variant styles (only if not sr-only)
        !srOnly && sizes[size],
        !srOnly && variants[variant],
        
        // State styles
        disabled && "opacity-50 cursor-not-allowed",
        
        // Additional spacing
        "mb-1",
        
        // Custom classes
        className
      )}
      {...(required && {"aria-required": "true"})}
      {...props}
    >
      {children}
      {requiredIndicator}
    </label>
  );
});

Label.displayName = "Label";

export { Label };
