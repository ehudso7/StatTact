import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Form component with enhanced functionality and accessibility
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Form content
 * @param {Function} props.onSubmit - Form submission handler
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.spacing - Vertical spacing between form elements: "none", "sm", "md", "lg"
 * @param {string} props.layout - Form layout: "vertical", "horizontal", "inline" 
 * @param {boolean} props.disabled - Whether the entire form is disabled
 * @param {Object} props.noValidate - Disables browser's built-in validation
 * @param {string} props.id - Form ID for accessibility and linking with labels
 * @param {string} props.method - Form submission method (get, post)
 */
const Form = React.forwardRef(({
  children,
  onSubmit,
  className,
  spacing = "md",
  layout = "vertical",
  disabled = false,
  noValidate,
  id,
  method,
  ...props
}, ref) => {
  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    if (onSubmit) {
      onSubmit(event);
    }
  };

  // Spacings for form elements
  const spacings = {
    none: "space-y-0",
    sm: "space-y-2",
    md: "space-y-4",
    lg: "space-y-6",
  };

  // Layouts for form elements
  const layouts = {
    vertical: "",
    horizontal: "sm:grid sm:grid-cols-12 sm:gap-x-4 sm:gap-y-6",
    inline: "flex flex-wrap items-end gap-4",
  };

  return (
    <form
      ref={ref}
      onSubmit={handleSubmit}
      className={cn(
        spacings[spacing] || spacings.md,
        layouts[layout],
        className
      )}
      id={id}
      method={method}
      noValidate={noValidate}
      {...(disabled && { "aria-disabled": true })}
      {...props}
    >
      {disabled ? (
        <fieldset disabled className="border-0 m-0 p-0 min-w-0">
          {children}
        </fieldset>
      ) : (
        children
      )}
    </form>
  );
});

Form.displayName = "Form";

/**
 * Form field component to wrap form inputs with labels and error messages
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Form field content (input, select, etc.)
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.label - Field label text
 * @param {string} props.description - Optional description text below the field
 * @param {string} props.error - Error message to display
 * @param {string} props.htmlFor - ID of the form control for the label
 * @param {boolean} props.required - Whether the field is required
 */
const FormField = React.forwardRef(({
  children,
  className,
  label,
  description,
  error,
  htmlFor,
  required,
  ...props
}, ref) => {
  // Generate a unique ID if none is provided
  const fieldId = React.useId();
  const id = htmlFor || fieldId;
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;

  return (
    <div
      ref={ref}
      className={cn(
        "w-full",
        className
      )}
      {...props}
    >
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="mt-1">
        {React.cloneElement(
          React.Children.only(children),
          {
            id,
            "aria-describedby": description ? descriptionId : undefined,
            "aria-invalid": error ? "true" : undefined,
            "aria-errormessage": error ? errorId : undefined,
            required,
          }
        )}
      </div>
      {description && (
        <p
          id={descriptionId}
          className="mt-1 text-sm text-gray-500 dark:text-gray-400"
        >
          {description}
        </p>
      )}
      {error && (
        <p
          id={errorId}
          className="mt-1 text-sm text-red-500"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
});

FormField.displayName = "FormField";

/**
 * Form section component to group related form fields
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Form section content
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.title - Section title
 * @param {string} props.description - Section description
 */
const FormSection = React.forwardRef(({
  children,
  className,
  title,
  description,
  ...props
}, ref) => {
  return (
    <fieldset
      ref={ref}
      className={cn(
        "border-0 p-0 m-0",
        className
      )}
      {...props}
    >
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <legend className="text-base font-medium text-gray-900 dark:text-gray-100">
              {title}
            </legend>
          )}
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </fieldset>
  );
});

FormSection.displayName = "FormSection";

/**
 * Form submit button container
 * Provides consistent styling and positioning for form actions
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Action buttons
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.align - Alignment of buttons: "start", "center", "end", "between"
 */
const FormActions = React.forwardRef(({
  children,
  className,
  align = "end",
  ...props
}, ref) => {
  const alignments = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-wrap items-center gap-3 pt-4 mt-2",
        alignments[align] || alignments.end,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

FormActions.displayName = "FormActions";

export { Form, FormField, FormSection, FormActions };
