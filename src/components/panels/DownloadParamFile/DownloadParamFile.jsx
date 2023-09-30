/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Layer,
  Button,
  ButtonSet,
  InlineNotification,
  TextArea,
  ToggletipLabel,
  Toggletip,
  ToggletipButton,
  ToggletipContent,
  FlexGrid,
  Row,
  Column
} from "@carbon/react";
import { Information } from '@carbon/react/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import "./_download-param-file.scss";

const DownloadParamFile = (patchState, stateToParamFile, globalState, localStorageKey) => {
  const paramFileContent = stateToParamFile(globalState);
  const getInitialState = () => {
    const localParamFileContent = paramFileContent && paramFileContent.contents && typeof paramFileContent === "string"
      ? paramFileContent.contents
      : stateToParamFile(globalState).contents;
    const initialState = JSON.parse(localStorage.getItem(localStorageKey));
    const defaultState = {
      copied: false,
      modified: false,
      paramFileContent: localParamFileContent
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

  const updateModified = (modified) => {
    setState((prevState) => ({...prevState, modified}));
  }

  const updateParamFileContent = (paramFileContent) => {
    setState((prevState) => ({...prevState, paramFileContent}));
  }

  const destroyClickedElement = (event) => {
    // remove the link from the DOM
    document.body.removeChild(event.target);
  }

  const saveParamFileContent = () => {
    const textFileAsBlob = new Blob([ paramFileContent.contents ], { type: "text/plain" });
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

  const textAreaModifiedClass = state.modified ? "download-param-file_textarea__modified": "";
  const textAreaClasses = `download-param-file_textarea ${textAreaModifiedClass}`;
  const buttonPaddingClass = (paramFileContent.hasIncompleteData || state.modified) ? "download-param-file_buttons__padding" : "";
  const buttonClasses = `download-param-file_buttons ${buttonPaddingClass}`;

  const gridContentsMarkup = (
    <>
      <TextArea
        enableCounter
        id="download-param-file_textarea"
        labelText={getLabel(
          "Param text file",
          "Show information",
          content
        )}
        className={textAreaClasses}
        rows={10}
        value={state.paramFileContent ? state.paramFileContent : paramFileContent.contents}
        onChange={(localParamFileContent) => {
          const localParamFileContentValue = localParamFileContent && localParamFileContent.target && localParamFileContent.target.value
            ? localParamFileContent.target.value
            : "";
          updateParamFileContent(localParamFileContentValue);
          updateModified(true);
        }}
      >
      </TextArea>
      {paramFileContent.hasIncompleteData &&
        <InlineNotification
          hideCloseButton
          statusIconDescription="notification"
          subtitle="The data provided is incomplete or invalid. The param file generated may be unusable."
          title="Incomplete data."
          kind="info"
          className="download-param-file__incomplete-data-banner"
        />
      }
      {state.modified &&
        <InlineNotification
          hideCloseButton
          statusIconDescription="notification"
          subtitle="The data provided has been modified. The param file generated may be unusable."
          title="Modified data."
          kind="warning"
          className="download-param-file__incomplete-data-banner"
      />
      }
      {state.copied ? <span className="download-param-file_copied-label">Copied.</span> : null}
      <ButtonSet className={buttonClasses}>
        <CopyToClipboard text={state.paramFileContent || paramFileContent.contents} onCopy={ updateCopied }>
          <Button kind="secondary" size="xl" className="download-param-file_button">
            Copy to clipboard
          </Button>
        </CopyToClipboard>
        {state.modified &&
          <Button kind="secondary" size="xl" className="download-param-file_button" onClick={() => {
            const localParamFileContentValue = stateToParamFile(globalState);

            updateParamFileContent(localParamFileContentValue.contents);
            updateModified(false);
          }}>
              Reset param file
          </Button>
        }
        <Button kind="primary" size="xl" className="download-param-file_button" onClick={ saveParamFileContent }>
          Download param file
        </Button>
      </ButtonSet>
    </>
  );
  const markup = (
    <Layer>
      <FlexGrid className="download-param-file_grid">
        <Row>
          <Column>
            {gridContentsMarkup}
          </Column>
        </Row>
      </FlexGrid>
    </Layer>
  );

  const isCompleteAndValid = (callback) => {
    let isComplete = false;
    let isValid = false;
  
    if (
      typeof state.paramFileContent === "string" &&
      state.paramFileContent.length > 0
    ) {
      isComplete = true;
      isValid = !paramFileContent.hasIncompleteData;
    }

    if (isComplete && isValid) {
      return callback(null, {isComplete, isValid});
    }

    return callback(new Error('Form data is incomplete or invalid'), {isComplete, isValid});
  }

  useEffect(() => {
    isCompleteAndValid((error, isCompleteAndValid) => {
      if (!error) {
        patchState({
          steps: {
            downloadParamFile: {
              contents: state.paramFileContent,
              complete: true,
              invalid: false,
              localStorageKey
            }
          }
        });
      } else if (isCompleteAndValid.isComplete) {
        patchState({
          steps: {
            downloadParamFile: {
              contents: state.paramFileContent,
              complete: isCompleteAndValid.isComplete,
              invalid: !isCompleteAndValid.isValid,
              localStorageKey
            }
          }
        });
      } else {
        patchState({
          steps: {
            downloadParamFile: {
              complete: false,
              disabled: false,
              invalid: true
            }
          }
        });
      }
    });

    localStorage.setItem(localStorageKey, JSON.stringify(state));
  }, [state]);

  return (markup);
};

DownloadParamFile.propTypes = {
  patchState: PropTypes.func.isRequired,
  stateToParamFile: PropTypes.func.isRequired,
  globalState: PropTypes.func.isRequired,
  localStorageKey: PropTypes.string.isRequired
};

export default DownloadParamFile;
