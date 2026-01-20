import React from 'react';
import * as Yup from 'yup';
import { useFormik } from '../src/formik';
import { Debug } from './Debug';

/**
 * Formik v3: withFormik() HOC removed - use useFormik() hook instead
 *
 * This example demonstrates the modern hook-based approach for Formik v3.
 * The useFormik hook replaces the deprecated withFormik() higher-order component.
 */

function MyForm({ user }) {
  const formik = useFormik({
    initialValues: { email: user?.email || '' },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required!'),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2));
        setSubmitting(false);
      }, 1000);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        placeholder="jane@acme.com"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.email}
      />
      {formik.touched.email && formik.errors.email && (
        <div>{formik.errors.email}</div>
      )}
      <button
        type="button"
        className="outline"
        onClick={formik.handleReset}
        disabled={!formik.dirty || formik.isSubmitting}
      >
        Reset
      </button>
      <button type="submit" disabled={formik.isSubmitting}>
        Submit
      </button>
      <Debug />
    </form>
  );
}

MyForm.displayName = 'MyForm'; // helps with React DevTools

export default MyForm;
