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
import { Help, LinuxAlt } from "@carbon/icons-react";
import { SidePanel } from "@carbon/ibm-products";
import About from "../../../components/About";
import HelpContent from "../../../components/InstallerHeader";
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
} from "../../../contexts";
import PathConstants from "../../../util/path-constants";
import { parmfileCardIsExpanded } from "../../../util/local-storage-util";
import "./_header-layout.scss";

const HeaderLayout = () => {
  const { t } = useTranslation();
  const homePageHref = useHref(PathConstants.HOME);
  const mainContentHref = useHref(PathConstants.MAIN_CONTENT);
  const navigate = useNavigate();
  const {
    state: globalState,
    config,
    resetToInitialState: globalResetToInitialState,
    updateIsEditing,
    updateIncludeIntroStep,
    updateUseStateFromLocalStorage,
  } = useContext(ApplicationContext);
  const { resetToInitialState: downloadParamFileResetToInitialState } =
    useContext(DownloadParamFileContext);
  const { resetToInitialState: editPageResetToInitialState } =
    useContext(EditPageContext);
  const {
    state,
    closeNotification,
    showNotification: onShowNotification,
    updateIsHelpPanelExpanded,
    updateShowConfirmationModal,
    updateNeedsManualNavigationConfirmation,
    resetToInitialState: headerResetToInitialState,
  } = useContext(HeaderContext);
  const { resetToInitialState: informationResetToInitialState } =
    useContext(InformationContext);
  const { resetToInitialState: inputFileSelectionResetToInitialState } =
    useContext(InputFileSelectionContext);
  const { resetToInitialState: installationParameterResetToInitialState } =
    useContext(InstallationParameterContext);
  const { resetToInitialState: introResetToInitialState } =
    useContext(IntroContext);
  const { resetToInitialState: landingPageResetToInitialState } =
    useContext(LandingPageContext);
  const { resetToInitialState: networkAddressResetToInitialState } = useContext(
    NetworkAddressContext,
  );
  const { resetToInitialState: networkDeviceResetToInitialState } =
    useContext(NetworkDeviceContext);
  const { resetToInitialState: summaryResetToInitialState } =
    useContext(SummaryContext);
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

  const sidePanelProps = hasMultipleSteps
    ? {
        currentStep: currentHelpStep,
        onNavigationBack: () => updateCurrentHelpStep(currentHelpStep - 1),
      }
    : {};

  const localPruneSettings = () => {
    globalResetToInitialState();
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
    summaryResetToInitialState();
    closeNotification(true);

    if (wasEditing) {
      updateIsEditing(true);
    }
    if (introPanelHasBeenIncluded) {
      updateIncludeIntroStep(true);
    }
  };

  const updateExpanded = (expanded) => {
    updateIsHelpPanelExpanded(expanded);
  };

  const modalMarkup = (
    <>
      <ComposedModal preventCloseOnClickOutside open={showConfirmationModal}>
        <ModalHeader
          label={t("modalLabel.manageSettings")}
          title={t("modalHeading.localStorageHasBeenPrunedConfirmation")}
        />
        <ModalBody>
          <div>{t("modalBody.localStorageHasBeenPrunedConfirmation")}</div>
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
      <ComposedModal
        preventCloseOnClickOutside
        open={needsManualNavigationConfirmation}
        onClose={() => {
          updateNeedsManualNavigationConfirmation(false);
        }}
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
          onRequestClose={() => {
            updateNeedsManualNavigationConfirmation(false);
          }}
          onRequestSubmit={() => {
            updateIsEditing(false);
            updateIncludeIntroStep(false);
            updateUseStateFromLocalStorage(true);
            updateNeedsManualNavigationConfirmation(false);
            navigate(
              `${parmfileCardIsExpanded() ? PathConstants.EXPANDED_PARMFILE_CARD : PathConstants.HOME}`,
            );
          }}
          primaryButtonText={t("editPage.createFullPage.modalDangerButtonText")}
          secondaryButtonText={t(
            "editPage.createFullPage.modalSecondaryButtonText",
          )}
        />
      </ComposedModal>
    </>
  );

  const aboutMenuMarkup = (
    <About
      ref={aboutMenuRef}
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

  const sidePanelMarkup = (
    <SidePanel
      animateTitle
      slideIn
      preventCloseOnClickOutside
      closeIconDescription={t("btnLabel.Close", { ns: "common" })}
      className="liz__installer-header_help-sidepanel-component"
      id="liz__installer-header_help-sidepanel-component"
      key="liz__installer-header_help-sidepanel-component"
      open={isHelpPanelExpanded}
      onRequestClose={hideSidePanel}
      title={t("rightNavigation.header")}
      subtitle=""
      selectorPageContent="#liz__page-content"
      {...sidePanelProps}
    >
      <HelpContent helpPanelConfig={helpPanelConfig} />
    </SidePanel>
  );

  const headerContainerMarkup = (
    <HeaderContainer
      render={({ isSideNavExpanded, onClickSideNavExpand }) => (
        <Header aria-label={t("header.productName", { ns: "common" })}>
          <SkipToContent href={mainContentHref} id="liz__skip-to-content">
            {t("headerLayout.skiptToMainContentText")}
          </SkipToContent>
          <HeaderName href={homePageHref} prefix="">
            {t("header.productName", { ns: "common" })}
          </HeaderName>
          <HeaderGlobalBar>
            <HeaderGlobalAction
              aria-label={t("header.button.help", { ns: "common" })}
              aria-haspopup="true"
              aria-expanded={isHelpPanelExpanded}
              key="liz__installer-header_global-action__help"
              id="liz__installer-header_global-action__help"
              onClick={showHideSidePanel}
            >
              <Help size="24" />
            </HeaderGlobalAction>
            <HeaderGlobalAction
              aria-label={t("header.button.profileSettings")}
              aria-haspopup="true"
              aria-expanded={showNotification}
              key="liz__installer-header_global-action__profile"
              id="liz__installer-header_global-action__profile"
              onClick={() => {
                return onShowNotification();
              }}
              {...aboutMenuButtonProps}
            >
              <LinuxAlt size="24" />
            </HeaderGlobalAction>
            {showNotification && aboutMenuMarkup}
          </HeaderGlobalBar>
          {sidePanelMarkup}
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
