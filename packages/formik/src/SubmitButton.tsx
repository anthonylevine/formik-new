import * as React from 'react';

/**
 * SubmitButton - A button that automatically disables during form submission
 *
 * Uses React 19's useFormStatus hook to automatically track form submission state.
 * Must be used inside a <Form> component.
 *
 * @example
 * <Formik initialValues={{}} onSubmit={handleSubmit}>
 *   <Form>
 *     <Field name="email" />
 *     <SubmitButton>Submit</SubmitButton>
 *   </Form>
 * </Formik>
 *
 * @example
 * // With custom pending text
 * <SubmitButton pendingText="Submitting...">
 *   Submit
 * </SubmitButton>
 *
 * @example
 * // With custom styling
 * <SubmitButton className="btn-primary">
 *   Submit
 * </SubmitButton>
 */
export function SubmitButton({
  children,
  pendingText,
  disabled,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Text to show while form is submitting */
  pendingText?: React.ReactNode;
}) {
  // React 19: useFormStatus tracks parent <form> submission state
  // Note: This requires React 19+ and only works inside <form> with action prop
  const pending = false; // Fallback for now - will use useFormStatus when available

  // Try to use useFormStatus if available (React 19+)
  try {
    // @ts-ignore - useFormStatus may not be available in all React versions
    const formStatus = React.useFormStatus?.();
    if (formStatus) {
      return (
        <button
          type="submit"
          disabled={disabled || formStatus.pending}
          {...props}
        >
          {formStatus.pending && pendingText ? pendingText : children}
        </button>
      );
    }
  } catch (e) {
    // useFormStatus not available, fall through to legacy implementation
  }

  // Legacy fallback: Use Formik context
  // This provides backwards compatibility for React <19
  const { useFormikState } = require('./FormikContext');
  const { isSubmitting } = useFormikState();

  return (
    <button
      type="submit"
      disabled={disabled || isSubmitting}
      {...props}
    >
      {isSubmitting && pendingText ? pendingText : children}
    </button>
  );
}

SubmitButton.displayName = 'SubmitButton';
