import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Enhanced Textarea component with improved accessibility and styling
 * 
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.size - Textarea size: "sm", "md", "lg"
 * @param {string} props.variant - Textarea style variant: "default", "outline", "filled", "unstyled"
 * @param {boolean} props.error - Whether the textarea has an error
 * @param {boolean} props.disabled - Whether the textarea is disabled
 * @param {boolean} props.readOnly - Whether the textarea is read-only
 * @param {boolean} props.autoResize - Whether the textarea should automatically resize to fit content
 * @param {number} props.maxHeight - Maximum height for auto-resizing textarea (in pixels)
 * @param {number} props.minRows - Minimum number of rows to display
 * @param {number} props.maxRows - Maximum number of rows to display
 */
const Textarea = React.forwardRef(({
  className,
  size = "md",
  variant = "default",
  error = false,
  disabled = false,
  readOnly = false,
  autoResize = false,
  maxHeight,
  minRows = 3,
  maxRows,
  onChange,
  ...props
}, ref) => {
  // Create internal ref if autoResize is enabled
  const textareaRef = React.useRef(null);
  const combinedRef = useCombinedRefs(ref, textareaRef);
  
  // Size variations
  const sizes = {
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-2",
    lg: "px-4 py-3 text-lg",
  };

  // Style variants
  const variants = {
    default: "border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100",
    outline: "border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100",
    filled: "border border-transparent bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100",
    unstyled: "border-0 bg-transparent p-0 focus:ring-0 shadow-none",
  };

  // Handle auto-resize functionality
  React.useEffect(() => {
    if (autoResize && textareaRef.current) {
      const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        
        // Reset height to get the correct scrollHeight
        textarea.style.height = 'auto';
        
        // Calculate new height
        let newHeight = textarea.scrollHeight;
        
        // Apply max height constraint if specified
        if (maxHeight && newHeight > maxHeight) {
          newHeight = maxHeight;
          textarea.style.overflowY = 'auto';
        } else {
          textarea.style.overflowY = 'hidden';
        }
        
        // Apply the new height
        textarea.style.height = `${newHeight}px`;
      };
      
      // Set initial height
      adjustHeight();
      
      // Create a new resize observer
      const resizeObserver = new ResizeObserver(adjustHeight);
      resizeObserver.observe(textareaRef.current);
      
      return () => {
        if (textareaRef.current) {
          resizeObserver.unobserve(textareaRef.current);
        }
        resizeObserver.disconnect();
      };
    }
  }, [autoResize, maxHeight]);

  // Handle change event for auto-resize
  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
    
    if (autoResize && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Calculate rows based on minRows and maxRows
  const rows = React.useMemo(() => {
    if (minRows && !autoResize) {
      return minRows;
    }
    return undefined;
  }, [minRows, autoResize]);

  return (
    <textarea
      ref={combinedRef}
      disabled={disabled}
      readOnly={readOnly}
      onChange={handleChange}
      rows={rows}
      className={cn(
        // Base styles
        "w-full rounded-md focus:outline-none resize-none",
        
        // Size and variant styles
        sizes[size],
        variants[variant],
        
        // State styles
        "focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400",
        disabled && "opacity-50 cursor-not-allowed",
        error && "border-red-500 focus:ring-red-500 dark:focus:ring-red-400",
        readOnly && "cursor-default bg-gray-50 dark:bg-gray-800",
        
        // Resize behavior (if not auto-resize)
        !autoResize && "resize-y",
        
        // Custom classes
        className
      )}
      aria-invalid={error ? "true" : undefined}
      {...props}
    />
  );
});

// Helper hook to combine refs
function useCombinedRefs(...refs) {
  const targetRef = React.useRef();

  React.useEffect(() => {
    refs.forEach(ref => {
      if (!ref) return;
      
      if (typeof ref === 'function') {
        ref(targetRef.current);
      } else {
        ref.current = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
}

Textarea.displayName = "Textarea";

export { Textarea };
