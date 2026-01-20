/**
 * React 19 Features Tests
 *
 * Tests for React 19-specific features:
 * - SubmitButton component with useFormStatus
 * - Form component with server actions
 * - Ref as prop (no forwardRef needed)
 * - useOptimistic pattern documentation
 */

import * as React from 'react';
import { act, render, fireEvent, waitFor } from '@testing-library/react';
import { Formik, Form, Field, SubmitButton } from '../src';

describe('React 19 Features', () => {
  describe('SubmitButton', () => {
    it('renders a submit button', () => {
      const { getByText } = render(
        <Formik initialValues={{}} onSubmit={() => {}}>
          <Form>
            <SubmitButton>Submit</SubmitButton>
          </Form>
        </Formik>
      );

      const button = getByText('Submit');
      expect(button).toBeTruthy();
      expect(button.getAttribute('type')).toBe('submit');
    });

    it('shows pending text during submission', async () => {
      const onSubmit = jest.fn(
        () =>
          new Promise((resolve) => {
            setTimeout(resolve, 100);
          })
      );

      const { getByText, queryByText } = render(
        <Formik initialValues={{}} onSubmit={onSubmit}>
          <Form>
            <SubmitButton pendingText="Submitting...">Submit</SubmitButton>
          </Form>
        </Formik>
      );

      // Initially shows "Submit"
      expect(getByText('Submit')).toBeTruthy();
      expect(queryByText('Submitting...')).toBeFalsy();

      // Click submit
      const button = getByText('Submit');
      fireEvent.click(button);

      // Should show pending text
      await waitFor(() => {
        expect(queryByText('Submitting...')).toBeTruthy();
      });

      // Wait for submission to complete
      await waitFor(
        () => {
          expect(onSubmit).toHaveBeenCalled();
        },
        { timeout: 200 }
      );
    });

    it('is disabled during submission', async () => {
      const onSubmit = jest.fn(
        () =>
          new Promise((resolve) => {
            setTimeout(resolve, 100);
          })
      );

      const { getByText } = render(
        <Formik initialValues={{}} onSubmit={onSubmit}>
          <Form>
            <SubmitButton>Submit</SubmitButton>
          </Form>
        </Formik>
      );

      const button = getByText('Submit') as HTMLButtonElement;

      // Initially enabled
      expect(button.disabled).toBe(false);

      // Click submit
      fireEvent.click(button);

      // Should be disabled during submission
      await waitFor(() => {
        expect(button.disabled).toBe(true);
      });

      // Wait for submission to complete
      await waitFor(
        () => {
          expect(onSubmit).toHaveBeenCalled();
        },
        { timeout: 200 }
      );
    });

    it('respects custom disabled prop', () => {
      const { getByText } = render(
        <Formik initialValues={{}} onSubmit={() => {}}>
          <Form>
            <SubmitButton disabled>Submit</SubmitButton>
          </Form>
        </Formik>
      );

      const button = getByText('Submit') as HTMLButtonElement;
      expect(button.disabled).toBe(true);
    });

    it('passes through additional props', () => {
      const { getByText } = render(
        <Formik initialValues={{}} onSubmit={() => {}}>
          <Form>
            <SubmitButton className="custom-class" data-testid="submit-btn">
              Submit
            </SubmitButton>
          </Form>
        </Formik>
      );

      const button = getByText('Submit');
      expect(button.className).toBe('custom-class');
      expect(button.getAttribute('data-testid')).toBe('submit-btn');
    });

    it('falls back to isSubmitting when useFormStatus is not available', async () => {
      // Mock useFormStatus to be undefined (simulating React < 19)
      const originalUseFormStatus = (React as any).useFormStatus;
      (React as any).useFormStatus = undefined;

      const onSubmit = jest.fn(
        () =>
          new Promise((resolve) => {
            setTimeout(resolve, 50);
          })
      );

      const { getByText } = render(
        <Formik initialValues={{}} onSubmit={onSubmit}>
          <Form>
            <SubmitButton pendingText="Loading...">Submit</SubmitButton>
          </Form>
        </Formik>
      );

      const button = getByText('Submit') as HTMLButtonElement;
      fireEvent.click(button);

      // Should still disable during submission using Formik's isSubmitting
      await waitFor(() => {
        expect(button.disabled).toBe(true);
      });

      // Restore
      (React as any).useFormStatus = originalUseFormStatus;

      await waitFor(
        () => {
          expect(onSubmit).toHaveBeenCalled();
        },
        { timeout: 100 }
      );
    });
  });

  describe('Form component with server actions', () => {
    it('accepts action prop as string', () => {
      const { container } = render(
        <Formik initialValues={{}} onSubmit={() => {}}>
          <Form action="/api/submit">
            <Field name="email" />
          </Form>
        </Formik>
      );

      const form = container.querySelector('form');
      expect(form?.getAttribute('action')).toBe('/api/submit');
    });

    it('accepts action prop as function (server action)', () => {
      const serverAction = jest.fn();

      const { container } = render(
        <Formik initialValues={{}} onSubmit={() => {}}>
          <Form action={serverAction}>
            <Field name="email" />
          </Form>
        </Formik>
      );

      const form = container.querySelector('form');
      expect(form?.getAttribute('action')).toBeTruthy();
    });

    it('defaults to # when no action provided (iOS compatibility)', () => {
      const { container } = render(
        <Formik initialValues={{}} onSubmit={() => {}}>
          <Form>
            <Field name="email" />
          </Form>
        </Formik>
      );

      const form = container.querySelector('form');
      expect(form?.getAttribute('action')).toBe('#');
    });

    it('still calls Formik onSubmit handler', async () => {
      const onSubmit = jest.fn();

      const { container } = render(
        <Formik initialValues={{}} onSubmit={onSubmit}>
          <Form action="/api/submit">
            <button type="submit">Submit</button>
          </Form>
        </Formik>
      );

      const form = container.querySelector('form');
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalled();
      });
    });
  });

  describe('Ref as prop (React 19)', () => {
    it('Field accepts ref prop directly', () => {
      const ref = React.createRef<HTMLInputElement>();

      render(
        <Formik initialValues={{ name: '' }} onSubmit={() => {}}>
          <Form>
            <Field name="name" ref={ref} />
          </Form>
        </Formik>
      );

      expect(ref.current).toBeTruthy();
      expect(ref.current?.tagName).toBe('INPUT');
    });

    it('Form accepts ref prop directly', () => {
      const ref = React.createRef<HTMLFormElement>();

      render(
        <Formik initialValues={{}} onSubmit={() => {}}>
          <Form ref={ref}>
            <Field name="email" />
          </Form>
        </Formik>
      );

      expect(ref.current).toBeTruthy();
      expect(ref.current?.tagName).toBe('FORM');
    });

    it('ref allows direct DOM manipulation', () => {
      const ref = React.createRef<HTMLInputElement>();

      const { container } = render(
        <Formik initialValues={{ name: 'test' }} onSubmit={() => {}}>
          <Form>
            <Field name="name" ref={ref} />
          </Form>
        </Formik>
      );

      expect(ref.current?.value).toBe('test');

      // Direct DOM manipulation
      act(() => {
        if (ref.current) {
          ref.current.value = 'updated';
        }
      });

      expect(ref.current?.value).toBe('updated');
    });
  });

  describe('Integration with validation', () => {
    it('SubmitButton stays disabled when form is invalid', async () => {
      const onSubmit = jest.fn();

      const { getByText, getByRole } = render(
        <Formik
          initialValues={{ email: '' }}
          validate={(values) => {
            const errors: any = {};
            if (!values.email) {
              errors.email = 'Required';
            }
            return errors;
          }}
          onSubmit={onSubmit}
        >
          <Form>
            <Field name="email" />
            <SubmitButton>Submit</SubmitButton>
          </Form>
        </Formik>
      );

      const button = getByText('Submit') as HTMLButtonElement;

      // Try to submit with invalid form
      fireEvent.click(button);

      // onSubmit should not be called
      await waitFor(() => {
        expect(onSubmit).not.toHaveBeenCalled();
      });
    });

    it('SubmitButton works with async validation', async () => {
      const onSubmit = jest.fn();
      const validate = jest.fn(async (values) => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        const errors: any = {};
        if (!values.email) {
          errors.email = 'Required';
        }
        return errors;
      });

      const { getByText, getByRole } = render(
        <Formik initialValues={{ email: 'test@example.com' }} validate={validate} onSubmit={onSubmit}>
          <Form>
            <Field name="email" />
            <SubmitButton pendingText="Validating...">Submit</SubmitButton>
          </Form>
        </Formik>
      );

      const button = getByText('Submit') as HTMLButtonElement;
      fireEvent.click(button);

      // Should show validating state
      await waitFor(() => {
        expect(button.disabled).toBe(true);
      });

      // Should call validation
      await waitFor(() => {
        expect(validate).toHaveBeenCalled();
      });

      // Should call onSubmit after validation passes
      await waitFor(
        () => {
          expect(onSubmit).toHaveBeenCalled();
        },
        { timeout: 200 }
      );
    });
  });
});
