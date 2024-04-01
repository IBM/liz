/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */
import React, { useReducer } from "react";
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

  const updateResetToInitialState = () => {
    dispatch({
      type: ACTION_RESET_TO_INITIAL_STATE,
      nextInitialState: createInitialLandingPageState(),
    });
  };

  const updateParmfileCardIsExpanded = (flag) => {
    dispatch({
      type: ACTION_UPDATE_PARMFILE_CARD_IS_EXPANDED,
      nextOrigin: STATE_ORIGIN_USER,
      nextParmfileCardIsExpanded: flag,
    });
  };

  const updateRequirementsCardIsExpanded = (flag) => {
    dispatch({
      type: ACTION_UPDATE_REQUIREMENTS_CARD_IS_EXPANDED,
      nextOrigin: STATE_ORIGIN_USER,
      nextRequirementsCardIsExpanded: flag,
    });
  };

  const updateNextStepsCardIsExpanded = (flag) => {
    dispatch({
      type: ACTION_UPDATE_NEXT_STEPS_CARD_IS_EXPANDED,
      nextOrigin: STATE_ORIGIN_USER,
      nextNextStepsCardIsExpanded: flag,
    });
  };

  const updateRequirementsCardHasBeenReviewed = (flag) => {
    dispatch({
      type: ACTION_UPDATE_REQUIREMENTS_CARD_HAS_BEEN_REVIEWED,
      nextOrigin: STATE_ORIGIN_USER,
      nextRequirementsCardHasBeenReviewed: flag,
    });
  };

  const updateNextStepsCardHasBeenReviewed = (flag) => {
    dispatch({
      type: ACTION_UPDATE_NEXT_STEPS_CARD_HAS_BEEN_REVIEWED,
      nextOrigin: STATE_ORIGIN_USER,
      nextNextStepsCardHasBeenReviewed: flag,
    });
  };

  return (
    <LandingPageContext.Provider
      value={{
        ...value,
        state,
        updateResetToInitialState,
        updateParmfileCardIsExpanded,
        updateRequirementsCardIsExpanded,
        updateNextStepsCardIsExpanded,
        updateRequirementsCardHasBeenReviewed,
        updateNextStepsCardHasBeenReviewed,
      }}
    >
      {children}
    </LandingPageContext.Provider>
  );
};

LandingPageContextProvider.propTypes = {
  value: PropTypes.object,
  children: PropTypes.node,
};

export default LandingPageContextProvider;
