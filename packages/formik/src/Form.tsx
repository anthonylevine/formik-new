import * as React from 'react';
import { useFormikContext } from './FormikContext';

export type FormikFormProps = Pick<
  React.FormHTMLAttributes<HTMLFormElement>,
  Exclude<
    keyof React.FormHTMLAttributes<HTMLFormElement>,
    'onReset' | 'onSubmit'
  >
> & {
  /** React 19: ref can be passed directly as a prop */
  ref?: React.Ref<HTMLFormElement>;
  /**
   * React 19: Server action for progressive enhancement.
   * If provided, form will work without JavaScript.
   * @see https://react.dev/reference/react-dom/components/form#form
   */
  action?: string | ((formData: FormData) => void | Promise<void>);
};

/**
 * Form component - Automatically connects onSubmit and onReset to Formik
 *
 * React 19 Features:
 * - Supports server actions for progressive enhancement
 * - Works with useFormStatus() for nested submit buttons
 * - Ref can be passed directly as a prop (no forwardRef needed)
 *
 * @example
 * // Basic usage
 * <Formik initialValues={{}} onSubmit={...}>
 *   <Form>
 *     <Field name="email" />
 *     <button type="submit">Submit</button>
 *   </Form>
 * </Formik>
 *
 * @example
 * // With SubmitButton (uses useFormStatus)
 * <Formik initialValues={{}} onSubmit={...}>
 *   <Form>
 *     <Field name="email" />
 *     <SubmitButton>Submit</SubmitButton>
 *   </Form>
 * </Formik>
 *
 * @example
 * // React 19: With server action for progressive enhancement
 * <Formik initialValues={{}} onSubmit={...}>
 *   <Form action={serverAction}>
 *     <Field name="email" />
 *     <button type="submit">Submit</button>
 *   </Form>
 * </Formik>
 */
export function Form(props: FormikFormProps) {
  // iOS needs an "action" attribute for nice input: https://stackoverflow.com/a/39485162/406725
  // We default the action to "#" in case the preventDefault fails (just updates the URL hash)
  const { action, ref, ...rest } = props;
  const { handleReset, handleSubmit } = useFormikContext();

  // If action is a function (React 19 server action), use it directly
  // Otherwise, default to '#' for iOS compatibility
  const _action = typeof action === 'function' ? action : (action ?? '#');

  return (
    <form
      onSubmit={handleSubmit}
      ref={ref}
      onReset={handleReset}
      action={_action as any}
      {...rest}
    />
  );
}

Form.displayName = 'Form';
