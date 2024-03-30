/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import {
  LOCAL_STORAGE_KEY_APP_DOWNLOAD_PARAM_FILE,
  LOCAL_STORAGE_KEY_APP_SUMMARY,
  LOCAL_STORAGE_KEY_APP_HINT,
  LOCAL_STORAGE_KEY_APP_INFORMATION,
  LOCAL_STORAGE_KEY_INPUT_FILE_SELECTION,
  LOCAL_STORAGE_KEY_APP_INSTALLATION_PARAMETERS,
  LOCAL_STORAGE_KEY_APP_INTRO,
  LOCAL_STORAGE_KEY_APP_NETWORK_ADDRESS,
  LOCAL_STORAGE_KEY_APP_NETWORK_DEVICE,
  LOCAL_STORAGE_KEY_APP_NEXT_STEPS,
  LOCAL_STORAGE_KEY_APP,
  LOCAL_STORAGE_KEY_APP_LANDING_PAGE,
  LOCAL_STORAGE_KEY_APP_INLINE_NOTIFICATION,
} from "./constants";

const getLocalStorageContentsForDownloadParamFileStep = () => {
  const downloadParamFileString = localStorage.getItem(
    LOCAL_STORAGE_KEY_APP_DOWNLOAD_PARAM_FILE,
  );
  const downloadParamFile =
    typeof downloadParamFileString === "string"
      ? JSON.parse(downloadParamFileString)
      : {};

  return downloadParamFile;
};

const getLocalStorageContentsForHintStep = () => {
  const hintString = localStorage.getItem(LOCAL_STORAGE_KEY_APP_HINT);
  const hint = typeof hintString === "string" ? JSON.parse(hintString) : {};

  return hint;
};

const getLocalStorageContentsForInformationStep = () => {
  const informationString = localStorage.getItem(
    LOCAL_STORAGE_KEY_APP_INFORMATION,
  );
  const information =
    typeof informationString === "string" ? JSON.parse(informationString) : {};

  return information;
};

const getLocalStorageContentsForInputFileSelectionStep = () => {
  const inputFileSelectionString = localStorage.getItem(
    LOCAL_STORAGE_KEY_INPUT_FILE_SELECTION,
  );
  const inputFileSelection =
    typeof inputFileSelectionString === "string"
      ? JSON.parse(inputFileSelectionString)
      : {};

  return inputFileSelection;
};

const getLocalStorageContentsForInstallationParameterStep = () => {
  const installationParameterString = localStorage.getItem(
    LOCAL_STORAGE_KEY_APP_INSTALLATION_PARAMETERS,
  );
  const installationParameter =
    typeof installationParameterString === "string"
      ? JSON.parse(installationParameterString)
      : {};

  return installationParameter;
};

const getLocalStorageContentsForIntroStep = () => {
  const introString = localStorage.getItem(LOCAL_STORAGE_KEY_APP_INTRO);
  const intro = typeof introString === "string" ? JSON.parse(introString) : {};

  return intro;
};

const getLocalStorageContentsForNetworkAddressStep = () => {
  const networkAddressString = localStorage.getItem(
    LOCAL_STORAGE_KEY_APP_NETWORK_ADDRESS,
  );
  const networkAddress =
    typeof networkAddressString === "string"
      ? JSON.parse(networkAddressString)
      : {};

  return networkAddress;
};

const getLocalStorageContentsForNetworkDeviceStep = () => {
  const networkDeviceString = localStorage.getItem(
    LOCAL_STORAGE_KEY_APP_NETWORK_DEVICE,
  );
  const networkDevice =
    typeof networkDeviceString === "string"
      ? JSON.parse(networkDeviceString)
      : {};

  return networkDevice;
};

const getLocalStorageContentsForNextStepStep = () => {
  const nextStepsString = localStorage.getItem(
    LOCAL_STORAGE_KEY_APP_NEXT_STEPS,
  );
  const nextSteps =
    typeof nextStepsString === "string" ? JSON.parse(nextStepsString) : {};

  return nextSteps;
};

const getLocalStorageContentsForSummaryStep = () => {
  const summaryString = localStorage.getItem(LOCAL_STORAGE_KEY_APP_SUMMARY);
  const summary =
    typeof summaryString === "string" ? JSON.parse(summaryString) : {};

  return summary;
};

const getLocalStorageContentsForLandingPage = () => {
  const landingPageString = localStorage.getItem(
    LOCAL_STORAGE_KEY_APP_LANDING_PAGE,
  );
  const landingPage =
    typeof landingPageString === "string" ? JSON.parse(landingPageString) : {};

  return landingPage;
};

const nextStepsCardHasBeenReviewed = () => {
  const landingPage = getLocalStorageContentsForLandingPage();
  return landingPage.nextStepsCardHasBeenReviewed;
};

const nextStepsCardIsExpanded = () => {
  const landingPage = getLocalStorageContentsForLandingPage();
  return landingPage.nextStepsCardIsExpanded;
};

const parmfileCardIsExpanded = () => {
  const landingPage = getLocalStorageContentsForLandingPage();
  return landingPage.parmfileCardIsExpanded;
};

const requirementsCardHasBeenReviewed = () => {
  const landingPage = getLocalStorageContentsForLandingPage();
  return landingPage.requirementsCardHasBeenReviewed;
};

const requirementsCardIsExpanded = () => {
  const landingPage = getLocalStorageContentsForLandingPage();
  return landingPage.requirementsCardIsExpanded;
};

const hasLocalStorageState = () => {
  const downloadParamFileStep =
    getLocalStorageContentsForDownloadParamFileStep();
  const summary = getLocalStorageContentsForSummaryStep();
  const information = getLocalStorageContentsForInformationStep();
  const inputFileSelection = getLocalStorageContentsForInputFileSelectionStep();
  const installationParameter =
    getLocalStorageContentsForInstallationParameterStep();
  const networkAddress = getLocalStorageContentsForNetworkAddressStep();
  const networkDevive = getLocalStorageContentsForNetworkDeviceStep();

  if (
    downloadParamFileStep &&
    Object.keys(downloadParamFileStep).length > 0 &&
    summary &&
    Object.keys(summary).length > 0 &&
    information &&
    Object.keys(information).length > 0 &&
    inputFileSelection &&
    Object.keys(inputFileSelection).length > 0 &&
    installationParameter &&
    Object.keys(installationParameter).length > 0 &&
    networkAddress &&
    Object.keys(networkAddress).length > 0 &&
    networkDevive &&
    Object.keys(networkDevive).length > 0
  ) {
    return true;
  }
  return false;
};

const pruneSettings = (localStorageKeys) => {
  if (localStorageKeys) {
    let i;
    for (i = 0; i < localStorageKeys.length; i++) {
      localStorage.removeItem(localStorageKeys[i]);
    }
    localStorage.removeItem(LOCAL_STORAGE_KEY_APP);
    localStorage.removeItem(LOCAL_STORAGE_KEY_APP_LANDING_PAGE);
    localStorage.removeItem(LOCAL_STORAGE_KEY_APP_INLINE_NOTIFICATION);
  }
};

const getLocalStorageKeys = (state) => {
  const keys = Object.keys(state.steps);
  const localStorageKeys = [];

  let i;
  for (i = 0; i < keys.length; i++) {
    const stateKey = keys[i];
    const currentLocalStorageKey = state.steps[stateKey].localStorageKey;
    localStorageKeys.push(currentLocalStorageKey);
  }
  return localStorageKeys;
};

export {
  pruneSettings,
  hasLocalStorageState,
  getLocalStorageKeys,
  getLocalStorageContentsForDownloadParamFileStep,
  getLocalStorageContentsForSummaryStep,
  getLocalStorageContentsForHintStep,
  getLocalStorageContentsForInformationStep,
  getLocalStorageContentsForInputFileSelectionStep,
  getLocalStorageContentsForInstallationParameterStep,
  getLocalStorageContentsForIntroStep,
  getLocalStorageContentsForNetworkAddressStep,
  getLocalStorageContentsForNetworkDeviceStep,
  getLocalStorageContentsForNextStepStep,
  getLocalStorageContentsForLandingPage,
  nextStepsCardHasBeenReviewed,
  nextStepsCardIsExpanded,
  parmfileCardIsExpanded,
  requirementsCardHasBeenReviewed,
  requirementsCardIsExpanded,
};
