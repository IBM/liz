/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import React, { useContext } from "react";
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
  const navigate = useNavigate();
  const { config, resetToInitialState: globalResetToInitialState } =
    useContext(ApplicationContext);
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

  const showNotification = state.showNotification;
  const isHelpPanelExpanded = state.isHelpPanelExpanded;

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
  };

  const updateExpanded = (expanded) => {
    updateIsHelpPanelExpanded(expanded);
  };

  const modalMarkup = (
    <>
      <ComposedModal
        preventCloseOnClickOutside
        open={state.showConfirmationModal}
      >
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
        open={state.needsManualNavigationConfirmation}
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

  return (
    <>
      <HeaderContainer
        render={({ isSideNavExpanded, onClickSideNavExpand }) => (
          <>
            {showNotification && (
              <About
                closeNotification={closeNotification}
                pruneSettings={localPruneSettings}
              />
            )}
            <Header aria-label={t("header.productName", { ns: "common" })}>
              <SkipToContent />
              <HeaderName href={homePageHref} prefix="">
                {t("header.productName", { ns: "common" })}
              </HeaderName>
              <HeaderGlobalBar>
                <HeaderGlobalAction
                  aria-label={t("header.button.help", { ns: "common" })}
                  onClick={() => {
                    return isHelpPanelExpanded
                      ? updateExpanded(false)
                      : updateExpanded(true);
                  }}
                >
                  <Help size="24" />
                </HeaderGlobalAction>
                <HeaderGlobalAction
                  aria-label={t("header.button.profileSettings")}
                  onClick={() => {
                    return onShowNotification();
                  }}
                >
                  <LinuxAlt size="24" />
                </HeaderGlobalAction>
              </HeaderGlobalBar>
              <SidePanel
                animateTitle
                slideIn
                preventCloseOnClickOutside
                closeIconDescription={t("btnLabel.Close", { ns: "common" })}
                className="liz__installer-header_help-sidepanel-component"
                open={isHelpPanelExpanded}
                onRequestClose={() => updateExpanded(false)}
                title={t("rightNavigation.header")}
                subtitle=""
                selectorPageContent="#liz__page-content"
                {...sidePanelProps}
              >
                <HelpContent helpPanelConfig={helpPanelConfig} />
              </SidePanel>
            </Header>
          </>
        )}
      />
      {modalMarkup}
    </>
  );
};

export default HeaderLayout;
