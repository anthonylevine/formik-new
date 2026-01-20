import * as React from 'react';
import { FormikProps, GenericFieldHTMLAttributes, FieldMetaProps, FieldHelperProps, FieldInputProps, FieldValidator } from './types';
export interface FieldProps<V = any, FormValues = any> {
    field: FieldInputProps<V>;
    form: FormikProps<FormValues>;
    meta: FieldMetaProps<V>;
}
export interface FieldConfig<V = any> {
    /**
     * Component to render. Can either be a string e.g. 'select', 'input', or 'textarea', or a component.
     */
    as?: React.ComponentType<FieldProps<V>['field']> | string | React.ComponentType | React.ForwardRefExoticComponent<any>;
    /**
     * Children render function <Field name>{props => ...}</Field>)
     */
    children?: ((props: FieldProps<V>) => React.ReactNode) | React.ReactNode;
    /**
     * Validate a single field value independently
     */
    validate?: FieldValidator;
    /**
     * Used for 'select' and related input types.
     */
    multiple?: boolean;
    /**
     * Field name
     */
    name: string;
    /** HTML input type */
    type?: string;
    /** Field value */
    value?: any;
    /** React 19: ref can be passed directly as a prop */
    ref?: React.Ref<any>;
}
export type FieldAttributes<T> = {
    className?: string;
} & GenericFieldHTMLAttributes & FieldConfig<T> & T & {
    name: string;
};
export type FieldHookConfig<T> = GenericFieldHTMLAttributes & FieldConfig<T>;
/**
 * useField hook - Connect a field to Formik
 *
 * Returns a tuple of [fieldProps, metaProps, helperProps]
 *
 * @example
 * const [field, meta, helpers] = useField('email');
 * return <input {...field} />;
 *
 * @example
 * const [field, meta] = useField({ name: 'email', validate: validateEmail });
 */
export declare function useField<Val = any>(propsOrFieldName: string | FieldHookConfig<Val>): [FieldInputProps<Val>, FieldMetaProps<Val>, FieldHelperProps<Val>];
/**
 * Field component - Connects any input to Formik
 *
 * @example
 * // As HTML input
 * <Field name="email" type="email" />
 *
 * @example
 * // As select
 * <Field name="color" as="select">
 *   <option value="red">Red</option>
 * </Field>
 *
 * @example
 * // With children function
 * <Field name="email">
 *   {({ field, meta }) => (
 *     <div>
 *       <input {...field} />
 *       {meta.touched && meta.error && <div>{meta.error}</div>}
 *     </div>
 *   )}
 * </Field>
 *
 * @example
 * // With custom component
 * <Field name="email" as={CustomInput} />
 */
export declare function Field({ validate, name, children, as: asElement, className, ref, ...props }: FieldAttributes<any>): React.ReactElement<unknown, string | React.JSXElementConstructor<any>>;
export declare namespace Field {
    var displayName: string;
}
