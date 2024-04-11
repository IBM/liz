/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import React, { useContext, useEffect } from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { GlobalTheme } from "@carbon/react";
import { CreateBrowserRoutes } from "./routes";
import {
  ApplicationContext,
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
import { DEFAULT_THEME } from "./util/constants";
import "./App.scss";

const router = createHashRouter(CreateBrowserRoutes);

const App = () => {
  const { state } = useContext(ApplicationContext);

  const theme = state?.theme ?? DEFAULT_THEME;

  useEffect(() => {
    document.documentElement.dataset.carbonTheme = theme;
  }, [state]);

  return (
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
                            <GlobalTheme theme={theme}>
                              <RouterProvider router={router} />
                            </GlobalTheme>
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
  );
};

export default App;
