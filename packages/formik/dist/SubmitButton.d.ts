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
export declare function SubmitButton({ children, pendingText, disabled, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    /** Text to show while form is submitting */
    pendingText?: React.ReactNode;
}): React.JSX.Element;
export declare namespace SubmitButton {
    var displayName: string;
}
