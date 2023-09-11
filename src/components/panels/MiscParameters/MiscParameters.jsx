/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Layer, TextArea, ToggletipLabel, Toggletip, ToggletipButton, ToggletipContent, Grid, Column } from "@carbon/react";
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
    patchState({
      steps: {
        miscParameters: {
          complete: true,
          disabled: true,
          invalid: false
        }
      }
    });
  }, []);

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
    <Layer>
      <Grid className="misc-parameters_grid" fullWidth>
        <Column sm={4} md={6} lg={10}>
          <TextArea
            labelText={textAreaLabel}
            helperText=""
            rows={8}
            id="misc-parameters-input"
            className="misc-parameters_textarea"
            defaultValue={state.miscParameterContent}
            value={state.miscParameterContent}
            onChange={(localMiscParameterContent) => {
              const localMiscParameterContentValue = localMiscParameterContent && localMiscParameterContent.target && localMiscParameterContent.target.value
                ? localMiscParameterContent.target.value
                : "";
              updateMiscParameterContent(localMiscParameterContentValue);
            }}
            onBlur={(content) => {
              patchState({
                steps: {
                  miscParameters: {
                    params: state.miscParameterContent,
                    complete: true,
                    localStorageKey
                  }
                }
              });
            }}
          />
        </Column>
      </Grid>
    </Layer>
  );
};

MiscParameters.propTypes = {
  patchState: PropTypes.func.isRequired,
  localStorageKey: PropTypes.string.isRequired
};

export default MiscParameters;
