/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */
import React, { useReducer, useCallback } from "react";
import PropTypes from "prop-types";
import editPageReducer from "../reducers/EditPageReducer";
import { createInitialState as createInitialEditPageState } from "../states/EditPageState";
import {
  ACTION_RESET_TO_INITIAL_STATE,
  ACTION_UPDATE_APP_HAS_TABS,
  ACTION_UPDATE_APP_TABS,
} from "../util/reducer-action-constants";
import { EditPageContext } from "./index";

const EditPageContextProvider = ({ value, children }) => {
  const [state, dispatch] = useReducer(
    editPageReducer,
    createInitialEditPageState(),
  );

  const updateResetToInitialState = () => {
    dispatch({
      type: ACTION_RESET_TO_INITIAL_STATE,
      nextInitialState: createInitialEditPageState(true),
    });
  };

  const updateHasTabs = (flag) => {
    dispatch({
      type: ACTION_UPDATE_APP_HAS_TABS,
      nextHasTabs: flag,
    });
  };

  const updateTabs = (tabs) => {
    dispatch({
      type: ACTION_UPDATE_APP_TABS,
      nextTabs: tabs,
    });
  };

  const addTabs = (tabs) => {
    updateHasTabs(true);
    updateTabs(tabs);
  };

  const removeTabs = () => {
    updateHasTabs(false);
    updateTabs(undefined);
  };

  const resetToInitialState = useCallback(() => {
    updateResetToInitialState();
  }, [state, updateResetToInitialState]);

  const getContextValue = useCallback(
    () => ({
      ...value,
      state,
      addTabs,
      removeTabs,
      updateHasTabs,
      updateTabs,
      resetToInitialState,
    }),
    [
      value,
      state,
      addTabs,
      removeTabs,
      updateHasTabs,
      updateTabs,
      resetToInitialState,
    ],
  );

  return (
    <EditPageContext.Provider value={getContextValue()}>
      {children}
    </EditPageContext.Provider>
  );
};

EditPageContextProvider.propTypes = {
  value: PropTypes.object,
  children: PropTypes.node,
};

export default EditPageContextProvider;
