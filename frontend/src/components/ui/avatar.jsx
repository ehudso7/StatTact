import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Avatar component that displays a user's profile picture with a fallback option
 * 
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alternative text for the image (required for accessibility)
 * @param {string} props.fallbackSrc - Fallback image source if primary fails to load
 * @param {string} props.initials - User initials to display if no image is available
 * @param {string} props.size - Size of the avatar: "xs", "sm", "md", "lg", "xl"
 * @param {string} props.status - Optional status indicator: "online", "away", "busy", "offline"
 * @param {boolean} props.bordered - Whether to add a border around the avatar
 */
const Avatar = React.forwardRef(({
  className,
  src,
  alt = "",
  fallbackSrc,
  initials,
  size = "md",
  status,
  bordered = false,
  ...props
}, ref) => {
  const [imgError, setImgError] = React.useState(false);
  
  // Define sizes with responsive values
  const sizes = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-base",
    lg: "w-16 h-16 text-lg",
    xl: "w-24 h-24 text-xl",
  };

  // Status indicator colors
  const statusColors = {
    online: "bg-green-500",
    away: "bg-yellow-500",
    busy: "bg-red-500",
    offline: "bg-gray-400",
  };

  const handleError = () => {
    setImgError(true);
  };

  return (
    <div className="relative inline-flex">
      {!src || imgError ? (
        fallbackSrc ? (
          // Fallback image
          <img
            ref={ref}
            src={fallbackSrc}
            alt={alt}
            className={cn(
              "rounded-full object-cover",
              bordered && "ring-2 ring-white dark:ring-gray-800",
              sizes[size],
              className
            )}
            {...props}
          />
        ) : (
          // Initials fallback
          <div
            ref={ref}
            className={cn(
              "rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium",
              bordered && "ring-2 ring-white dark:ring-gray-800",
              sizes[size],
              className
            )}
            aria-label={alt}
            {...props}
          >
            {initials?.substring(0, 2) || ""}
          </div>
        )
      ) : (
        // Primary image
        <img
          ref={ref}
          src={src}
          alt={alt}
          onError={handleError}
          className={cn(
            "rounded-full object-cover",
            bordered && "ring-2 ring-white dark:ring-gray-800",
            sizes[size],
            className
          )}
          {...props}
        />
      )}
      
      {/* Status indicator */}
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 block rounded-full ring-2 ring-white dark:ring-gray-800",
            size === "xs" ? "w-1.5 h-1.5" : "w-2.5 h-2.5",
            statusColors[status] || "bg-gray-400"
          )}
          aria-hidden="true"
        />
      )}
    </div>
  );
});

Avatar.displayName = "Avatar";

export { Avatar };
