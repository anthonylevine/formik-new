import * as React from 'react';
import { FormikProps, GenericFieldHTMLAttributes, FieldMetaProps, FieldInputProps } from './types';
import { FieldConfig } from './Field';
export interface FastFieldProps<V = any> {
    field: FieldInputProps<V>;
    meta: FieldMetaProps<V>;
    form: FormikProps<V>;
}
export type FastFieldConfig<T> = FieldConfig & {
    /** Override FastField's default should update comparison */
    shouldUpdate?: (nextProps: T & GenericFieldHTMLAttributes, prevProps: T & GenericFieldHTMLAttributes) => boolean;
};
export type FastFieldAttributes<T> = GenericFieldHTMLAttributes & FastFieldConfig<T> & T & {
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
export declare const FastField: React.MemoExoticComponent<any>;
