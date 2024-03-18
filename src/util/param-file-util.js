/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import {
  DEFAULT_PARAM_FILE_NAME,
  DEFAULT_DISTRIBUTION_ID,
  RHEL_V9_DISTRIBUTION_ID,
  SLES_V12_DISTRIBUTION_ID,
  UBUNTU_V20_DISTRIBUTION_ID,
} from "./constants";
import {
  getLocalStorageContentsForSummaryStep,
  getLocalStorageContentsForDownloadParamFileStep,
} from "./local-storage-util";
import {
  stateToNetworkAddressParams as stateToNetworkAddressParamsRhel,
  stateToNetworkDeviceParams as stateToNetworkDeviceParamsRhel,
  stateToSshParams as stateToSshParamsRhel,
  stateToVncParams as stateToVncParamsRhel,
  stateToInstallationRepoParams as stateToInstallationRepoParamsRhel,
} from "./param-file-util_rhel";
import {
  stateToNetworkAddressParams as stateToNetworkAddressParamsSles,
  stateToNetworkDeviceParams as stateToNetworkDeviceParamsSles,
  stateToSshParams as stateToSshParamsSles,
  stateToVncParams as stateToVncParamsSles,
  stateToInstallationRepoParams as stateToInstallationRepoParamsSles,
} from "./param-file-util_sles";

import {
  stateToNetworkAddressParams as stateToNetworkAddressParamsUbuntu,
  stateToNetworkDeviceParams as stateToNetworkDeviceParamsUbuntu,
  stateToSshParams as stateToSshParamsUbuntu,
  stateToVncParams as stateToVncParamsUbuntu,
  stateToInstallationRepoParams as stateToInstallationRepoParamsUbuntu,
} from "./param-file-util_ubuntu";

const getFunctionsForDistribution = () => {
  return {
    [RHEL_V9_DISTRIBUTION_ID]: {
      stateToNetworkAddressParams: stateToNetworkAddressParamsRhel,
      stateToNetworkDeviceParams: stateToNetworkDeviceParamsRhel,
      stateToSshParams: stateToSshParamsRhel,
      stateToVncParams: stateToVncParamsRhel,
      stateToInstallationRepoParams: stateToInstallationRepoParamsRhel,
    },
    [SLES_V12_DISTRIBUTION_ID]: {
      stateToNetworkAddressParams: stateToNetworkAddressParamsSles,
      stateToNetworkDeviceParams: stateToNetworkDeviceParamsSles,
      stateToSshParams: stateToSshParamsSles,
      stateToVncParams: stateToVncParamsSles,
      stateToInstallationRepoParams: stateToInstallationRepoParamsSles,
    },
    [UBUNTU_V20_DISTRIBUTION_ID]: {
      stateToNetworkAddressParams: stateToNetworkAddressParamsUbuntu,
      stateToNetworkDeviceParams: stateToNetworkDeviceParamsUbuntu,
      stateToSshParams: stateToSshParamsUbuntu,
      stateToVncParams: stateToVncParamsUbuntu,
      stateToInstallationRepoParams: stateToInstallationRepoParamsUbuntu,
    },
  };
};

const removeEmptyLines = (str) =>
  str
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "")
    .join("\n");

const hasIncompleteData = (steps) => {
  for (const property in steps) {
    if (steps[property].complete === false) {
      return true;
    }
  }
  return false;
};

const hasInvalidData = (steps) => {
  for (const property in steps) {
    if (steps[property].invalid === true) {
      return true;
    }
  }
  return false;
};

const stateToParamFile = (state) => {
  const distributionName =
    state.steps.inputFileSelection.distributionName &&
    state.steps.inputFileSelection.distributionName.length > 0
      ? state.steps.inputFileSelection.distributionName
      : DEFAULT_DISTRIBUTION_ID;
  const functionNames = getFunctionsForDistribution()[distributionName];

  const stateToInstallationRepoParamsResult =
    functionNames.stateToInstallationRepoParams(state);
  const stateToVncParamsResult = functionNames.stateToVncParams(state);
  const stateToSshParamsResult = functionNames.stateToSshParams(state);
  const stateToNetworkDeviceParamsResult =
    functionNames.stateToNetworkDeviceParams(state);
  const stateToNetworkAddressParamsResult =
    functionNames.stateToNetworkAddressParams(state);

  const presets = state?.steps?.downloadParamFile?.presets ?? "";

  const data = removeEmptyLines(`${presets}
${stateToNetworkDeviceParamsResult.contents}
${stateToNetworkAddressParamsResult.contents}
${stateToInstallationRepoParamsResult.contents}
${stateToVncParamsResult.contents}
${stateToSshParamsResult.contents}
`);
  const steps = {
    installationParameters: {
      complete: stateToInstallationRepoParamsResult.complete,
      invalid: stateToInstallationRepoParamsResult.invalid,
      index: stateToInstallationRepoParamsResult.index,
    },
    networkAddress: {
      complete: stateToNetworkAddressParamsResult.complete,
      invalid: stateToNetworkAddressParamsResult.invalid,
      index: stateToNetworkAddressParamsResult.index,
    },
    networkDevice: {
      complete: stateToNetworkDeviceParamsResult.complete,
      invalid: stateToNetworkDeviceParamsResult.invalid,
      index: stateToNetworkDeviceParamsResult.index,
    },
  };
  const metadata = {
    hasIncompleteData: hasIncompleteData(steps),
    hasInvalidData: hasInvalidData(steps),
    steps,
  };

  return {
    data,
    metadata,
  };
};

const destroyClickedElement = (event) => {
  // remove the link from the DOM
  document.body.removeChild(event.target);
};

const saveParamFileContent = (content, name = DEFAULT_PARAM_FILE_NAME) => {
  const textFileAsBlob = new Blob([content], {
    type: "text/plain",
  });

  const downloadLink = document.createElement("a");
  downloadLink.download = name;
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

const getParamFileName = () => {
  const summary = getLocalStorageContentsForSummaryStep();
  const paramFileName = summary?.downloadParmfileName ?? "";

  return paramFileName;
};

const getParamFileContents = () => {
  const downloadParamFile = getLocalStorageContentsForDownloadParamFileStep();
  const paramFileContents = downloadParamFile?.paramFileContent ?? "";

  return paramFileContents;
};

const hasParamFile = () => {
  const paramFileContents = getParamFileContents();
  const hasParamFile = paramFileContents.length > 0;

  return hasParamFile;
};

export {
  stateToParamFile,
  saveParamFileContent,
  getParamFileName,
  getParamFileContents,
  hasParamFile,
};
