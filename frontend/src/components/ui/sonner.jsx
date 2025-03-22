import * as React from "react";
import { cn } from "@/lib/utils";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

/**
 * Toast provider component to manage toast notifications
 * Place this at the top level of your application
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Application content
 * @param {string} props.position - Position of toasts: "top-right", "top-center", "top-left", "bottom-right", "bottom-center", "bottom-left"
 * @param {number} props.duration - Default duration in milliseconds
 * @param {number} props.maxToasts - Maximum number of toasts visible at once
 */
const ToastProvider = ({
  children,
  position = "bottom-right",
  duration = 5000,
  maxToasts = 3,
}) => {
  const [toasts, setToasts] = React.useState([]);

  // Position styles
  const positions = {
    "top-right": "top-0 right-0",
    "top-center": "top-0 left-1/2 -translate-x-1/2",
    "top-left": "top-0 left-0",
    "bottom-right": "bottom-0 right-0",
    "bottom-center": "bottom-0 left-1/2 -translate-x-1/2",
    "bottom-left": "bottom-0 left-0",
  };

  // Add a new toast
  const toast = React.useCallback(({ message, type = "info", icon, duration: customDuration }) => {
    const id = Date.now().toString();
    const newToast = { id, message, type, icon, duration: customDuration || duration };
    
    setToasts((prev) => [...prev, newToast]);
    
    // Auto-remove toast after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, newToast.duration);
    
    return id;
  }, [duration]);

  // Remove a toast by ID
  const removeToast = React.useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Create context value
  const contextValue = React.useMemo(() => ({
    toast,
    removeToast,
    success: (message, options) => toast({ message, type: "success", ...options }),
    error: (message, options) => toast({ message, type: "error", ...options }),
    warning: (message, options) => toast({ message, type: "warning", ...options }),
    info: (message, options) => toast({ message, type: "info", ...options }),
  }), [toast, removeToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      
      <div 
        aria-live="polite" 
        aria-atomic="true"
        className={cn(
          "fixed z-50 flex flex-col gap-2 p-4 max-w-md w-full pointer-events-none",
          positions[position] || positions["bottom-right"]
        )}
      >
        {toasts.slice(0, maxToasts).map((toast) => (
          <Sonner
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            icon={toast.icon}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Create context for toast functions
const ToastContext = React.createContext(null);

/**
 * Hook to use toast functionality from anywhere in the app
 * @returns {Object} Toast functions: toast, success, error, warning, info, removeToast
 */
const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

/**
 * Enhanced Sonner toast notification component
 * 
 * @param {Object} props - Component props
 * @param {string} props.id - Unique ID for the toast
 * @param {string} props.message - Toast message content
 * @param {string} props.type - Toast type: "info", "success", "warning", "error"
 * @param {React.ReactNode} props.icon - Custom icon to display
 * @param {Function} props.onClose - Function to call when toast is closed
 * @param {string} props.className - Additional CSS classes
 */
const Sonner = React.forwardRef(({
  id,
  message,
  type = "info",
  icon,
  onClose,
  className,
  ...props
}, ref) => {
  // Style variants based on type
  const styles = {
    info: "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
    success: "bg-green-50 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800",
    error: "bg-red-50 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
  };

  // Default icons for each toast type
  const defaultIcons = {
    info: <Info className="h-5 w-5 text-blue-500 dark:text-blue-400 flex-shrink-0" />,
    success: <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 flex-shrink-0" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-500 dark:text-yellow-400 flex-shrink-0" />,
    error: <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 flex-shrink-0" />,
  };

  // Animation to fade in and slide from the right
  React.useEffect(() => {
    const element = document.getElementById(`toast-${id}`);
    if (element) {
      element.animate(
        [
          { opacity: 0, transform: 'translateX(1rem)' },
          { opacity: 1, transform: 'translateX(0)' }
        ],
        { duration: 200, easing: 'ease-out' }
      );
    }
  }, [id]);

  return (
    <div
      ref={ref}
      id={`toast-${id}`}
      role="alert"
      className={cn(
        "p-4 rounded-lg border shadow-sm pointer-events-auto flex items-start gap-3 w-full animate-in",
        styles[type] || styles.info,
        className
      )}
      {...props}
    >
      {/* Icon */}
      {(icon || defaultIcons[type]) && (
        <div className="flex-shrink-0">
          {icon || defaultIcons[type]}
        </div>
      )}
      
      {/* Content */}
      <div className="flex-1 mr-2">
        {typeof message === 'string' ? (
          <p className="text-sm font-medium">{message}</p>
        ) : (
          message
        )}
      </div>
      
      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 rounded-md p-1 opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
});

Sonner.displayName = "Sonner";

export { Sonner, ToastProvider, useToast };
