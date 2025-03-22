import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Container component to provide consistent width and padding to layout sections
 * 
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Container content
 * @param {string} props.size - Container max-width: "xs", "sm", "md", "lg", "xl", "2xl", "full"
 * @param {string} props.as - HTML element to render as
 * @param {boolean} props.centered - Whether to center the content vertically as well
 * @param {string} props.padding - Custom padding setting: "none", "sm", "md", "lg"
 */
const Container = React.forwardRef(({
  className,
  children,
  size = "xl",
  as: Component = "div",
  centered = false,
  padding = "md",
  ...props
}, ref) => {
  // Container max-width presets
  const sizes = {
    xs: "max-w-md", // 448px
    sm: "max-w-2xl", // 672px
    md: "max-w-4xl", // 896px
    lg: "max-w-6xl", // 1152px
    xl: "max-w-7xl", // 1280px
    "2xl": "max-w-screen-2xl", // 1536px
    full: "max-w-full" // 100%
  };

  // Padding presets
  const paddings = {
    none: "px-0",
    sm: "px-2 sm:px-4",
    md: "px-4 sm:px-6 lg:px-8",
    lg: "px-6 sm:px-8 lg:px-12"
  };

  return (
    <Component
      ref={ref}
      className={cn(
        "mx-auto",
        sizes[size] || sizes.xl,
        paddings[padding] || paddings.md,
        centered && "flex flex-col items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
});

Container.displayName = "Container";

export { Container };
