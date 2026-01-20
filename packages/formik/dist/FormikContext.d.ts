import * as React from 'react';
import { FormikContextType, FormikState, FormikErrors, FormikTouched } from './types';
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
    registerField: (name: string, fns: {
        validate?: any;
    }) => void;
    unregisterField: (name: string) => void;
    getFieldProps: (props: any) => any;
    getFieldMeta: (name: string) => any;
    getFieldHelpers: (name: string) => any;
    handleBlur: (e: any) => void;
    handleChange: (e: any) => void;
    handleReset: (e?: any) => void;
    handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
    resetForm: (nextState?: Partial<FormikState<Values>>) => void;
    submitForm: () => Promise<any>;
    validateForm: (values?: Values) => Promise<FormikErrors<Values>>;
    validateField: (name: string) => Promise<void> | Promise<string | undefined>;
    setErrors: (errors: FormikErrors<Values>) => void;
    setFieldError: (field: string, value: string | undefined) => void;
    setFieldTouched: (field: string, touched?: boolean, shouldValidate?: boolean) => void;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
    setStatus: (status: any) => void;
    setSubmitting: (isSubmitting: boolean) => void;
    setTouched: (touched: FormikTouched<Values>, shouldValidate?: boolean) => void;
    setValues: (values: React.SetStateAction<Values>, shouldValidate?: boolean) => void;
    setFormikState: (stateOrCb: FormikState<Values> | ((state: FormikState<Values>) => FormikState<Values>)) => void;
    validate?: (values: Values) => void | object | Promise<FormikErrors<Values>>;
    validationSchema?: any;
}
export interface FormikProviderProps<Values = any> {
    value: FormikContextType<Values>;
    children: React.ReactNode;
}
/**
 * FormikProvider wraps your form and provides Formik context to all child components.
 * In v3, it automatically splits the context into 4 optimized contexts.
 */
export declare function FormikProvider<Values = any>({ value, children }: FormikProviderProps<Values>): React.JSX.Element;
/**
 * Subscribe to form values only. Component only re-renders when values change.
 * @example
 * const { values } = useFormikValues();
 */
export declare function useFormikValues<Values = any>(): FormikValuesContextValue<Values>;
/**
 * Subscribe to form state (errors, touched, isSubmitting, etc.).
 * Component only re-renders when state changes.
 * @example
 * const { errors, touched, isSubmitting } = useFormikState();
 */
export declare function useFormikState<Values = any>(): FormikStateContextValue<Values>;
/**
 * Subscribe to form metadata (dirty, isValid, initialValues).
 * Component rarely re-renders as metadata changes infrequently.
 * @example
 * const { dirty, isValid } = useFormikMetadata();
 */
export declare function useFormikMetadata<Values = any>(): FormikMetadataContextValue<Values>;
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
export declare function useFormikMethods<Values = any>(): FormikMethodsContextValue<Values>;
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
export declare function useFormikContext<Values = any>(): FormikContextType<Values>;
/**
 * @deprecated Use useFormikContext() hook or selective hooks instead
 *
 * Legacy consumer that combines all contexts for backwards compatibility.
 * This is used by the deprecated connect() HOC.
 */
export declare const FormikConsumer: React.FC<{
    children: (value: FormikContextType<any>) => React.ReactNode;
}>;
/**
 * Legacy context - not recommended for use in v3
 * @deprecated Internal use only
 */
export declare const FormikContext: React.Context<FormikValuesContextValue<any> | undefined>;
