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

const InstallerHeader = ({ onProgress, progressStep }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <HeaderContainer
      render={({ isSideNavExpanded, onClickSideNavExpand }) => (
        <Header aria-label="Linux on Z Installer">
          <SkipToContent />
          <HeaderMenuButton
            aria-label="Open menu"
            onClick={onClickSideNavExpand}
            isActive={isSideNavExpanded}
          />
          <HeaderName href="#" prefix="IBM">
            Linux Installation
          </HeaderName>
          <HeaderGlobalBar>
            <HeaderGlobalAction
              aria-label="Help"
              onClick={() => {
                return expanded ? setExpanded(false) : setExpanded(true);
              }}
            >
              <Help />
            </HeaderGlobalAction>
          </HeaderGlobalBar>
          <SideNav aria-label="Side navigation" expanded={true}>
            <SideNavItems>
              <InstallerFlow
                onProgress={onProgress}
                progressStep={progressStep}
              />
            </SideNavItems>
          </SideNav>
          <HeaderPanel expanded={expanded}></HeaderPanel>
        </Header>
      )}
    />
  );
};

InstallerHeader.propTypes = {
  onProgress: PropTypes.func.isRequired,
  progressStep: PropTypes.number.isRequired,
};

export default InstallerHeader;
