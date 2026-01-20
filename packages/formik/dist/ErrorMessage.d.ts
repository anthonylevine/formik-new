import * as React from 'react';
export interface ErrorMessageProps {
    id?: string;
    name: string;
    className?: string;
    component?: string | React.ComponentType;
    children?: (errorMessage: string) => React.ReactNode;
}
/**
 * ErrorMessage component - displays validation errors for a field.
 * Only renders when the field is touched AND has an error.
 *
 * Uses React.memo with custom comparison to prevent unnecessary re-renders.
 * Only subscribes to FormikStateContext (errors, touched).
 *
 * @example
 * <ErrorMessage name="email" />
 * <ErrorMessage name="email" component="div" />
 * <ErrorMessage name="email">{msg => <div className="error">{msg}</div>}</ErrorMessage>
 */
export declare const ErrorMessage: React.NamedExoticComponent<ErrorMessageProps>;
