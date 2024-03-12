/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { Trans, useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import {
  Layer,
  InlineNotification,
  ActionableNotification,
  Tag,
  FlexGrid,
  Row,
  Column,
  Link,
} from "@carbon/react";
import { ParamFileTextArea } from "../../ParamFileTextArea";
import {
  ACTION_UPDATE_PARAM_FILE_COPIED,
  ACTION_UPDATE_PARAM_FILE_MODIFIED,
  ACTION_UPDATE_PARAM_FILE_CONTENT,
  ACTION_UPDATE_APP_STEPS,
  ACTION_UPDATE_APP_IS_DIRTY,
  ACTION_UPDATE_APP_IS_DISABLED,
  LOCAL_STORAGE_KEY_APP_DOWNLOAD_PARAM_FILE,
  STATE_ORIGIN_USER,
  STATE_ORIGIN_STORAGE,
  DEFAULT_PARAM_FILE_NAME,
} from "../../../util/constants";
import { ApplicationContext } from "../../../App";
import { updateIsDisabled } from "../../../util/panel-utils";
import { saveParamFileContent } from "../../../util/param-file-util";
import "./_download-param-file.scss";

const DownloadParamFile = forwardRef(function DownloadParamFile(props, ref) {
  const { state: globalState, dispatch: globalDispatch } =
    React.useContext(ApplicationContext);
  const { t } = useTranslation();

  const { state, dispatch, setStep, stateToParamFile } = props;
  const publicRef = {
    persistState: () => {
      const paramFileContentToBePersisted = stateHasValidParamFileContents()
        ? state.paramFileContent
        : paramFileContent.data;

      isCompleteAndValid((error, isCompleteAndValid) => {
        let mergedSteps = {};

        if (!error) {
          mergedSteps = {
            ...globalState,
            steps: {
              ...globalState.steps,
              downloadParamFile: {
                ...globalState.steps.downloadParamFile,
                contents: paramFileContentToBePersisted,
                modified: state.paramFileContentModified,
                complete: true,
                invalid: false,
                origin: STATE_ORIGIN_USER,
              },
            },
          };
        } else if (isCompleteAndValid.isComplete) {
          mergedSteps = {
            ...globalState,
            steps: {
              ...globalState.steps,
              downloadParamFile: {
                ...globalState.steps.downloadParamFile,
                contents: paramFileContentToBePersisted,
                modified: state.paramFileContentModified,
                complete: isCompleteAndValid.isComplete,
                invalid: !isCompleteAndValid.isValid,
                origin: STATE_ORIGIN_USER,
              },
            },
          };
        } else {
          mergedSteps = {
            ...globalState,
            steps: {
              ...globalState.steps,
              downloadParamFile: {
                ...globalState.steps.downloadParamFile,
                contents: paramFileContentToBePersisted,
                modified: state.paramFileContentModified,
                disabled: false,
                complete: isCompleteAndValid.isComplete,
                invalid: !isCompleteAndValid.isValid,
                origin: STATE_ORIGIN_USER,
              },
            },
          };
        }

        globalDispatch({
          type: ACTION_UPDATE_APP_STEPS,
          nextSteps: mergedSteps.steps,
        });
        globalDispatch({
          type: ACTION_UPDATE_APP_IS_DIRTY,
          nextIsDirty: true,
        });
        globalDispatch({
          type: ACTION_UPDATE_APP_IS_DISABLED,
          nextSteps: updateIsDisabled(mergedSteps.steps),
        });
      });

      localStorage.setItem(
        LOCAL_STORAGE_KEY_APP_DOWNLOAD_PARAM_FILE,
        JSON.stringify({
          ...state,
          paramFileContent: paramFileContentToBePersisted,
          origin: STATE_ORIGIN_STORAGE,
        }),
      );
    },
  };

  useEffect(publicRef.persistState, [state]);
  useImperativeHandle(ref, () => publicRef);

  const stepLabels = {
    0: t("leftNavigation.progressStep.inputFileSelection.label"),
    1: t("leftNavigation.progressStep.information.label"),
    2: t("leftNavigation.progressStep.hint.label"),
    3: t("leftNavigation.progressStep.networkDevice.label"),
    4: t("leftNavigation.progressStep.networkAddress.label"),
    5: t("leftNavigation.progressStep.installationParameters.label"),
    6: t("leftNavigation.progressStep.downloadParamFile.label"),
    7: t("leftNavigation.progressStep.nextSteps.label"),
  };

  const paramFileContent = stateToParamFile(globalState);

  const updateCopied = () => {
    dispatch({
      type: ACTION_UPDATE_PARAM_FILE_COPIED,
      nextParamFileContentCopied: true,
    });

    const timer = setTimeout(() => {
      dispatch({
        type: ACTION_UPDATE_PARAM_FILE_COPIED,
        nextParamFileContentCopied: false,
      });
    }, 2000);
    return () => clearTimeout(timer);
  };

  const updateModified = (paramFileContentModified) => {
    dispatch({
      type: ACTION_UPDATE_PARAM_FILE_MODIFIED,
      nextParamFileContentModified: paramFileContentModified,
    });
  };

  const updateParamFileContent = (paramFileContent) => {
    dispatch({
      type: ACTION_UPDATE_PARAM_FILE_CONTENT,
      nextParamFileContent: paramFileContent,
    });
  };

  const saveParamFileContentProxy = () => {
    saveParamFileContent(
      stateHasValidParamFileContents()
        ? state.paramFileContent
        : paramFileContent.data,
      DEFAULT_PARAM_FILE_NAME,
    );
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
          const label = stepLabels[steps[property].index];

          incompleteListMarkup.push(
            <Tag
              onClick={() => {
                setStep(steps[property].index);
              }}
              className="download-param-file_incomplete-data-tag"
              type="cyan"
              title={label}
              id={`tag-incomplete__${property}`}
              key={`tag-incomplete__${property}`}
            >
              {label}
            </Tag>,
          );
        }
      }
    }
    if (paramFileContent.metadata.hasInvalidData) {
      for (const property in steps) {
        if (steps[property].invalid === true) {
          const label = stepLabels[steps[property].index];

          invalidListMarkup.push(
            <Tag
              onClick={() => {
                setStep(steps[property].index);
              }}
              className="download-param-file_invalid-data-tag"
              type="cyan"
              title={label}
              id={`tag-invalid__${property}`}
              key={`tag-invalid__${property}`}
            >
              {label}
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
    if (
      typeof state.paramFileContent === "string" &&
      state.paramFileContentModified
    ) {
      return true;
    }
    return false;
  };

  const resetParamFileTextAreaData = () => {
    const localParamFileContentValue = stateToParamFile(globalState);

    updateParamFileContent(localParamFileContentValue.data);
    updateModified(false);
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
  const modifiedDataMessageMarkup = (
    <>
      <span className="download-param-file_modified-data-message-text">
        {t("panel.downloadParamFile.modifiedDataNotificationSubtitle", {
          ns: "panels",
        })}
      </span>
      {state.paramFileContentModified && (
        <>
          <span>&nbsp;</span>
          <span className="download-param-file_modified-data-message-link-text">
            <Trans
              i18nKey="panel.downloadParamFile.modifiedDataNotificationLinkText"
              ns="panels"
            >
              You may&nbsp;
              <Link href="#" onClick={resetParamFileTextAreaData}>
                reset
              </Link>
              &nbsp; the generated data to its original state.
            </Trans>
          </span>
        </>
      )}
    </>
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
          resetContents={resetParamFileTextAreaData}
          downloadContents={saveParamFileContentProxy}
          onChange={(localParamFileContent) => {
            const localParamFileContentValue =
              localParamFileContent &&
              localParamFileContent.target &&
              localParamFileContent.target.value
                ? localParamFileContent.target.value
                : "";
            updateParamFileContent(localParamFileContentValue);
            if (localParamFileContentValue === paramFileContent.data) {
              updateModified(false);
            } else {
              updateModified(true);
            }
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
        <ActionableNotification
          inline
          hideCloseButton
          statusIconDescription="notification"
          subtitle={modifiedDataMessageMarkup}
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
    <Layer className="download-param-file_layer">
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
      isValid = !paramFileContent.metadata.hasIncompleteData;

      if (isComplete && isValid) {
        return callback(null, { isComplete, isValid });
      }
    }
    if (
      typeof paramFileContent.data === "string" &&
      paramFileContent.data.length > 0 &&
      !state.paramFileContentModified
    ) {
      isComplete = true;
      isValid = !paramFileContent.metadata.hasIncompleteData;

      if (isComplete && isValid) {
        return callback(null, { isComplete, isValid });
      }
    }

    return callback(new Error("Form data is incomplete or invalid"), {
      isComplete,
      isValid,
    });
  };

  return markup;
});

DownloadParamFile.propTypes = {
  setStep: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  stateToParamFile: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired,
};

export default DownloadParamFile;
