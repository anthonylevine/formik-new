import * as React from 'react';
import { getIn, isFunction } from './utils';
import { useFormikState } from './FormikContext';

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
export const ErrorMessage = React.memo<ErrorMessageProps>(
  function ErrorMessage({ name, component, children, ...rest }) {
    const { errors, touched } = useFormikState();

    const touch = getIn(touched, name);
    const error = getIn(errors, name);

    // Don't render if field hasn't been touched or has no error
    if (!touch || !error) {
      return null;
    }

    // Render with children function
    if (isFunction(children)) {
      return children(error) as React.ReactElement;
    }

    // Render with custom component
    if (component) {
      return React.createElement(component, rest as any, error);
    }

    // Default: render error string directly
    return error as React.ReactElement;
  },
  (prevProps, nextProps) => {
    // Custom comparison function - only re-render if:
    // 1. name changed
    // 2. props length changed
    // Note: We can't compare error/touched here since we don't have access to state
    // React.memo will handle re-renders when useFormikState returns new values
    return (
      prevProps.name === nextProps.name &&
      Object.keys(prevProps).length === Object.keys(nextProps).length
    );
  }
);

ErrorMessage.displayName = 'ErrorMessage';
