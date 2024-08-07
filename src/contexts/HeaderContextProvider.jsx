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
    ACTION_UPDATE_APP_HELP_PANEL_SELECTOR_PRIMARY_FOCUS,
    ACTION_UPDATE_NEEDS_MANUAL_NAVIGATION_CONFIRMATION,
    ACTION_UPDATE_MANUAL_NAVIGATION_ORIGIN,
} from "../util/reducer-action-constants";
import { HeaderContext } from "./index";

const HeaderContextProvider = ({ value, children }) => {
    const [state, dispatch] = useReducer(
        headerReducer,
        createInitialHeaderState()
    );

    const updateResetToInitialState = useCallback(
        (updates) => {
            dispatch({
                type: ACTION_RESET_TO_INITIAL_STATE,
                nextInitialState: createInitialHeaderState(true),
            });
        },
        [state, dispatch]
    );

    const updateIsHelpPanelExpanded = useCallback(
        (updates) => {
            dispatch({
                type: ACTION_UPDATE_APP_HELP_PANEL_EXPANDED,
                nextIsHelpPanelExpanded: updates,
            });
        },
        [state, dispatch]
    );

    const updateSelectorPrimaryFocus = useCallback(
        (updates) => {
            dispatch({
                type: ACTION_UPDATE_APP_HELP_PANEL_SELECTOR_PRIMARY_FOCUS,
                nextSelectorPrimaryFocus: updates,
            });
        },
        [state, dispatch]
    );

    const updateShowNotification = useCallback(
        (updates) => {
            dispatch({
                type: ACTION_UPDATE_APP_SHOW_NOTIFICATION,
                nextShowNotification: updates,
            });
        },
        [state, dispatch]
    );

    const updateShowConfirmationModal = useCallback(
        (updates) => {
            dispatch({
                type: ACTION_UPDATE_APP_SHOW_CONFIRMATION_MODAL,
                nextShowConfirmationModal: updates,
            });
        },
        [state, dispatch]
    );

    const updateManualNavigationOrigin = useCallback(
        (updates) => {
            dispatch({
                type: ACTION_UPDATE_MANUAL_NAVIGATION_ORIGIN,
                nextManualNavigationOrigin: updates,
            });
        },
        [state, dispatch]
    );

    const updateNeedsManualNavigationConfirmation = useCallback(
        (updates) => {
            dispatch({
                type: ACTION_UPDATE_NEEDS_MANUAL_NAVIGATION_CONFIRMATION,
                nextNeedsManualNavigationConfirmation: updates,
            });
        },
        [state, dispatch]
    );

    const showNotification = useCallback(
        (updates) => {
            if (updates) {
                if (state.showNotification) {
                    updateShowNotification(false);
                    return updates();
                }
                updateShowNotification(true);
                return updates();
            }
            return state.showNotification
                ? updateShowNotification(false)
                : updateShowNotification(true);
        },
        [state, dispatch, updateShowNotification]
    );

    const closeNotification = useCallback(
        (updates) => {
            if (updates && typeof updates === "boolean") {
                showNotification(() => {
                    return updateShowConfirmationModal(true);
                });
            }
            return updateShowNotification(false);
        },
        [state, showNotification, updateShowConfirmationModal]
    );

    const resetToInitialState = useCallback(() => {
        updateResetToInitialState();
    }, [state, updateResetToInitialState]);

    const getContextValue = useCallback(
        () => ({
            ...value,
            state,
            updateManualNavigationOrigin,
            updateNeedsManualNavigationConfirmation,
            updateShowConfirmationModal,
            updateIsHelpPanelExpanded,
            updateSelectorPrimaryFocus,
            showNotification,
            closeNotification,
            resetToInitialState,
        }),
        [
            value,
            state,
            updateManualNavigationOrigin,
            updateNeedsManualNavigationConfirmation,
            updateShowConfirmationModal,
            updateIsHelpPanelExpanded,
            updateSelectorPrimaryFocus,
            showNotification,
            closeNotification,
            resetToInitialState,
        ]
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
