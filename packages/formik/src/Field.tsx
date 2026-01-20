import * as React from 'react';
import {
  FormikProps,
  GenericFieldHTMLAttributes,
  FieldMetaProps,
  FieldHelperProps,
  FieldInputProps,
  FieldValidator,
} from './types';
import { useFormikContext } from './FormikContext';
import { isFunction, isObject } from './utils';
import invariant from 'tiny-warning';

export interface FieldProps<V = any, FormValues = any> {
  field: FieldInputProps<V>;
  form: FormikProps<FormValues>;
  meta: FieldMetaProps<V>;
}

export interface FieldConfig<V = any> {
  /**
   * Component to render. Can either be a string e.g. 'select', 'input', or 'textarea', or a component.
   */
  as?:
    | React.ComponentType<FieldProps<V>['field']>
    | string
    | React.ComponentType
    | React.ForwardRefExoticComponent<any>;

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
} & GenericFieldHTMLAttributes &
  FieldConfig<T> & T & {
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
export function useField<Val = any>(
  propsOrFieldName: string | FieldHookConfig<Val>
): [FieldInputProps<Val>, FieldMetaProps<Val>, FieldHelperProps<Val>] {
  const formik = useFormikContext();
  const {
    getFieldProps,
    getFieldMeta,
    getFieldHelpers,
    registerField,
    unregisterField,
  } = formik;

  const isAnObject = isObject(propsOrFieldName);

  // Normalize propsOrFieldName to FieldHookConfig<Val>
  const props: FieldHookConfig<Val> = isAnObject
    ? (propsOrFieldName as FieldHookConfig<Val>)
    : { name: propsOrFieldName as string };

  const { name: fieldName, validate: validateFn } = props;

  React.useEffect(() => {
    if (fieldName) {
      registerField(fieldName, {
        validate: validateFn,
      });
    }
    return () => {
      if (fieldName) {
        unregisterField(fieldName);
      }
    };
  }, [registerField, unregisterField, fieldName, validateFn]);

  if (__DEV__) {
    invariant(
      formik,
      'useField() / <Field /> must be used underneath a <Formik> component'
    );
  }

  invariant(
    fieldName,
    'Invalid field name. Either pass `useField` a string or an object containing a `name` key.'
  );

  const fieldHelpers = React.useMemo(
    () => getFieldHelpers(fieldName),
    [getFieldHelpers, fieldName]
  );

  return [getFieldProps(props), getFieldMeta(fieldName), fieldHelpers];
}

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
export function Field({
  validate,
  name,
  children,
  as: asElement = 'input',
  className,
  ref,
  ...props
}: FieldAttributes<any>) {
  const {
    validate: _validate,
    validationSchema: _validationSchema,
    ...formik
  } = useFormikContext();

  // Register field and field-level validation with parent <Formik>
  const { registerField, unregisterField } = formik;
  React.useEffect(() => {
    registerField(name, {
      validate: validate,
    });
    return () => {
      unregisterField(name);
    };
  }, [registerField, unregisterField, name, validate]);

  const field = formik.getFieldProps({ name, ...props });
  const meta = formik.getFieldMeta(name);
  const bag = { field, form: formik, meta };

  // Render with children function
  if (isFunction(children)) {
    return children(bag) as React.ReactElement;
  }

  // Render as HTML element or component
  if (typeof asElement === 'string') {
    return React.createElement(
      asElement,
      { ref, ...field, ...props, className },
      children
    );
  }

  // Render as custom component
  return React.createElement(
    asElement as React.ComponentType,
    { ref, ...field, ...props, className },
    children
  );
}

Field.displayName = 'Field';
