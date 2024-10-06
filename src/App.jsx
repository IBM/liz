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
    SettingsPageContextProvider,
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
import {
    DEFAULT_THEME,
    DARK_THEME,
    LIGHT_THEME,
    OS_DARK_THEME,
    OS_LIGHT_THEME,
} from "./util/constants";
import "./App.scss";

const router = createHashRouter(CreateBrowserRoutes);

const App = () => {
    const { state, updateTheme } = useContext(ApplicationContext);

    const theme = state?.theme ?? DEFAULT_THEME;
    const useOperatingSystemTheme = state?.useOperatingSystemTheme ?? false;

    useEffect(() => {
        document.documentElement.dataset.carbonTheme = theme;

        if (!document.documentElement.dataset.useOperatingSystemTheme) {
            document.documentElement.dataset.useOperatingSystemTheme = `${useOperatingSystemTheme}`;
        }

        window
            .matchMedia("(prefers-color-scheme: dark)")
            .addEventListener("change", (e) => {
                if (
                    document.documentElement.dataset.useOperatingSystemTheme &&
                    document.documentElement.dataset.useOperatingSystemTheme ===
                        "true"
                ) {
                    const newColorScheme = e.matches
                        ? OS_DARK_THEME
                        : OS_LIGHT_THEME;
                    switch (newColorScheme) {
                        case OS_DARK_THEME:
                            updateTheme(DARK_THEME);
                            break;
                        case OS_LIGHT_THEME:
                            updateTheme(LIGHT_THEME);
                            break;
                        default:
                            console.log(
                                "Unsupported operating system theme recognized."
                            );
                    }
                }
            });

        return () => {
            window
                .matchMedia("(prefers-color-scheme: dark)")
                .removeEventListener("change", (e) => {});
        };
    }, [state]);

    return (
        <HeaderContextProvider>
            <LandingPageContextProvider>
                <EditPageContextProvider>
                    <SettingsPageContextProvider>
                        <DownloadParamFileContextProvider>
                            <InformationContextProvider>
                                <InputFileSelectionContextProvider>
                                    <InstallationParameterContextProvider>
                                        <IntroContextProvider>
                                            <NetworkAddressContextProvider>
                                                <NetworkDeviceContextProvider>
                                                    <SummaryContextProvider>
                                                        <ErrorPageContextProvider>
                                                            <GlobalTheme
                                                                theme={theme}
                                                            >
                                                                <RouterProvider
                                                                    router={
                                                                        router
                                                                    }
                                                                />
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
                    </SettingsPageContextProvider>
                </EditPageContextProvider>
            </LandingPageContextProvider>
        </HeaderContextProvider>
    );
};

export default App;
