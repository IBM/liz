/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */
import React, { useReducer, useCallback } from "react";
import PropTypes from "prop-types";
import informationReducer from "../reducers/InformationReducer";
import { createInitialState as createInitialInformationState } from "../states/InformationState";
import { ACTION_RESET_TO_INITIAL_STATE } from "../util/reducer-action-constants";
import { InformationContext } from "./index";

const InformationContextProvider = ({ value, children }) => {
  const [state, dispatch] = useReducer(
    informationReducer,
    createInitialInformationState(),
  );

  const updateResetToInitialState = useCallback(
    (updates) => {
      dispatch({
        type: ACTION_RESET_TO_INITIAL_STATE,
        nextInitialState: createInitialInformationState(true),
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
      resetToInitialState,
    }),
    [value, state, resetToInitialState],
  );

  return (
    <InformationContext.Provider value={getContextValue()}>
      {children}
    </InformationContext.Provider>
  );
};

InformationContextProvider.propTypes = {
  value: PropTypes.object,
  children: PropTypes.node,
};

export default InformationContextProvider;
