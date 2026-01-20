import * as React from 'react';
import isEqual from 'react-fast-compare';
import { FormikProps, FormikState } from './types';
import {
  getIn,
  isEmptyArray,
  isFunction,
  isObject,
  setIn,
} from './utils';
import { useFormikValues, useFormikMethods } from './FormikContext';

export type FieldArrayRenderProps = ArrayHelpers & {
  form: FormikProps<any>;
  name: string;
};

export type FieldArrayConfig = {
  /** Really the path to the array field to be updated */
  name: string;
  /** Should field array validate the form AFTER array updates/changes? */
  validateOnChange?: boolean;
  children: (arrayHelpers: FieldArrayRenderProps) => React.ReactNode;
};

export interface ArrayHelpers<T extends any[] = any[]> {
  /** Imperatively add a value to the end of an array */
  push<X extends T[number] = T[number]>(obj: X): void;
  /** Curried fn to add a value to the end of an array */
  handlePush<X extends T[number] = T[number]>(obj: X): () => void;
  /** Imperatively swap two values in an array */
  swap: (indexA: number, indexB: number) => void;
  /** Curried fn to swap two values in an array */
  handleSwap: (indexA: number, indexB: number) => () => void;
  /** Imperatively move an element in an array to another index */
  move: (from: number, to: number) => void;
  /** Imperatively move an element in an array to another index */
  handleMove: (from: number, to: number) => () => void;
  /** Imperatively insert an element at a given index into the array */
  insert<X extends T[number] = T[number]>(index: number, value: X): void;
  /** Curried fn to insert an element at a given index into the array */
  handleInsert<X extends T[number] = T[number]>(index: number, value: X): () => void;
  /** Imperatively replace a value at an index of an array  */
  replace<X extends T[number] = T[number]>(index: number, value: X): void;
  /** Curried fn to replace an element at a given index into the array */
  handleReplace<X extends T[number] = T[number]>(index: number, value: X): () => void;
  /** Imperatively add an element to the beginning of an array and return its length */
  unshift<X extends T[number] = T[number]>(value: X): number;
  /** Curried fn to add an element to the beginning of an array */
  handleUnshift<X extends T[number] = T[number]>(value: X): () => void;
  /** Curried fn to remove an element at an index of an array */
  handleRemove: (index: number) => () => void;
  /** Curried fn to remove a value from the end of the array */
  handlePop: () => () => void;
  /** Imperatively remove and element at an index of an array */
  remove<X extends T[number] = T[number]>(index: number): X | undefined;
  /** Imperatively remove and return value from the end of the array */
  pop<X extends T[number] = T[number]>(): X | undefined;
}

/**
 * Array helper functions
 */
export const move = <T,>(array: T[], from: number, to: number) => {
  const copy = copyArrayLike(array);
  const value = copy[from];
  copy.splice(from, 1);
  copy.splice(to, 0, value);
  return copy;
};

export const swap = <T,>(
  arrayLike: ArrayLike<T>,
  indexA: number,
  indexB: number
) => {
  const copy = copyArrayLike(arrayLike);
  const a = copy[indexA];
  copy[indexA] = copy[indexB];
  copy[indexB] = a;
  return copy;
};

export const insert = <T,>(
  arrayLike: ArrayLike<T>,
  index: number,
  value: T
) => {
  const copy = copyArrayLike(arrayLike);
  copy.splice(index, 0, value);
  return copy;
};

export const replace = <T,>(
  arrayLike: ArrayLike<T>,
  index: number,
  value: T
) => {
  const copy = copyArrayLike(arrayLike);
  copy[index] = value;
  return copy;
};

const copyArrayLike = (arrayLike: ArrayLike<any>) => {
  if (!arrayLike) {
    return [];
  } else if (Array.isArray(arrayLike)) {
    return [...arrayLike];
  } else {
    const maxIndex = Object.keys(arrayLike)
      .map(key => parseInt(key))
      .reduce((max, el) => (el > max ? el : max), 0);
    return Array.from({ ...arrayLike, length: maxIndex + 1 });
  }
};

const createAlterationHandler = (
  alteration: boolean | Function,
  defaultFunction: Function
) => {
  const fn = typeof alteration === 'function' ? alteration : defaultFunction;

  return (data: any | any[]) => {
    if (Array.isArray(data) || isObject(data)) {
      const clone = copyArrayLike(data);
      return fn(clone);
    }
    return data;
  };
};

/**
 * FieldArray - A component for managing arrays of fields in Formik.
 *
 * Provides array helper methods (push, pop, swap, move, insert, replace, unshift, remove)
 * and automatically updates values, errors, and touched states.
 *
 * @example
 * <FieldArray name="friends">
 *   {({ push, remove, form }) => (
 *     <div>
 *       {form.values.friends.map((friend, index) => (
 *         <div key={index}>
 *           <Field name={`friends.${index}.name`} />
 *           <button type="button" onClick={() => remove(index)}>X</button>
 *         </div>
 *       ))}
 *       <button type="button" onClick={() => push({ name: '' })}>Add Friend</button>
 *     </div>
 *   )}
 * </FieldArray>
 */
export const FieldArray = React.memo<FieldArrayConfig>(
  function FieldArray({ name, validateOnChange = true, children }) {
    const { values } = useFormikValues();
    const methods = useFormikMethods();

    const arrayValue = React.useMemo(
      () => getIn(values, name),
      [values, name]
    );

    // Track previous array value for validation on change
    const prevArrayValueRef = React.useRef(arrayValue);

    // Validate form when array changes (if validateOnChange is true)
    React.useEffect(() => {
      if (
        validateOnChange &&
        !isEqual(prevArrayValueRef.current, arrayValue)
      ) {
        methods.validateForm(values);
      }
      prevArrayValueRef.current = arrayValue;
    }, [arrayValue, validateOnChange, methods, values]);

    // Core update function for array operations
    const updateArrayField = React.useCallback(
      (
        fn: Function,
        alterTouched: boolean | Function,
        alterErrors: boolean | Function
      ) => {
        methods.setFormikState((prevState: FormikState<any>) => {
          let updateErrors = createAlterationHandler(alterErrors, fn);
          let updateTouched = createAlterationHandler(alterTouched, fn);

          // Execute values fn first
          let newValues = setIn(
            prevState.values,
            name,
            fn(getIn(prevState.values, name))
          );

          let fieldError = alterErrors
            ? updateErrors(getIn(prevState.errors, name))
            : undefined;
          let fieldTouched = alterTouched
            ? updateTouched(getIn(prevState.touched, name))
            : undefined;

          if (isEmptyArray(fieldError)) {
            fieldError = undefined;
          }
          if (isEmptyArray(fieldTouched)) {
            fieldTouched = undefined;
          }

          return {
            ...prevState,
            values: newValues,
            errors: alterErrors
              ? setIn(prevState.errors, name, fieldError)
              : prevState.errors,
            touched: alterTouched
              ? setIn(prevState.touched, name, fieldTouched)
              : prevState.touched,
          };
        });
      },
      [name, methods]
    );

    // Array helper methods
    const arrayHelpers: ArrayHelpers = React.useMemo(
      () => ({
        push: (value: any) => {
          updateArrayField(
            (arrayLike: ArrayLike<any>) => [
              ...copyArrayLike(arrayLike),
              structuredClone(value),
            ],
            false,
            false
          );
        },
        handlePush: (value: any) => () => {
          updateArrayField(
            (arrayLike: ArrayLike<any>) => [
              ...copyArrayLike(arrayLike),
              structuredClone(value),
            ],
            false,
            false
          );
        },
        swap: (indexA: number, indexB: number) => {
          updateArrayField(
            (array: any[]) => swap(array, indexA, indexB),
            true,
            true
          );
        },
        handleSwap: (indexA: number, indexB: number) => () => {
          updateArrayField(
            (array: any[]) => swap(array, indexA, indexB),
            true,
            true
          );
        },
        move: (from: number, to: number) => {
          updateArrayField((array: any[]) => move(array, from, to), true, true);
        },
        handleMove: (from: number, to: number) => () => {
          updateArrayField((array: any[]) => move(array, from, to), true, true);
        },
        insert: (index: number, value: any) => {
          updateArrayField(
            (array: any[]) => insert(array, index, value),
            (array: any[]) => insert(array, index, null),
            (array: any[]) => insert(array, index, null)
          );
        },
        handleInsert: (index: number, value: any) => () => {
          updateArrayField(
            (array: any[]) => insert(array, index, value),
            (array: any[]) => insert(array, index, null),
            (array: any[]) => insert(array, index, null)
          );
        },
        replace: (index: number, value: any) => {
          updateArrayField(
            (array: any[]) => replace(array, index, value),
            false,
            false
          );
        },
        handleReplace: (index: number, value: any) => () => {
          updateArrayField(
            (array: any[]) => replace(array, index, value),
            false,
            false
          );
        },
        unshift: (value: any) => {
          let length = -1;
          updateArrayField(
            (array: any[]) => {
              const arr = array ? [value, ...array] : [value];
              length = arr.length;
              return arr;
            },
            (array: any[]) => (array ? [null, ...array] : [null]),
            (array: any[]) => (array ? [null, ...array] : [null])
          );
          return length;
        },
        handleUnshift: (value: any) => () => {
          updateArrayField(
            (array: any[]) => (array ? [value, ...array] : [value]),
            (array: any[]) => (array ? [null, ...array] : [null]),
            (array: any[]) => (array ? [null, ...array] : [null])
          );
        },
        remove: (index: number) => {
          let result: any;
          updateArrayField(
            (array?: any[]) => {
              const copy = array ? copyArrayLike(array) : [];
              if (!result) {
                result = copy[index];
              }
              if (isFunction(copy.splice)) {
                copy.splice(index, 1);
              }
              return isFunction(copy.every)
                ? copy.every(v => v === undefined)
                  ? []
                  : copy
                : copy;
            },
            true,
            true
          );
          return result;
        },
        handleRemove: (index: number) => () => {
          updateArrayField(
            (array?: any[]) => {
              const copy = array ? copyArrayLike(array) : [];
              if (isFunction(copy.splice)) {
                copy.splice(index, 1);
              }
              return isFunction(copy.every)
                ? copy.every(v => v === undefined)
                  ? []
                  : copy
                : copy;
            },
            true,
            true
          );
        },
        pop: () => {
          let result: any;
          updateArrayField(
            (array: any[]) => {
              const tmp = array.slice();
              if (!result) {
                result = tmp && tmp.pop && tmp.pop();
              }
              return tmp;
            },
            true,
            true
          );
          return result;
        },
        handlePop: () => () => {
          updateArrayField(
            (array: any[]) => {
              const tmp = array.slice();
              tmp && tmp.pop && tmp.pop();
              return tmp;
            },
            true,
            true
          );
        },
      }),
      [updateArrayField]
    );

    // Build render props
    const renderProps: FieldArrayRenderProps = React.useMemo(
      () => ({
        ...arrayHelpers,
        form: methods as FormikProps<any>,
        name,
      }),
      [arrayHelpers, methods, name]
    );

    // Render with children function
    if (isFunction(children)) {
      return children(renderProps) as React.ReactElement;
    }

    return null;
  }
);

FieldArray.displayName = 'FieldArray';
