/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */
import React, { useReducer, useCallback } from "react";
import PropTypes from "prop-types";
import landingPageReducer from "../reducers/LandingPageReducer";
import { createInitialState as createInitialLandingPageState } from "../states/LandingPageState";
import {
  ACTION_RESET_TO_INITIAL_STATE,
  ACTION_UPDATE_PARMFILE_CARD_IS_EXPANDED,
  ACTION_UPDATE_REQUIREMENTS_CARD_IS_EXPANDED,
  ACTION_UPDATE_NEXT_STEPS_CARD_IS_EXPANDED,
  ACTION_UPDATE_REQUIREMENTS_CARD_HAS_BEEN_REVIEWED,
  ACTION_UPDATE_NEXT_STEPS_CARD_HAS_BEEN_REVIEWED,
} from "../util/reducer-action-constants";
import { STATE_ORIGIN_USER } from "../util/local-storage-constants";
import { LandingPageContext } from "./index";

const LandingPageContextProvider = ({ value, children }) => {
  const [state, dispatch] = useReducer(
    landingPageReducer,
    createInitialLandingPageState(),
  );

  const updateResetToInitialState = useCallback(
    (updates) => {
      dispatch({
        type: ACTION_RESET_TO_INITIAL_STATE,
        nextInitialState: createInitialLandingPageState(true),
      });
    },
    [state, dispatch],
  );

  const updateParmfileCardIsExpanded = useCallback(
    (updates) => {
      dispatch({
        type: ACTION_UPDATE_PARMFILE_CARD_IS_EXPANDED,
        nextOrigin: STATE_ORIGIN_USER,
        nextParmfileCardIsExpanded: updates,
      });
    },
    [state, dispatch],
  );

  const updateRequirementsCardIsExpanded = useCallback(
    (updates) => {
      dispatch({
        type: ACTION_UPDATE_REQUIREMENTS_CARD_IS_EXPANDED,
        nextOrigin: STATE_ORIGIN_USER,
        nextRequirementsCardIsExpanded: updates,
      });
    },
    [state, dispatch],
  );

  const updateNextStepsCardIsExpanded = useCallback(
    (updates) => {
      dispatch({
        type: ACTION_UPDATE_NEXT_STEPS_CARD_IS_EXPANDED,
        nextOrigin: STATE_ORIGIN_USER,
        nextNextStepsCardIsExpanded: updates,
      });
    },
    [state, dispatch],
  );

  const updateRequirementsCardHasBeenReviewed = useCallback(
    (updates) => {
      dispatch({
        type: ACTION_UPDATE_REQUIREMENTS_CARD_HAS_BEEN_REVIEWED,
        nextOrigin: STATE_ORIGIN_USER,
        nextRequirementsCardHasBeenReviewed: updates,
      });
    },
    [state, dispatch],
  );

  const updateNextStepsCardHasBeenReviewed = useCallback(
    (updates) => {
      dispatch({
        type: ACTION_UPDATE_NEXT_STEPS_CARD_HAS_BEEN_REVIEWED,
        nextOrigin: STATE_ORIGIN_USER,
        nextNextStepsCardHasBeenReviewed: updates,
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
      updateParmfileCardIsExpanded,
      updateRequirementsCardIsExpanded,
      updateNextStepsCardIsExpanded,
      updateRequirementsCardHasBeenReviewed,
      updateNextStepsCardHasBeenReviewed,
      resetToInitialState,
    }),
    [
      value,
      state,
      updateParmfileCardIsExpanded,
      updateRequirementsCardIsExpanded,
      updateNextStepsCardIsExpanded,
      updateRequirementsCardHasBeenReviewed,
      updateNextStepsCardHasBeenReviewed,
      resetToInitialState,
    ],
  );

  return (
    <LandingPageContext.Provider value={getContextValue()}>
      {children}
    </LandingPageContext.Provider>
  );
};

LandingPageContextProvider.propTypes = {
  value: PropTypes.object,
  children: PropTypes.node,
};

export default LandingPageContextProvider;
