import React, { useState } from "react";
import {
  Header,
  HeaderContainer,
  HeaderName,
  HeaderMenuButton,
  HeaderGlobalBar,
  HeaderGlobalAction,
  HeaderPanel,
  SkipToContent,
  SideNav,
  SideNavItems,
} from "@carbon/react";
import { Help, LinuxAlt } from "@carbon/icons-react";
import PropTypes from "prop-types";
import InstallerFlow from "../InstallerFlow";
import "./_installer-header.scss";

const InstallerHeader = ({ onShowNotification, onProgress, progressStep, progressStepCompletion, progressStepInvalidation }) => {
  const [state, setState] = useState({
    expanded: false
  });

  const updateExpanded = (expanded) => {
    setState({ ...state, expanded });
  }

  return (
    <HeaderContainer
      render={({ isSideNavExpanded, onClickSideNavExpand }) => (
        <Header aria-label="Installation assistant for Linux on IBM Z">
          <SkipToContent />
          <HeaderMenuButton
            aria-label="Open menu"
            onClick={onClickSideNavExpand}
            isActive={isSideNavExpanded}
          />
          <HeaderName href="#" prefix="">
            Installation assistant for Linux on IBM Z
          </HeaderName>
          <HeaderGlobalBar>
            <HeaderGlobalAction
              aria-label="Help"
              onClick={() => {
                return state.expanded ? updateExpanded(false) : updateExpanded(true);
              }}
            >
              <Help size="24" />
            </HeaderGlobalAction>
            <HeaderGlobalAction
              aria-label="Profile settings"
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
            <SideNavItems>
              <InstallerFlow
                onProgress={onProgress}
                progressStep={progressStep}
                progressStepCompletion={progressStepCompletion}
                progressStepInvalidation={progressStepInvalidation}
              />
            </SideNavItems>
          </SideNav>
          <HeaderPanel
            expanded={state.expanded}
            aria-label="Help"
            className="installer-header__panel-component"
          ></HeaderPanel>
        </Header>
      )}
    />
  );
};

InstallerHeader.propTypes = {
  onShowNotification: PropTypes.func.isRequired,
  onProgress: PropTypes.func.isRequired,
  progressStep: PropTypes.number.isRequired,
  progressStepCompletion: PropTypes.shape({
    inputFileSelection: PropTypes.bool.isRequired,
    information: PropTypes.bool.isRequired,
    hint: PropTypes.bool.isRequired,
    networkDevice: PropTypes.bool.isRequired,
    networkAddress: PropTypes.bool.isRequired,
    installationParameters: PropTypes.bool.isRequired,
    miscParameters: PropTypes.bool.isRequired,
    downloadParamFile: PropTypes.bool.isRequired,
    nextStep: PropTypes.bool.isRequired
  }).isRequired,
  progressStepInvalidation: PropTypes.shape({
    inputFileSelection: PropTypes.bool.isRequired,
    information: PropTypes.bool.isRequired,
    hint: PropTypes.bool.isRequired,
    networkDevice: PropTypes.bool.isRequired,
    networkAddress: PropTypes.bool.isRequired,
    installationParameters: PropTypes.bool.isRequired,
    miscParameters: PropTypes.bool.isRequired,
    downloadParamFile: PropTypes.bool.isRequired,
    nextStep: PropTypes.bool.isRequired
  }).isRequired
};

export default InstallerHeader;
