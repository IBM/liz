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
import "./_tutorial-header.scss";

const TutorialHeader = () => {
  const [expanded, setExpanded] = useState(false);
  return (
    <HeaderContainer
      render={({ isSideNavExpanded, onClickSideNavExpand }) => (
        <Header aria-label="Carbon Tutorial">
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
              <div>TEST</div>
            </SideNavItems>
          </SideNav>
          <HeaderPanel expanded={expanded}></HeaderPanel>
        </Header>
      )}
    />
  );
};

export default TutorialHeader;
