import * as React from 'react';
import { FormikContextType, FormikState, FormikErrors, FormikTouched, FormikValues } from './types';
import invariant from 'tiny-warning';

/**
 * Formik v3 Context Architecture
 *
 * In v3, we split the monolithic context into 4 separate contexts for performance:
 * 1. FormikValuesContext - Form values (changes frequently)
 * 2. FormikStateContext - Errors, touched, submission state (moderate changes)
 * 3. FormikMetadataContext - Computed values, initial values (rarely changes)
 * 4. FormikMethodsContext - Handlers and helpers (stable references, never changes)
 *
 * This prevents unnecessary re-renders when only one part of the state changes.
 */

// =====================================================================
// Context Type Definitions
// =====================================================================

export interface FormikValuesContextValue<Values = any> {
  values: Values;
}

export interface FormikStateContextValue<Values = any> {
  errors: FormikErrors<Values>;
  touched: FormikTouched<Values>;
  isSubmitting: boolean;
  isValidating: boolean;
  status?: any;
  submitCount: number;
}

export interface FormikMetadataContextValue<Values = any> {
  dirty: boolean;
  isValid: boolean;
  initialValues: Values;
  initialErrors: FormikErrors<Values>;
  initialTouched: FormikTouched<Values>;
  initialStatus?: any;
}

export interface FormikMethodsContextValue<Values = any> {
  // Field registration
  registerField: (name: string, fns: { validate?: any }) => void;
  unregisterField: (name: string) => void;

  // Field props getters
  getFieldProps: (props: any) => any;
  getFieldMeta: (name: string) => any;
  getFieldHelpers: (name: string) => any;

  // Form handlers
  handleBlur: (e: any) => void;
  handleChange: (e: any) => void;
  handleReset: (e?: any) => void;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;

  // Form helpers
  resetForm: (nextState?: Partial<FormikState<Values>>) => void;
  submitForm: () => Promise<any>;
  validateForm: (values?: Values) => Promise<FormikErrors<Values>>;
  validateField: (name: string) => Promise<void> | Promise<string>;

  // Setters
  setErrors: (errors: FormikErrors<Values>) => void;
  setFieldError: (field: string, value: string | undefined) => void;
  setFieldTouched: (field: string, touched?: boolean, shouldValidate?: boolean) => void;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  setStatus: (status: any) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  setTouched: (touched: FormikTouched<Values>, shouldValidate?: boolean) => void;
  setValues: (values: React.SetStateAction<Values>, shouldValidate?: boolean) => void;
  setFormikState: (stateOrCb: FormikState<Values> | ((state: FormikState<Values>) => FormikState<Values>)) => void;

  // Validation config (stable)
  validate?: (values: Values) => void | object | Promise<FormikErrors<Values>>;
  validationSchema?: any;
}

// =====================================================================
// Context Creation
// =====================================================================

const FormikValuesContext = React.createContext<FormikValuesContextValue<any> | undefined>(undefined);
const FormikStateContext = React.createContext<FormikStateContextValue<any> | undefined>(undefined);
const FormikMetadataContext = React.createContext<FormikMetadataContextValue<any> | undefined>(undefined);
const FormikMethodsContext = React.createContext<FormikMethodsContextValue<any> | undefined>(undefined);

FormikValuesContext.displayName = 'FormikValuesContext';
FormikStateContext.displayName = 'FormikStateContext';
FormikMetadataContext.displayName = 'FormikMetadataContext';
FormikMethodsContext.displayName = 'FormikMethodsContext';

// =====================================================================
// Provider Component
// =====================================================================

export interface FormikProviderProps<Values = any> {
  value: FormikContextType<Values>;
  children: React.ReactNode;
}

/**
 * FormikProvider wraps your form and provides Formik context to all child components.
 * In v3, it automatically splits the context into 4 optimized contexts.
 */
export function FormikProvider<Values = any>({ value, children }: FormikProviderProps<Values>) {
  // Split the monolithic context into 4 optimized slices
  const valuesContext = React.useMemo<FormikValuesContextValue<Values>>(
    () => ({ values: value.values }),
    [value.values]
  );

  const stateContext = React.useMemo<FormikStateContextValue<Values>>(
    () => ({
      errors: value.errors,
      touched: value.touched,
      isSubmitting: value.isSubmitting,
      isValidating: value.isValidating,
      status: value.status,
      submitCount: value.submitCount,
    }),
    [
      value.errors,
      value.touched,
      value.isSubmitting,
      value.isValidating,
      value.status,
      value.submitCount,
    ]
  );

  const metadataContext = React.useMemo<FormikMetadataContextValue<Values>>(
    () => ({
      dirty: value.dirty,
      isValid: value.isValid,
      initialValues: value.initialValues,
      initialErrors: value.initialErrors,
      initialTouched: value.initialTouched,
      initialStatus: value.initialStatus,
    }),
    [
      value.dirty,
      value.isValid,
      value.initialValues,
      value.initialErrors,
      value.initialTouched,
      value.initialStatus,
    ]
  );

  // Methods context is stable - handlers don't change reference
  const methodsContext = React.useMemo<FormikMethodsContextValue<Values>>(
    () => ({
      registerField: value.registerField,
      unregisterField: value.unregisterField,
      getFieldProps: value.getFieldProps,
      getFieldMeta: value.getFieldMeta,
      getFieldHelpers: value.getFieldHelpers,
      handleBlur: value.handleBlur,
      handleChange: value.handleChange,
      handleReset: value.handleReset,
      handleSubmit: value.handleSubmit,
      resetForm: value.resetForm,
      submitForm: value.submitForm,
      validateForm: value.validateForm,
      validateField: value.validateField,
      setErrors: value.setErrors,
      setFieldError: value.setFieldError,
      setFieldTouched: value.setFieldTouched,
      setFieldValue: value.setFieldValue,
      setStatus: value.setStatus,
      setSubmitting: value.setSubmitting,
      setTouched: value.setTouched,
      setValues: value.setValues,
      setFormikState: value.setFormikState,
      validate: value.validate,
      validationSchema: value.validationSchema,
    }),
    [
      value.registerField,
      value.unregisterField,
      value.getFieldProps,
      value.getFieldMeta,
      value.getFieldHelpers,
      value.handleBlur,
      value.handleChange,
      value.handleReset,
      value.handleSubmit,
      value.resetForm,
      value.submitForm,
      value.validateForm,
      value.validateField,
      value.setErrors,
      value.setFieldError,
      value.setFieldTouched,
      value.setFieldValue,
      value.setStatus,
      value.setSubmitting,
      value.setTouched,
      value.setValues,
      value.setFormikState,
      value.validate,
      value.validationSchema,
    ]
  );

  return (
    <FormikMethodsContext.Provider value={methodsContext}>
      <FormikMetadataContext.Provider value={metadataContext}>
        <FormikStateContext.Provider value={stateContext}>
          <FormikValuesContext.Provider value={valuesContext}>
            {children}
          </FormikValuesContext.Provider>
        </FormikStateContext.Provider>
      </FormikMetadataContext.Provider>
    </FormikMethodsContext.Provider>
  );
}

// =====================================================================
// Selective Hooks (Recommended for v3)
// =====================================================================

/**
 * Subscribe to form values only. Component only re-renders when values change.
 * @example
 * const { values } = useFormikValues();
 */
export function useFormikValues<Values = any>(): FormikValuesContextValue<Values> {
  const context = React.useContext(FormikValuesContext);
  invariant(
    context !== undefined,
    'useFormikValues must be used within a <Formik> component'
  );
  return context as FormikValuesContextValue<Values>;
}

/**
 * Subscribe to form state (errors, touched, isSubmitting, etc.).
 * Component only re-renders when state changes.
 * @example
 * const { errors, touched, isSubmitting } = useFormikState();
 */
export function useFormikState<Values = any>(): FormikStateContextValue<Values> {
  const context = React.useContext(FormikStateContext);
  invariant(
    context !== undefined,
    'useFormikState must be used within a <Formik> component'
  );
  return context as FormikStateContextValue<Values>;
}

/**
 * Subscribe to form metadata (dirty, isValid, initialValues).
 * Component rarely re-renders as metadata changes infrequently.
 * @example
 * const { dirty, isValid } = useFormikMetadata();
 */
export function useFormikMetadata<Values = any>(): FormikMetadataContextValue<Values> {
  const context = React.useContext(FormikMetadataContext);
  invariant(
    context !== undefined,
    'useFormikMetadata must be used within a <Formik> component'
  );
  return context as FormikMetadataContextValue<Values>;
}

/**
 * Get stable handler and helper references. Never causes re-renders.
 * @example
 * const { setFieldValue, handleSubmit } = useFormikMethods();
 *
 * @example
 * // React 19: Optimistic updates
 * const { values } = useFormikValues();
 * const { setFieldValue } = useFormikMethods();
 * const [optimisticValues, setOptimisticValues] = React.useOptimistic?.(
 *   values,
 *   (state, newValue) => ({ ...state, ...newValue })
 * ) ?? [values, () => {}];
 *
 * const handleOptimisticUpdate = (field: string, value: any) => {
 *   // Show optimistic update immediately
 *   setOptimisticValues({ [field]: value });
 *   // Then update real state
 *   setFieldValue(field, value);
 * };
 */
export function useFormikMethods<Values = any>(): FormikMethodsContextValue<Values> {
  const context = React.useContext(FormikMethodsContext);
  invariant(
    context !== undefined,
    'useFormikMethods must be used within a <Formik> component'
  );
  return context as FormikMethodsContextValue<Values>;
}

// =====================================================================
// Legacy Hook (For Backwards Compatibility)
// =====================================================================

/**
 * Get the entire Formik context (all contexts combined).
 *
 * ⚠️ PERFORMANCE WARNING: This hook subscribes to ALL contexts, causing
 * re-renders whenever ANY part of the form changes. For better performance,
 * use selective hooks instead:
 * - useFormikValues() - for form values
 * - useFormikState() - for errors, touched, isSubmitting
 * - useFormikMetadata() - for dirty, isValid
 * - useFormikMethods() - for handlers (doesn't cause re-renders)
 *
 * @deprecated Use selective hooks for better performance
 * @example
 * // Instead of:
 * const formik = useFormikContext();
 *
 * // Do this:
 * const { values } = useFormikValues();
 * const { errors } = useFormikState();
 * const { setFieldValue } = useFormikMethods();
 */
export function useFormikContext<Values = any>(): FormikContextType<Values> {
  const values = useFormikValues<Values>();
  const state = useFormikState<Values>();
  const metadata = useFormikMetadata<Values>();
  const methods = useFormikMethods<Values>();

  if (__DEV__) {
    console.warn(
      'Formik v3: useFormikContext() subscribes to all contexts and may cause unnecessary re-renders. ' +
      'Consider using selective hooks (useFormikValues, useFormikState, useFormikMetadata, useFormikMethods) for better performance.'
    );
  }

  // Combine all contexts into the legacy format
  return React.useMemo(
    () => ({
      ...values,
      ...state,
      ...metadata,
      ...methods,
    }),
    [values, state, metadata, methods]
  ) as FormikContextType<Values>;
}

// =====================================================================
// Legacy Exports (For Backwards Compatibility)
// =====================================================================

/**
 * @deprecated Use FormikProvider instead
 */
export const FormikConsumer = FormikValuesContext.Consumer;

/**
 * Legacy context - not recommended for use in v3
 * @deprecated Internal use only
 */
export const FormikContext = FormikValuesContext;
