/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import React from "react";
import PropTypes from "prop-types";
import { Layer, FlexGrid, Row, Column } from "@carbon/react";
import "../_installation-parameters.scss";

const InstallationParameters = ({ children }) => {
    return (
        <Layer className="installation-parameters__layer">
            <FlexGrid className="installation-parameters__grid">
                <Row>
                    <Column>
                        {children.parmfileHasBeenModifiedNotificationMarkup}
                    </Column>
                </Row>
                <Row>
                    <Column>{children.gridContentsMarkupRowOne}</Column>
                </Row>
                <Row>
                    <Column>
                        {children.gridContentsMarkupRowTwoColumnOne}
                    </Column>
                    <Column>
                        {children.gridContentsMarkupRowTwoColumnTwo}
                    </Column>
                </Row>
                {children.remoteWrapperView}
            </FlexGrid>
        </Layer>
    );
};

InstallationParameters.propTypes = {
    children: PropTypes.object.isRequired,
};

export default InstallationParameters;
