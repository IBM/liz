/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import React, { useContext, useCallback } from "react";
import { useNavigate, useHref } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    Header,
    HeaderContainer,
    HeaderName,
    HeaderGlobalBar,
    HeaderGlobalAction,
    SkipToContent,
    ComposedModal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@carbon/react";
import { Close, Help, LinuxAlt } from "@carbon/icons-react";
import About from "../../../components/About";
import SidePanel from "../../../components/SidePanel";
import HelpContent from "../../../components/InstallerHeader";
import {
    ApplicationContext,
    DownloadParamFileContext,
    EditPageContext,
    SettingsPageContext,
    HeaderContext,
    InformationContext,
    InputFileSelectionContext,
    InstallationParameterContext,
    IntroContext,
    LandingPageContext,
    NetworkAddressContext,
    NetworkDeviceContext,
    SummaryContext,
} from "../../../contexts";
import PathConstants from "../../../util/path-constants";
import {
    PANEL_SETTINGS_PAGE,
    PANEL_EDIT_PAGE,
} from "../../../util/panel-constants";
import { parmfileCardIsExpanded } from "../../../util/local-storage-util";
import { resetToInitialState } from "../../../uiUtil/state-util";
import "./_header-layout.scss";

const HeaderLayout = () => {
    const { t } = useTranslation();
    const homePageHref = useHref(PathConstants.HOME);
    const mainContentHref = useHref(PathConstants.MAIN_CONTENT);
    const navigate = useNavigate();

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
        config,
        updateIsEditing,
        updateIncludeIntroStep,
        updateUseStateFromLocalStorage,
    } = contexts.applicationContext;
    const { updateIsDirty } = contexts.settingsPageContext;
    const {
        state,
        closeNotification,
        showNotification: onShowNotification,
        updateIsHelpPanelExpanded,
        updateShowConfirmationModal,
        updateNeedsManualNavigationConfirmation,
    } = contexts.headerContext;

    const { helpPanelConfig } = config || {
        helpPanelConfig: {},
    };

    const aboutMenuRef = useCallback((inputElement) => {
        if (inputElement) {
            inputElement.focus();
        }
    }, []);

    const showNotification = state?.showNotification ?? false;
    const isHelpPanelExpanded = state?.isHelpPanelExpanded ?? false;
    const selectorPrimaryFocus = state?.selectorPrimaryFocus ?? "";
    const hasSelectorPrimaryFocus = selectorPrimaryFocus.length > 0;
    const showConfirmationModal = state?.showConfirmationModal ?? false;
    const needsManualNavigationConfirmation =
        state?.needsManualNavigationConfirmation ?? false;
    const wasEditing = globalState?.isEditing ?? false;
    const introPanelHasBeenIncluded =
        (wasEditing && globalState?.useStateFromLocalStorage) ?? false;

    const hasParams = helpPanelConfig.params
        ? Object.keys(helpPanelConfig.params).length > 0
        : false;
    const hasMultipleSteps = hasParams
        ? helpPanelConfig.params.hasMultipleSteps
        : false;
    const currentHelpStep = hasParams
        ? helpPanelConfig.params.currentHelpStep
        : 0;
    const updateCurrentHelpStep = hasParams
        ? helpPanelConfig.params.updateCurrentHelpStep
        : null;

    const getSidePanelProps = () => {
        const sidePanelProps = hasMultipleSteps
            ? {
                  currentStep: currentHelpStep,
                  onNavigationBack: () =>
                      updateCurrentHelpStep(currentHelpStep - 1),
              }
            : {};

        if (hasSelectorPrimaryFocus) {
            return {
                ...sidePanelProps,
                selectorPrimaryFocus,
            };
        }

        return sidePanelProps;
    };

    const localPruneSettings = () => {
        const resetToInitialStateParameters = {
            shouldCloseNotification: true,
            contexts,
        };

        if (wasEditing) {
            resetToInitialStateParameters.isEditing = true;
        }
        if (introPanelHasBeenIncluded) {
            resetToInitialStateParameters.includeIntroStep = true;
        }

        resetToInitialState(resetToInitialStateParameters);
    };

    const updateExpanded = (expanded) => {
        updateIsHelpPanelExpanded(expanded);
    };

    const getConfirmationModalMarkup = ({
        primaryButtonLabel,
        open,
        onClose,
        onRequestClose,
        onRequestSubmit,
    }) => {
        return (
            <ComposedModal
                preventCloseOnClickOutside
                open={open}
                onClose={onClose}
            >
                <ModalHeader
                    label={t("editPage.createFullPage.modalLabel")}
                    title={t("editPage.createFullPage.modalTitle")}
                />
                <ModalBody>
                    <div>{t("editPage.createFullPage.modalDescription")}</div>
                </ModalBody>
                <ModalFooter
                    danger
                    onRequestClose={onRequestClose}
                    onRequestSubmit={onRequestSubmit}
                    primaryButtonText={primaryButtonLabel}
                    secondaryButtonText={t(
                        "editPage.createFullPage.modalSecondaryButtonText"
                    )}
                />
            </ComposedModal>
        );
    };

    const modalMarkup = (
        <>
            <ComposedModal
                preventCloseOnClickOutside
                open={showConfirmationModal}
            >
                <ModalHeader
                    label={t("modalLabel.manageSettings")}
                    title={t(
                        "modalHeading.localStorageHasBeenPrunedConfirmation"
                    )}
                />
                <ModalBody>
                    <div>
                        {t("modalBody.localStorageHasBeenPrunedConfirmation")}
                    </div>
                </ModalBody>
                <ModalFooter
                    onRequestClose={() => {
                        updateShowConfirmationModal(false);
                    }}
                    onRequestSubmit={() => {
                        updateShowConfirmationModal(false);
                    }}
                    primaryButtonText={t("btnLabel.OK", { ns: "common" })}
                />
            </ComposedModal>
            {getConfirmationModalMarkup({
                primaryButtonLabel: t(
                    "editPage.createFullPage.modalSecondaryButtonText"
                ),
                open:
                    needsManualNavigationConfirmation &&
                    state.manualNavigationOrigin === PANEL_EDIT_PAGE,
                onClose: () => {
                    updateNeedsManualNavigationConfirmation(false);
                },
                onRequestClose: () => {
                    updateNeedsManualNavigationConfirmation(false);
                },
                onRequestSubmit: () => {
                    updateIsEditing(false);
                    updateIncludeIntroStep(false);
                    updateUseStateFromLocalStorage(true);
                    updateNeedsManualNavigationConfirmation(false);
                    navigate(
                        `${parmfileCardIsExpanded() ? PathConstants.EXPANDED_PARMFILE_CARD : PathConstants.HOME}`
                    );
                },
            })}
            {getConfirmationModalMarkup({
                primaryButtonLabel: t(
                    "settingsPage.buttonBar.modalDangerButtonText"
                ),
                open:
                    needsManualNavigationConfirmation &&
                    state.manualNavigationOrigin === PANEL_SETTINGS_PAGE,
                onClose: () => {
                    // updateIsDirty(false);
                    updateNeedsManualNavigationConfirmation(false);
                },
                onRequestClose: () => {
                    // updateIsDirty(false);
                    updateNeedsManualNavigationConfirmation(false);
                },
                onRequestSubmit: () => {
                    updateIsDirty(false);
                    updateNeedsManualNavigationConfirmation(false);
                    navigate(
                        `${parmfileCardIsExpanded() ? PathConstants.EXPANDED_PARMFILE_CARD : PathConstants.HOME}`
                    );
                },
            })}
        </>
    );

    const getAboutMenuMarkup = ({ href, expanded }) => (
        <About
            ref={aboutMenuRef}
            href={href}
            expanded={expanded}
            closeNotification={closeNotification}
            pruneSettings={localPruneSettings}
        />
    );

    const aboutMenuButtonProps = showNotification
        ? {
              "aria-controls": "about-dialog__about-menu",
          }
        : {};

    const showHideSidePanel = () => {
        return isHelpPanelExpanded ? hideSidePanel() : showSidePanel();
    };

    const showSidePanel = () => {
        updateExpanded(true);
    };

    const hideSidePanel = () => {
        updateExpanded(false);
    };

    const getSidePanelMarkup = ({ href, expanded }) => (
        <SidePanel
            ref={aboutMenuRef}
            href={href}
            expanded={expanded}
            closeNotification={closeNotification}
            pruneSettings={localPruneSettings}
            {...getSidePanelProps()}
        >
            <HelpContent helpPanelConfig={helpPanelConfig} />
        </SidePanel>
    );

    const profileActionId = "liz__installer-header_global-action__profile";
    const profileActionHref = useHref(`/#${profileActionId}`);
    const profileActionIcon = showNotification ? (
        <Close size="24" />
    ) : (
        <LinuxAlt size="24" />
    );

    const helpActionId = "liz__installer-header_global-action__help";
    const helpActionHref = useHref(`/#${helpActionId}`);
    const helpActionIcon = isHelpPanelExpanded ? (
        <Close size="24" />
    ) : (
        <Help size="24" />
    );

    const headerContainerMarkup = (
        <HeaderContainer
            render={({ isSideNavExpanded, onClickSideNavExpand }) => (
                <Header aria-label={t("header.productName", { ns: "common" })}>
                    <SkipToContent
                        href={mainContentHref}
                        id="liz__skip-to-content"
                    >
                        {t("headerLayout.skiptToMainContentText")}
                    </SkipToContent>
                    <HeaderName href={homePageHref} prefix="">
                        {t("header.productName", { ns: "common" })}
                    </HeaderName>
                    <HeaderGlobalBar>
                        <HeaderGlobalAction
                            aria-label={t("header.button.help", {
                                ns: "common",
                            })}
                            aria-haspopup="true"
                            aria-expanded={isHelpPanelExpanded}
                            key="liz__installer-header_global-action__help"
                            isActive={isHelpPanelExpanded}
                            id={helpActionId}
                            onClick={() => {
                                showHideSidePanel();
                                onClickSideNavExpand();
                                state.showNotification && onShowNotification();
                            }}
                        >
                            {helpActionIcon}
                        </HeaderGlobalAction>
                        <HeaderGlobalAction
                            aria-label={t("header.button.profileSettings")}
                            aria-haspopup="true"
                            aria-expanded={showNotification}
                            key="liz__installer-header_global-action__profile"
                            isActive={showNotification}
                            id={profileActionId}
                            onClick={() => {
                                isHelpPanelExpanded && showHideSidePanel();
                                isSideNavExpanded && onClickSideNavExpand();
                                onShowNotification();
                            }}
                            {...aboutMenuButtonProps}
                        >
                            {profileActionIcon}
                        </HeaderGlobalAction>
                    </HeaderGlobalBar>
                    {showNotification &&
                        getAboutMenuMarkup({
                            href: profileActionHref,
                            expanded: showNotification,
                        })}
                    {isHelpPanelExpanded &&
                        getSidePanelMarkup({
                            href: helpActionHref,
                            expanded: isHelpPanelExpanded,
                        })}
                </Header>
            )}
        />
    );

    return (
        <>
            {headerContainerMarkup}
            {modalMarkup}
        </>
    );
};

export default HeaderLayout;
