import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Card component with configurable variants and sizes
 * 
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.variant - Card style variant: "default", "outlined", "flat"
 * @param {string} props.size - Card size: "sm", "md", "lg"
 * @param {boolean} props.hoverable - Whether the card has hover effects
 * @param {boolean} props.interactive - Whether the card is interactive (clickable)
 * @param {Function} props.onClick - Click handler for interactive cards
 */
const Card = React.forwardRef(({
  className,
  children,
  variant = "default",
  size = "md",
  hoverable = false,
  interactive = false,
  onClick,
  ...props
}, ref) => {
  // Card variants
  const variants = {
    default: "bg-white dark:bg-gray-900 shadow-md",
    outlined: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700",
    flat: "bg-gray-50 dark:bg-gray-800",
  };

  // Card sizes
  const sizes = {
    sm: "p-3",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg",
        variants[variant] || variants.default,
        sizes[size] || sizes.md,
        hoverable && "transition-shadow duration-200 hover:shadow-lg",
        interactive && "cursor-pointer",
        className
      )}
      onClick={interactive ? onClick : undefined}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  );
});

/**
 * Card header component
 * 
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Header content
 * @param {React.ReactNode} props.action - Optional action element for the header (e.g., button)
 * @param {string} props.as - HTML element to render as (h2, h3, div, etc.)
 */
const CardHeader = React.forwardRef(({
  className,
  children,
  action,
  as: Component = "div",
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-between mb-4",
      className
    )}
    {...props}
  >
    <Component className="text-lg font-semibold dark:text-white">
      {children}
    </Component>
    {action && <div className="ml-4">{action}</div>}
  </div>
));

/**
 * Card title component
 * 
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Title content
 * @param {string} props.as - HTML element to render as (h2, h3, div, etc.)
 */
const CardTitle = React.forwardRef(({
  className,
  children,
  as: Component = "h3",
  ...props
}, ref) => (
  <Component
    ref={ref}
    className={cn(
      "text-lg font-semibold dark:text-white",
      className
    )}
    {...props}
  >
    {children}
  </Component>
));

/**
 * Card description component
 * 
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Description content
 */
const CardDescription = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm text-gray-500 dark:text-gray-400",
      className
    )}
    {...props}
  >
    {children}
  </p>
));

/**
 * Card content component
 * 
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Content elements
 */
const CardContent = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-gray-700 dark:text-gray-300",
      className
    )}
    {...props}
  >
    {children}
  </div>
));

/**
 * Card footer component
 * 
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Footer content
 */
const CardFooter = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center pt-4 mt-4 border-t border-gray-200 dark:border-gray-700",
      className
    )}
    {...props}
  >
    {children}
  </div>
));

// Set display names for all components
Card.displayName = "Card";
CardHeader.displayName = "CardHeader";
CardTitle.displayName = "CardTitle";
CardDescription.displayName = "CardDescription";
CardContent.displayName = "CardContent";
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
