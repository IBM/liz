/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import {
  Dropdown,
  /* FileUploader, */ FlexGrid,
  Row,
  Column,
  Layer,
  ActionableNotification,
} from "@carbon/react";
import {
  ACTION_UPDATE_DISTRIBUTION_NAME,
  ACTION_UPDATE_DISTRIBUTION_VERSION,
  ACTION_UPDATE_APP_STEPS,
  ACTION_UPDATE_APP_IS_DIRTY,
  ACTION_UPDATE_APP_IS_DISABLED,
  STATE_ORIGIN_USER,
  STATE_ORIGIN_STORAGE,
  DISTRIBUTION_LIST,
  VERSION_LIST,
  LOCAL_STORAGE_KEY_INPUT_FILE_SELECTION,
} from "../../../util/constants";
import { ApplicationContext } from "../../../App";
import { updateIsDisabled } from "../../../util/panel-utils";
import { resetParamFileTextAreaData } from "../../../uiUtil/panel-utils";
import "./_input-file-selection.scss";

const InputFileSelection = forwardRef(function InputFileSelection(props, ref) {
  const {
    state: globalState,
    dispatch: globalDispatch,
    downloadParamFileDispatch,
  } = React.useContext(ApplicationContext);
  const { t } = useTranslation();

  const { state, dispatch } = props;
  const publicRef = {
    persistState: () => {
      isComplete((error, isComplete) => {
        let mergedSteps = {};

        if (!error) {
          mergedSteps = {
            ...globalState,
            steps: {
              ...globalState.steps,
              inputFileSelection: {
                ...globalState.steps.inputFileSelection,
                distributionName:
                  state.selectedDistributionName &&
                  state.selectedDistributionName.id
                    ? state.selectedDistributionName.id
                    : "",
                distributionVersion:
                  state.selectedDistributionVersion &&
                  state.selectedDistributionVersion.id
                    ? state.selectedDistributionVersion.id
                    : "",
                complete: isComplete,
                disabled: false,
                invalid: false,
                origin: STATE_ORIGIN_USER,
              },
            },
          };

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
        }
      });

      localStorage.setItem(
        LOCAL_STORAGE_KEY_INPUT_FILE_SELECTION,
        JSON.stringify({
          ...state,
          origin: STATE_ORIGIN_STORAGE,
        }),
      );
    },
  };

  useEffect(publicRef.persistState, [state]);
  useImperativeHandle(ref, () => publicRef);

  const paramFileHasBeenModifiedFromState =
    globalState?.steps.downloadParamFile?.modified ?? false;
  const updateSelectedDistributionName = (
    selectedDistributionName,
    callback,
  ) => {
    dispatch({
      type: ACTION_UPDATE_DISTRIBUTION_NAME,
      nextOrigin: STATE_ORIGIN_USER,
      nextSelectedDistributionName: selectedDistributionName,
    });
  };

  const updateSelectedDistributionVersion = (
    selectedDistributionVersion,
    callback,
  ) => {
    dispatch({
      type: ACTION_UPDATE_DISTRIBUTION_VERSION,
      nextOrigin: STATE_ORIGIN_USER,
      nextSelectedDistributionVersion: selectedDistributionVersion,
    });
  };

  const isComplete = (callback) => {
    if (
      typeof state.selectedDistributionName === "object" &&
      typeof state.selectedDistributionName.label === "string" &&
      state.selectedDistributionName.label.length > 0 &&
      typeof state.selectedDistributionVersion === "object" &&
      typeof state.selectedDistributionVersion.label === "string" &&
      state.selectedDistributionVersion.label.length > 0
    ) {
      return callback(null, true);
    }
    return callback(null, false);
  };

  const parmfileHasBeenModifiedNotificationMarkup = (
    <ActionableNotification
      hideCloseButton
      inline
      lowContrast
      className="intro_parmfile-purge-banner"
      actionButtonLabel={t("btnLabel.Reset", { ns: "common" })}
      aria-label="closes notification"
      kind="info"
      onActionButtonClick={() => {
        resetParamFileTextAreaData(
          globalState,
          globalDispatch,
          downloadParamFileDispatch,
        );
      }}
      onClose={function noRefCheck() {}}
      onCloseButtonClick={function noRefCheck() {}}
      statusIconDescription="notification"
      subtitle={t("panel.parmFileHasBeenModifiedNotificationSubtitle", {
        ns: "common",
      })}
      title={t("modalHeading.discardParamFileModificationsPrompt")}
    />
  );

  const gridContentsMarkupRowOne = (
    <>
      {/* <div className="input-file-selection__heading">edgedancer9487</div> */}
    </>
  );
  const gridContentsMarkupRowTwo = (
    <>
      {/*
      <div>
        <div className="input-file-selection__subheading">
          {t("panel.inputFileSelection.hostOS", { ns: "panels" })}
        </div>
      </div>
      */}
    </>
  );
  const gridContentsMarkupRowThreeColumnOne = (
    <div>
      <div className="input-file-selection__contentRowDropdowns">
        <Dropdown
          readOnly={paramFileHasBeenModifiedFromState}
          aria-label={t(
            "panel.inputFileSelection.chooseDistributionFromeTemplateShort",
            { ns: "panels" },
          )}
          id="distribution-selection"
          items={DISTRIBUTION_LIST}
          titleText={t(
            "panel.inputFileSelection.chooseDistributionFromeTemplate",
            { ns: "panels" },
          )}
          label={t(
            "panel.inputFileSelection.chooseDistributionFromeTemplateShort",
            { ns: "panels" },
          )}
          size="md"
          warn={false}
          invalid={false}
          disabled={false}
          onChange={({ selectedItem }) => {
            if (paramFileHasBeenModifiedFromState) return;

            updateSelectedDistributionName(selectedItem);
          }}
          selectedItem={state.selectedDistributionName}
        />
        <Dropdown
          readOnly={paramFileHasBeenModifiedFromState}
          aria-label={t(
            "panel.inputFileSelection.chooseVersionFromeTemplateShort",
            { ns: "panels" },
          )}
          id="version-selection"
          items={VERSION_LIST}
          titleText={t("panel.inputFileSelection.chooseVersionFromeTemplate", {
            ns: "panels",
          })}
          label={t("panel.inputFileSelection.chooseVersionFromeTemplateShort", {
            ns: "panels",
          })}
          size="md"
          warn={false}
          invalid={false}
          disabled={false}
          onChange={({ selectedItem }) => {
            if (paramFileHasBeenModifiedFromState) return;

            updateSelectedDistributionVersion(selectedItem);
          }}
          selectedItem={state.selectedDistributionVersion}
        />
        {paramFileHasBeenModifiedFromState &&
          parmfileHasBeenModifiedNotificationMarkup}
      </div>
    </div>
  );
  const gridContentsMarkupRowThreeColumnTwo = (
    <div>
      <div></div>
      <div>
        {/*
        <FileUploader
          labelTitle="Already have a custom ISO file?"
          labelDescription="Drag and drop or upload your ISO file here."
          buttonLabel="Add file"
          buttonKind="primary"
          size="md"
          filenameStatus="edit"
          role="button"
          accept={[".iso"]}
          multiple={true}
          disabled={false}
          iconDescription="Delete file"
          name=""
        />
        */}
      </div>
    </div>
  );

  return (
    <Layer className="input-file-selection__layer">
      <FlexGrid className="input-file-selection__grid">
        <Row>
          <Column>{gridContentsMarkupRowOne}</Column>
        </Row>
        <Row>
          <Column>{gridContentsMarkupRowTwo}</Column>
        </Row>
        <Row>
          <Column>{gridContentsMarkupRowThreeColumnOne}</Column>
          <Column>{gridContentsMarkupRowThreeColumnTwo}</Column>
        </Row>
      </FlexGrid>
    </Layer>
  );
});

InputFileSelection.propTypes = {
  state: PropTypes.shape({
    selectedDistributionName: PropTypes.object.isRequired,
    selectedDistributionVersion: PropTypes.object.isRequired,
    origin: PropTypes.string.isRequired,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default InputFileSelection;
