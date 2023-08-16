/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, ButtonSet, TextArea, ToggletipLabel, Toggletip, ToggletipButton, ToggletipContent, Grid, Column } from "@carbon/react";
import { Information } from '@carbon/react/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import "./_download-param-file.scss";

const DownloadParamFile = (patchState, stateToParamFile, globalState, localStorageKey) => {
  const paramFileContent = stateToParamFile(globalState);
  const getInitialState = () => {
    const initialState = JSON.parse(localStorage.getItem(localStorageKey));
    const defaultState = {
      copied: false,
      paramFileContent
    };

    if (initialState) {
      return initialState
    }
    return defaultState;
  }
  const [state, setState] = useState(getInitialState);

  const updateCopied = () => {
    setState((prevState) => ({...prevState, copied: true}));
    const timer = setTimeout(() => {
      setState((prevState) => ({...prevState, copied: false}));
    }, 2000);
    return () => clearTimeout(timer);
  }

  const destroyClickedElement = (event) => {
    // remove the link from the DOM
    document.body.removeChild(event.target);
  }

  const saveParamFileContent = () => {
    const textFileAsBlob = new Blob([ paramFileContent ], { type: "text/plain" });
    const fileNameToSaveAs = "parmfile.txt";

    const downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null) {
      // Chrome allows the link to be clicked without actually adding it to the DOM.
      downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    } else {
      // Firefox requires the link to be added to the DOM before it can be clicked.
      downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
      downloadLink.onclick = destroyClickedElement;
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);
    }
  
    downloadLink.click();
  }

  const content = (
    <p>
      Lorem ipsum dolor sit amet, di os consectetur adipiscing elit, sed
      do eiusmod tempor incididunt ut fsil labore et dolore magna
      aliqua.
    </p>
  );

  const getLabel = (label, buttonLabel, content) => {
    return (
        <>
        <ToggletipLabel>{label}</ToggletipLabel>
        <Toggletip className="misc-parameters_info-icon" align="right-bottom">
            <ToggletipButton label={buttonLabel}>
            <Information/>
            </ToggletipButton>
            <ToggletipContent>
            {content}
            </ToggletipContent>
        </Toggletip>
        </>
    );
  }

  const markup = (
    <Grid className="download-param-file_grid" fullWidth>
      <Column sm={6} md={8} lg={16}>
        <TextArea
          enableCounter
          id="download-param-file_textarea"
          labelText={getLabel(
            "Param text file",
            "Show information",
            content
          )}
          className="download-param-file_textarea"
          rows={10}
          value={state.paramFileContent || paramFileContent}
        />
        {state.copied ? <span className="download-param-file_copied-label">Copied.</span> : null}
        <ButtonSet className="download-param-file_buttons">
          <CopyToClipboard text={state.paramFileValue || paramFileContent} onCopy={ updateCopied }>
            <Button kind="secondary" size="xl" className="download-param-file_button">
              Copy to clipboard
            </Button>
          </CopyToClipboard>
          <Button kind="primary" size="xl" className="download-param-file_button" onClick={ saveParamFileContent }>
            Download param file
          </Button>
        </ButtonSet>
      </Column>
    </Grid>
  );

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(state));
  });

  return (markup);
};

DownloadParamFile.propTypes = {
  patchState: PropTypes.func.isRequired,
  stateToParamFile: PropTypes.func.isRequired,
  globalState: PropTypes.func.isRequired,
  localStorageKey: PropTypes.string.isRequired
};

export default DownloadParamFile;
