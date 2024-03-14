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
  HeaderGlobalBar,
  HeaderGlobalAction,
  SkipToContent,
} from "@carbon/react";
import { Help, LinuxAlt } from "@carbon/icons-react";
import { SidePanel } from "@carbon/ibm-products";
import PropTypes from "prop-types";
import HelpContent from "./components/HelpContent";
import "./_installer-header.scss";

const InstallerHeader = ({
  onShowNotification,
  onShowHelpPanel,
  helpPanelConfig,
}) => {
  const { t } = useTranslation();

  const [state, setState] = useState({
    expanded: true,
  });

  const updateExpanded = (expanded) => {
    setState({ ...state, expanded });
    onShowHelpPanel(expanded);
  };

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

  return (
    <HeaderContainer
      render={({ isSideNavExpanded, onClickSideNavExpand }) => (
        <Header aria-label={t("header.productName", { ns: "common" })}>
          <SkipToContent />
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
          <SidePanel
            animateTitle
            preventCloseOnClickOutside
            closeIconDescription={t("btnLabel.Close", { ns: "common" })}
            className="installer-header_help-sidepanel-component"
            open={state.expanded}
            onRequestClose={() => updateExpanded(false)}
            title={t("rightNavigation.header")}
            subtitle=""
            {...sidePanelProps}
          >
            <HelpContent helpPanelConfig={helpPanelConfig} />
          </SidePanel>
        </Header>
      )}
    />
  );
};

InstallerHeader.propTypes = {
  onShowNotification: PropTypes.func.isRequired,
  onShowHelpPanel: PropTypes.func.isRequired,
  helpPanelConfig: PropTypes.shape({
    forPanel: PropTypes.string.isRequired,
    params: PropTypes.object,
  }).isRequired,
};

export default InstallerHeader;
