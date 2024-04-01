/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */
import React, { useReducer } from "react";
import PropTypes from "prop-types";
import editPageReducer from "../reducers/EditPageReducer";
import { createInitialState as createInitialEditPageState } from "../states/EditPageState";
import { ACTION_RESET_TO_INITIAL_STATE } from "../util/reducer-action-constants";
import { EditPageContext } from "./index";

const EditPageContextProvider = ({ value, children }) => {
  const [state, dispatch] = useReducer(
    editPageReducer,
    createInitialEditPageState(),
  );

  const updateResetToInitialState = () => {
    dispatch({
      type: ACTION_RESET_TO_INITIAL_STATE,
      nextInitialState: createInitialEditPageState(),
    });
  };

  return (
    <EditPageContext.Provider
      value={{
        ...value,
        state,
        updateResetToInitialState,
      }}
    >
      {children}
    </EditPageContext.Provider>
  );
};

EditPageContextProvider.propTypes = {
  value: PropTypes.object,
  children: PropTypes.node,
};

export default EditPageContextProvider;
