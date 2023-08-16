/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { TextArea, ToggletipLabel, Toggletip, ToggletipButton, ToggletipContent, Grid, Column } from "@carbon/react";
import { Information } from '@carbon/react/icons';
import "./_misc-parameters.scss";

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

  const textAreaLabel = (
    <>
      <ToggletipLabel>Miscellaneous parameters</ToggletipLabel>
      <Toggletip className="misc-parameters_info-icon" align="right-bottom">
        <ToggletipButton label="Show information">
          <Information/>
        </ToggletipButton>
        <ToggletipContent>
          <p>
            Lorem ipsum dolor sit amet, di os consectetur adipiscing elit, sed
            do eiusmod tempor incididunt ut fsil labore et dolore magna
            aliqua.
          </p>
        </ToggletipContent>
      </Toggletip>
    </>
  );

  return (
    <Grid className="misc-parameters_grid" fullWidth>
      <Column sm={6} md={8} lg={16}>
        <TextArea
          labelText={textAreaLabel}
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
