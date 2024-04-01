/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import React from "react";
import { Routes } from "./routes";
import {
  ApplicationContextProvider,
  HeaderContextProvider,
  LandingPageContextProvider,
  EditPageContextProvider,
  DownloadParamFileContextProvider,
  InformationContextProvider,
  InputFileSelectionContextProvider,
  InstallationParameterContextProvider,
  IntroContextProvider,
  NetworkAddressContextProvider,
  NetworkDeviceContextProvider,
  SummaryContextProvider,
} from "./contexts";
import "./App.scss";

const App = () => {
  return (
    <ApplicationContextProvider>
      <HeaderContextProvider>
        <LandingPageContextProvider>
          <EditPageContextProvider>
            <DownloadParamFileContextProvider>
              <InformationContextProvider>
                <InputFileSelectionContextProvider>
                  <InstallationParameterContextProvider>
                    <IntroContextProvider>
                      <NetworkAddressContextProvider>
                        <NetworkDeviceContextProvider>
                          <SummaryContextProvider>
                            <Routes />
                          </SummaryContextProvider>
                        </NetworkDeviceContextProvider>
                      </NetworkAddressContextProvider>
                    </IntroContextProvider>
                  </InstallationParameterContextProvider>
                </InputFileSelectionContextProvider>
              </InformationContextProvider>
            </DownloadParamFileContextProvider>
          </EditPageContextProvider>
        </LandingPageContextProvider>
      </HeaderContextProvider>
    </ApplicationContextProvider>
  );
};

export default App;
