/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import React, { useRef } from "react";
import { CreateFullPageStep } from "@carbon/ibm-products";
import {
  Information as InformationHelp,
  InputFileSelection as InputFileSelectionHelp,
  InstallationParameters as InstallationParametersHelp,
  Hint as HintHelp,
  NetworkAddress as NetworkAddressHelp,
  NetworkDevice as NetworkDeviceHelp,
  NextSteps as NextStepsHelp,
  Summary as SummaryHelp,
  Intro as IntroHelp,
  DownloadParamFile as DownloadParamFileHelp,
  LandingPage as LandingPageHelp,
} from "../components/help";
import {
  Information,
  InputFileSelection,
  InstallationParameters,
  Hint,
  NetworkAddress,
  NetworkDevice,
  NextSteps,
  Summary,
  Intro,
  DownloadParamFile,
} from "../components/panels";
import { stateToParamFile } from "../util/param-file-util";
import {
  PANEL_DOWNLOAD_PARAM_FILE,
  PANEL_HINT,
  PANEL_INFORMATION,
  PANEL_INPUT_FILE_SELECTION,
  PANEL_INSTALLATION_PARAMETERS,
  PANEL_NETWORK_ADDRESS,
  PANEL_NETWORK_DEVICE,
  PANEL_NEXT_STEPS,
  PANEL_SUMMARY,
  PANEL_INTRO,
  PANEL_LANDING_PAGE,
  ACTION_UPDATE_PARAM_FILE_CONTENT,
  ACTION_UPDATE_APP_PARAM_FILE_CONTENT,
  ACTION_UPDATE_APP_PARAM_FILE_MODIFIED,
  ACTION_UPDATE_PARAM_FILE_MODIFIED,
  LOCAL_STORAGE_KEY_APP_INLINE_NOTIFICATION,
} from "../util/constants";

const getHelpPanel = ({ forPanel, params }) => {
  switch (forPanel) {
    case PANEL_DOWNLOAD_PARAM_FILE:
      return <DownloadParamFileHelp {...params} />;
    case PANEL_HINT:
      return <HintHelp {...params} />;
    case PANEL_INFORMATION:
      return <InformationHelp {...params} />;
    case PANEL_INPUT_FILE_SELECTION:
      return <InputFileSelectionHelp {...params} />;
    case PANEL_INSTALLATION_PARAMETERS:
      return <InstallationParametersHelp {...params} />;
    case PANEL_NETWORK_ADDRESS:
      return <NetworkAddressHelp {...params} />;
    case PANEL_NETWORK_DEVICE:
      return <NetworkDeviceHelp {...params} />;
    case PANEL_NEXT_STEPS:
      return <NextStepsHelp {...params} />;
    case PANEL_SUMMARY:
      return <SummaryHelp {...params} />;
    case PANEL_INTRO:
      return <IntroHelp {...params} />;
    case PANEL_LANDING_PAGE:
      return <LandingPageHelp {...params} />;
    default:
      return null;
  }
};

const getPanel = (panel, panelConfig, panelRef) => {
  switch (panel) {
    case PANEL_DOWNLOAD_PARAM_FILE:
      return (
        <DownloadParamFile
          state={panelConfig.state}
          dispatch={panelConfig.dispatch}
          stateToParamFile={panelConfig.params.stateToParamFile}
          ref={panelRef}
        />
      );
    case PANEL_HINT:
      return <Hint state={panelConfig.state} dispatch={panelConfig.dispatch} />;
    case PANEL_INFORMATION:
      return (
        <Information
          state={panelConfig.state}
          dispatch={panelConfig.dispatch}
          distribution={panelConfig.params.distribution}
          systemRequirements={panelConfig.params.systemRequirements}
          docLink={panelConfig.params.docLink}
          ref={panelRef}
        />
      );
    case PANEL_INPUT_FILE_SELECTION:
      return (
        <InputFileSelection
          state={panelConfig.state}
          dispatch={panelConfig.dispatch}
          ref={panelRef}
        />
      );
    case PANEL_INSTALLATION_PARAMETERS:
      return (
        <InstallationParameters
          state={panelConfig.state}
          dispatch={panelConfig.dispatch}
          ipAddressVersion={panelConfig.params.ipAddressVersion}
          ref={panelRef}
        />
      );
    case PANEL_NETWORK_ADDRESS:
      return (
        <NetworkAddress
          state={panelConfig.state}
          dispatch={panelConfig.dispatch}
          ref={panelRef}
        />
      );
    case PANEL_NETWORK_DEVICE:
      return (
        <NetworkDevice
          state={panelConfig.state}
          dispatch={panelConfig.dispatch}
          ref={panelRef}
        />
      );
    case PANEL_NEXT_STEPS:
      return (
        <NextSteps
          state={panelConfig.state}
          dispatch={panelConfig.dispatch}
          useVnc={panelConfig.params.useVnc}
          useSsh={panelConfig.params.useSsh}
          networkAddress={panelConfig.params.networkAddress}
          vncPassword={panelConfig.params.vncPassword}
          ref={panelRef}
        />
      );
    case PANEL_SUMMARY:
      return (
        <Summary
          state={panelConfig.state}
          dispatch={panelConfig.dispatch}
          ref={panelRef}
        />
      );
    case PANEL_INTRO:
      return (
        <Intro
          state={panelConfig.state}
          dispatch={panelConfig.dispatch}
          resetToInitialState={panelConfig.params.resetToInitialState}
          localStorageKeys={panelConfig.params.localStorageKeys}
          ref={panelRef}
        />
      );
    default:
      return <>{null}</>;
  }
};

const PANEL_NAME_TO_INDEX_MAP = new Map();

PANEL_NAME_TO_INDEX_MAP.set(0, PANEL_INPUT_FILE_SELECTION);
PANEL_NAME_TO_INDEX_MAP.set(1, PANEL_INFORMATION);
PANEL_NAME_TO_INDEX_MAP.set(2, PANEL_HINT);
PANEL_NAME_TO_INDEX_MAP.set(3, PANEL_NETWORK_DEVICE);
PANEL_NAME_TO_INDEX_MAP.set(4, PANEL_NETWORK_ADDRESS);
PANEL_NAME_TO_INDEX_MAP.set(5, PANEL_INSTALLATION_PARAMETERS);
PANEL_NAME_TO_INDEX_MAP.set(6, PANEL_DOWNLOAD_PARAM_FILE);
PANEL_NAME_TO_INDEX_MAP.set(7, PANEL_NEXT_STEPS);
PANEL_NAME_TO_INDEX_MAP.set(8, PANEL_SUMMARY);
PANEL_NAME_TO_INDEX_MAP.set(10, PANEL_INTRO);

const getSteps = ({ panelConfig, updateStep, updateNextStep }) => {
  const pageStepsMarkup = [];

  if (Array.isArray(panelConfig)) {
    for (let index = 0; index < panelConfig.length; index++) {
      const includeStep = panelConfig[index].params.includeStep;
      const panelIndex = panelConfig[index].params.index;

      if (includeStep) {
        pageStepsMarkup.push(
          getStep({
            panel: PANEL_NAME_TO_INDEX_MAP.get(panelIndex),
            panelConfig: panelConfig[index],
            updateStep,
            updateNextStep,
          }),
        );
      }
    }
    return pageStepsMarkup;
  }
  return <>{null}</>;
};

const getStep = ({ panel, panelConfig, updateStep, updateNextStep }) => {
  const panelRef = useRef(null);
  const currentPanel = getPanel(panel, panelConfig, panelRef);

  const onNextStep = () => {
    if (
      panelRef.current &&
      panelRef.current.pruneSettings &&
      typeof panelRef.current.pruneSettings === "function"
    ) {
      const pruneSettings = panelRef.current.pruneSettings;

      pruneSettings();
    }
  };

  const onMountStep = () => {
    updateStep(panelConfig.params.index);
    updateNextStep(panelConfig.params.index + 1);

    if (
      panelRef.current &&
      panelRef.current.persistState &&
      typeof panelRef.current.persistState === "function"
    ) {
      const persistState = panelRef.current.persistState;

      persistState();
    }
  };

  const getStepMarkup = () => {
    return (
      <CreateFullPageStep
        className="edit-page__step-header"
        description=""
        onNext={onNextStep}
        onMount={onMountStep}
        subtitle={panelConfig.params.subtitle}
        disableSubmit={panelConfig.params.disableSubmit}
        introStep={panelConfig.params.introStep}
        invalid={panelConfig.params.invalid}
        title={panelConfig.params.title}
        key={`pageStep-for__${PANEL_NAME_TO_INDEX_MAP.get(panelConfig.params.index)}`}
      >
        {currentPanel}
      </CreateFullPageStep>
    );
  };

  return getStepMarkup();
};

const resetParamFileTextAreaData = (
  state,
  dispatch,
  downloadParamFileDispatch,
) => {
  const localParamFileContentValue = stateToParamFile(state);

  downloadParamFileDispatch({
    type: ACTION_UPDATE_PARAM_FILE_CONTENT,
    nextParamFileContent: localParamFileContentValue,
  });
  dispatch({
    type: ACTION_UPDATE_APP_PARAM_FILE_CONTENT,
    nextParamFileContent: localParamFileContentValue,
  });
  dispatch({
    type: ACTION_UPDATE_APP_PARAM_FILE_MODIFIED,
    paramFileContentModified: false,
  });
  downloadParamFileDispatch({
    type: ACTION_UPDATE_PARAM_FILE_MODIFIED,
    paramFileContentModified: false,
  });
};

const getInlineNotification = (headerLabel, contentLabel) => {
  const inlineNotification = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_KEY_APP_INLINE_NOTIFICATION),
  );
  const defaultInlineNotification = {
    show: true,
    kind: "warning",
    title: headerLabel,
    subtitle: contentLabel,
  };

  if (inlineNotification) {
    return inlineNotification;
  }
  localStorage.setItem(
    LOCAL_STORAGE_KEY_APP_INLINE_NOTIFICATION,
    JSON.stringify(defaultInlineNotification),
  );
  return defaultInlineNotification;
};

export {
  getPanel,
  getHelpPanel,
  getStep,
  getSteps,
  getInlineNotification,
  resetParamFileTextAreaData,
};
