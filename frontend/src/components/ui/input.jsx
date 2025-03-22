import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Enhanced Input component with improved accessibility and styling
 * 
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.type - Input type (text, email, password, etc.)
 * @param {string} props.size - Input size: "sm", "md", "lg"
 * @param {string} props.variant - Input style variant: "default", "outline", "filled", "unstyled"
 * @param {boolean} props.error - Whether the input has an error
 * @param {boolean} props.disabled - Whether the input is disabled
 * @param {boolean} props.readOnly - Whether the input is read-only
 * @param {string} props.prefix - Content to display before the input
 * @param {string} props.suffix - Content to display after the input
 * @param {string} props.id - Input ID for accessibility
 * @param {string} props.name - Input name for form submission
 */
const Input = React.forwardRef(({
  className,
  type = "text",
  size = "md",
  variant = "default",
  error = false,
  disabled = false,
  readOnly = false,
  prefix,
  suffix,
  id,
  name,
  ...props
}, ref) => {
  // Size variations
  const sizes = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-4 py-3 text-lg",
  };

  // Style variants
  const variants = {
    default: "border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100",
    outline: "border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100",
    filled: "border border-transparent bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100",
    unstyled: "border-0 bg-transparent p-0 focus:ring-0 shadow-none",
  };

  // Determine if we need a wrapper (for prefix/suffix)
  const needsWrapper = prefix || suffix;

  // The base input element
  const inputElement = (
    <input
      ref={ref}
      type={type}
      id={id}
      name={name}
      disabled={disabled}
      readOnly={readOnly}
      className={cn(
        // Base styles
        "w-full rounded-md focus:outline-none",
        
        // State styles
        "focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400",
        disabled && "opacity-50 cursor-not-allowed",
        error && "border-red-500 focus:ring-red-500 dark:focus:ring-red-400",
        readOnly && "cursor-default bg-gray-50 dark:bg-gray-800",
        
        // Conditionally apply padding only if no wrapper
        !needsWrapper && sizes[size],
        !needsWrapper && variants[variant],
        
        // Custom classes
        className
      )}
      aria-invalid={error ? "true" : undefined}
      {...props}
    />
  );

  // Return plain input if no wrapper needed
  if (!needsWrapper) {
    return inputElement;
  }

  // Return input with wrapper for prefix/suffix
  return (
    <div className={cn(
      "flex items-center rounded-md relative",
      variants[variant],
      sizes[size],
      error && "border-red-500",
      disabled && "opacity-50 cursor-not-allowed"
    )}>
      {prefix && (
        <div className="flex-shrink-0 text-gray-500 dark:text-gray-400 mr-2">
          {prefix}
        </div>
      )}
      
      <input
        ref={ref}
        type={type}
        id={id}
        name={name}
        disabled={disabled}
        readOnly={readOnly}
        className={cn(
          "w-full bg-transparent border-0 focus:ring-0 focus:outline-none p-0",
          error && "placeholder-red-400",
          className
        )}
        aria-invalid={error ? "true" : undefined}
        {...props}
      />
      
      {suffix && (
        <div className="flex-shrink-0 text-gray-500 dark:text-gray-400 ml-2">
          {suffix}
        </div>
      )}
    </div>
  );
});

Input.displayName = "Input";

export { Input };
