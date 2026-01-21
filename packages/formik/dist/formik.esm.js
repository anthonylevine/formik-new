import deepmerge from 'deepmerge';
import { useMemo, createElement, useContext, Fragment, createContext, Children, useRef, useEffect, useState, useCallback, useImperativeHandle, useLayoutEffect, memo, useFormStatus } from 'react';
import isEqual from 'react-fast-compare';
import invariant from 'tiny-warning';
import clone$1 from 'lodash-es/clone';
import toPath from 'lodash-es/toPath';

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      return function () {
        if (i >= o.length) return {
          done: true
        };
        return {
          done: false,
          value: o[i++]
        };
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  it = o[Symbol.iterator]();
  return it.next.bind(it);
}

// Context Creation
// =====================================================================

var FormikValuesContext = /*#__PURE__*/createContext(undefined);
var FormikStateContext = /*#__PURE__*/createContext(undefined);
var FormikMetadataContext = /*#__PURE__*/createContext(undefined);
var FormikMethodsContext = /*#__PURE__*/createContext(undefined);
FormikValuesContext.displayName = 'FormikValuesContext';
FormikStateContext.displayName = 'FormikStateContext';
FormikMetadataContext.displayName = 'FormikMetadataContext';
FormikMethodsContext.displayName = 'FormikMethodsContext';
/**
 * FormikProvider wraps your form and provides Formik context to all child components.
 * In v3, it automatically splits the context into 4 optimized contexts.
 */

function FormikProvider(_ref) {
  var value = _ref.value,
      children = _ref.children;
  // Split the monolithic context into 4 optimized slices
  var valuesContext = useMemo(function () {
    return {
      values: value.values
    };
  }, [value.values]);
  var stateContext = useMemo(function () {
    return {
      errors: value.errors,
      touched: value.touched,
      isSubmitting: value.isSubmitting,
      isValidating: value.isValidating,
      status: value.status,
      submitCount: value.submitCount
    };
  }, [value.errors, value.touched, value.isSubmitting, value.isValidating, value.status, value.submitCount]);
  var metadataContext = useMemo(function () {
    return {
      dirty: value.dirty,
      isValid: value.isValid,
      initialValues: value.initialValues,
      initialErrors: value.initialErrors,
      initialTouched: value.initialTouched,
      initialStatus: value.initialStatus
    };
  }, [value.dirty, value.isValid, value.initialValues, value.initialErrors, value.initialTouched, value.initialStatus]); // Methods context is stable - handlers don't change reference

  var methodsContext = useMemo(function () {
    return {
      registerField: value.registerField,
      unregisterField: value.unregisterField,
      getFieldProps: value.getFieldProps,
      getFieldMeta: value.getFieldMeta,
      getFieldHelpers: value.getFieldHelpers,
      handleBlur: value.handleBlur,
      handleChange: value.handleChange,
      handleReset: value.handleReset,
      handleSubmit: value.handleSubmit,
      resetForm: value.resetForm,
      submitForm: value.submitForm,
      validateForm: value.validateForm,
      validateField: value.validateField,
      setErrors: value.setErrors,
      setFieldError: value.setFieldError,
      setFieldTouched: value.setFieldTouched,
      setFieldValue: value.setFieldValue,
      setStatus: value.setStatus,
      setSubmitting: value.setSubmitting,
      setTouched: value.setTouched,
      setValues: value.setValues,
      setFormikState: value.setFormikState,
      validate: value.validate,
      validationSchema: value.validationSchema
    };
  }, [value.registerField, value.unregisterField, value.getFieldProps, value.getFieldMeta, value.getFieldHelpers, value.handleBlur, value.handleChange, value.handleReset, value.handleSubmit, value.resetForm, value.submitForm, value.validateForm, value.validateField, value.setErrors, value.setFieldError, value.setFieldTouched, value.setFieldValue, value.setStatus, value.setSubmitting, value.setTouched, value.setValues, value.setFormikState, value.validate, value.validationSchema]);
  return createElement(FormikMethodsContext.Provider, {
    value: methodsContext
  }, createElement(FormikMetadataContext.Provider, {
    value: metadataContext
  }, createElement(FormikStateContext.Provider, {
    value: stateContext
  }, createElement(FormikValuesContext.Provider, {
    value: valuesContext
  }, children))));
} // =====================================================================
// Selective Hooks (Recommended for v3)
// =====================================================================

/**
 * Subscribe to form values only. Component only re-renders when values change.
 * @example
 * const { values } = useFormikValues();
 */

function useFormikValues() {
  var context = useContext(FormikValuesContext);
  !(context !== undefined) ? process.env.NODE_ENV !== "production" ? invariant(false, 'useFormikValues must be used within a <Formik> component') : invariant(false) : void 0;
  return context;
}
/**
 * Subscribe to form state (errors, touched, isSubmitting, etc.).
 * Component only re-renders when state changes.
 * @example
 * const { errors, touched, isSubmitting } = useFormikState();
 */

function useFormikState() {
  var context = useContext(FormikStateContext);
  !(context !== undefined) ? process.env.NODE_ENV !== "production" ? invariant(false, 'useFormikState must be used within a <Formik> component') : invariant(false) : void 0;
  return context;
}
/**
 * Subscribe to form metadata (dirty, isValid, initialValues).
 * Component rarely re-renders as metadata changes infrequently.
 * @example
 * const { dirty, isValid } = useFormikMetadata();
 */

function useFormikMetadata() {
  var context = useContext(FormikMetadataContext);
  !(context !== undefined) ? process.env.NODE_ENV !== "production" ? invariant(false, 'useFormikMetadata must be used within a <Formik> component') : invariant(false) : void 0;
  return context;
}
/**
 * Get stable handler and helper references. Never causes re-renders.
 * @example
 * const { setFieldValue, handleSubmit } = useFormikMethods();
 *
 * @example
 * // React 19: Optimistic updates
 * const { values } = useFormikValues();
 * const { setFieldValue } = useFormikMethods();
 * const [optimisticValues, setOptimisticValues] = React.useOptimistic?.(
 *   values,
 *   (state, newValue) => ({ ...state, ...newValue })
 * ) ?? [values, () => {}];
 *
 * const handleOptimisticUpdate = (field: string, value: any) => {
 *   // Show optimistic update immediately
 *   setOptimisticValues({ [field]: value });
 *   // Then update real state
 *   setFieldValue(field, value);
 * };
 */

function useFormikMethods() {
  var context = useContext(FormikMethodsContext);
  !(context !== undefined) ? process.env.NODE_ENV !== "production" ? invariant(false, 'useFormikMethods must be used within a <Formik> component') : invariant(false) : void 0;
  return context;
} // =====================================================================
// Legacy Hook (For Backwards Compatibility)
// =====================================================================

/**
 * Get the entire Formik context (all contexts combined).
 *
 * ⚠️ PERFORMANCE WARNING: This hook subscribes to ALL contexts, causing
 * re-renders whenever ANY part of the form changes. For better performance,
 * use selective hooks instead:
 * - useFormikValues() - for form values
 * - useFormikState() - for errors, touched, isSubmitting
 * - useFormikMetadata() - for dirty, isValid
 * - useFormikMethods() - for handlers (doesn't cause re-renders)
 *
 * @deprecated Use selective hooks for better performance
 * @example
 * // Instead of:
 * const formik = useFormikContext();
 *
 * // Do this:
 * const { values } = useFormikValues();
 * const { errors } = useFormikState();
 * const { setFieldValue } = useFormikMethods();
 */

function useFormikContext() {
  var values = useFormikValues();
  var state = useFormikState();
  var metadata = useFormikMetadata();
  var methods = useFormikMethods();

  if (process.env.NODE_ENV !== "production") {
    console.warn('Formik v3: useFormikContext() subscribes to all contexts and may cause unnecessary re-renders. ' + 'Consider using selective hooks (useFormikValues, useFormikState, useFormikMetadata, useFormikMethods) for better performance.');
  } // Combine all contexts into the legacy format


  return useMemo(function () {
    return _extends({}, values, state, metadata, methods);
  }, [values, state, metadata, methods]);
} // =====================================================================
// Legacy Exports (For Backwards Compatibility)
// =====================================================================

/**
 * @deprecated Use useFormikContext() hook or selective hooks instead
 *
 * Legacy consumer that combines all contexts for backwards compatibility.
 * This is used by the deprecated connect() HOC.
 */

var FormikConsumer = function FormikConsumer(_ref2) {
  var children = _ref2.children;
  var context = useFormikContext();
  return createElement(Fragment, null, children(context));
};
/**
 * Legacy context - not recommended for use in v3
 * @deprecated Internal use only
 */

var FormikContext = FormikValuesContext;

/** @private is the value an empty array? */

var isEmptyArray = function isEmptyArray(value) {
  return Array.isArray(value) && value.length === 0;
};
/** @private is the given object a Function? */

var isFunction = function isFunction(obj) {
  return typeof obj === 'function';
};
/** @private is the given object an Object? */

var isObject = function isObject(obj) {
  return obj !== null && typeof obj === 'object';
};
/** @private is the given object an integer? */

var isInteger = function isInteger(obj) {
  return String(Math.floor(Number(obj))) === obj;
};
/** @private is the given object a string? */

var isString = function isString(obj) {
  return Object.prototype.toString.call(obj) === '[object String]';
};
/** @private is the given object a NaN? */
// eslint-disable-next-line no-self-compare

var isNaN$1 = function isNaN(obj) {
  return obj !== obj;
};
/** @private Does a React component have exactly 0 children? */

var isEmptyChildren = function isEmptyChildren(children) {
  return Children.count(children) === 0;
};
/** @private is the given object/value a promise? */

var isPromise = function isPromise(value) {
  return isObject(value) && isFunction(value.then);
};
/** @private is the given object/value a type of synthetic event? */

var isInputEvent = function isInputEvent(value) {
  return value && isObject(value) && isObject(value.target);
};
/**
 * Same as document.activeElement but wraps in a try-catch block. In IE it is
 * not safe to call document.activeElement if there is nothing focused.
 *
 * The activeElement will be null only if the document or document body is not
 * yet defined.
 *
 * @param {?Document} doc Defaults to current document.
 * @return {Element | null}
 * @see https://github.com/facebook/fbjs/blob/master/packages/fbjs/src/core/dom/getActiveElement.js
 */

function getActiveElement(doc) {
  doc = doc || (typeof document !== 'undefined' ? document : undefined);

  if (typeof doc === 'undefined') {
    return null;
  }

  try {
    return doc.activeElement || doc.body;
  } catch (e) {
    return doc.body;
  }
}
/**
 * Deeply get a value from an object via its path.
 */

function getIn(obj, key, def, p) {
  if (p === void 0) {
    p = 0;
  }

  var path = toPath(key);

  while (obj && p < path.length) {
    obj = obj[path[p++]];
  } // check if path is not in the end


  if (p !== path.length && !obj) {
    return def;
  }

  return obj === undefined ? def : obj;
}
/**
 * Deeply set a value from in object via it's path. If the value at `path`
 * has changed, return a shallow copy of obj with `value` set at `path`.
 * If `value` has not changed, return the original `obj`.
 *
 * Existing objects / arrays along `path` are also shallow copied. Sibling
 * objects along path retain the same internal js reference. Since new
 * objects / arrays are only created along `path`, we can test if anything
 * changed in a nested structure by comparing the object's reference in
 * the old and new object, similar to how russian doll cache invalidation
 * works.
 *
 * In earlier versions of this function, which used cloneDeep, there were
 * issues whereby settings a nested value would mutate the parent
 * instead of creating a new object. `clone` avoids that bug making a
 * shallow copy of the objects along the update path
 * so no object is mutated in place.
 *
 * Before changing this function, please read through the following
 * discussions.
 *
 * @see https://github.com/developit/linkstate
 * @see https://github.com/jaredpalmer/formik/pull/123
 */

function setIn(obj, path, value) {
  var res = clone$1(obj); // this keeps inheritance when obj is a class

  var resVal = res;
  var i = 0;
  var pathArray = toPath(path);

  for (; i < pathArray.length - 1; i++) {
    var currentPath = pathArray[i];
    var currentObj = getIn(obj, pathArray.slice(0, i + 1));

    if (currentObj && (isObject(currentObj) || Array.isArray(currentObj))) {
      resVal = resVal[currentPath] = clone$1(currentObj);
    } else {
      var nextPath = pathArray[i + 1];
      resVal = resVal[currentPath] = isInteger(nextPath) && Number(nextPath) >= 0 ? [] : {};
    }
  } // Return original object if new value is the same as current


  if ((i === 0 ? obj : resVal)[pathArray[i]] === value) {
    return obj;
  }

  if (value === undefined) {
    delete resVal[pathArray[i]];
  } else {
    resVal[pathArray[i]] = value;
  } // If the path array has a single element, the loop did not run.
  // Deleting on `resVal` had no effect in this scenario, so we delete on the result instead.


  if (i === 0 && value === undefined) {
    delete res[pathArray[i]];
  }

  return res;
}
/**
 * Recursively a set the same value for all keys and arrays nested object, cloning
 * @param object
 * @param value
 * @param visited
 * @param response
 */

function setNestedObjectValues(object, value, visited, response) {
  if (visited === void 0) {
    visited = new WeakMap();
  }

  if (response === void 0) {
    response = {};
  }

  for (var _i = 0, _Object$keys = Object.keys(object); _i < _Object$keys.length; _i++) {
    var k = _Object$keys[_i];
    var val = object[k];

    if (isObject(val)) {
      if (!visited.get(val)) {
        visited.set(val, true); // In order to keep array values consistent for both dot path  and
        // bracket syntax, we need to check if this is an array so that
        // this will output  { friends: [true] } and not { friends: { "0": true } }

        response[k] = Array.isArray(val) ? [] : {};
        setNestedObjectValues(val, value, visited, response[k]);
      }
    } else {
      response[k] = value;
    }
  }

  return response;
}

function isPlainObject(value) {
  if (typeof value !== 'object' || value === null) return false;
  var proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
} // Polyfill for clone (not available in older Node/browsers)


function clone(obj) {
  if (typeof clone !== 'undefined') {
    return clone(obj);
  } // Fallback: JSON-based clone (works for plain objects)


  return JSON.parse(JSON.stringify(obj));
}

function formikReducer(state, msg) {
  switch (msg.type) {
    case 'SET_VALUES':
      return _extends({}, state, {
        values: msg.payload
      });

    case 'SET_TOUCHED':
      return _extends({}, state, {
        touched: msg.payload
      });

    case 'SET_ERRORS':
      if (isEqual(state.errors, msg.payload)) {
        return state;
      }

      return _extends({}, state, {
        errors: msg.payload
      });

    case 'SET_STATUS':
      return _extends({}, state, {
        status: msg.payload
      });

    case 'SET_ISSUBMITTING':
      return _extends({}, state, {
        isSubmitting: msg.payload
      });

    case 'SET_ISVALIDATING':
      return _extends({}, state, {
        isValidating: msg.payload
      });

    case 'SET_FIELD_VALUE':
      return _extends({}, state, {
        values: setIn(state.values, msg.payload.field, msg.payload.value)
      });

    case 'SET_FIELD_TOUCHED':
      return _extends({}, state, {
        touched: setIn(state.touched, msg.payload.field, msg.payload.value)
      });

    case 'SET_FIELD_ERROR':
      return _extends({}, state, {
        errors: setIn(state.errors, msg.payload.field, msg.payload.value)
      });

    case 'RESET_FORM':
      return _extends({}, state, msg.payload);

    case 'SET_FORMIK_STATE':
      return msg.payload(state);

    case 'SUBMIT_ATTEMPT':
      return _extends({}, state, {
        touched: setNestedObjectValues(state.values, true),
        isSubmitting: true,
        submitCount: state.submitCount + 1
      });

    case 'SUBMIT_FAILURE':
      return _extends({}, state, {
        isSubmitting: false
      });

    case 'SUBMIT_SUCCESS':
      return _extends({}, state, {
        isSubmitting: false
      });

    default:
      return state;
  }
} // Initial empty states // objects


var emptyErrors = {};
var emptyTouched = {};
function useFormik(_ref) {
  var _ref$validateOnChange = _ref.validateOnChange,
      validateOnChange = _ref$validateOnChange === void 0 ? true : _ref$validateOnChange,
      _ref$validateOnBlur = _ref.validateOnBlur,
      validateOnBlur = _ref$validateOnBlur === void 0 ? true : _ref$validateOnBlur,
      _ref$validateOnMount = _ref.validateOnMount,
      validateOnMount = _ref$validateOnMount === void 0 ? false : _ref$validateOnMount,
      isInitialValid = _ref.isInitialValid,
      _ref$enableReinitiali = _ref.enableReinitialize,
      enableReinitialize = _ref$enableReinitiali === void 0 ? false : _ref$enableReinitiali,
      onSubmit = _ref.onSubmit,
      rest = _objectWithoutPropertiesLoose(_ref, ["validateOnChange", "validateOnBlur", "validateOnMount", "isInitialValid", "enableReinitialize", "onSubmit"]);

  var props = _extends({
    validateOnChange: validateOnChange,
    validateOnBlur: validateOnBlur,
    validateOnMount: validateOnMount,
    onSubmit: onSubmit
  }, rest);

  var initialValues = useRef(props.initialValues);
  var initialErrors = useRef(props.initialErrors || emptyErrors);
  var initialTouched = useRef(props.initialTouched || emptyTouched);
  var initialStatus = useRef(props.initialStatus);
  var isMounted = useRef(false);
  var fieldRegistry = useRef({});

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(function () {
      !(typeof isInitialValid === 'undefined') ? process.env.NODE_ENV !== "production" ? invariant(false, 'isInitialValid has been deprecated and will be removed in future versions of Formik. Please use initialErrors or validateOnMount instead.') : invariant(false) : void 0; // eslint-disable-next-line
    }, []);
  }

  useEffect(function () {
    isMounted.current = true;
    return function () {
      isMounted.current = false;
    };
  }, []);

  var _React$useState = useState(0),
      setIteration = _React$useState[1];

  var stateRef = useRef({
    values: clone(props.initialValues),
    errors: clone(props.initialErrors) || emptyErrors,
    touched: clone(props.initialTouched) || emptyTouched,
    status: clone(props.initialStatus),
    isSubmitting: false,
    isValidating: false,
    submitCount: 0
  });
  var state = stateRef.current;
  var dispatch = useCallback(function (action) {
    var prev = stateRef.current;
    stateRef.current = formikReducer(prev, action); // force rerender

    if (prev !== stateRef.current) setIteration(function (x) {
      return x + 1;
    });
  }, []);
  var runValidateHandler = useCallback(function (values, field) {
    return new Promise(function (resolve, reject) {
      var maybePromisedErrors = props.validate(values, field);

      if (maybePromisedErrors == null) {
        // use loose null check here on purpose
        resolve(emptyErrors);
      } else if (isPromise(maybePromisedErrors)) {
        maybePromisedErrors.then(function (errors) {
          resolve(errors || emptyErrors);
        }, function (actualException) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn("Warning: An unhandled error was caught during validation in <Formik validate />", actualException);
          }

          reject(actualException);
        });
      } else {
        resolve(maybePromisedErrors);
      }
    });
  }, [props.validate]);
  /**
   * Run validation against a Yup schema and optionally run a function if successful
   */

  var runValidationSchema = useCallback(function (values, field) {
    var validationSchema = props.validationSchema;
    var schema = isFunction(validationSchema) ? validationSchema(field) : validationSchema;
    var promise = field && schema.validateAt ? schema.validateAt(field, values) : validateYupSchema(values, schema);
    return new Promise(function (resolve, reject) {
      promise.then(function () {
        resolve(emptyErrors);
      }, function (err) {
        // Yup will throw a validation error if validation fails. We catch those and
        // resolve them into Formik errors. We can sniff if something is a Yup error
        // by checking error.name.
        // @see https://github.com/jquense/yup#validationerrorerrors-string--arraystring-value-any-path-string
        if (err.name === 'ValidationError') {
          resolve(yupToFormErrors(err));
        } else {
          // We throw any other errors
          if (process.env.NODE_ENV !== 'production') {
            console.warn("Warning: An unhandled error was caught during validation in <Formik validationSchema />", err);
          }

          reject(err);
        }
      });
    });
  }, [props.validationSchema]);
  var runSingleFieldLevelValidation = useCallback(function (field, value) {
    return new Promise(function (resolve) {
      return resolve(fieldRegistry.current[field].validate(value));
    });
  }, []);
  var runFieldLevelValidations = useCallback(function (values) {
    var fieldKeysWithValidation = Object.keys(fieldRegistry.current).filter(function (f) {
      return isFunction(fieldRegistry.current[f].validate);
    }); // Construct an array with all of the field validation functions

    var fieldValidations = fieldKeysWithValidation.length > 0 ? fieldKeysWithValidation.map(function (f) {
      return runSingleFieldLevelValidation(f, getIn(values, f));
    }) : [Promise.resolve('DO_NOT_DELETE_YOU_WILL_BE_FIRED')]; // use special case ;)

    return Promise.all(fieldValidations).then(function (fieldErrorsList) {
      return fieldErrorsList.reduce(function (prev, curr, index) {
        if (curr === 'DO_NOT_DELETE_YOU_WILL_BE_FIRED') {
          return prev;
        }

        if (curr) {
          prev = setIn(prev, fieldKeysWithValidation[index], curr);
        }

        return prev;
      }, {});
    });
  }, [runSingleFieldLevelValidation]); // Run all validations and return the result

  var runAllValidations = useCallback(function (values) {
    return Promise.all([runFieldLevelValidations(values), props.validationSchema ? runValidationSchema(values) : {}, props.validate ? runValidateHandler(values) : {}]).then(function (_ref2) {
      var fieldErrors = _ref2[0],
          schemaErrors = _ref2[1],
          validateErrors = _ref2[2];
      var combinedErrors = deepmerge.all([fieldErrors, schemaErrors, validateErrors], {
        arrayMerge: arrayMerge
      });
      return combinedErrors;
    });
  }, [props.validate, props.validationSchema, runFieldLevelValidations, runValidateHandler, runValidationSchema]); // Run all validations methods and update state accordingly

  var validateFormWithHighPriority = useEventCallback(function (values) {
    if (values === void 0) {
      values = state.values;
    }

    dispatch({
      type: 'SET_ISVALIDATING',
      payload: true
    });
    return runAllValidations(values).then(function (combinedErrors) {
      if (!!isMounted.current) {
        dispatch({
          type: 'SET_ISVALIDATING',
          payload: false
        });
        dispatch({
          type: 'SET_ERRORS',
          payload: combinedErrors
        });
      }

      return combinedErrors;
    });
  });
  useEffect(function () {
    if (validateOnMount && isMounted.current === true && isEqual(initialValues.current, props.initialValues)) {
      validateFormWithHighPriority(initialValues.current);
    }
  }, [validateOnMount, validateFormWithHighPriority]);
  var resetForm = useCallback(function (nextState) {
    var values = nextState && nextState.values ? nextState.values : initialValues.current;
    var errors = nextState && nextState.errors ? nextState.errors : initialErrors.current ? initialErrors.current : props.initialErrors || {};
    var touched = nextState && nextState.touched ? nextState.touched : initialTouched.current ? initialTouched.current : props.initialTouched || {};
    var status = nextState && nextState.status ? nextState.status : initialStatus.current ? initialStatus.current : props.initialStatus;
    initialValues.current = values;
    initialErrors.current = errors;
    initialTouched.current = touched;
    initialStatus.current = status;

    var dispatchFn = function dispatchFn() {
      dispatch({
        type: 'RESET_FORM',
        payload: {
          isSubmitting: !!nextState && !!nextState.isSubmitting,
          errors: errors,
          touched: touched,
          status: status,
          values: values,
          isValidating: !!nextState && !!nextState.isValidating,
          submitCount: !!nextState && !!nextState.submitCount && typeof nextState.submitCount === 'number' ? nextState.submitCount : 0
        }
      });
    };

    if (props.onReset) {
      var maybePromisedOnReset = props.onReset(state.values, imperativeMethods);

      if (isPromise(maybePromisedOnReset)) {
        maybePromisedOnReset.then(dispatchFn);
      } else {
        dispatchFn();
      }
    } else {
      dispatchFn();
    }
  }, [props.initialErrors, props.initialStatus, props.initialTouched, props.onReset]);
  useEffect(function () {
    if (isMounted.current === true && !isEqual(initialValues.current, props.initialValues)) {
      if (enableReinitialize) {
        initialValues.current = props.initialValues;
        resetForm();

        if (validateOnMount) {
          validateFormWithHighPriority(initialValues.current);
        }
      }
    }
  }, [enableReinitialize, props.initialValues, resetForm, validateOnMount, validateFormWithHighPriority]);
  useEffect(function () {
    if (enableReinitialize && isMounted.current === true && !isEqual(initialErrors.current, props.initialErrors)) {
      initialErrors.current = props.initialErrors || emptyErrors;
      dispatch({
        type: 'SET_ERRORS',
        payload: props.initialErrors || emptyErrors
      });
    }
  }, [enableReinitialize, props.initialErrors]);
  useEffect(function () {
    if (enableReinitialize && isMounted.current === true && !isEqual(initialTouched.current, props.initialTouched)) {
      initialTouched.current = props.initialTouched || emptyTouched;
      dispatch({
        type: 'SET_TOUCHED',
        payload: props.initialTouched || emptyTouched
      });
    }
  }, [enableReinitialize, props.initialTouched]);
  useEffect(function () {
    if (enableReinitialize && isMounted.current === true && !isEqual(initialStatus.current, props.initialStatus)) {
      initialStatus.current = props.initialStatus;
      dispatch({
        type: 'SET_STATUS',
        payload: props.initialStatus
      });
    }
  }, [enableReinitialize, props.initialStatus, props.initialTouched]);
  var validateField = useEventCallback(function (name) {
    // This will efficiently validate a single field by avoiding state
    // changes if the validation function is synchronous. It's different from
    // what is called when using validateForm.
    if (fieldRegistry.current[name] && isFunction(fieldRegistry.current[name].validate)) {
      var value = getIn(state.values, name);
      var maybePromise = fieldRegistry.current[name].validate(value);

      if (isPromise(maybePromise)) {
        // Only flip isValidating if the function is async.
        dispatch({
          type: 'SET_ISVALIDATING',
          payload: true
        });
        return maybePromise.then(function (x) {
          return x;
        }).then(function (error) {
          dispatch({
            type: 'SET_FIELD_ERROR',
            payload: {
              field: name,
              value: error
            }
          });
          dispatch({
            type: 'SET_ISVALIDATING',
            payload: false
          });
        });
      } else {
        dispatch({
          type: 'SET_FIELD_ERROR',
          payload: {
            field: name,
            value: maybePromise
          }
        });
        return Promise.resolve(maybePromise);
      }
    } else if (props.validationSchema) {
      dispatch({
        type: 'SET_ISVALIDATING',
        payload: true
      });
      return runValidationSchema(state.values, name).then(function (x) {
        return x;
      }).then(function (error) {
        dispatch({
          type: 'SET_FIELD_ERROR',
          payload: {
            field: name,
            value: getIn(error, name)
          }
        });
        dispatch({
          type: 'SET_ISVALIDATING',
          payload: false
        });
      });
    }

    return Promise.resolve();
  });
  var registerField = useCallback(function (name, _ref3) {
    var validate = _ref3.validate;
    fieldRegistry.current[name] = {
      validate: validate
    };
  }, []);
  var unregisterField = useCallback(function (name) {
    delete fieldRegistry.current[name];
  }, []);
  var setTouched = useEventCallback(function (touched, shouldValidate) {
    dispatch({
      type: 'SET_TOUCHED',
      payload: touched
    });
    var willValidate = shouldValidate === undefined ? validateOnBlur : shouldValidate;
    return willValidate ? validateFormWithHighPriority(state.values) : Promise.resolve();
  });
  var setErrors = useCallback(function (errors) {
    dispatch({
      type: 'SET_ERRORS',
      payload: errors
    });
  }, []);
  var setValues = useEventCallback(function (values, shouldValidate) {
    var resolvedValues = isFunction(values) ? values(state.values) : values;
    dispatch({
      type: 'SET_VALUES',
      payload: resolvedValues
    });
    var willValidate = shouldValidate === undefined ? validateOnChange : shouldValidate;
    return willValidate ? validateFormWithHighPriority(resolvedValues) : Promise.resolve();
  });
  var setFieldError = useCallback(function (field, value) {
    dispatch({
      type: 'SET_FIELD_ERROR',
      payload: {
        field: field,
        value: value
      }
    });
  }, []);
  var setFieldValue = useEventCallback(function (field, value, shouldValidate) {
    var resolvedValue = isFunction(value) ? value(getIn(state.values, field)) : value;
    dispatch({
      type: 'SET_FIELD_VALUE',
      payload: {
        field: field,
        value: resolvedValue
      }
    });
    var willValidate = shouldValidate === undefined ? validateOnChange : shouldValidate;
    return willValidate ? validateFormWithHighPriority(setIn(state.values, field, resolvedValue)) : Promise.resolve();
  });
  var executeChange = useCallback(function (eventOrTextValue, maybePath) {
    // By default, assume that the first argument is a string. This allows us to use
    // handleChange with React Native and React Native Web's onChangeText prop which
    // provides just the value of the input.
    var field = maybePath;
    var val = eventOrTextValue;
    var parsed; // If the first argument is not a string though, it has to be a synthetic React Event (or a fake one),
    // so we handle like we would a normal HTML change event.

    if (!isString(eventOrTextValue)) {
      // If we can, persist the event
      // @see https://reactjs.org/docs/events.html#event-pooling
      if (eventOrTextValue.persist) {
        eventOrTextValue.persist();
      }

      var target = eventOrTextValue.target ? eventOrTextValue.target : eventOrTextValue.currentTarget;
      var type = target.type,
          name = target.name,
          id = target.id,
          value = target.value,
          checked = target.checked,
          outerHTML = target.outerHTML,
          options = target.options,
          multiple = target.multiple;
      field = maybePath ? maybePath : name ? name : id;

      if (!field && process.env.NODE_ENV !== "production") {
        warnAboutMissingIdentifier({
          htmlContent: outerHTML,
          documentationAnchorLink: 'handlechange-e-reactchangeeventany--void',
          handlerName: 'handleChange'
        });
      }

      val = /number|range/.test(type) ? (parsed = parseFloat(value), isNaN(parsed) ? '' : parsed) : /checkbox/.test(type) // checkboxes
      ? getValueForCheckbox(getIn(state.values, field), checked, value) : options && multiple // <select multiple>
      ? getSelectedValues(options) : value;
    }

    if (field) {
      // Set form fields by name
      setFieldValue(field, val);
    }
  }, [setFieldValue, state.values]);
  var handleChange = useEventCallback(function (eventOrPath) {
    if (isString(eventOrPath)) {
      return function (event) {
        return executeChange(event, eventOrPath);
      };
    } else {
      executeChange(eventOrPath);
    }
  });
  var setFieldTouched = useEventCallback(function (field, touched, shouldValidate) {
    if (touched === void 0) {
      touched = true;
    }

    dispatch({
      type: 'SET_FIELD_TOUCHED',
      payload: {
        field: field,
        value: touched
      }
    });
    var willValidate = shouldValidate === undefined ? validateOnBlur : shouldValidate;
    return willValidate ? validateFormWithHighPriority(state.values) : Promise.resolve();
  });
  var executeBlur = useCallback(function (e, path) {
    if (e.persist) {
      e.persist();
    }

    var _e$target = e.target,
        name = _e$target.name,
        id = _e$target.id,
        outerHTML = _e$target.outerHTML;
    var field = path ? path : name ? name : id;

    if (!field && process.env.NODE_ENV !== "production") {
      warnAboutMissingIdentifier({
        htmlContent: outerHTML,
        documentationAnchorLink: 'handleblur-e-any--void',
        handlerName: 'handleBlur'
      });
    }

    setFieldTouched(field, true);
  }, [setFieldTouched]);
  var handleBlur = useEventCallback(function (eventOrString) {
    if (isString(eventOrString)) {
      return function (event) {
        return executeBlur(event, eventOrString);
      };
    } else {
      executeBlur(eventOrString);
    }
  });
  var setFormikState = useCallback(function (stateOrCb) {
    if (isFunction(stateOrCb)) {
      dispatch({
        type: 'SET_FORMIK_STATE',
        payload: stateOrCb
      });
    } else {
      dispatch({
        type: 'SET_FORMIK_STATE',
        payload: function payload() {
          return stateOrCb;
        }
      });
    }
  }, []);
  var setStatus = useCallback(function (status) {
    dispatch({
      type: 'SET_STATUS',
      payload: status
    });
  }, []);
  var setSubmitting = useCallback(function (isSubmitting) {
    dispatch({
      type: 'SET_ISSUBMITTING',
      payload: isSubmitting
    });
  }, []);
  var submitForm = useEventCallback(function () {
    dispatch({
      type: 'SUBMIT_ATTEMPT'
    });
    return validateFormWithHighPriority().then(function (combinedErrors) {
      // In case an error was thrown and passed to the resolved Promise,
      // `combinedErrors` can be an instance of an Error. We need to check
      // that and abort the submit.
      // If we don't do that, calling `Object.keys(new Error())` yields an
      // empty array, which causes the validation to pass and the form
      // to be submitted.
      var isInstanceOfError = combinedErrors instanceof Error;
      var isActuallyValid = !isInstanceOfError && Object.keys(combinedErrors).length === 0;

      if (isActuallyValid) {
        // Proceed with submit...
        //
        // To respect sync submit fns, we can't simply wrap executeSubmit in a promise and
        // _always_ dispatch SUBMIT_SUCCESS because isSubmitting would then always be false.
        // This would be fine in simple cases, but make it impossible to disable submit
        // buttons where people use callbacks or promises as side effects (which is basically
        // all of v1 Formik code). Instead, recall that we are inside of a promise chain already,
        //  so we can try/catch executeSubmit(), if it returns undefined, then just bail.
        // If there are errors, throw em. Otherwise, wrap executeSubmit in a promise and handle
        // cleanup of isSubmitting on behalf of the consumer.
        var promiseOrUndefined;

        try {
          promiseOrUndefined = executeSubmit(); // Bail if it's sync, consumer is responsible for cleaning up
          // via setSubmitting(false)

          if (promiseOrUndefined === undefined) {
            return;
          }
        } catch (error) {
          throw error;
        }

        return Promise.resolve(promiseOrUndefined).then(function (result) {
          if (!!isMounted.current) {
            dispatch({
              type: 'SUBMIT_SUCCESS'
            });
          }

          return result;
        })["catch"](function (_errors) {
          if (!!isMounted.current) {
            dispatch({
              type: 'SUBMIT_FAILURE'
            }); // This is a legit error rejected by the onSubmit fn
            // so we don't want to break the promise chain

            throw _errors;
          }
        });
      } else if (!!isMounted.current) {
        // ^^^ Make sure Formik is still mounted before updating state
        dispatch({
          type: 'SUBMIT_FAILURE'
        }); // throw combinedErrors;

        if (isInstanceOfError) {
          throw combinedErrors;
        }
      }

      return;
    });
  });
  var handleSubmit = useEventCallback(function (e) {
    if (e && e.preventDefault && isFunction(e.preventDefault)) {
      e.preventDefault();
    }

    if (e && e.stopPropagation && isFunction(e.stopPropagation)) {
      e.stopPropagation();
    } // Warn if form submission is triggered by a <button> without a
    // specified `type` attribute during development. This mitigates
    // a common gotcha in forms with both reset and submit buttons,
    // where the dev forgets to add type="button" to the reset button.


    if (process.env.NODE_ENV !== "production" && typeof document !== 'undefined') {
      // Safely get the active element (works with IE)
      var activeElement = getActiveElement();

      if (activeElement !== null && activeElement instanceof HTMLButtonElement) {
        !(activeElement.attributes && activeElement.attributes.getNamedItem('type')) ? process.env.NODE_ENV !== "production" ? invariant(false, 'You submitted a Formik form using a button with an unspecified `type` attribute.  Most browsers default button elements to `type="submit"`. If this is not a submit button, please add `type="button"`.') : invariant(false) : void 0;
      }
    }

    submitForm()["catch"](function (reason) {
      console.warn("Warning: An unhandled error was caught from submitForm()", reason);
    });
  });
  var imperativeMethods = {
    resetForm: resetForm,
    validateForm: validateFormWithHighPriority,
    validateField: validateField,
    setErrors: setErrors,
    setFieldError: setFieldError,
    setFieldTouched: setFieldTouched,
    setFieldValue: setFieldValue,
    setStatus: setStatus,
    setSubmitting: setSubmitting,
    setTouched: setTouched,
    setValues: setValues,
    setFormikState: setFormikState,
    submitForm: submitForm
  };
  var executeSubmit = useEventCallback(function () {
    return onSubmit(state.values, imperativeMethods);
  });
  var handleReset = useEventCallback(function (e) {
    if (e && e.preventDefault && isFunction(e.preventDefault)) {
      e.preventDefault();
    }

    if (e && e.stopPropagation && isFunction(e.stopPropagation)) {
      e.stopPropagation();
    }

    resetForm();
  });
  var getFieldMeta = useCallback(function (name) {
    return {
      value: getIn(state.values, name),
      error: getIn(state.errors, name),
      touched: !!getIn(state.touched, name),
      initialValue: getIn(initialValues.current, name),
      initialTouched: !!getIn(initialTouched.current, name),
      initialError: getIn(initialErrors.current, name)
    };
  }, [state.errors, state.touched, state.values]);
  var getFieldHelpers = useCallback(function (name) {
    return {
      setValue: function setValue(value, shouldValidate) {
        return setFieldValue(name, value, shouldValidate);
      },
      setTouched: function setTouched(value, shouldValidate) {
        return setFieldTouched(name, value, shouldValidate);
      },
      setError: function setError(value) {
        return setFieldError(name, value);
      }
    };
  }, [setFieldValue, setFieldTouched, setFieldError]);
  var getFieldProps = useCallback(function (nameOrOptions) {
    var isAnObject = isObject(nameOrOptions);
    var name = isAnObject ? nameOrOptions.name : nameOrOptions;
    var valueState = getIn(state.values, name);
    var field = {
      name: name,
      value: valueState,
      onChange: handleChange,
      onBlur: handleBlur
    };

    if (isAnObject) {
      var type = nameOrOptions.type,
          valueProp = nameOrOptions.value,
          is = nameOrOptions.as,
          multiple = nameOrOptions.multiple;

      if (type === 'checkbox') {
        if (valueProp === undefined) {
          field.checked = !!valueState;
        } else {
          field.checked = !!(Array.isArray(valueState) && ~valueState.indexOf(valueProp));
          field.value = valueProp;
        }
      } else if (type === 'radio') {
        field.checked = valueState === valueProp;
        field.value = valueProp;
      } else if (is === 'select' && multiple) {
        field.value = field.value || [];
        field.multiple = true;
      }
    }

    return field;
  }, [handleBlur, handleChange, state.values]);
  var dirty = useMemo(function () {
    return !isEqual(initialValues.current, state.values);
  }, [initialValues.current, state.values]);
  var isValid = useMemo(function () {
    return typeof isInitialValid !== 'undefined' ? dirty ? state.errors && Object.keys(state.errors).length === 0 : isInitialValid !== false && isFunction(isInitialValid) ? isInitialValid(props) : isInitialValid : state.errors && Object.keys(state.errors).length === 0;
  }, [isInitialValid, dirty, state.errors, props]);

  var ctx = _extends({}, state, {
    initialValues: initialValues.current,
    initialErrors: initialErrors.current,
    initialTouched: initialTouched.current,
    initialStatus: initialStatus.current,
    handleBlur: handleBlur,
    handleChange: handleChange,
    handleReset: handleReset,
    handleSubmit: handleSubmit,
    resetForm: resetForm,
    setErrors: setErrors,
    setFormikState: setFormikState,
    setFieldTouched: setFieldTouched,
    setFieldValue: setFieldValue,
    setFieldError: setFieldError,
    setStatus: setStatus,
    setSubmitting: setSubmitting,
    setTouched: setTouched,
    setValues: setValues,
    submitForm: submitForm,
    validateForm: validateFormWithHighPriority,
    validateField: validateField,
    isValid: isValid,
    dirty: dirty,
    unregisterField: unregisterField,
    registerField: registerField,
    getFieldProps: getFieldProps,
    getFieldMeta: getFieldMeta,
    getFieldHelpers: getFieldHelpers,
    validateOnBlur: validateOnBlur,
    validateOnChange: validateOnChange,
    validateOnMount: validateOnMount
  });

  return ctx;
}
function Formik(props) {
  var formikbag = useFormik(props);
  var component = props.component,
      children = props.children,
      render = props.render,
      innerRef = props.innerRef; // This allows folks to pass a ref to <Formik />

  useImperativeHandle(innerRef, function () {
    return formikbag;
  });

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(function () {
      !!props.render ? process.env.NODE_ENV !== "production" ? invariant(false, "<Formik render> has been deprecated and will be removed in future versions of Formik. Please use a child callback function instead. To get rid of this warning, replace <Formik render={(props) => ...} /> with <Formik>{(props) => ...}</Formik>") : invariant(false) : void 0; // eslint-disable-next-line
    }, []);
  }

  return createElement(FormikProvider, {
    value: formikbag
  }, component ? createElement(component, formikbag) : render ? render(formikbag) : children // children come last, always called
  ? isFunction(children) ? children(formikbag) : !isEmptyChildren(children) ? Children.only(children) : null : null);
}

function warnAboutMissingIdentifier(_ref4) {
  var htmlContent = _ref4.htmlContent,
      documentationAnchorLink = _ref4.documentationAnchorLink,
      handlerName = _ref4.handlerName;
  console.warn("Warning: Formik called `" + handlerName + "`, but you forgot to pass an `id` or `name` attribute to your input:\n    " + htmlContent + "\n    Formik cannot determine which value to update. For more info see https://formik.org/docs/api/formik#" + documentationAnchorLink + "\n  ");
}
/**
 * Transform Yup ValidationError to a more usable object
 */


function yupToFormErrors(yupError) {
  var errors = {};

  if (yupError.inner) {
    if (yupError.inner.length === 0) {
      return setIn(errors, yupError.path, yupError.message);
    }

    for (var _iterator = _createForOfIteratorHelperLoose(yupError.inner), _step; !(_step = _iterator()).done;) {
      var err = _step.value;

      if (!getIn(errors, err.path)) {
        errors = setIn(errors, err.path, err.message);
      }
    }
  }

  return errors;
}
/**
 * Validate a yup schema.
 */

function validateYupSchema(values, schema, sync, context) {
  if (sync === void 0) {
    sync = false;
  }

  var normalizedValues = prepareDataForValidation(values);
  return schema[sync ? 'validateSync' : 'validate'](normalizedValues, {
    abortEarly: false,
    context: context || normalizedValues
  });
}
/**
 * Recursively prepare values.
 */

function prepareDataForValidation(values) {
  var data = Array.isArray(values) ? [] : {};

  for (var k in values) {
    if (Object.prototype.hasOwnProperty.call(values, k)) {
      var key = String(k);

      if (Array.isArray(values[key]) === true) {
        data[key] = values[key].map(function (value) {
          if (Array.isArray(value) === true || isPlainObject(value)) {
            return prepareDataForValidation(value);
          } else {
            return value !== '' ? value : undefined;
          }
        });
      } else if (isPlainObject(values[key])) {
        data[key] = prepareDataForValidation(values[key]);
      } else {
        data[key] = values[key] !== '' ? values[key] : undefined;
      }
    }
  }

  return data;
}
/**
 * deepmerge array merging algorithm
 * https://github.com/KyleAMathews/deepmerge#combine-array
 */

function arrayMerge(target, source, options) {
  var destination = target.slice();
  source.forEach(function merge(e, i) {
    if (typeof destination[i] === 'undefined') {
      var cloneRequested = options.clone !== false;
      var shouldClone = cloneRequested && options.isMergeableObject(e);
      destination[i] = shouldClone ? deepmerge(Array.isArray(e) ? [] : {}, e, options) : e;
    } else if (options.isMergeableObject(e)) {
      destination[i] = deepmerge(target[i], e, options);
    } else if (target.indexOf(e) === -1) {
      destination.push(e);
    }
  });
  return destination;
}
/** Return multi select values based on an array of options */


function getSelectedValues(options) {
  return Array.from(options).filter(function (el) {
    return el.selected;
  }).map(function (el) {
    return el.value;
  });
}
/** Return the next value for a checkbox */


function getValueForCheckbox(currentValue, checked, valueProp) {
  // If the current value was a boolean, return a boolean
  if (typeof currentValue === 'boolean') {
    return Boolean(checked);
  } // If the currentValue was not a boolean we want to return an array


  var currentArrayOfValues = [];
  var isValueInArray = false;
  var index = -1;

  if (!Array.isArray(currentValue)) {
    // eslint-disable-next-line eqeqeq
    if (!valueProp || valueProp == 'true' || valueProp == 'false') {
      return Boolean(checked);
    }
  } else {
    // If the current value is already an array, use it
    currentArrayOfValues = currentValue;
    index = currentValue.indexOf(valueProp);
    isValueInArray = index >= 0;
  } // If the checkbox was checked and the value is not already present in the aray we want to add the new value to the array of values


  if (checked && valueProp && !isValueInArray) {
    return currentArrayOfValues.concat(valueProp);
  } // If the checkbox was unchecked and the value is not in the array, simply return the already existing array of values


  if (!isValueInArray) {
    return currentArrayOfValues;
  } // If the checkbox was unchecked and the value is in the array, remove the value and return the array


  return currentArrayOfValues.slice(0, index).concat(currentArrayOfValues.slice(index + 1));
} // React currently throws a warning when using useLayoutEffect on the server.
// To get around it, we can conditionally useEffect on the server (no-op) and
// useLayoutEffect in the browser.
// @see https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85


var useIsomorphicLayoutEffect = typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof window.document.createElement !== 'undefined' ? useLayoutEffect : useEffect;

function useEventCallback(fn) {
  var ref = useRef(fn); // we copy a ref to the callback scoped to the current state/props on each render

  useIsomorphicLayoutEffect(function () {
    ref.current = fn;
  });
  return useCallback(function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return ref.current.apply(void 0, args);
  }, []);
}

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

function useField(propsOrFieldName) {
  var formik = useFormikContext();
  var getFieldProps = formik.getFieldProps,
      getFieldMeta = formik.getFieldMeta,
      getFieldHelpers = formik.getFieldHelpers,
      registerField = formik.registerField,
      unregisterField = formik.unregisterField;
  var isAnObject = isObject(propsOrFieldName); // Normalize propsOrFieldName to FieldHookConfig<Val>

  var props = isAnObject ? propsOrFieldName : {
    name: propsOrFieldName
  };
  var fieldName = props.name,
      validateFn = props.validate;
  useEffect(function () {
    if (fieldName) {
      registerField(fieldName, {
        validate: validateFn
      });
    }

    return function () {
      if (fieldName) {
        unregisterField(fieldName);
      }
    };
  }, [registerField, unregisterField, fieldName, validateFn]);

  if (process.env.NODE_ENV !== "production") {
    !formik ? process.env.NODE_ENV !== "production" ? invariant(false, 'useField() / <Field /> must be used underneath a <Formik> component') : invariant(false) : void 0;
  }

  !fieldName ? process.env.NODE_ENV !== "production" ? invariant(false, 'Invalid field name. Either pass `useField` a string or an object containing a `name` key.') : invariant(false) : void 0;
  var fieldHelpers = useMemo(function () {
    return getFieldHelpers(fieldName);
  }, [getFieldHelpers, fieldName]);
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

function Field(_ref) {
  var validate = _ref.validate,
      name = _ref.name,
      children = _ref.children,
      _ref$as = _ref.as,
      asElement = _ref$as === void 0 ? 'input' : _ref$as,
      className = _ref.className,
      ref = _ref.ref,
      props = _objectWithoutPropertiesLoose(_ref, ["validate", "name", "children", "as", "className", "ref"]);

  var _useFormikContext = useFormikContext(),
      formik = _objectWithoutPropertiesLoose(_useFormikContext, ["validate", "validationSchema"]); // Register field and field-level validation with parent <Formik>


  var registerField = formik.registerField,
      unregisterField = formik.unregisterField;
  useEffect(function () {
    registerField(name, {
      validate: validate
    });
    return function () {
      unregisterField(name);
    };
  }, [registerField, unregisterField, name, validate]);
  var field = formik.getFieldProps(_extends({
    name: name
  }, props));
  var meta = formik.getFieldMeta(name);
  var bag = {
    field: field,
    form: formik,
    meta: meta
  }; // Render with children function

  if (isFunction(children)) {
    return children(bag);
  } // Render as HTML element or component


  if (typeof asElement === 'string') {
    return createElement(asElement, _extends({
      ref: ref
    }, field, props, {
      className: className
    }), children);
  } // Render as custom component


  return createElement(asElement, _extends({
    ref: ref
  }, field, props, {
    className: className
  }), children);
}
Field.displayName = 'Field';

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

var FastField = /*#__PURE__*/memo(function FastField(_ref) {
  var name = _ref.name,
      validate = _ref.validate,
      _ref$as = _ref.as,
      asElement = _ref$as === void 0 ? 'input' : _ref$as,
      children = _ref.children,
      props = _objectWithoutPropertiesLoose(_ref, ["name", "validate", "as", "children"]);

  var _useFormikValues = useFormikValues(),
      values = _useFormikValues.values;

  var _useFormikState = useFormikState(),
      errors = _useFormikState.errors,
      touched = _useFormikState.touched,
      isSubmitting = _useFormikState.isSubmitting;

  var _useFormikMetadata = useFormikMetadata(),
      initialValues = _useFormikMetadata.initialValues,
      initialErrors = _useFormikMetadata.initialErrors,
      initialTouched = _useFormikMetadata.initialTouched;

  var methods = useFormikMethods(); // Register field on mount and when validate/name changes

  useEffect(function () {
    methods.registerField(name, {
      validate: validate
    });
    return function () {
      methods.unregisterField(name);
    };
  }, [name, validate, methods]); // Build field props

  var field = methods.getFieldProps(_extends({
    name: name
  }, props)); // Build meta object

  var meta = {
    value: getIn(values, name),
    error: getIn(errors, name),
    touched: !!getIn(touched, name),
    initialValue: getIn(initialValues, name),
    initialTouched: !!getIn(initialTouched, name),
    initialError: getIn(initialErrors, name)
  }; // Build form bag (excluding validate/validationSchema)

  var form = _extends({
    values: values,
    errors: errors,
    touched: touched,
    isSubmitting: isSubmitting
  }, methods, {
    initialValues: initialValues,
    initialErrors: initialErrors,
    initialTouched: initialTouched
  });

  var bag = {
    field: field,
    meta: meta,
    form: form
  }; // Render with children function

  if (isFunction(children)) {
    return children(bag);
  } // Render as HTML element or component


  if (typeof asElement === 'string') {
    return createElement(asElement, _extends({}, field, props), children);
  } // Render as custom component


  return createElement(asElement, _extends({}, field, props), children);
}, function (prevProps, nextProps) {
  // Custom shouldUpdate function takes precedence
  if (prevProps.shouldUpdate) {
    return !prevProps.shouldUpdate(nextProps, prevProps);
  } // Name changed - must re-render


  if (prevProps.name !== nextProps.name) {
    return false;
  } // Props length changed - must re-render


  if (Object.keys(prevProps).length !== Object.keys(nextProps).length) {
    return false;
  } // Check if any non-formik props changed


  var prevKeys = Object.keys(prevProps);

  for (var _i = 0, _prevKeys = prevKeys; _i < _prevKeys.length; _i++) {
    var key = _prevKeys[_i];

    if (key !== '_values' && key !== '_errors' && key !== '_touched' && key !== '_isSubmitting' && prevProps[key] !== nextProps[key]) {
      return false;
    }
  } // Check formik-specific values (passed via hidden props for comparison)
  // These are injected by the wrapper if needed, but we primarily rely on
  // context updates triggering re-renders


  if (prevProps._values !== nextProps._values || prevProps._errors !== nextProps._errors || prevProps._touched !== nextProps._touched || prevProps._isSubmitting !== nextProps._isSubmitting) {
    return false;
  } // Props are equal, skip re-render


  return true;
});
FastField.displayName = 'FastField';

/**
 * Array helper functions
 */

var _move = function move(array, from, to) {
  var copy = copyArrayLike(array);
  var value = copy[from];
  copy.splice(from, 1);
  copy.splice(to, 0, value);
  return copy;
};

var _swap = function swap(arrayLike, indexA, indexB) {
  var copy = copyArrayLike(arrayLike);
  var a = copy[indexA];
  copy[indexA] = copy[indexB];
  copy[indexB] = a;
  return copy;
};

var _insert = function insert(arrayLike, index, value) {
  var copy = copyArrayLike(arrayLike);
  copy.splice(index, 0, value);
  return copy;
};

var _replace = function replace(arrayLike, index, value) {
  var copy = copyArrayLike(arrayLike);
  copy[index] = value;
  return copy;
};

var copyArrayLike = function copyArrayLike(arrayLike) {
  if (!arrayLike) {
    return [];
  } else if (Array.isArray(arrayLike)) {
    return [].concat(arrayLike);
  } else {
    var maxIndex = Object.keys(arrayLike).map(function (key) {
      return parseInt(key);
    }).reduce(function (max, el) {
      return el > max ? el : max;
    }, 0);
    return Array.from(_extends({}, arrayLike, {
      length: maxIndex + 1
    }));
  }
};

var createAlterationHandler = function createAlterationHandler(alteration, defaultFunction) {
  var fn = typeof alteration === 'function' ? alteration : defaultFunction;
  return function (data) {
    if (Array.isArray(data) || isObject(data)) {
      var clone = copyArrayLike(data);
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


var FieldArray = /*#__PURE__*/memo(function FieldArray(_ref) {
  var name = _ref.name,
      _ref$validateOnChange = _ref.validateOnChange,
      validateOnChange = _ref$validateOnChange === void 0 ? true : _ref$validateOnChange,
      children = _ref.children;

  var _useFormikValues = useFormikValues(),
      values = _useFormikValues.values;

  var methods = useFormikMethods();
  var arrayValue = useMemo(function () {
    return getIn(values, name);
  }, [values, name]); // Track previous array value for validation on change

  var prevArrayValueRef = useRef(arrayValue); // Validate form when array changes (if validateOnChange is true)

  useEffect(function () {
    if (validateOnChange && !isEqual(prevArrayValueRef.current, arrayValue)) {
      methods.validateForm(values);
    }

    prevArrayValueRef.current = arrayValue;
  }, [arrayValue, validateOnChange, methods, values]); // Core update function for array operations

  var updateArrayField = useCallback(function (fn, alterTouched, alterErrors) {
    methods.setFormikState(function (prevState) {
      var updateErrors = createAlterationHandler(alterErrors, fn);
      var updateTouched = createAlterationHandler(alterTouched, fn); // Execute values fn first

      var newValues = setIn(prevState.values, name, fn(getIn(prevState.values, name)));
      var fieldError = alterErrors ? updateErrors(getIn(prevState.errors, name)) : undefined;
      var fieldTouched = alterTouched ? updateTouched(getIn(prevState.touched, name)) : undefined;

      if (isEmptyArray(fieldError)) {
        fieldError = undefined;
      }

      if (isEmptyArray(fieldTouched)) {
        fieldTouched = undefined;
      }

      return _extends({}, prevState, {
        values: newValues,
        errors: alterErrors ? setIn(prevState.errors, name, fieldError) : prevState.errors,
        touched: alterTouched ? setIn(prevState.touched, name, fieldTouched) : prevState.touched
      });
    });
  }, [name, methods]); // Array helper methods

  var arrayHelpers = useMemo(function () {
    return {
      push: function push(value) {
        updateArrayField(function (arrayLike) {
          return [].concat(copyArrayLike(arrayLike), [structuredClone(value)]);
        }, false, false);
      },
      handlePush: function handlePush(value) {
        return function () {
          updateArrayField(function (arrayLike) {
            return [].concat(copyArrayLike(arrayLike), [structuredClone(value)]);
          }, false, false);
        };
      },
      swap: function swap(indexA, indexB) {
        updateArrayField(function (array) {
          return _swap(array, indexA, indexB);
        }, true, true);
      },
      handleSwap: function handleSwap(indexA, indexB) {
        return function () {
          updateArrayField(function (array) {
            return _swap(array, indexA, indexB);
          }, true, true);
        };
      },
      move: function move(from, to) {
        updateArrayField(function (array) {
          return _move(array, from, to);
        }, true, true);
      },
      handleMove: function handleMove(from, to) {
        return function () {
          updateArrayField(function (array) {
            return _move(array, from, to);
          }, true, true);
        };
      },
      insert: function insert(index, value) {
        updateArrayField(function (array) {
          return _insert(array, index, value);
        }, function (array) {
          return _insert(array, index, null);
        }, function (array) {
          return _insert(array, index, null);
        });
      },
      handleInsert: function handleInsert(index, value) {
        return function () {
          updateArrayField(function (array) {
            return _insert(array, index, value);
          }, function (array) {
            return _insert(array, index, null);
          }, function (array) {
            return _insert(array, index, null);
          });
        };
      },
      replace: function replace(index, value) {
        updateArrayField(function (array) {
          return _replace(array, index, value);
        }, false, false);
      },
      handleReplace: function handleReplace(index, value) {
        return function () {
          updateArrayField(function (array) {
            return _replace(array, index, value);
          }, false, false);
        };
      },
      unshift: function unshift(value) {
        var length = -1;
        updateArrayField(function (array) {
          var arr = array ? [value].concat(array) : [value];
          length = arr.length;
          return arr;
        }, function (array) {
          return array ? [null].concat(array) : [null];
        }, function (array) {
          return array ? [null].concat(array) : [null];
        });
        return length;
      },
      handleUnshift: function handleUnshift(value) {
        return function () {
          updateArrayField(function (array) {
            return array ? [value].concat(array) : [value];
          }, function (array) {
            return array ? [null].concat(array) : [null];
          }, function (array) {
            return array ? [null].concat(array) : [null];
          });
        };
      },
      remove: function remove(index) {
        var result;
        updateArrayField(function (array) {
          var copy = array ? copyArrayLike(array) : [];

          if (!result) {
            result = copy[index];
          }

          if (isFunction(copy.splice)) {
            copy.splice(index, 1);
          }

          return isFunction(copy.every) ? copy.every(function (v) {
            return v === undefined;
          }) ? [] : copy : copy;
        }, true, true);
        return result;
      },
      handleRemove: function handleRemove(index) {
        return function () {
          updateArrayField(function (array) {
            var copy = array ? copyArrayLike(array) : [];

            if (isFunction(copy.splice)) {
              copy.splice(index, 1);
            }

            return isFunction(copy.every) ? copy.every(function (v) {
              return v === undefined;
            }) ? [] : copy : copy;
          }, true, true);
        };
      },
      pop: function pop() {
        var result;
        updateArrayField(function (array) {
          var tmp = array.slice();

          if (!result) {
            result = tmp && tmp.pop && tmp.pop();
          }

          return tmp;
        }, true, true);
        return result;
      },
      handlePop: function handlePop() {
        return function () {
          updateArrayField(function (array) {
            var tmp = array.slice();
            tmp && tmp.pop && tmp.pop();
            return tmp;
          }, true, true);
        };
      }
    };
  }, [updateArrayField]); // Build render props

  var renderProps = useMemo(function () {
    return _extends({}, arrayHelpers, {
      form: methods,
      name: name
    });
  }, [arrayHelpers, methods, name]); // Render with children function

  if (isFunction(children)) {
    return children(renderProps);
  }

  return null;
});
FieldArray.displayName = 'FieldArray';

/**
 * ErrorMessage component - displays validation errors for a field.
 * Only renders when the field is touched AND has an error.
 *
 * Uses React.memo with custom comparison to prevent unnecessary re-renders.
 * Only subscribes to FormikStateContext (errors, touched).
 *
 * @example
 * <ErrorMessage name="email" />
 * <ErrorMessage name="email" component="div" />
 * <ErrorMessage name="email">{msg => <div className="error">{msg}</div>}</ErrorMessage>
 */

var ErrorMessage = /*#__PURE__*/memo(function ErrorMessage(_ref) {
  var name = _ref.name,
      component = _ref.component,
      children = _ref.children,
      rest = _objectWithoutPropertiesLoose(_ref, ["name", "component", "children"]);

  var _useFormikState = useFormikState(),
      errors = _useFormikState.errors,
      touched = _useFormikState.touched;

  var touch = getIn(touched, name);
  var error = getIn(errors, name); // Don't render if field hasn't been touched or has no error

  if (!touch || !error) {
    return null;
  } // Render with children function


  if (isFunction(children)) {
    return children(error);
  } // Render with custom component


  if (component) {
    return createElement(component, rest, error);
  } // Default: render error string directly


  return error;
}, function (prevProps, nextProps) {
  // Custom comparison function - only re-render if:
  // 1. name changed
  // 2. props length changed
  // Note: We can't compare error/touched here since we don't have access to state
  // React.memo will handle re-renders when useFormikState returns new values
  return prevProps.name === nextProps.name && Object.keys(prevProps).length === Object.keys(nextProps).length;
});
ErrorMessage.displayName = 'ErrorMessage';

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

function Form(props) {
  // iOS needs an "action" attribute for nice input: https://stackoverflow.com/a/39485162/406725
  // We default the action to "#" in case the preventDefault fails (just updates the URL hash)
  var action = props.action,
      ref = props.ref,
      rest = _objectWithoutPropertiesLoose(props, ["action", "ref"]);

  var _useFormikContext = useFormikContext(),
      handleReset = _useFormikContext.handleReset,
      handleSubmit = _useFormikContext.handleSubmit; // If action is a function (React 19 server action), use it directly
  // Otherwise, default to '#' for iOS compatibility


  var _action = typeof action === 'function' ? action : action != null ? action : '#';

  return createElement("form", _extends({
    onSubmit: handleSubmit,
    ref: ref,
    onReset: handleReset,
    action: _action
  }, rest));
}
Form.displayName = 'Form';

/**
 * SubmitButton - A button that automatically disables during form submission
 *
 * Uses React 19's useFormStatus hook to automatically track form submission state.
 * Must be used inside a <Form> component.
 *
 * @example
 * <Formik initialValues={{}} onSubmit={handleSubmit}>
 *   <Form>
 *     <Field name="email" />
 *     <SubmitButton>Submit</SubmitButton>
 *   </Form>
 * </Formik>
 *
 * @example
 * // With custom pending text
 * <SubmitButton pendingText="Submitting...">
 *   Submit
 * </SubmitButton>
 *
 * @example
 * // With custom styling
 * <SubmitButton className="btn-primary">
 *   Submit
 * </SubmitButton>
 */

function SubmitButton(_ref) {
  var children = _ref.children,
      pendingText = _ref.pendingText,
      disabled = _ref.disabled,
      props = _objectWithoutPropertiesLoose(_ref, ["children", "pendingText", "disabled"]);

  // React 19: useFormStatus tracks parent <form> submission state
  // Note: This requires React 19+ and only works inside <form> with action prop
  // Try to use useFormStatus if available (React 19+)
  try {
    // @ts-ignore - useFormStatus may not be available in all React versions
    var formStatus = useFormStatus == null ? void 0 : useFormStatus();

    if (formStatus) {
      return createElement("button", _extends({
        type: "submit",
        disabled: disabled || formStatus.pending
      }, props), formStatus.pending && pendingText ? pendingText : children);
    }
  } catch (e) {// useFormStatus not available, fall through to legacy implementation
  } // Legacy fallback: Use Formik context
  // This provides backwards compatibility for React <19


  var _require = require('./FormikContext'),
      useFormikState = _require.useFormikState;

  var _useFormikState = useFormikState(),
      isSubmitting = _useFormikState.isSubmitting;

  return createElement("button", _extends({
    type: "submit",
    disabled: disabled || isSubmitting
  }, props), isSubmitting && pendingText ? pendingText : children);
}
SubmitButton.displayName = 'SubmitButton';

export { ErrorMessage, FastField, Field, FieldArray, Form, Formik, FormikConsumer, FormikContext, FormikProvider, SubmitButton, getActiveElement, getIn, _insert as insert, isEmptyArray, isEmptyChildren, isFunction, isInputEvent, isInteger, isNaN$1 as isNaN, isObject, isPromise, isString, _move as move, prepareDataForValidation, _replace as replace, setIn, setNestedObjectValues, _swap as swap, useField, useFormik, useFormikContext, useFormikMetadata, useFormikMethods, useFormikState, useFormikValues, validateYupSchema, yupToFormErrors };
//# sourceMappingURL=formik.esm.js.map
