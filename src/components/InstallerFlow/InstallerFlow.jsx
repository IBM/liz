/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { ProgressIndicator, ProgressStep } from "@carbon/react";
import "./_installer-flow.scss";

const InstallerFlow = ({
  onProgress,
  progressStep,
  progressStepComplete,
  progressStepInvalid,
  progressStepDisabled,
}) => {
  const { t } = useTranslation();

  const descriptionForInvalidStep =
    "The data provided for this step is invalid.";
  const descriptionForCompleteStep =
    "The data required by this step is complete.";
  const descriptionForIncompleteStep =
    "The data required by this step is incomplete.";

  const getDescriptionForStep = (forStep) => {
    if (progressStepInvalid[forStep]) {
      return descriptionForInvalidStep;
    }
    if (progressStepComplete[forStep]) {
      return descriptionForCompleteStep;
    }
    return descriptionForIncompleteStep;
  };

  return (
    <>
      <div className="installer-flow__heading">
        {t("leftNavigation.gettingStartedHeader")}
      </div>
      <ProgressIndicator
        vertical
        currentIndex={progressStep}
        onChange={(index) => onProgress(index)}
      >
        <ProgressStep
          invalid={progressStepInvalid.inputFileSelection}
          complete={progressStepComplete.inputFileSelection}
          disabled={progressStepDisabled.inputFileSelection}
          current={progressStep === 0}
          label={t("leftNavigation.progressStep.inputFileSelection.label")}
          secondaryLabel={t(
            "leftNavigation.progressStep.inputFileSelection.secondaryLabel",
          )}
          description={getDescriptionForStep("inputFileSelection")}
        />
        <ProgressStep
          invalid={progressStepInvalid.information}
          complete={progressStepComplete.information}
          disabled={progressStepDisabled.information}
          current={progressStep === 1}
          label={t("leftNavigation.progressStep.information.label")}
          secondaryLabel={t(
            "leftNavigation.progressStep.information.secondaryLabel",
          )}
        />
        <ProgressStep
          invalid={progressStepInvalid.hint}
          complete={progressStepComplete.hint}
          disabled={progressStepDisabled.hint}
          current={progressStep === 2}
          label={t("leftNavigation.progressStep.hint.label")}
          secondaryLabel={t("leftNavigation.progressStep.hint.secondaryLabel")}
        />
        <ProgressStep
          invalid={progressStepInvalid.networkDevice}
          complete={progressStepComplete.networkDevice}
          disabled={progressStepDisabled.networkDevice}
          current={progressStep === 3}
          label={t("leftNavigation.progressStep.networkDevice.label")}
          secondaryLabel={t(
            "leftNavigation.progressStep.networkDevice.secondaryLabel",
          )}
          description={getDescriptionForStep("networkDevice")}
        />
        <ProgressStep
          invalid={progressStepInvalid.networkAddress}
          complete={progressStepComplete.networkAddress}
          disabled={progressStepDisabled.networkAddress}
          current={progressStep === 4}
          label={t("leftNavigation.progressStep.networkAddress.label")}
          secondaryLabel={t(
            "leftNavigation.progressStep.networkAddress.secondaryLabel",
          )}
          description={getDescriptionForStep("networkAddress")}
        />
        <ProgressStep
          invalid={progressStepInvalid.installationParameters}
          complete={progressStepComplete.installationParameters}
          disabled={progressStepDisabled.installationParameters}
          current={progressStep === 5}
          label={t("leftNavigation.progressStep.installationParameters.label")}
          secondaryLabel={t(
            "leftNavigation.progressStep.installationParameters.secondaryLabel",
          )}
          description={getDescriptionForStep("installationParameters")}
        />
        <ProgressStep
          invalid={progressStepInvalid.downloadParamFile}
          complete={progressStepComplete.downloadParamFile}
          disabled={progressStepDisabled.downloadParamFile}
          current={progressStep === 7}
          label={t("leftNavigation.progressStep.downloadParamFile.label")}
          secondaryLabel={t(
            "leftNavigation.progressStep.downloadParamFile.secondaryLabel",
          )}
          description={getDescriptionForStep("downloadParamFile")}
        />
        <ProgressStep
          invalid={progressStepInvalid.nextSteps}
          complete={progressStepComplete.nextSteps}
          disabled={progressStepDisabled.nextSteps}
          current={progressStep === 8}
          label={t("leftNavigation.progressStep.nextSteps.label")}
          secondaryLabel={t(
            "leftNavigation.progressStep.nextSteps.secondaryLabel",
          )}
        />
      </ProgressIndicator>
    </>
  );
};

InstallerFlow.propTypes = {
  onProgress: PropTypes.func.isRequired,
  progressStep: PropTypes.number.isRequired,
  progressStepComplete: PropTypes.shape({
    inputFileSelection: PropTypes.bool.isRequired,
    information: PropTypes.bool.isRequired,
    hint: PropTypes.bool.isRequired,
    networkDevice: PropTypes.bool.isRequired,
    networkAddress: PropTypes.bool.isRequired,
    installationParameters: PropTypes.bool.isRequired,
    downloadParamFile: PropTypes.bool.isRequired,
    nextSteps: PropTypes.bool.isRequired,
  }).isRequired,
  progressStepInvalid: PropTypes.shape({
    inputFileSelection: PropTypes.bool.isRequired,
    information: PropTypes.bool.isRequired,
    hint: PropTypes.bool.isRequired,
    networkDevice: PropTypes.bool.isRequired,
    networkAddress: PropTypes.bool.isRequired,
    installationParameters: PropTypes.bool.isRequired,
    downloadParamFile: PropTypes.bool.isRequired,
    nextSteps: PropTypes.bool.isRequired,
  }).isRequired,
  progressStepDisabled: PropTypes.shape({
    inputFileSelection: PropTypes.bool.isRequired,
    information: PropTypes.bool.isRequired,
    hint: PropTypes.bool.isRequired,
    networkDevice: PropTypes.bool.isRequired,
    networkAddress: PropTypes.bool.isRequired,
    installationParameters: PropTypes.bool.isRequired,
    downloadParamFile: PropTypes.bool.isRequired,
    nextSteps: PropTypes.bool.isRequired,
  }).isRequired,
};

export default InstallerFlow;
