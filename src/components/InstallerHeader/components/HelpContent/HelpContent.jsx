/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import { useTranslation } from "react-i18next";
import { Button, FlexGrid, Row, Column, Layer } from "@carbon/react";
import { Close } from "@carbon/icons-react";
import PropTypes from "prop-types";
import { getHelpPanel as getPanel } from "../../../../uiUtil/panel-utils";
import "./_help-content.scss";

const HelpContent = ({ expanded, updateExpanded, helpPanelConfig }) => {
  const { t } = useTranslation();

  const markup = (
    <Layer>
      <div className="help-content__panel-component-header">
        <div className="help-content__panel-component-header__title">
          <span>{t("rightNavigation.header")}</span>
        </div>
        <Button
          className="help-content__panel-component-header__button"
          size="sm"
          kind="ghost"
          renderIcon={Close}
          iconDescription={t("btnLabel.Close", { ns: "common" })}
          tooltipPosition="left"
          hasIconOnly
          onClick={() => {
            return expanded ? updateExpanded(false) : updateExpanded(true);
          }}
        />
      </div>
      <FlexGrid className="help-content__grid">
        <Row className="help-content__grid__row">
          <Column className="help-content__grid__column">
            {getPanel(helpPanelConfig.forPanel)}
          </Column>
        </Row>
      </FlexGrid>
    </Layer>
  );

  return markup;
};

HelpContent.propTypes = {
  expanded: PropTypes.bool.isRequired,
  updateExpanded: PropTypes.func.isRequired,
  helpPanelConfig: PropTypes.shape({
    forPanel: PropTypes.string.isRequired,
  }).isRequired,
};

export default HelpContent;
