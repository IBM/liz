/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */
import React, { useReducer, useCallback } from "react";
import PropTypes from "prop-types";
import headerReducer from "../reducers/HeaderReducer";
import { createInitialState as createInitialHeaderState } from "../states/HeaderState";
import {
  ACTION_RESET_TO_INITIAL_STATE,
  ACTION_UPDATE_APP_HELP_PANEL_EXPANDED,
  ACTION_UPDATE_APP_SHOW_NOTIFICATION,
  ACTION_UPDATE_APP_SHOW_CONFIRMATION_MODAL,
  ACTION_UPDATE_NEEDS_MANUAL_NAVIGATION_CONFIRMATION,
} from "../util/reducer-action-constants";
import { HeaderContext } from "./index";

const HeaderContextProvider = ({ value, children }) => {
  const [state, dispatch] = useReducer(
    headerReducer,
    createInitialHeaderState(),
  );

  const updateResetToInitialState = () => {
    dispatch({
      type: ACTION_RESET_TO_INITIAL_STATE,
      nextInitialState: createInitialHeaderState(true),
    });
  };

  const updateIsHelpPanelExpanded = (isHelpPanelExpanded) => {
    dispatch({
      type: ACTION_UPDATE_APP_HELP_PANEL_EXPANDED,
      nextIsHelpPanelExpanded: isHelpPanelExpanded,
    });
  };

  const updateShowNotification = (showNotification) => {
    dispatch({
      type: ACTION_UPDATE_APP_SHOW_NOTIFICATION,
      nextShowNotification: showNotification,
    });
  };

  const updateShowConfirmationModal = (showConfirmationModal) => {
    dispatch({
      type: ACTION_UPDATE_APP_SHOW_CONFIRMATION_MODAL,
      nextShowConfirmationModal: showConfirmationModal,
    });
  };

  const updateNeedsManualNavigationConfirmation = (flag) => {
    dispatch({
      type: ACTION_UPDATE_NEEDS_MANUAL_NAVIGATION_CONFIRMATION,
      nextNeedsManualNavigationConfirmation: flag,
    });
  };

  const showNotification = (callback) => {
    if (callback) {
      if (state.showNotification) {
        updateShowNotification(false);
        return callback();
      }
      updateShowNotification(true);
      return callback();
    }
    return state.showNotification
      ? updateShowNotification(false)
      : updateShowNotification(true);
  };

  const closeNotification = (settingsWereDeleted) => {
    if (settingsWereDeleted && typeof settingsWereDeleted === "boolean") {
      showNotification(() => {
        return updateShowConfirmationModal(true);
      });
    }
    return updateShowNotification(false);
  };

  const resetToInitialState = useCallback(() => {
    updateResetToInitialState();
  }, [state, updateResetToInitialState]);

  const getContextValue = useCallback(
    () => ({
      ...value,
      state,
      updateNeedsManualNavigationConfirmation,
      updateShowConfirmationModal,
      updateIsHelpPanelExpanded,
      showNotification,
      closeNotification,
      resetToInitialState,
    }),
    [
      value,
      state,
      updateNeedsManualNavigationConfirmation,
      updateShowConfirmationModal,
      updateIsHelpPanelExpanded,
      showNotification,
      closeNotification,
      resetToInitialState,
    ],
  );

  return (
    <HeaderContext.Provider value={getContextValue()}>
      {children}
    </HeaderContext.Provider>
  );
};

HeaderContextProvider.propTypes = {
  value: PropTypes.object,
  children: PropTypes.node,
};

export default HeaderContextProvider;
