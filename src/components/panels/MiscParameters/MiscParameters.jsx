/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Layer, FlexGrid, Row, Column } from "@carbon/react";
import { ParamFileTextArea } from "../../ParamFileTextArea";
import "./_misc-parameters.scss";

const MiscParameters = (patchState, localStorageKey) => {
  const DEFAULT_PARAM_CONTENT = "ro ramdisk_size=40000 cio_ignore=all,!condev";
  const getInitialState = () => {
    const initialState = JSON.parse(localStorage.getItem(localStorageKey));
    const defaultState = {
      miscParameterContent: DEFAULT_PARAM_CONTENT,
      miscParameterContentCopied: false,
      miscParameterContentModified: false,
    };

    if (initialState) {
      return initialState;
    }
    return defaultState;
  };
  const [state, setState] = useState(getInitialState());

  const updateMiscParameterContent = (miscParameterContent) => {
    setState((prevState) => ({ ...prevState, miscParameterContent }));
  };

  const updateCopied = () => {
    setState((prevState) => ({
      ...prevState,
      miscParameterContentCopied: true,
    }));
    const timer = setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        miscParameterContentCopied: false,
      }));
    }, 2000);
    return () => clearTimeout(timer);
  };

  const updateModified = (miscParameterContentModified) => {
    setState((prevState) => ({ ...prevState, miscParameterContentModified }));
  };

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(state));
    // Since the data is user provided and won't be validated
    // it is considered to be always valid and thus complete.
    // This also applies if no data has been provided.
    patchState({
      steps: {
        miscParameters: {
          params: state.miscParameterContent,
          complete: true,
          disabled: true,
          invalid: false,
          localStorageKey,
        },
      },
    });
  }, [state]);

  const content = (
    <p>
      Lorem ipsum dolor sit amet, di os consectetur adipiscing elit, sed do
      eiusmod tempor incididunt ut fsil labore et dolore magna aliqua.
    </p>
  );

  const gridContentsMarkup = (
    <>
      <div className="misc-parameters_textarea-container">
        <ParamFileTextArea
          id="misc-parameters_textarea"
          contents={
            state.miscParameterContent
              ? state.miscParameterContent
              : DEFAULT_PARAM_CONTENT
          }
          copyContents={updateCopied}
          resetContents={() => {
            updateMiscParameterContent("");
            updateModified(false);
          }}
          onChange={(localMiscParameterContent) => {
            const localMiscParameterContentValue =
              localMiscParameterContent &&
              localMiscParameterContent.target &&
              localMiscParameterContent.target.value
                ? localMiscParameterContent.target.value
                : "";
            updateMiscParameterContent(localMiscParameterContentValue);
            updateModified(true);
          }}
          allowCopy
          allowReset={state.miscParameterContentModified}
          label={{
            text: "Miscellaneous parameters",
            content,
          }}
        />
      </div>
      {state.miscParameterContentCopied ? (
        <span className="misc-parameters_copied-label">Copied.</span>
      ) : null}
    </>
  );

  const markup = (
    <Layer>
      <FlexGrid className="misc-parameters_grid">
        <Row>
          <Column>{gridContentsMarkup}</Column>
        </Row>
      </FlexGrid>
    </Layer>
  );

  return markup;
};

MiscParameters.propTypes = {
  patchState: PropTypes.func.isRequired,
  localStorageKey: PropTypes.string.isRequired,
};

export default MiscParameters;
