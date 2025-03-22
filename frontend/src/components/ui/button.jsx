import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Button component with enhanced styling and accessibility
 * 
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.variant - Button style variant: "default", "primary", "outline", "ghost", "link"
 * @param {string} props.size - Button size: "sm", "md", "lg"
 * @param {boolean} props.disabled - Whether the button is disabled
 */
const Button = React.forwardRef(({ 
  className, 
  children,
  variant = "default",
  size = "md",
  disabled = false,
  ...props 
}, ref) => {
  // Button variants
  const variants = {
    default: "bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100",
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    outline: "border border-gray-300 hover:bg-gray-100 text-gray-700 dark:border-gray-600 dark:hover:bg-gray-800 dark:text-gray-300",
    ghost: "hover:bg-gray-100 text-gray-700 dark:hover:bg-gray-800 dark:text-gray-300",
    link: "text-blue-500 hover:underline",
  };

  // Button sizes
  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(
        // Base styles
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        // Variant and size styles
        variants[variant] || variants.default,
        sizes[size] || sizes.md,
        // Disabled styles
        disabled && "opacity-50 cursor-not-allowed",
        // Custom classes
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export { Button };
