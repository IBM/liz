/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { TextArea, Grid, Column } from "@carbon/react";

const MiscParameters = (patchState, localStorageKey) => {
  const getInitialState = () => {
    const initialState = JSON.parse(localStorage.getItem(localStorageKey));
    const defaultState = {
      miscParameterContent: ""
    };

    if (initialState) {
      return initialState
    }
    return defaultState;
  }
  const [state, setState] = useState(getInitialState);

  const updateMiscParameterContent = (miscParameterContent) => {
    setState((prevState) => ({...prevState, miscParameterContent}));
  }

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(state));
  });

  return (
    <Grid className="misc-parameters_grid" fullWidth>
      <Column sm={6} md={8} lg={16}>
        <TextArea
          labelText="Miscellaneous parameters"
          helperText=""
          rows={8}
          id="misc-parameters-input"
          onChange={(content) => {
            updateMiscParameterContent(content && content.target ? content.target.value : "");
            patchState({
              miscParameters: {
                params: state.miscParameterContent,
                complete: true,
                localStorageKey
              },
            });
          }}
        />
      </Column>
    </Grid>
  );
};

MiscParameters.propTypes = {
  patchState: PropTypes.func.isRequired,
  localStorageKey: PropTypes.string.isRequired
};

export default MiscParameters;
