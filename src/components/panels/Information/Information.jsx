/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { useState, useEffect } from "react";
import { Trans, useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Layer, Link } from "@carbon/react";
// import { IsoFilled } from "@carbon/icons-react";
import "./_information.scss";

const Information = (
  patchState,
  distribution,
  systemRequirements,
  docLink,
  localStorageKey,
) => {
  const { t } = useTranslation();
  const getInitialState = () => {
    const initialState = JSON.parse(localStorage.getItem(localStorageKey));
    const defaultState = {};

    if (initialState) {
      return initialState;
    }
    return defaultState;
  };
  // eslint-disable-next-line
  const [state, setState] = useState(getInitialState);
  const distributionName =
    distribution && distribution.name ? distribution.name : "";
  const distributionVersion =
    distribution && distribution.version ? distribution.version : "";
  const memorySize =
    systemRequirements && systemRequirements.memory
      ? systemRequirements.memory
      : 0;
  const diskSize =
    systemRequirements && systemRequirements.disk ? systemRequirements.disk : 0;
  const machineLevel =
    systemRequirements && systemRequirements.level
      ? systemRequirements.level
      : "";

  const DEFAULT_MEMORY_SIZE_UNIT = "GiB";
  const DEFAULT_DISK_SIZE_UNIT = "GiB";

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(state));
    patchState({
      steps: {
        information: {
          complete: true,
          disabled: true,
          invalid: false,
        },
      },
    });
  }, []);

  const markup = (
    <Layer>
      <div className="information_heading">
        {t("panel.information.requirementsHeader", { ns: "panels" })}
      </div>
      <div className="information_content">
        {t("panel.information.requirementsExplanation", { ns: "panels" })}
      </div>
      <div
        className="table-container"
        role="table"
        aria-label="Display Information"
      >
        <div
          className="flex-table row"
          id="display-iformation__table-header-row"
          role="rowgroup"
        >
          <div
            className="flex-row"
            id="display-iformation__table-header-row__name"
            role="columnheader"
          >
            {t("panel.information.table.nameOsLabel", { ns: "panels" })}
          </div>
          <div
            className="flex-row"
            id="display-iformation__table-content-row__name"
            role="cell"
          >
            {distributionName}
          </div>
        </div>
        <div
          className="flex-table row"
          id="display-iformation__table-header-row"
          role="rowgroup"
        >
          <div
            className="flex-row"
            id="display-iformation__table-header-row__version"
            role="columnheader"
          >
            {t("panel.information.table.versionLabel", { ns: "panels" })}
          </div>
          <div
            className="flex-row"
            id="display-iformation__table-content-row__version"
            role="cell"
          >
            {distributionVersion}
          </div>
        </div>
        <div
          className="flex-table row"
          id="display-iformation__table-header-row"
          role="rowgroup"
        >
          <div
            className="flex-row"
            id="display-iformation__table-header-row__distribution"
            role="columnheader"
          >
            {t("panel.information.table.memoryLabel", { ns: "panels" })}
          </div>
          <div
            className="flex-row"
            id="display-iformation__table-content-row__memory-size"
            role="cell"
          >
            {memorySize} {DEFAULT_MEMORY_SIZE_UNIT}
          </div>
        </div>
        <div
          className="flex-table row"
          id="display-iformation__table-header-row"
          role="rowgroup"
        >
          <div
            className="flex-row"
            id="display-iformation__table-header-row__distribution"
            role="columnheader"
          >
            {t("panel.information.table.diskLabel", { ns: "panels" })}
          </div>
          <div
            className="flex-row"
            id="display-iformation__table-content-row__disk-size"
            role="cell"
          >
            {diskSize} {DEFAULT_DISK_SIZE_UNIT}
          </div>
        </div>
        <div
          className="flex-table row"
          id="display-iformation__table-header-row"
          role="rowgroup"
        >
          <div
            className="flex-row"
            id="display-iformation__table-header-row__distribution"
            role="columnheader"
          >
            {t("panel.information.table.machineLevelLabel", { ns: "panels" })}
          </div>
          <div
            className="flex-row"
            id="display-iformation__table-content-row__machine-level"
            role="cell"
          >
            {machineLevel}
          </div>
        </div>
        {/*
        <div className="flex-table row" id="display-iformation__table-header-row" role="rowgroup">
          <div className="flex-row" id="display-iformation__table-header-row__status" role="columnheader">Status</div>
          <div className="flex-row" id="display-iformation__table-content-row__status" role="cell">
            <span className="isoIcon icon"><IsoFilled size="24" /></span>
            <span className="isoIcon label">ISO inserted</span>
          </div>
        </div>
        */}
      </div>
      <div className="information_heading_alt">
        {t("panel.information.informationHeader", { ns: "panels" })}
      </div>
      <div className="information_content">
        <Trans i18nKey="panel.information.informationExplanation" ns="panels">
          Link to distribution-specific documentation:{" "}
          <Link href={docLink} target="_blank">
            {{ distributionName }}
          </Link>
        </Trans>
      </div>
    </Layer>
  );

  return markup;
};

Information.propTypes = {
  patchState: PropTypes.func.isRequired,
  distribution: PropTypes.shape({
    name: PropTypes.string.isRequired,
    version: PropTypes.string.isRequired,
  }).isRequired,
  systemRequirements: PropTypes.shape({
    disk: PropTypes.number.isRequired,
    memory: PropTypes.number.isRequired,
    level: PropTypes.string.isRequired,
  }).isRequired,
  docLink: PropTypes.string.isRequired,
  localStorageKey: PropTypes.string.isRequired,
};

export default Information;
