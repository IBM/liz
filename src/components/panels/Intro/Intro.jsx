/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import React, {
    forwardRef,
    useContext,
    useEffect,
    useImperativeHandle,
} from "react";
import { useTranslation } from "react-i18next";
import {
    Layer,
    Toggle,
    FlexGrid,
    Row,
    Column,
    InlineNotification,
    ActionableNotification,
} from "@carbon/react";
import {
    LOCAL_STORAGE_KEY_APP_INTRO,
    STATE_ORIGIN_USER,
    STATE_ORIGIN_STORAGE,
} from "../../../util/local-storage-constants";
import {
    ApplicationContext,
    DownloadParamFileContext,
    EditPageContext,
    HeaderContext,
    InformationContext,
    InputFileSelectionContext,
    InstallationParameterContext,
    IntroContext,
    LandingPageContext,
    NetworkAddressContext,
    NetworkDeviceContext,
    SummaryContext,
    SettingsPageContext,
} from "../../../contexts";
import { updateIsDisabled as updateIsDisabledFromUtils } from "../../../util/panel-util";
import { resetParamFileTextAreaData } from "../../../uiUtil/panel-util";
import { resetToInitialState } from "../../../uiUtil/state-util";
import { setItem } from "../../../util/local-storage-util";
import "./_intro.scss";

const Intro = forwardRef(function Intro(props, ref) {
    const contexts = {
        applicationContext: useContext(ApplicationContext),
        downloadParamFileContext: useContext(DownloadParamFileContext),
        editPageContext: useContext(EditPageContext),
        settingsPageContext: useContext(SettingsPageContext),
        headerContext: useContext(HeaderContext),
        informationContext: useContext(InformationContext),
        inputFileSelectionContext: useContext(InputFileSelectionContext),
        installationParameterContext: useContext(InstallationParameterContext),
        introContext: useContext(IntroContext),
        landingPageContext: useContext(LandingPageContext),
        networkAddressContext: useContext(NetworkAddressContext),
        networkDeviceContext: useContext(NetworkDeviceContext),
        summaryContext: useContext(SummaryContext),
    };

    const {
        state: globalState,
        updateModified: globalUpdateModified,
        updateNextStep,
        updateIsDirty,
        updateIsDisabled,
    } = contexts.applicationContext;
    const { updateModified, updateParamFileContent } =
        contexts.downloadParamFileContext;
    const { state, updatePurgeParmfileSettings } = contexts.introContext;
    const { t } = useTranslation();
    const publicRef = {
        pruneSettings: () => {
            if (purgeParmfileSettings) {
                const resetToInitialStateParameters = {
                    globalResetToInitialStateShouldBeUsingTrue: true,
                    isEditing: true,
                    contexts,
                };

                if (panelHasBeenIncluded) {
                    resetToInitialStateParameters.includeIntroStep = true;
                }

                resetToInitialState(resetToInitialStateParameters);
            }
        },
        persistState: () => {
            const mergedSteps = {
                ...globalState,
                steps: {
                    ...globalState.steps,
                    intro: {
                        ...globalState.steps.intro,
                        complete: true,
                        disabled: false,
                        invalid: false,
                        purgeParmfileSettings,
                        origin: STATE_ORIGIN_USER,
                    },
                },
            };

            updateNextStep(mergedSteps.steps);
            updateIsDirty(true);
            updateIsDisabled(updateIsDisabledFromUtils(mergedSteps.steps));

            setItem(
                LOCAL_STORAGE_KEY_APP_INTRO,
                JSON.stringify({
                    ...state,
                    origin: STATE_ORIGIN_STORAGE,
                })
            );
        },
    };

    useEffect(publicRef.persistState, [state]);
    useImperativeHandle(ref, () => publicRef);

    const paramFileHasBeenModifiedFromState =
        globalState?.steps.downloadParamFile?.modified ?? false;
    const purgeParmfileSettings = state.purgeParmfileSettings;
    const panelHasBeenIncluded =
        (globalState?.isEditing && globalState?.useStateFromLocalStorage) ??
        false;

    const parmfilePurgeNotificationMarkup = (
        <InlineNotification
            hideCloseButton
            statusIconDescription="notification"
            subtitle={t("panel.intro.parmFilePurgeNotificationSubtitle", {
                ns: "panels",
            })}
            title={t("panel.intro.parmFilePurgeNotificationTitle", {
                ns: "panels",
            })}
            kind="warning"
            className="intro_parmfile-purge-warning-banner"
        />
    );

    const parmfileHasBeenModifiedNotificationMarkup = (
        <ActionableNotification
            hideCloseButton
            inline
            lowContrast
            className="intro_parmfile-purge-banner"
            actionButtonLabel={t("btnLabel.Reset", { ns: "common" })}
            aria-label="closes notification"
            kind="info"
            onActionButtonClick={() => {
                resetParamFileTextAreaData({
                    updateParamFileContent,
                    globalUpdateModified,
                    updateModified,
                    state: globalState,
                });
            }}
            onClose={function noRefCheck() {}}
            onCloseButtonClick={function noRefCheck() {}}
            statusIconDescription="notification"
            subtitle={t("panel.parmFileHasBeenModifiedNotificationSubtitle", {
                ns: "common",
            })}
            title={t("modalHeading.discardParamFileModificationsPrompt")}
        />
    );

    const gridContentsMarkup = (
        <>
            {paramFileHasBeenModifiedFromState &&
                parmfileHasBeenModifiedNotificationMarkup}
            <Toggle
                labelText={t(
                    "panel.intro.purgeParmfileSettingsToggleTextLabel",
                    {
                        ns: "panels",
                    }
                )}
                labelA={t("btnLabel.No", { ns: "common" })}
                labelB={t("btnLabel.Yes", { ns: "common" })}
                id="intro_purge-parmfile-settings-toggle"
                className="intro_purge-parmfile-settings-toggle"
                toggled={!purgeParmfileSettings}
                onToggle={() => {
                    if (purgeParmfileSettings) {
                        updatePurgeParmfileSettings(false);
                        document
                            .getElementById("helpPanelContents_intro_para1")
                            ?.classList?.add(
                                "help-panel__intro__content__active"
                            );
                        document
                            .getElementById("helpPanelContents_intro_para2")
                            ?.classList?.remove(
                                "help-panel__intro__content__active"
                            );
                    } else {
                        updatePurgeParmfileSettings(true);
                        document
                            .getElementById("helpPanelContents_intro_para1")
                            ?.classList?.remove(
                                "help-panel__intro__content__active"
                            );
                        document
                            .getElementById("helpPanelContents_intro_para2")
                            ?.classList?.add(
                                "help-panel__intro__content__active"
                            );
                    }
                }}
                onFocus={() => {
                    document
                        .getElementById("helpPanelContents_intro_para1")
                        ?.classList?.add("help-panel__intro__content__active");
                    document
                        .getElementById("helpPanelContents_intro_para2")
                        ?.classList?.add("help-panel__intro__content__active");
                }}
                onBlur={() => {
                    document
                        .getElementById("helpPanelContents_intro_para1")
                        ?.classList?.remove(
                            "help-panel__intro__content__active"
                        );
                    document
                        .getElementById("helpPanelContents_intro_para2")
                        ?.classList?.remove(
                            "help-panel__intro__content__active"
                        );
                }}
            />
            {purgeParmfileSettings && parmfilePurgeNotificationMarkup}
        </>
    );

    const markup = (
        <Layer className="summary__layer">
            <FlexGrid className="summary__grid">
                <Row>
                    <Column>{gridContentsMarkup}</Column>
                </Row>
            </FlexGrid>
        </Layer>
    );

    return markup;
});

export default Intro;
