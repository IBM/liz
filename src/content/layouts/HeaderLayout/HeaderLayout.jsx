/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import React from "react";
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
import { ApplicationContext, HeaderContext } from "../../../contexts";
import {
  pruneSettings,
  getLocalStorageKeys,
} from "../../../util/local-storage-util";
import "./_header-layout.scss";

const HeaderLayout = () => {
  const { t } = useTranslation();
  const {
    state: globalState,
    config,
    resetToInitialState,
  } = React.useContext(ApplicationContext);
  const {
    state,
    closeNotification,
    showNotification: onShowNotification,
    updateIsHelpPanelExpanded,
    updateShowConfirmationModal,
  } = React.useContext(HeaderContext);
  const { helpPanelConfig } = config;

  const showNotification = state.showNotification;
  const isHelpPanelExpanded = state.isHelpPanelExpanded;
  const localStorageKeys = getLocalStorageKeys(globalState);

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
    pruneSettings(localStorageKeys);
    resetToInitialState();
    closeNotification(true);
  };

  const updateExpanded = (expanded) => {
    updateIsHelpPanelExpanded(expanded);
  };

  const modalMarkup = (
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
              <HeaderName href="/#" prefix="">
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
