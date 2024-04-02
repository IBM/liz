/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */
import React, { useReducer, useCallback } from "react";
import PropTypes from "prop-types";
import errorPageReducer from "../reducers/ErrorPageReducer";
import { createInitialState as createInitialErrorPageState } from "../states/ErrorPageState";
import { ACTION_RESET_TO_INITIAL_STATE } from "../util/reducer-action-constants";
import { ErrorPageContext } from "./index";

const ErrorPageContextProvider = ({ value, children }) => {
  const [state, dispatch] = useReducer(
    errorPageReducer,
    createInitialErrorPageState(),
  );

  const updateResetToInitialState = () => {
    dispatch({
      type: ACTION_RESET_TO_INITIAL_STATE,
      nextInitialState: createInitialErrorPageState(true),
    });
  };

  const resetToInitialState = useCallback(() => {
    updateResetToInitialState();
  }, [state, updateResetToInitialState]);

  const getContextValue = useCallback(
    () => ({
      ...value,
      state,
      resetToInitialState,
    }),
    [value, state, resetToInitialState],
  );

  return (
    <ErrorPageContext.Provider value={getContextValue()}>
      {children}
    </ErrorPageContext.Provider>
  );
};

ErrorPageContextProvider.propTypes = {
  value: PropTypes.object,
  children: PropTypes.node,
};

export default ErrorPageContextProvider;
