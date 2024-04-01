/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */
import React, { useReducer, useCallback } from "react";
import PropTypes from "prop-types";
import inputFileSelectionReducer from "../reducers/InputFileSelectionReducer";
import { createInitialState as createInitialInputFileSelectionState } from "../states/InputFileSelectionState";
import {
  ACTION_UPDATE_DISTRIBUTION_NAME,
  ACTION_UPDATE_DISTRIBUTION_VERSION,
  ACTION_RESET_TO_INITIAL_STATE,
} from "../util/reducer-action-constants";
import { STATE_ORIGIN_USER } from "../util/local-storage-constants";
import { InputFileSelectionContext } from "./index";

const InputFileSelectionContextProvider = ({ value, children }) => {
  const [state, dispatch] = useReducer(
    inputFileSelectionReducer,
    createInitialInputFileSelectionState(),
  );

  const updateResetToInitialState = () => {
    dispatch({
      type: ACTION_RESET_TO_INITIAL_STATE,
      nextInitialState: createInitialInputFileSelectionState(true),
    });
  };

  const updateSelectedDistributionName = (selectedDistributionName) => {
    dispatch({
      type: ACTION_UPDATE_DISTRIBUTION_NAME,
      nextOrigin: STATE_ORIGIN_USER,
      nextSelectedDistributionName: selectedDistributionName,
    });
  };

  const updateSelectedDistributionVersion = (selectedDistributionVersion) => {
    dispatch({
      type: ACTION_UPDATE_DISTRIBUTION_VERSION,
      nextOrigin: STATE_ORIGIN_USER,
      nextSelectedDistributionVersion: selectedDistributionVersion,
    });
  };

  const resetToInitialState = useCallback(() => {
    updateResetToInitialState();
  }, [state, updateResetToInitialState]);

  const getContextValue = useCallback(
    () => ({
      ...value,
      state,
      updateSelectedDistributionName,
      updateSelectedDistributionVersion,
      resetToInitialState,
    }),
    [
      value,
      state,
      updateSelectedDistributionName,
      updateSelectedDistributionVersion,
      resetToInitialState,
    ],
  );

  return (
    <InputFileSelectionContext.Provider value={getContextValue()}>
      {children}
    </InputFileSelectionContext.Provider>
  );
};

InputFileSelectionContextProvider.propTypes = {
  value: PropTypes.object,
  children: PropTypes.node,
};

export default InputFileSelectionContextProvider;
