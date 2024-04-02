/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { Trans, useTranslation } from "react-i18next";
import {
  Layer,
  InlineNotification,
  ActionableNotification,
  FlexGrid,
  Row,
  Column,
  Link,
} from "@carbon/react";
import { ParamFileTextArea } from "../../ParamFileTextArea";
import {
  LOCAL_STORAGE_KEY_APP_DOWNLOAD_PARAM_FILE,
  STATE_ORIGIN_USER,
  STATE_ORIGIN_STORAGE,
} from "../../../util/local-storage-constants";
import {
  DEFAULT_PARAM_FILE_NAME,
  RHEL_DISTRIBUTION_ID,
  PRESETS,
} from "../../../util/constants";
import {
  ApplicationContext,
  DownloadParamFileContext,
} from "../../../contexts";
import { updateIsDisabled as updateIsDisabledFromUtils } from "../../../util/panel-util";
import { resetParamFileTextAreaData } from "../../../uiUtil/panel-util";
import {
  saveParamFileContent,
  stateToParamFile,
} from "../../../util/param-file-util";
import "./_download-param-file.scss";

const DownloadParamFile = forwardRef(function DownloadParamFile(props, ref) {
  const {
    state: globalState,
    updateModified: globalUpdateModified,
    updateNextStep,
    updateIsDirty,
    updateIsDisabled,
  } = React.useContext(ApplicationContext);
  const { t } = useTranslation();
  const {
    state,
    updatParamFileCopied,
    updateModified,
    updateParamFileContent,
  } = React.useContext(DownloadParamFileContext);
  const distributionName =
    globalState.steps.inputFileSelection.distributionName ??
    RHEL_DISTRIBUTION_ID;
  const presets = PRESETS[distributionName];
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
                presets,
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
                presets,
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
                presets,
                modified: state.paramFileContentModified,
                disabled: false,
                complete: isCompleteAndValid.isComplete,
                invalid: !isCompleteAndValid.isValid,
                origin: STATE_ORIGIN_USER,
              },
            },
          };
        }

        updateNextStep(mergedSteps.steps);
        updateIsDirty(true);
        updateIsDisabled(updateIsDisabledFromUtils(mergedSteps.steps));
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

  const paramFileContent = stateToParamFile(globalState);

  const updateCopied = () => {
    updatParamFileCopied(true);

    const timer = setTimeout(() => {
      updatParamFileCopied(false);
    }, 2000);
    return () => clearTimeout(timer);
  };

  const saveParamFileContentProxy = () => {
    saveParamFileContent(
      stateHasValidParamFileContents()
        ? state.paramFileContent
        : paramFileContent.data,
      DEFAULT_PARAM_FILE_NAME,
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
              <Link
                onClick={() => {
                  resetParamFileTextAreaData({
                    updateParamFileContent,
                    globalUpdateModified,
                    updateModified,
                    state: globalState,
                  });
                }}
                className="download-param-file_modified-data-message-link-anchor"
              >
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
          resetContents={() => {
            resetParamFileTextAreaData({
              updateParamFileContent,
              globalUpdateModified,
              updateModified,
              state: globalState,
            });
          }}
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
            content: t("panel.downloadParamFile.paramFileHelp", {
              ns: "panels",
            }),
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
        <span className="download-param-file_copied-label">
          {t("copied.short", { ns: "common" })}.
        </span>
      ) : null}
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

export default DownloadParamFile;
