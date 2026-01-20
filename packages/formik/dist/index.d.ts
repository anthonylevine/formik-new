/**
 * Formik v3.0 - Main Exports
 *
 * Breaking Changes from v2:
 * - withFormik() HOC removed (use useFormik() hook instead)
 * - connect() HOC removed (use useFormikContext() hook instead)
 * - render prop pattern removed (use children function instead)
 * - component prop removed (use 'as' prop instead)
 * - innerRef removed (use 'ref' directly in React 19)
 */
export * from './Formik';
export * from './Field';
export * from './FastField';
export * from './FieldArray';
export * from './ErrorMessage';
export * from './Form';
export * from './SubmitButton';
export * from './FormikContext';
export * from './types';
export * from './utils';
/**
 * REMOVED IN V3:
 *
 * The following files should be deleted as they export deprecated APIs:
 * - src/withFormik.tsx (use useFormik hook instead)
 * - src/connect.tsx (use useFormikContext hook instead)
 *
 * Migration guide:
 *
 * withFormik() → useFormik():
 * ```tsx
 * // v2
 * export default withFormik({ ... })(MyForm);
 *
 * // v3
 * function MyForm() {
 *   const formik = useFormik({ ... });
 *   return <form>...</form>;
 * }
 * ```
 *
 * connect() → useFormikContext():
 * ```tsx
 * // v2
 * export default connect(MyComponent);
 *
 * // v3
 * function MyComponent() {
 *   const formik = useFormikContext();
 *   return <div>...</div>;
 * }
 * ```
 */
