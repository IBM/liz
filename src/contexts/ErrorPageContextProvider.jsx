/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */
import React, { useReducer, useCallback } from "react";
import PropTypes from "prop-types";
import errorPageReducer from "../reducers/ErrorPageReducer";
import { createInitialState as createInitialErrorPageState } from "../states/ErrorPageState";
import {
  ACTION_RESET_TO_INITIAL_STATE,
  ACTION_UPDATE_APP_CONFIG,
} from "../util/reducer-action-constants";
import { ErrorPageContext } from "./index";

const ErrorPageContextProvider = ({ value, children }) => {
  const [state, dispatch] = useReducer(
    errorPageReducer,
    createInitialErrorPageState(),
  );

  const updateResetToInitialState = useCallback(
    (updates) => {
      dispatch({
        type: ACTION_RESET_TO_INITIAL_STATE,
        nextInitialState: createInitialErrorPageState(true),
      });
    },
    [state, dispatch],
  );

  const updateConfig = useCallback(
    (updates) => {
      dispatch({
        type: ACTION_UPDATE_APP_CONFIG,
        nextAppConfig: updates,
      });
    },
    [state, dispatch],
  );

  const resetToInitialState = useCallback(() => {
    updateResetToInitialState();
  }, [state, updateResetToInitialState]);

  const getContextValue = useCallback(
    () => ({
      ...value,
      state,
      updateConfig,
      resetToInitialState,
    }),
    [value, state, updateConfig, resetToInitialState],
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
