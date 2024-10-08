/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import { FlexGrid, Row, Column, Layer } from "@carbon/react";
import PropTypes from "prop-types";
import { getHelpPanel as getPanel } from "../../../../uiUtil/panel-util";
import "./_help-content.scss";

const HelpContent = ({ helpPanelConfig }) => {
    const forPanel = helpPanelConfig.forPanel;
    const hasParams = helpPanelConfig.params
        ? Object.keys(helpPanelConfig.params).length > 0
        : false;
    const params = hasParams ? helpPanelConfig.params : {};

    const markup = (
        <Layer>
            <FlexGrid className="help-content__grid">
                <Row className="help-content__grid__row">
                    <Column className="help-content__grid__column">
                        <div className="help-panel__download-param-file__header">
                            <span>{params.title}</span>
                        </div>
                        {getPanel({ forPanel, params })}
                    </Column>
                </Row>
            </FlexGrid>
        </Layer>
    );

    return markup;
};

HelpContent.propTypes = {
    helpPanelConfig: PropTypes.shape({
        forPanel: PropTypes.string.isRequired,
        params: PropTypes.object,
    }).isRequired,
};

export default HelpContent;
