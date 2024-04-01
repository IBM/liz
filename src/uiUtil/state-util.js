/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */
import { useContext } from "react";

import {
  ApplicationContext,
  DownloadParamFileContext,
  InformationContext,
  InputFileSelectionContext,
  InstallationParameterContext,
  NetworkAddressContext,
  NetworkDeviceContext,
  SummaryContext,
  LandingPageContext,
} from "../contexts";
import { DEFAULT_STEPS } from "../util/constants";

const resetToInitialState = () => {
  const { state, updateSteps, updateUseStateFromLocalStorage } =
    useContext(ApplicationContext);
  const { updateResetToInitialState: createInitialDownloadParamFileState } =
    useContext(DownloadParamFileContext);
  const { updateResetToInitialState: createInitialInformationState } =
    useContext(InformationContext);
  const { updateResetToInitialState: createInitialInputFileSelectionState } =
    useContext(InputFileSelectionContext);
  const { updateResetToInitialState: createInitialInstallationParameterState } =
    useContext(InstallationParameterContext);
  const { updateResetToInitialState: createInitialNetworkAddressState } =
    useContext(NetworkAddressContext);
  const { updateResetToInitialState: createInitialNetworkDeviceState } =
    useContext(NetworkDeviceContext);
  const { updateResetToInitialState: createInitialSummaryState } =
    useContext(SummaryContext);
  const { updateResetToInitialState: createInitialLandingPageState } =
    useContext(LandingPageContext);

  createInitialDownloadParamFileState();
  createInitialInformationState();
  createInitialInputFileSelectionState();
  createInitialInstallationParameterState();
  createInitialNetworkAddressState();
  createInitialNetworkDeviceState();
  createInitialSummaryState();
  createInitialLandingPageState();

  updateSteps(DEFAULT_STEPS);
  if (!state.isEditing) {
    updateUseStateFromLocalStorage(false);
  }
};

export { resetToInitialState };
