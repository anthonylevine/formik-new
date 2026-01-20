import * as React from 'react';
import { act, render } from '@testing-library/react';
import { Formik, FormikProps, ErrorMessage } from '../src';
import { noop } from './testHelpers';

interface TestFormValues {
  name: string;
  email: string;
}

const TestForm: React.FC<any> = p => (
  <Formik
    onSubmit={noop}
    initialValues={{ name: 'jared', email: 'hello@reason.nyc' }}
    {...p}
  />
);

describe('<ErrorMessage />', () => {
  it('renders with children as a function', async () => {
    let actual: any; /** ErrorMessage ;) */
    let actualFProps: any;
    let message = 'Wrong';
    render(
      <TestForm>
        {(fProps: FormikProps<TestFormValues>) => {
          actualFProps = fProps;
          return (
            <div>
              <ErrorMessage name="email">
                {props => (actual = props) || <div>{props}</div>}
              </ErrorMessage>
            </div>
          );
        }}
      </TestForm>
    );

    await act(async () => {
      await actualFProps.setFieldError('email', message);
    });

    // Only renders if Field has been visited.
    expect(actual).toEqual(undefined);

    await act(async () => {
      await actualFProps.setFieldTouched('email');
      await actualFProps.setFieldError('email', message);
    });

    // Renders after being visited with an error.
    expect(actual).toEqual(message);
  });

  it('does not render when field is not touched', async () => {
    let actualFProps: any;
    const { container } = render(
      <TestForm>
        {(fProps: FormikProps<TestFormValues>) => {
          actualFProps = fProps;
          return (
            <div>
              <ErrorMessage name="email" />
            </div>
          );
        }}
      </TestForm>
    );

    await act(async () => {
      await actualFProps.setFieldError('email', 'Error message');
    });

    expect(container.textContent).toBe('');
  });

  it('renders error message when field is touched and has error', async () => {
    let actualFProps: any;
    const { container } = render(
      <TestForm>
        {(fProps: FormikProps<TestFormValues>) => {
          actualFProps = fProps;
          return (
            <div>
              <ErrorMessage name="email" />
            </div>
          );
        }}
      </TestForm>
    );

    await act(async () => {
      await actualFProps.setFieldTouched('email', true);
      await actualFProps.setFieldError('email', 'Invalid email');
    });

    expect(container.textContent).toBe('Invalid email');
  });

  it('renders with custom component', async () => {
    let actualFProps: any;
    const CustomError = ({ children }: any) => <span className="error">{children}</span>;
    const { container } = render(
      <TestForm>
        {(fProps: FormikProps<TestFormValues>) => {
          actualFProps = fProps;
          return (
            <div>
              <ErrorMessage name="email" component={CustomError} />
            </div>
          );
        }}
      </TestForm>
    );

    await act(async () => {
      await actualFProps.setFieldTouched('email', true);
      await actualFProps.setFieldError('email', 'Custom error');
    });

    expect(container.querySelector('.error')).toBeTruthy();
    expect(container.textContent).toBe('Custom error');
  });
});
