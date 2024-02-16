/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import {
  ACTION_UPDATE_DISTRIBUTION_NAME,
  ACTION_UPDATE_DISTRIBUTION_VERSION,
  ACTION_RESET_TO_INITIAL_STATE,
} from "../util/constants";

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION_RESET_TO_INITIAL_STATE:
      return action.nextInitialState;
    case ACTION_UPDATE_DISTRIBUTION_NAME:
      return {
        selectedDistributionName: action.nextSelectedDistributionName,
        selectedDistributionVersion: state.selectedDistributionVersion,
        origin: action.nextOrigin,
      };
    case ACTION_UPDATE_DISTRIBUTION_VERSION:
      return {
        selectedDistributionName: state.selectedDistributionName,
        selectedDistributionVersion: action.nextSelectedDistributionVersion,
        origin: action.nextOrigin,
      };
  }

  throw Error(`Unknown action: ${action.type}`);
};

export default reducer;
