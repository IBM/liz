/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

const resetToInitialState = ({
    includeIntroStep,
    isEditing,
    shouldCloseNotification,
    globalResetToInitialStateShouldBeUsingTrue,
    contexts: {
        applicationContext,
        downloadParamFileContext,
        editPageContext,
        settingsPageContext,
        headerContext,
        informationContext,
        inputFileSelectionContext,
        installationParameterContext,
        introContext,
        landingPageContext,
        networkAddressContext,
        networkDeviceContext,
        summaryContext,
    },
}) => {
    const {
        updateIncludeIntroStep,
        updateIsEditing,
        resetToInitialState: globalResetToInitialState,
    } = applicationContext;
    const { resetToInitialState: downloadParamFileResetToInitialState } =
        downloadParamFileContext;
    const { resetToInitialState: editPageResetToInitialState } =
        editPageContext;
    const { resetToInitialState: settingsPageResetToInitialState } =
        settingsPageContext;
    const {
        resetToInitialState: headerResetToInitialState,
        closeNotification,
    } = headerContext;
    const { resetToInitialState: informationResetToInitialState } =
        informationContext;
    const { resetToInitialState: inputFileSelectionResetToInitialState } =
        inputFileSelectionContext;
    const { resetToInitialState: installationParameterResetToInitialState } =
        installationParameterContext;
    const { resetToInitialState: introResetToInitialState } = introContext;
    const { resetToInitialState: landingPageResetToInitialState } =
        landingPageContext;
    const { resetToInitialState: networkAddressResetToInitialState } =
        networkAddressContext;
    const { resetToInitialState: networkDeviceResetToInitialState } =
        networkDeviceContext;
    const { resetToInitialState: summaryResetToInitialState } = summaryContext;

    globalResetToInitialState(globalResetToInitialStateShouldBeUsingTrue);
    downloadParamFileResetToInitialState();
    editPageResetToInitialState();
    headerResetToInitialState();
    informationResetToInitialState();
    inputFileSelectionResetToInitialState();
    installationParameterResetToInitialState();
    introResetToInitialState();
    landingPageResetToInitialState();
    networkAddressResetToInitialState();
    networkDeviceResetToInitialState();
    settingsPageResetToInitialState();
    summaryResetToInitialState();

    if (isEditing) {
        updateIsEditing(isEditing);
    }
    if (includeIntroStep) {
        updateIncludeIntroStep(includeIntroStep);
    }
    if (shouldCloseNotification) {
        closeNotification(shouldCloseNotification);
    }
};

export { resetToInitialState };
