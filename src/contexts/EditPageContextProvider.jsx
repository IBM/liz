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

  const updateResetToInitialState = useCallback(
    (updates) => {
      dispatch({
        type: ACTION_RESET_TO_INITIAL_STATE,
        nextInitialState: createInitialEditPageState(true),
      });
    },
    [state, dispatch],
  );

  const updateHasTabs = useCallback(
    (updates) => {
      dispatch({
        type: ACTION_UPDATE_APP_HAS_TABS,
        nextHasTabs: updates,
      });
    },
    [state, dispatch],
  );

  const updateTabs = useCallback(
    (updates) => {
      dispatch({
        type: ACTION_UPDATE_APP_TABS,
        nextTabs: updates,
      });
    },
    [status, dispatch],
  );

  const addTabs = useCallback(
    (updates) => {
      updateHasTabs(true);
      updateTabs(updates);
    },
    [state, dispatch, updateHasTabs, updateTabs],
  );

  const removeTabs = useCallback(
    (updates) => {
      updateHasTabs(false);
      updateTabs(undefined);
    },
    [state, updateHasTabs, updateHasTabs, updateTabs],
  );

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
