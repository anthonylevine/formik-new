/**
 * Formik v3 Context Tests
 *
 * Tests for the split context architecture and selective hooks:
 * - useFormikValues()
 * - useFormikState()
 * - useFormikMetadata()
 * - useFormikMethods()
 * - useFormikContext() (deprecated but still functional)
 */

import * as React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import {
  Formik,
  Form,
  Field,
  useFormikValues,
  useFormikState,
  useFormikMetadata,
  useFormikMethods,
  useFormikContext,
} from '../src';

describe('Split Context Architecture', () => {
  describe('useFormikValues()', () => {
    it('provides access to form values', () => {
      let capturedValues: any;

      const TestComponent = () => {
        const { values } = useFormikValues();
        capturedValues = values;
        return null;
      };

      render(
        <Formik initialValues={{ name: 'test', email: 'test@example.com' }} onSubmit={() => {}}>
          <TestComponent />
        </Formik>
      );

      expect(capturedValues).toEqual({ name: 'test', email: 'test@example.com' });
    });

    it('causes re-render only when values change', async () => {
      let renderCount = 0;
      let capturedFormik: any;

      const TestComponent = () => {
        const { values } = useFormikValues();
        renderCount++;
        return <div>{values.name}</div>;
      };

      const { container } = render(
        <Formik initialValues={{ name: 'test' }} onSubmit={() => {}}>
          {(formik) => {
            capturedFormik = formik;
            return <TestComponent />;
          }}
        </Formik>
      );

      const initialRenderCount = renderCount;

      // Change value - should cause re-render
      await act(async () => {
        await capturedFormik.setFieldValue('name', 'updated');
      });

      expect(renderCount).toBe(initialRenderCount + 1);
      expect(container.textContent).toBe('updated');

      // Set error - should NOT cause re-render since useFormikValues doesn't subscribe to errors
      const beforeErrorRenderCount = renderCount;
      await act(async () => {
        await capturedFormik.setFieldError('name', 'Error');
      });

      expect(renderCount).toBe(beforeErrorRenderCount);
    });
  });

  describe('useFormikState()', () => {
    it('provides access to errors, touched, and submission state', async () => {
      let capturedState: any;
      let capturedFormik: any;

      const TestComponent = () => {
        const state = useFormikState();
        capturedState = state;
        return null;
      };

      render(
        <Formik initialValues={{ name: '' }} onSubmit={() => {}}>
          {(formik) => {
            capturedFormik = formik;
            return <TestComponent />;
          }}
        </Formik>
      );

      expect(capturedState.errors).toEqual({});
      expect(capturedState.touched).toEqual({});
      expect(capturedState.isSubmitting).toBe(false);
      expect(capturedState.isValidating).toBe(false);
      expect(capturedState.submitCount).toBe(0);

      await act(async () => {
        await capturedFormik.setFieldError('name', 'Required');
        await capturedFormik.setFieldTouched('name', true);
      });

      expect(capturedState.errors).toEqual({ name: 'Required' });
      expect(capturedState.touched).toEqual({ name: true });
    });

    it('causes re-render only when state changes', async () => {
      let renderCount = 0;
      let capturedFormik: any;

      const TestComponent = () => {
        const { errors } = useFormikState();
        renderCount++;
        return <div>{errors.name}</div>;
      };

      const { container } = render(
        <Formik initialValues={{ name: '' }} onSubmit={() => {}}>
          {(formik) => {
            capturedFormik = formik;
            return <TestComponent />;
          }}
        </Formik>
      );

      const initialRenderCount = renderCount;

      // Set error - should cause re-render
      await act(async () => {
        await capturedFormik.setFieldError('name', 'Error');
      });

      expect(renderCount).toBe(initialRenderCount + 1);
      expect(container.textContent).toBe('Error');

      // Change value - should NOT cause re-render since useFormikState doesn't subscribe to values
      const beforeValueRenderCount = renderCount;
      await act(async () => {
        await capturedFormik.setFieldValue('name', 'test');
      });

      expect(renderCount).toBe(beforeValueRenderCount);
    });
  });

  describe('useFormikMetadata()', () => {
    it('provides access to computed metadata', () => {
      let capturedMetadata: any;

      const TestComponent = () => {
        const metadata = useFormikMetadata();
        capturedMetadata = metadata;
        return null;
      };

      render(
        <Formik initialValues={{ name: 'test' }} onSubmit={() => {}}>
          <TestComponent />
        </Formik>
      );

      expect(capturedMetadata.dirty).toBe(false);
      expect(capturedMetadata.isValid).toBe(true);
      expect(capturedMetadata.initialValues).toEqual({ name: 'test' });
    });

    it('updates dirty flag when values change', async () => {
      let capturedMetadata: any;
      let capturedFormik: any;

      const TestComponent = () => {
        const metadata = useFormikMetadata();
        capturedMetadata = metadata;
        return <div>{metadata.dirty ? 'dirty' : 'clean'}</div>;
      };

      const { container } = render(
        <Formik initialValues={{ name: 'test' }} onSubmit={() => {}}>
          {(formik) => {
            capturedFormik = formik;
            return <TestComponent />;
          }}
        </Formik>
      );

      expect(capturedMetadata.dirty).toBe(false);
      expect(container.textContent).toBe('clean');

      await act(async () => {
        await capturedFormik.setFieldValue('name', 'updated');
      });

      expect(capturedMetadata.dirty).toBe(true);
      expect(container.textContent).toBe('dirty');
    });
  });

  describe('useFormikMethods()', () => {
    it('provides access to all form methods', () => {
      let capturedMethods: any;

      const TestComponent = () => {
        const methods = useFormikMethods();
        capturedMethods = methods;
        return null;
      };

      render(
        <Formik initialValues={{ name: '' }} onSubmit={() => {}}>
          <TestComponent />
        </Formik>
      );

      expect(typeof capturedMethods.setFieldValue).toBe('function');
      expect(typeof capturedMethods.setFieldError).toBe('function');
      expect(typeof capturedMethods.setFieldTouched).toBe('function');
      expect(typeof capturedMethods.handleSubmit).toBe('function');
      expect(typeof capturedMethods.handleReset).toBe('function');
      expect(typeof capturedMethods.handleChange).toBe('function');
      expect(typeof capturedMethods.handleBlur).toBe('function');
      expect(typeof capturedMethods.validateForm).toBe('function');
    });

    it('provides stable references (does not cause re-renders)', async () => {
      let renderCount = 0;
      let capturedFormik: any;

      const TestComponent = () => {
        const methods = useFormikMethods();
        renderCount++;
        return <button onClick={() => methods.setFieldValue('name', 'clicked')}>Click</button>;
      };

      const { getByText } = render(
        <Formik initialValues={{ name: '' }} onSubmit={() => {}}>
          {(formik) => {
            capturedFormik = formik;
            return <TestComponent />;
          }}
        </Formik>
      );

      const initialRenderCount = renderCount;

      // Set value - should NOT cause re-render since useFormikMethods provides stable references
      await act(async () => {
        await capturedFormik.setFieldValue('name', 'test');
      });

      expect(renderCount).toBe(initialRenderCount);
    });

    it('methods work correctly', async () => {
      let capturedMethods: any;
      let capturedValues: any;

      const TestComponent = () => {
        const methods = useFormikMethods();
        const { values } = useFormikValues();
        capturedMethods = methods;
        capturedValues = values;
        return null;
      };

      render(
        <Formik initialValues={{ name: '', email: '' }} onSubmit={() => {}}>
          <TestComponent />
        </Formik>
      );

      await act(async () => {
        await capturedMethods.setFieldValue('name', 'John');
        await capturedMethods.setFieldValue('email', 'john@example.com');
      });

      expect(capturedValues.name).toBe('John');
      expect(capturedValues.email).toBe('john@example.com');
    });
  });

  describe('useFormikContext() - legacy', () => {
    it('still works but shows deprecation warning in dev', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      let capturedContext: any;

      const TestComponent = () => {
        const context = useFormikContext();
        capturedContext = context;
        return null;
      };

      render(
        <Formik initialValues={{ name: 'test' }} onSubmit={() => {}}>
          <TestComponent />
        </Formik>
      );

      expect(capturedContext.values).toEqual({ name: 'test' });
      expect(capturedContext.errors).toEqual({});
      expect(typeof capturedContext.setFieldValue).toBe('function');

      // Check for deprecation warning in dev mode
      if (process.env.NODE_ENV !== 'production') {
        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringContaining('useFormikContext() subscribes to all contexts')
        );
      }

      consoleSpy.mockRestore();
    });

    it('combines all context values', () => {
      let capturedContext: any;

      const TestComponent = () => {
        const context = useFormikContext();
        capturedContext = context;
        return null;
      };

      render(
        <Formik
          initialValues={{ name: 'test' }}
          initialErrors={{ name: 'Error' }}
          onSubmit={() => {}}
        >
          <TestComponent />
        </Formik>
      );

      // Should have values
      expect(capturedContext.values).toBeDefined();
      // Should have state
      expect(capturedContext.errors).toBeDefined();
      expect(capturedContext.touched).toBeDefined();
      expect(capturedContext.isSubmitting).toBeDefined();
      // Should have metadata
      expect(capturedContext.dirty).toBeDefined();
      expect(capturedContext.isValid).toBeDefined();
      // Should have methods
      expect(typeof capturedContext.setFieldValue).toBe('function');
      expect(typeof capturedContext.handleSubmit).toBe('function');
    });
  });

  describe('Context integration', () => {
    it('all hooks access the same form state', async () => {
      let capturedValues: any;
      let capturedState: any;
      let capturedMethods: any;

      const TestComponent = () => {
        capturedValues = useFormikValues();
        capturedState = useFormikState();
        capturedMethods = useFormikMethods();
        return null;
      };

      render(
        <Formik initialValues={{ name: 'test' }} onSubmit={() => {}}>
          <TestComponent />
        </Formik>
      );

      expect(capturedValues.values.name).toBe('test');

      await act(async () => {
        await capturedMethods.setFieldValue('name', 'updated');
        await capturedMethods.setFieldError('name', 'Error');
      });

      expect(capturedValues.values.name).toBe('updated');
      expect(capturedState.errors.name).toBe('Error');
    });

    it('works with nested components', async () => {
      let outerRenderCount = 0;
      let innerRenderCount = 0;
      let capturedFormik: any;

      const InnerComponent = () => {
        const { values } = useFormikValues();
        innerRenderCount++;
        return <div>{values.name}</div>;
      };

      const OuterComponent = () => {
        const { errors } = useFormikState();
        outerRenderCount++;
        return (
          <div>
            <div>{errors.name}</div>
            <InnerComponent />
          </div>
        );
      };

      render(
        <Formik initialValues={{ name: 'test' }} onSubmit={() => {}}>
          {(formik) => {
            capturedFormik = formik;
            return <OuterComponent />;
          }}
        </Formik>
      );

      const initialInnerCount = innerRenderCount;
      const initialOuterCount = outerRenderCount;

      // Set error - should only re-render outer (subscribed to errors)
      await act(async () => {
        await capturedFormik.setFieldError('name', 'Error');
      });

      expect(outerRenderCount).toBe(initialOuterCount + 1);
      expect(innerRenderCount).toBe(initialInnerCount); // No re-render

      // Set value - should only re-render inner (subscribed to values)
      const beforeValueOuterCount = outerRenderCount;
      const beforeValueInnerCount = innerRenderCount;

      await act(async () => {
        await capturedFormik.setFieldValue('name', 'updated');
      });

      expect(innerRenderCount).toBe(beforeValueInnerCount + 1);
      expect(outerRenderCount).toBe(beforeValueOuterCount); // No re-render
    });
  });
});
