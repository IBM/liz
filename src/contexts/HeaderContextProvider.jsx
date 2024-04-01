/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */
import React, { useReducer } from "react";
import PropTypes from "prop-types";
import headerReducer from "../reducers/HeaderReducer";
import { createInitialState as createInitialHeaderState } from "../states/HeaderState";
import {
  ACTION_RESET_TO_INITIAL_STATE,
  ACTION_UPDATE_APP_HELP_PANEL_EXPANDED,
  ACTION_UPDATE_APP_SHOW_NOTIFICATION,
  ACTION_UPDATE_APP_SHOW_CONFIRMATION_MODAL,
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
      nextInitialState: createInitialHeaderState(),
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

  return (
    <HeaderContext.Provider
      value={{
        ...value,
        state,
        updateShowConfirmationModal,
        updateResetToInitialState,
        updateIsHelpPanelExpanded,
        showNotification,
        closeNotification,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
};

HeaderContextProvider.propTypes = {
  value: PropTypes.object,
  children: PropTypes.node,
};

export default HeaderContextProvider;
