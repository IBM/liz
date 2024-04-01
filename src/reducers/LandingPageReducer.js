/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import {
  ACTION_UPDATE_NOP,
  ACTION_RESET_TO_INITIAL_STATE,
  ACTION_UPDATE_PARMFILE_CARD_IS_EXPANDED,
  ACTION_UPDATE_REQUIREMENTS_CARD_IS_EXPANDED,
  ACTION_UPDATE_REQUIREMENTS_CARD_HAS_BEEN_REVIEWED,
  ACTION_UPDATE_NEXT_STEPS_CARD_IS_EXPANDED,
  ACTION_UPDATE_NEXT_STEPS_CARD_HAS_BEEN_REVIEWED,
} from "../util/reducer-action-constants";

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION_UPDATE_PARMFILE_CARD_IS_EXPANDED:
      return {
        ...state,
        parmfileCardIsExpanded: action.nextParmfileCardIsExpanded,
        origin: action.nextOrigin,
      };
    case ACTION_UPDATE_REQUIREMENTS_CARD_IS_EXPANDED:
      return {
        ...state,
        requirementsCardIsExpanded: action.nextRequirementsCardIsExpanded,
        origin: action.nextOrigin,
      };
    case ACTION_UPDATE_REQUIREMENTS_CARD_HAS_BEEN_REVIEWED:
      return {
        ...state,
        requirementsCardHasBeenReviewed:
          action.nextRequirementsCardHasBeenReviewed,
        origin: action.nextOrigin,
      };
    case ACTION_UPDATE_NEXT_STEPS_CARD_IS_EXPANDED:
      return {
        ...state,
        nextStepsCardIsExpanded: action.nextNextStepsCardIsExpanded,
        origin: action.nextOrigin,
      };
    case ACTION_UPDATE_NEXT_STEPS_CARD_HAS_BEEN_REVIEWED:
      return {
        ...state,
        nextStepsCardHasBeenReviewed: action.nextNextStepsCardHasBeenReviewed,
        origin: action.nextOrigin,
      };
    case ACTION_RESET_TO_INITIAL_STATE:
      // for combined states the state is prefixed by the reducer name
      return (
        action.nextInitialState.landingPageReducer || action.nextInitialState
      );
    case ACTION_UPDATE_NOP:
      return {};
  }

  throw Error(`Unknown action: ${action.type}`);
};

export default reducer;
