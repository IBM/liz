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
import { Help } from "@carbon/icons-react";
import PropTypes from "prop-types";
import InstallerFlow from "../InstallerFlow";
import "./_installer-header.scss";

const InstallerHeader = ({ onProgress, progressStep, progressStepCompletion }) => {
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
              <Help />
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
  }).isRequired
};

export default InstallerHeader;
