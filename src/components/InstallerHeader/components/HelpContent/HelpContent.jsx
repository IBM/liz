/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import {
    Button,
    Grid,
    Column,
    Layer
} from "@carbon/react";
import { Close  } from "@carbon/icons-react";
import PropTypes from "prop-types";
import "./_help-content.scss";

const HelpContent = ({expanded, updateExpanded, helpContent}) => {

    const markup = (
        <Layer>
            <Grid className="help-content__grid" condensed>
                <Column max={14} className="help-content__grid-header-column__left">
                    <div className="help-content__panel-component-header__title">
                        <span>Help &amp; Documentation</span>
                    </div>
                </Column>
                <Column max={2} className="help-content__grid-header-column__right">
                    <Button
                        className="help-content__panel-component-header__button"
                        size="sm"
                        kind="ghost"
                        renderIcon={Close}
                        iconDescription="Close"
                        tooltipPosition="left"
                        hasIconOnly
                        onClick={() => {
                            return expanded ? updateExpanded(false) : updateExpanded(true);
                        }}
                    />
                </Column>
            </Grid>
            <Grid className="help-content__grid" condensed>
                <Column max={16} className="help-content__grid-content-column">
                    {helpContent}
                    <div className="help-content__dummy-content">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tincidunt dui ut ornare lectus. Elit ullamcorper dignissim cras tincidunt. Nunc faucibus a pellentesque sit. Nulla pharetra diam sit amet nisl suscipit adipiscing. Semper feugiat nibh sed pulvinar proin gravida. Sed felis eget velit aliquet sagittis id consectetur purus. Quam pellentesque nec nam aliquam sem et tortor consequat id. Pellentesque habitant morbi tristique senectus et netus. Vulputate mi sit amet mauris commodo quis imperdiet massa.
                    </div>
                </Column>
            </Grid>
        </Layer>
    );

    return (markup);
}

HelpContent.propTypes = {
    expanded: PropTypes.bool.isRequired,
    updateExpanded: PropTypes.func.isRequired,
    helpContent: PropTypes.node.isRequired
}

export default HelpContent;