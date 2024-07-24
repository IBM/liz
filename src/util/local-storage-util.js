/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import ls from "localstorage-slim";

import {
    LOCAL_STORAGE_KEY_APP_DOWNLOAD_PARAM_FILE,
    LOCAL_STORAGE_KEY_APP_SUMMARY,
    LOCAL_STORAGE_KEY_APP_INFORMATION,
    LOCAL_STORAGE_KEY_INPUT_FILE_SELECTION,
    LOCAL_STORAGE_KEY_APP_INSTALLATION_PARAMETERS,
    LOCAL_STORAGE_KEY_APP_INTRO,
    LOCAL_STORAGE_KEY_APP_NETWORK_ADDRESS,
    LOCAL_STORAGE_KEY_APP_NETWORK_DEVICE,
    LOCAL_STORAGE_KEY_APP,
    LOCAL_STORAGE_KEY_APP_LANDING_PAGE,
    LOCAL_STORAGE_KEY_APP_EDIT_PAGE,
    LOCAL_STORAGE_KEY_APP_ERROR_PAGE,
    LOCAL_STORAGE_KEY_APP_HEADER,
    LOCAL_STORAGE_KEY_APP_INLINE_NOTIFICATION,
    STATE_ORIGIN_STORAGE,
} from "./local-storage-constants";
import { DEFAULT_DISTRIBUTION_ID } from "./constants";

const encryptItem = (key, item) => {
    ls.set(key, item, { encrypt: true });
};

const decryptItem = (key) => {
    const item = ls.get(key, { decrypt: true });

    if (typeof item === "string") {
        return JSON.parse(item);
    } else if (typeof item === "object") {
        return item;
    }
    return undefined;
};

const setItem = (key, item) => {
    ls.set(key, item, { encrypt: false });
};

const getItem = (key) => {
    const item = ls.get(key);

    if (typeof item === "string") {
        return JSON.parse(item);
    } else if (typeof item === "object") {
        return item;
    }
    return undefined;
};

const removeItem = (key) => {
    return ls.remove(key);
};

const getLocalStorageContentsForDownloadParamFileStep = () => {
    const downloadParamFileString = getItem(
        LOCAL_STORAGE_KEY_APP_DOWNLOAD_PARAM_FILE
    );
    const downloadParamFile =
        typeof downloadParamFileString === "object"
            ? downloadParamFileString
            : {};

    return downloadParamFile;
};

const getLocalStorageContentsForInformationStep = () => {
    const informationString = getItem(LOCAL_STORAGE_KEY_APP_INFORMATION);
    const information =
        typeof informationString === "object" ? informationString : {};

    return information;
};

const getLocalStorageContentsForInputFileSelectionStep = () => {
    const inputFileSelectionString = getItem(
        LOCAL_STORAGE_KEY_INPUT_FILE_SELECTION
    );
    const inputFileSelection =
        typeof inputFileSelectionString === "object"
            ? inputFileSelectionString
            : {};

    return inputFileSelection;
};

const getLocalStorageContentsForInstallationParameterStep = () => {
    const installationParameterString = decryptItem(
        LOCAL_STORAGE_KEY_APP_INSTALLATION_PARAMETERS
    );
    const installationParameter =
        typeof installationParameterString === "object"
            ? installationParameterString
            : {};

    return installationParameter;
};

const getLocalStorageContentsForIntroStep = () => {
    const introString = getItem(LOCAL_STORAGE_KEY_APP_INTRO);
    const intro = typeof introString === "object" ? introString : {};

    return intro;
};

const getLocalStorageContentsForNetworkAddressStep = () => {
    const networkAddressString = getItem(LOCAL_STORAGE_KEY_APP_NETWORK_ADDRESS);
    const networkAddress =
        typeof networkAddressString === "object" ? networkAddressString : {};

    return networkAddress;
};

const getLocalStorageContentsForNetworkDeviceStep = () => {
    const networkDeviceString = getItem(LOCAL_STORAGE_KEY_APP_NETWORK_DEVICE);
    const networkDevice =
        typeof networkDeviceString === "object" ? networkDeviceString : {};

    return networkDevice;
};

const getLocalStorageContentsForSummaryStep = () => {
    const summaryString = getItem(LOCAL_STORAGE_KEY_APP_SUMMARY);
    const summary = typeof summaryString === "object" ? summaryString : {};

    return summary;
};

const getLocalStorageContentsForLandingPage = () => {
    const landingPageString = getItem(LOCAL_STORAGE_KEY_APP_LANDING_PAGE);
    const landingPage =
        typeof landingPageString === "object" ? landingPageString : {};

    return landingPage;
};

const nextStepsCardHasBeenReviewed = () => {
    const landingPage = getLocalStorageContentsForLandingPage();
    return landingPage?.nextStepsCardHasBeenReviewed ?? false;
};

const nextStepsCardIsExpanded = () => {
    const landingPage = getLocalStorageContentsForLandingPage();
    return landingPage?.nextStepsCardIsExpanded ?? false;
};

const parmfileCardIsExpanded = () => {
    const landingPage = getLocalStorageContentsForLandingPage();
    return landingPage?.parmfileCardIsExpanded ?? false;
};

const requirementsCardHasBeenReviewed = () => {
    const landingPage = getLocalStorageContentsForLandingPage();
    return landingPage?.requirementsCardHasBeenReviewed ?? false;
};

const requirementsCardIsExpanded = () => {
    const landingPage = getLocalStorageContentsForLandingPage();
    return landingPage?.requirementsCardIsExpanded ?? false;
};

const getDistributionName = () => {
    const inputFileSelection =
        getLocalStorageContentsForInputFileSelectionStep();
    return (
        inputFileSelection?.selectedDistributionName?.id ??
        DEFAULT_DISTRIBUTION_ID
    );
};

const hasLocalStorageState = () => {
    const downloadParamFileStep =
        getLocalStorageContentsForDownloadParamFileStep();
    const summary = getLocalStorageContentsForSummaryStep();
    const information = getLocalStorageContentsForInformationStep();
    const inputFileSelection =
        getLocalStorageContentsForInputFileSelectionStep();
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
            removeItem(localStorageKeys[i]);
        }
        removeItem(LOCAL_STORAGE_KEY_APP);
        removeItem(LOCAL_STORAGE_KEY_APP_LANDING_PAGE);
        removeItem(LOCAL_STORAGE_KEY_APP_EDIT_PAGE);
        removeItem(LOCAL_STORAGE_KEY_APP_ERROR_PAGE);
        removeItem(LOCAL_STORAGE_KEY_APP_HEADER);
        removeItem(LOCAL_STORAGE_KEY_APP_INLINE_NOTIFICATION);
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

const persistToLocalStorage = (key, state, encrypt = false) => {
    if (encrypt) {
        encryptItem(
            key,
            JSON.stringify({
                ...state,
                origin: STATE_ORIGIN_STORAGE,
            })
        );
    } else {
        setItem(
            key,
            JSON.stringify({
                ...state,
                origin: STATE_ORIGIN_STORAGE,
            })
        );
    }
};

export {
    encryptItem,
    decryptItem,
    setItem,
    getItem,
    removeItem,
    pruneSettings,
    hasLocalStorageState,
    getDistributionName,
    getLocalStorageKeys,
    getLocalStorageContentsForDownloadParamFileStep,
    getLocalStorageContentsForSummaryStep,
    getLocalStorageContentsForInformationStep,
    getLocalStorageContentsForInputFileSelectionStep,
    getLocalStorageContentsForInstallationParameterStep,
    getLocalStorageContentsForIntroStep,
    getLocalStorageContentsForNetworkAddressStep,
    getLocalStorageContentsForNetworkDeviceStep,
    getLocalStorageContentsForLandingPage,
    nextStepsCardHasBeenReviewed,
    nextStepsCardIsExpanded,
    parmfileCardIsExpanded,
    requirementsCardHasBeenReviewed,
    requirementsCardIsExpanded,
    persistToLocalStorage,
};
