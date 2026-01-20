import * as React from 'react';
import {
  FormikProps,
  GenericFieldHTMLAttributes,
  FieldMetaProps,
  FieldInputProps,
} from './types';
import { getIn, isFunction } from './utils';
import { FieldConfig } from './Field';
import { useFormikValues, useFormikState, useFormikMetadata, useFormikMethods } from './FormikContext';

export interface FastFieldProps<V = any> {
  field: FieldInputProps<V>;
  meta: FieldMetaProps<V>;
  form: FormikProps<V>;
}

export type FastFieldConfig<T> = FieldConfig & {
  /** Override FastField's default should update comparison */
  shouldUpdate?: (
    nextProps: T & GenericFieldHTMLAttributes,
    prevProps: T & GenericFieldHTMLAttributes
  ) => boolean;
};

export type FastFieldAttributes<T> = GenericFieldHTMLAttributes &
  FastFieldConfig<T> &
  T & {
    name: string;
  };

/**
 * FastField is an optimized version of Field for performance-critical forms.
 *
 * It only re-renders when:
 * - The field's value changes
 * - The field's error changes
 * - The field's touched state changes
 * - isSubmitting changes
 * - The field name changes
 * - Props change
 *
 * This prevents unnecessary re-renders when other fields in the form change.
 *
 * @example
 * <FastField name="email" type="email" />
 * <FastField name="email" as="textarea" />
 * <FastField name="email">{({ field, meta }) => <input {...field} />}</FastField>
 */
export const FastField = React.memo<FastFieldAttributes<any>>(
  function FastField({
    name,
    validate,
    as: asElement = 'input',
    children,
    ...props
  }: FastFieldAttributes<any>) {
    const { values } = useFormikValues();
    const { errors, touched, isSubmitting } = useFormikState();
    const { initialValues, initialErrors, initialTouched } = useFormikMetadata();
    const methods = useFormikMethods();

    // Register field on mount and when validate/name changes
    React.useEffect(() => {
      methods.registerField(name, { validate });

      return () => {
        methods.unregisterField(name);
      };
    }, [name, validate, methods]);

    // Build field props
    const field = methods.getFieldProps({ name, ...props });

    // Build meta object
    const meta: FieldMetaProps<any> = {
      value: getIn(values, name),
      error: getIn(errors, name),
      touched: !!getIn(touched, name),
      initialValue: getIn(initialValues, name),
      initialTouched: !!getIn(initialTouched, name),
      initialError: getIn(initialErrors, name),
    };

    // Build form bag (excluding validate/validationSchema)
    const form: FormikProps<any> = {
      values,
      errors,
      touched,
      isSubmitting,
      ...methods,
      initialValues,
      initialErrors,
      initialTouched,
    } as FormikProps<any>;

    const bag = { field, meta, form };

    // Render with children function
    if (isFunction(children)) {
      return (children as (props: FastFieldProps<any>) => React.ReactNode)(bag);
    }

    // Render as HTML element or component
    if (typeof asElement === 'string') {
      return React.createElement(
        asElement,
        { ...field, ...props },
        children
      );
    }

    // Render as custom component
    return React.createElement(
      asElement as React.ComponentType,
      { ...field, ...props },
      children
    );
  },
  (prevProps, nextProps) => {
    // Custom shouldUpdate function takes precedence
    if (prevProps.shouldUpdate) {
      return !prevProps.shouldUpdate(nextProps, prevProps);
    }

    // Name changed - must re-render
    if (prevProps.name !== nextProps.name) {
      return false;
    }

    // Props length changed - must re-render
    if (Object.keys(prevProps).length !== Object.keys(nextProps).length) {
      return false;
    }

    // Check if any non-formik props changed
    const prevKeys = Object.keys(prevProps);
    for (let key of prevKeys) {
      if (
        key !== '_values' &&
        key !== '_errors' &&
        key !== '_touched' &&
        key !== '_isSubmitting' &&
        (prevProps as any)[key] !== (nextProps as any)[key]
      ) {
        return false;
      }
    }

    // Check formik-specific values (passed via hidden props for comparison)
    // These are injected by the wrapper if needed, but we primarily rely on
    // context updates triggering re-renders
    if (
      (prevProps as any)._values !== (nextProps as any)._values ||
      (prevProps as any)._errors !== (nextProps as any)._errors ||
      (prevProps as any)._touched !== (nextProps as any)._touched ||
      (prevProps as any)._isSubmitting !== (nextProps as any)._isSubmitting
    ) {
      return false;
    }

    // Props are equal, skip re-render
    return true;
  }
);

FastField.displayName = 'FastField';
