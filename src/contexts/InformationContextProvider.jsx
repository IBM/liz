/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */
import React, { useReducer } from "react";
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

  const updateResetToInitialState = () => {
    dispatch({
      type: ACTION_RESET_TO_INITIAL_STATE,
      nextInitialState: createInitialInformationState(),
    });
  };

  return (
    <InformationContext.Provider
      value={{
        ...value,
        state,
        dispatch,
        updateResetToInitialState,
      }}
    >
      {children}
    </InformationContext.Provider>
  );
};

InformationContextProvider.propTypes = {
  value: PropTypes.object,
  children: PropTypes.node,
};

export default InformationContextProvider;
