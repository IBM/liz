/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */
import { createContext } from "react";

import ApplicationContextProvider from "./ApplicationContextProvider";
import HeaderContextProvider from "./HeaderContextProvider";
import LandingPageContextProvider from "./LandingPageContextProvider";
import DownloadParamFileContextProvider from "./DownloadParamFileContextProvider";
import InformationContextProvider from "./InformationContextProvider";
import InputFileSelectionContextProvider from "./InputFileSelectionContextProvider";
import InstallationParameterContextProvider from "./InstallationParameterContextProvider";
import EditPageContextProvider from "./EditPageContextProvider";
import IntroContextProvider from "./IntroContextProvider";
import NetworkAddressContextProvider from "./NetworkAddressContextProvider";
import NetworkDeviceContextProvider from "./NetworkDeviceContextProvider";
import SummaryContextProvider from "./SummaryContextProvider";

const ApplicationContext = createContext({
  state: null,
  dispatch: null,
});
const HeaderContext = createContext({
  state: null,
  dispatch: null,
});
const LandingPageContext = createContext({
  state: null,
  dispatch: null,
});
const EditPageContext = createContext({
  state: null,
  dispatch: null,
});
const DownloadParamFileContext = createContext({
  state: null,
  dispatch: null,
});
const InformationContext = createContext({
  state: null,
  dispatch: null,
});
const InputFileSelectionContext = createContext({
  state: null,
  dispatch: null,
});
const InstallationParameterContext = createContext({
  state: null,
  dispatch: null,
});
const IntroContext = createContext({
  state: null,
  dispatch: null,
});
const NetworkAddressContext = createContext({
  state: null,
  dispatch: null,
});
const NetworkDeviceContext = createContext({
  state: null,
  dispatch: null,
});
const SummaryContext = createContext({
  state: null,
  dispatch: null,
});

export {
  ApplicationContext,
  ApplicationContextProvider,
  HeaderContext,
  HeaderContextProvider,
  EditPageContext,
  EditPageContextProvider,
  LandingPageContext,
  LandingPageContextProvider,
  DownloadParamFileContext,
  DownloadParamFileContextProvider,
  InformationContext,
  InformationContextProvider,
  InputFileSelectionContext,
  InputFileSelectionContextProvider,
  InstallationParameterContext,
  InstallationParameterContextProvider,
  IntroContext,
  IntroContextProvider,
  NetworkAddressContext,
  NetworkAddressContextProvider,
  NetworkDeviceContext,
  NetworkDeviceContextProvider,
  SummaryContext,
  SummaryContextProvider,
};
