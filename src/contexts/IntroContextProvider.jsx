/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */
import React, { useReducer } from "react";
import PropTypes from "prop-types";
import introReducer from "../reducers/IntroReducer";
import { createInitialState as createInitialIntroState } from "../states/IntroState";
import {
  ACTION_RESET_TO_INITIAL_STATE,
  ACTION_UPDATE_INTRO_PURGE_PARMFILE_SETTINGS,
} from "../util/reducer-action-constants";
import { STATE_ORIGIN_USER } from "../util/local-storage-constants";
import { IntroContext } from "./index";

const IntroContextProvider = ({ value, children }) => {
  const [state, dispatch] = useReducer(introReducer, createInitialIntroState());

  const updateResetToInitialState = () => {
    dispatch({
      type: ACTION_RESET_TO_INITIAL_STATE,
      nextInitialState: createInitialIntroState(),
    });
  };

  const updatePurgeParmfileSettings = (flag) => {
    dispatch({
      type: ACTION_UPDATE_INTRO_PURGE_PARMFILE_SETTINGS,
      nextOrigin: STATE_ORIGIN_USER,
      nextPurgeParmfileSettings: flag,
    });
  };

  return (
    <IntroContext.Provider
      value={{
        ...value,
        state,
        updateResetToInitialState,
        updatePurgeParmfileSettings,
      }}
    >
      {children}
    </IntroContext.Provider>
  );
};

IntroContextProvider.propTypes = {
  value: PropTypes.object,
  children: PropTypes.node,
};

export default IntroContextProvider;
