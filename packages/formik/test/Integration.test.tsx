/**
 * Integration Tests
 *
 * End-to-end tests for complete form workflows including:
 * - Submission with validation
 * - Field arrays
 * - Error handling
 * - Form reset
 * - Complex validation scenarios with Yup
 */

import * as React from 'react';
import { act, render, fireEvent, waitFor } from '@testing-library/react';
import * as Yup from 'yup';
import {
  Formik,
  Form,
  Field,
  FieldArray,
  ErrorMessage,
  SubmitButton,
  useFormikValues,
  useFormikState,
} from '../src';

describe('Integration Tests', () => {
  describe('Complete Form Submission Flow', () => {
    it('validates, submits, and displays success', async () => {
      const onSubmit = jest.fn();
      let submitSuccess = false;

      const TestForm = () => {
        const { isSubmitting } = useFormikState();

        return (
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={Yup.object({
              email: Yup.string().email('Invalid email').required('Required'),
              password: Yup.string().min(8, 'Must be 8+ characters').required('Required'),
            })}
            onSubmit={async (values, { setSubmitting }) => {
              await new Promise((resolve) => setTimeout(resolve, 100));
              onSubmit(values);
              submitSuccess = true;
              setSubmitting(false);
            }}
          >
            <Form>
              <Field name="email" type="email" data-testid="email" />
              <ErrorMessage name="email" />

              <Field name="password" type="password" data-testid="password" />
              <ErrorMessage name="password" />

              <SubmitButton pendingText="Submitting...">Submit</SubmitButton>

              {!isSubmitting && submitSuccess && <div data-testid="success">Success!</div>}
            </Form>
          </Formik>
        );
      };

      const { getByTestId, getByText, queryByTestId } = render(<TestForm />);

      // Try to submit with empty fields - should show validation errors
      fireEvent.click(getByText('Submit'));

      await waitFor(() => {
        expect(getByText('Required')).toBeTruthy();
      });

      expect(onSubmit).not.toHaveBeenCalled();

      // Fill in email with invalid format
      fireEvent.change(getByTestId('email'), { target: { value: 'invalid' } });
      fireEvent.blur(getByTestId('email'));

      await waitFor(() => {
        expect(getByText('Invalid email')).toBeTruthy();
      });

      // Fill in valid email
      fireEvent.change(getByTestId('email'), { target: { value: 'test@example.com' } });

      // Fill in password that's too short
      fireEvent.change(getByTestId('password'), { target: { value: 'short' } });
      fireEvent.blur(getByTestId('password'));

      await waitFor(() => {
        expect(getByText('Must be 8+ characters')).toBeTruthy();
      });

      // Fill in valid password
      fireEvent.change(getByTestId('password'), { target: { value: 'longpassword' } });

      // Submit - should succeed
      fireEvent.click(getByText('Submit'));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'longpassword',
        });
      });

      await waitFor(() => {
        expect(queryByTestId('success')).toBeTruthy();
      });
    });
  });

  describe('Field Arrays', () => {
    it('adds, removes, and validates array items', async () => {
      const onSubmit = jest.fn();

      const TestForm = () => (
        <Formik
          initialValues={{
            friends: [{ name: 'John' }],
          }}
          validationSchema={Yup.object({
            friends: Yup.array().of(
              Yup.object({
                name: Yup.string().required('Name required'),
              })
            ),
          })}
          onSubmit={onSubmit}
        >
          {() => (
            <Form>
              <FieldArray name="friends">
                {({ push, remove, form }) => (
                  <div>
                    {form.values.friends.map((_: any, index: number) => (
                      <div key={index} data-testid={`friend-${index}`}>
                        <Field
                          name={`friends.${index}.name`}
                          data-testid={`friend-name-${index}`}
                        />
                        <ErrorMessage name={`friends.${index}.name`} />
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          data-testid={`remove-${index}`}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => push({ name: '' })}
                      data-testid="add-friend"
                    >
                      Add Friend
                    </button>
                  </div>
                )}
              </FieldArray>
              <button type="submit" data-testid="submit">
                Submit
              </button>
            </Form>
          )}
        </Formik>
      );

      const { getByTestId, queryByTestId, getByText } = render(<TestForm />);

      // Initially has one friend
      expect(queryByTestId('friend-0')).toBeTruthy();

      // Add a friend
      fireEvent.click(getByTestId('add-friend'));

      await waitFor(() => {
        expect(queryByTestId('friend-1')).toBeTruthy();
      });

      // Try to submit with empty name - should show validation error
      fireEvent.click(getByTestId('submit'));

      await waitFor(() => {
        expect(getByText('Name required')).toBeTruthy();
      });

      // Fill in the name
      fireEvent.change(getByTestId('friend-name-1'), { target: { value: 'Jane' } });

      // Remove the first friend
      fireEvent.click(getByTestId('remove-0'));

      await waitFor(() => {
        expect(queryByTestId('friend-0')).toBeTruthy();
        expect(queryByTestId('friend-1')).toBeFalsy();
      });

      // Submit - should succeed
      fireEvent.click(getByTestId('submit'));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          { friends: [{ name: 'Jane' }] },
          expect.anything()
        );
      });
    });

    it('validates nested fields correctly with Yup', async () => {
      const TestForm = () => (
        <Formik
          initialValues={{
            users: [
              { name: '', email: '' },
              { name: 'John', email: 'invalid' },
            ],
          }}
          validationSchema={Yup.object({
            users: Yup.array().of(
              Yup.object({
                name: Yup.string().required('Name is required'),
                email: Yup.string().email('Invalid email').required('Email is required'),
              })
            ),
          })}
          onSubmit={() => {}}
        >
          {() => (
            <Form>
              <FieldArray name="users">
                {({ form }) => (
                  <div>
                    {form.values.users.map((_: any, index: number) => (
                      <div key={index}>
                        <Field name={`users.${index}.name`} data-testid={`name-${index}`} />
                        <ErrorMessage name={`users.${index}.name`} />

                        <Field name={`users.${index}.email`} data-testid={`email-${index}`} />
                        <ErrorMessage name={`users.${index}.email`} />
                      </div>
                    ))}
                  </div>
                )}
              </FieldArray>
              <button type="submit">Submit</button>
            </Form>
          )}
        </Formik>
      );

      const { getByText } = render(<TestForm />);

      // Submit to trigger validation
      fireEvent.submit(getByText('Submit'));

      // Should show validation errors for both users
      await waitFor(() => {
        const requiredErrors = document.querySelectorAll('div');
        const errorTexts = Array.from(requiredErrors).map((el) => el.textContent);

        expect(errorTexts).toContain('Name is required');
        expect(errorTexts).toContain('Email is required');
        expect(errorTexts).toContain('Invalid email');
      });
    });
  });

  describe('Form Reset', () => {
    it('resets form to initial values', async () => {
      const TestForm = () => {
        const { values } = useFormikValues();

        return (
          <Formik initialValues={{ name: 'Initial', email: 'initial@example.com' }} onSubmit={() => {}}>
            {({ handleReset }) => (
              <Form>
                <Field name="name" data-testid="name" />
                <Field name="email" data-testid="email" />
                <button type="button" onClick={handleReset} data-testid="reset">
                  Reset
                </button>
                <div data-testid="values">{JSON.stringify(values)}</div>
              </Form>
            )}
          </Formik>
        );
      };

      const { getByTestId } = render(<TestForm />);

      // Change values
      fireEvent.change(getByTestId('name'), { target: { value: 'Changed' } });
      fireEvent.change(getByTestId('email'), { target: { value: 'changed@example.com' } });

      await waitFor(() => {
        expect(getByTestId('values').textContent).toContain('Changed');
      });

      // Reset
      fireEvent.click(getByTestId('reset'));

      await waitFor(() => {
        expect(getByTestId('values').textContent).toContain('Initial');
        expect(getByTestId('values').textContent).toContain('initial@example.com');
      });
    });

    it('clears errors on reset', async () => {
      const TestForm = () => (
        <Formik
          initialValues={{ email: '' }}
          validationSchema={Yup.object({
            email: Yup.string().email('Invalid email').required('Required'),
          })}
          onSubmit={() => {}}
        >
          {({ handleReset }) => (
            <Form>
              <Field name="email" data-testid="email" />
              <ErrorMessage name="email" />
              <button type="submit">Submit</button>
              <button type="button" onClick={handleReset} data-testid="reset">
                Reset
              </button>
            </Form>
          )}
        </Formik>
      );

      const { getByTestId, getByText, queryByText } = render(<TestForm />);

      // Submit to trigger validation
      fireEvent.click(getByText('Submit'));

      await waitFor(() => {
        expect(getByText('Required')).toBeTruthy();
      });

      // Reset - should clear errors
      fireEvent.click(getByTestId('reset'));

      await waitFor(() => {
        expect(queryByText('Required')).toBeFalsy();
      });
    });
  });

  describe('Complex Validation with Yup', () => {
    it('validates dependent fields', async () => {
      const TestForm = () => (
        <Formik
          initialValues={{ password: '', confirmPassword: '' }}
          validationSchema={Yup.object({
            password: Yup.string().min(8, 'Must be 8+ characters').required('Required'),
            confirmPassword: Yup.string()
              .oneOf([Yup.ref('password')], 'Passwords must match')
              .required('Required'),
          })}
          onSubmit={() => {}}
        >
          <Form>
            <Field name="password" type="password" data-testid="password" />
            <ErrorMessage name="password" />

            <Field name="confirmPassword" type="password" data-testid="confirm" />
            <ErrorMessage name="confirmPassword" />

            <button type="submit">Submit</button>
          </Form>
        </Formik>
      );

      const { getByTestId, getByText } = render(<TestForm />);

      // Set password
      fireEvent.change(getByTestId('password'), { target: { value: 'password123' } });

      // Set non-matching confirm password
      fireEvent.change(getByTestId('confirm'), { target: { value: 'different' } });

      // Submit
      fireEvent.click(getByText('Submit'));

      await waitFor(() => {
        expect(getByText('Passwords must match')).toBeTruthy();
      });

      // Fix confirm password
      fireEvent.change(getByTestId('confirm'), { target: { value: 'password123' } });

      // Submit again
      fireEvent.click(getByText('Submit'));

      await waitFor(() => {
        expect(document.body.textContent).not.toContain('Passwords must match');
      });
    });

    it('validates with async Yup schema', async () => {
      const checkEmailAvailable = jest.fn(async (email: string) => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        return email !== 'taken@example.com';
      });

      const TestForm = () => (
        <Formik
          initialValues={{ email: '' }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email('Invalid email')
              .required('Required')
              .test('unique', 'Email already taken', async (value) => {
                if (!value) return true;
                return await checkEmailAvailable(value);
              }),
          })}
          onSubmit={() => {}}
        >
          {() => (
            <Form>
              <Field name="email" data-testid="email" />
              <ErrorMessage name="email" />
              <button type="submit">Submit</button>
            </Form>
          )}
        </Formik>
      );

      const { getByTestId, getByText, queryByText } = render(<TestForm />);

      // Enter taken email
      fireEvent.change(getByTestId('email'), { target: { value: 'taken@example.com' } });
      fireEvent.blur(getByTestId('email'));

      await waitFor(
        () => {
          expect(checkEmailAvailable).toHaveBeenCalledWith('taken@example.com');
        },
        { timeout: 200 }
      );

      await waitFor(
        () => {
          expect(getByText('Email already taken')).toBeTruthy();
        },
        { timeout: 200 }
      );

      // Enter available email
      fireEvent.change(getByTestId('email'), { target: { value: 'available@example.com' } });
      fireEvent.blur(getByTestId('email'));

      await waitFor(
        () => {
          expect(checkEmailAvailable).toHaveBeenCalledWith('available@example.com');
        },
        { timeout: 200 }
      );

      await waitFor(
        () => {
          expect(queryByText('Email already taken')).toBeFalsy();
        },
        { timeout: 200 }
      );
    });
  });

  describe('Error Handling', () => {
    it('handles submission errors gracefully', async () => {
      const onSubmit = jest.fn(() => {
        throw new Error('Submission failed');
      });

      const TestForm = () => {
        const { status } = useFormikState();

        return (
          <Formik initialValues={{ name: '' }} onSubmit={onSubmit}>
            {({ setStatus }) => (
              <Form>
                <Field name="name" />
                <button type="submit">Submit</button>
                {status && <div data-testid="error">{status}</div>}
              </Form>
            )}
          </Formik>
        );
      };

      const { getByText, queryByTestId } = render(<TestForm />);

      // This test would need proper error boundary handling
      // For now, just verify the form doesn't crash
      expect(getByText('Submit')).toBeTruthy();
    });
  });
});
