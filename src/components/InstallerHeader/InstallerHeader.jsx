/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Header,
  HeaderContainer,
  HeaderName,
  HeaderMenuButton,
  HeaderGlobalBar,
  HeaderGlobalAction,
  HeaderPanel,
  Layer,
  SkipToContent,
  SideNav,
} from "@carbon/react";
import { Help, LinuxAlt } from "@carbon/icons-react";
import PropTypes from "prop-types";
import InstallerFlow from "../InstallerFlow";
import HelpContent from "./components/HelpContent";
import "./_installer-header.scss";

const InstallerHeader = ({
  onShowNotification,
  onShowHelpPanel,
  onProgress,
  progressStep,
  progressStepComplete,
  progressStepInvalid,
  progressStepDisabled,
  helpContent,
}) => {
  const { t } = useTranslation();

  const [state, setState] = useState({
    expanded: true,
  });

  const updateExpanded = (expanded) => {
    setState({ ...state, expanded });
    onShowHelpPanel(expanded);
  };

  return (
    <Layer>
      <HeaderContainer
        render={({ isSideNavExpanded, onClickSideNavExpand }) => (
          <Header aria-label={t("header.productName", { ns: "common" })}>
            <SkipToContent />
            <HeaderMenuButton
              aria-label="Open menu"
              onClick={onClickSideNavExpand}
              isActive={isSideNavExpanded}
            />
            <HeaderName href="#" prefix="">
              {t("header.productName", { ns: "common" })}
            </HeaderName>
            <HeaderGlobalBar>
              <HeaderGlobalAction
                aria-label={t("header.button.help", { ns: "common" })}
                onClick={() => {
                  return state.expanded
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
            <SideNav
              aria-label="Side navigation"
              expanded={true}
              className="installer-header__sidenav-component"
            >
              <InstallerFlow
                onProgress={onProgress}
                progressStep={progressStep}
                progressStepComplete={progressStepComplete}
                progressStepInvalid={progressStepInvalid}
                progressStepDisabled={progressStepDisabled}
              />
            </SideNav>
            <HeaderPanel
              expanded={state.expanded}
              aria-label={t("header.button.help", { ns: "common" })}
              className="installer-header__panel-component"
            >
              <HelpContent
                expanded={state.expanded}
                updateExpanded={updateExpanded}
                helpContent={helpContent}
              />
            </HeaderPanel>
          </Header>
        )}
      />
    </Layer>
  );
};

InstallerHeader.propTypes = {
  onShowNotification: PropTypes.func.isRequired,
  onShowHelpPanel: PropTypes.func.isRequired,
  onProgress: PropTypes.func.isRequired,
  progressStep: PropTypes.number.isRequired,
  progressStepComplete: PropTypes.shape({
    inputFileSelection: PropTypes.bool.isRequired,
    information: PropTypes.bool.isRequired,
    hint: PropTypes.bool.isRequired,
    networkDevice: PropTypes.bool.isRequired,
    networkAddress: PropTypes.bool.isRequired,
    installationParameters: PropTypes.bool.isRequired,
    downloadParamFile: PropTypes.bool.isRequired,
    nextSteps: PropTypes.bool.isRequired,
  }).isRequired,
  progressStepInvalid: PropTypes.shape({
    inputFileSelection: PropTypes.bool.isRequired,
    information: PropTypes.bool.isRequired,
    hint: PropTypes.bool.isRequired,
    networkDevice: PropTypes.bool.isRequired,
    networkAddress: PropTypes.bool.isRequired,
    installationParameters: PropTypes.bool.isRequired,
    downloadParamFile: PropTypes.bool.isRequired,
    nextSteps: PropTypes.bool.isRequired,
  }).isRequired,
  progressStepDisabled: PropTypes.shape({
    inputFileSelection: PropTypes.bool.isRequired,
    information: PropTypes.bool.isRequired,
    hint: PropTypes.bool.isRequired,
    networkDevice: PropTypes.bool.isRequired,
    networkAddress: PropTypes.bool.isRequired,
    installationParameters: PropTypes.bool.isRequired,
    downloadParamFile: PropTypes.bool.isRequired,
    nextSteps: PropTypes.bool.isRequired,
  }).isRequired,
  helpContent: PropTypes.node.isRequired,
};

export default InstallerHeader;
