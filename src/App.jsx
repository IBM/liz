/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import React from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { CreateBrowserRoutes } from "./routes";
import {
  ApplicationContextProvider,
  HeaderContextProvider,
  LandingPageContextProvider,
  EditPageContextProvider,
  ErrorPageContextProvider,
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

const router = createHashRouter(CreateBrowserRoutes);

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
                            <ErrorPageContextProvider>
                              <RouterProvider router={router} />
                            </ErrorPageContextProvider>
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
