/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import {
  Layer,
  InlineNotification,
  Tag,
  FlexGrid,
  Row,
  Column,
} from "@carbon/react";
import { ParamFileTextArea } from "../../ParamFileTextArea";
import { RHEL_PRESET } from "../../../util/constants";
import "./_download-param-file.scss";

const DownloadParamFile = (
  patchState,
  stateToParamFile,
  globalState,
  localStorageKey,
) => {
  const { t } = useTranslation();
  const paramFileContent = stateToParamFile(globalState);
  const getInitialState = () => {
    const localParamFileContent =
      paramFileContent &&
      paramFileContent.data &&
      typeof paramFileContent.data === "string"
        ? paramFileContent.data
        : stateToParamFile(globalState).data;
    const initialState = JSON.parse(localStorage.getItem(localStorageKey));
    const defaultState = {
      paramFileContentCopied: false,
      paramFileContentModified: false,
      paramFileContent: localParamFileContent,
    };

    if (initialState) {
      return initialState;
    }
    return defaultState;
  };
  const [state, setState] = useState(getInitialState());

  const updateCopied = () => {
    setState((prevState) => ({ ...prevState, paramFileContentCopied: true }));
    const timer = setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        paramFileContentCopied: false,
      }));
    }, 2000);
    return () => clearTimeout(timer);
  };

  const updateModified = (paramFileContentModified) => {
    setState((prevState) => ({ ...prevState, paramFileContentModified }));
  };

  const updateParamFileContent = (paramFileContent) => {
    setState((prevState) => ({ ...prevState, paramFileContent }));
  };

  const destroyClickedElement = (event) => {
    // remove the link from the DOM
    document.body.removeChild(event.target);
  };

  const saveParamFileContent = () => {
    const textFileAsBlob = new Blob(
      [
        stateHasValidParamFileContents()
          ? state.paramFileContent
          : paramFileContent.data,
      ],
      {
        type: "text/plain",
      },
    );
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
  };

  const getContent = (value) => {
    return <p>{value}</p>;
  };

  const getIncompleteOrInvalidMarkup = () => {
    const incompleteListMarkup = [];
    const invalidListMarkup = [];
    const steps = paramFileContent.metadata.steps;

    if (paramFileContent.metadata.hasIncompleteData) {
      for (const property in steps) {
        if (steps[property].complete === false) {
          incompleteListMarkup.push(
            <Tag
              className="download-param-file_incomplete-data-tag"
              type="gray"
              title={property}
            >
              {property}
            </Tag>,
          );
        }
      }
    }
    if (paramFileContent.metadata.hasInvalidData) {
      for (const property in steps) {
        if (steps[property].invalid === true) {
          invalidListMarkup.push(
            <Tag
              className="download-param-file_invalid-data-tag"
              type="gray"
              title={property}
              id={`tag__${property}`}
            >
              {property}
            </Tag>,
          );
        }
      }
    }

    return (
      <div className="download-param-file_data-tag-container">
        {incompleteListMarkup.length > 0 && (
          <div className="download-param-file_data-tag_heading">
            {t("panel.downloadParamFile.stepsWithIncompleteData", {
              ns: "panels",
            })}
          </div>
        )}
        {incompleteListMarkup.length > 0 && incompleteListMarkup}
        {invalidListMarkup.length > 0 && (
          <div className="download-param-file_data-tag_heading">
            {t("panel.downloadParamFile.stepsWithInvalidData", {
              ns: "panels",
            })}
          </div>
        )}
        {invalidListMarkup.length > 0 && invalidListMarkup}
      </div>
    );
  };

  const stateHasValidParamFileContents = () => {
    if (typeof state.paramFileContent === "string") {
      return true;
    }
    return false;
  };

  const notificationMarkup = (
    <InlineNotification
      hideCloseButton
      statusIconDescription="notification"
      subtitle={t(
        "panel.downloadParamFile.incompletOrInvalidDataNotificationSubtitle",
        { ns: "panels" },
      )}
      title={t(
        "panel.downloadParamFile.incompletOrInvalidDataNotificationTitle",
        { ns: "panels" },
      )}
      kind="info"
      className="download-param-file__incomplete-data-banner"
    />
  );
  const gridContentsMarkup = (
    <>
      <div className="download-param-file_textarea-container">
        <ParamFileTextArea
          id="download-param-file_textarea"
          contents={
            stateHasValidParamFileContents()
              ? state.paramFileContent
              : paramFileContent.data
          }
          copyContents={updateCopied}
          resetContents={() => {
            const localParamFileContentValue = stateToParamFile(globalState);

            updateParamFileContent(localParamFileContentValue.data);
            updateModified(false);
          }}
          downloadContents={saveParamFileContent}
          onChange={(localParamFileContent) => {
            const localParamFileContentValue =
              localParamFileContent &&
              localParamFileContent.target &&
              localParamFileContent.target.value
                ? localParamFileContent.target.value
                : "";
            updateParamFileContent(localParamFileContentValue);
            updateModified(true);
          }}
          allowCopy
          allowReset={state.paramFileContentModified}
          allowDownload
          label={{
            text: t("panel.downloadParamFile.paramFileTextLabel", {
              ns: "panels",
            }),
            content: getContent(
              t("panel.downloadParamFile.paramFileHelp", { ns: "panels" }),
            ),
          }}
        />
      </div>
      {state.paramFileContentModified && (
        <InlineNotification
          hideCloseButton
          statusIconDescription="notification"
          subtitle={t(
            "panel.downloadParamFile.modifiedDataNotificationSubtitle",
            { ns: "panels" },
          )}
          title={t("panel.downloadParamFile.modifiedDataNotificationTitle", {
            ns: "panels",
          })}
          kind="warning"
          className="download-param-file__incomplete-data-banner"
        />
      )}
      {(paramFileContent.metadata.hasIncompleteData ||
        paramFileContent.metadata.hasInvalidData) &&
        notificationMarkup}
      {state.paramFileContentCopied ? (
        <span className="download-param-file_copied-label">Copied.</span>
      ) : null}
      {(paramFileContent.metadata.hasIncompleteData ||
        paramFileContent.metadata.hasInvalidData) &&
        getIncompleteOrInvalidMarkup()}
    </>
  );
  const markup = (
    <Layer>
      <FlexGrid className="download-param-file_grid">
        <Row>
          <Column>{gridContentsMarkup}</Column>
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
      return callback(null, { isComplete, isValid });
    }

    return callback(new Error("Form data is incomplete or invalid"), {
      isComplete,
      isValid,
    });
  };

  useEffect(() => {
    isCompleteAndValid((error, isCompleteAndValid) => {
      if (!error) {
        patchState({
          steps: {
            downloadParamFile: {
              contents: state.paramFileContent,
              presets: RHEL_PRESET,
              complete: true,
              invalid: false,
              localStorageKey,
            },
          },
        });
      } else if (isCompleteAndValid.isComplete) {
        patchState({
          steps: {
            downloadParamFile: {
              contents: state.paramFileContent,
              presets: RHEL_PRESET,
              complete: isCompleteAndValid.isComplete,
              invalid: !isCompleteAndValid.isValid,
              localStorageKey,
            },
          },
        });
      } else {
        patchState({
          steps: {
            downloadParamFile: {
              contents: state?.paramFileContent ?? "",
              presets: RHEL_PRESET,
              disabled: false,
              complete: isCompleteAndValid.isComplete,
              invalid: !isCompleteAndValid.isValid,
              localStorageKey,
            },
          },
        });
      }
    });

    localStorage.setItem(localStorageKey, JSON.stringify(state));
  }, [state]);

  return markup;
};

DownloadParamFile.propTypes = {
  patchState: PropTypes.func.isRequired,
  stateToParamFile: PropTypes.func.isRequired,
  globalState: PropTypes.func.isRequired,
  localStorageKey: PropTypes.string.isRequired,
};

export default DownloadParamFile;
