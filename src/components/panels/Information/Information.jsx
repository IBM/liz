/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { useEffect } from "react";
import { useTranslation, Trans } from "react-i18next";
import PropTypes from "prop-types";
import { Layer, Link } from "@carbon/react";
import {
  DISTRIBUTION_LIST,
  VERSION_LIST,
  ACTION_UPDATE_APP_STEPS,
  ACTION_UPDATE_APP_IS_DIRTY,
  ACTION_UPDATE_APP_IS_DISABLED,
  LOCAL_STORAGE_KEY_APP_INFORMATION,
  STATE_ORIGIN_USER,
  STATE_ORIGIN_STORAGE,
} from "../../../util/constants";
import { ApplicationContext } from "../../../App";
import { updateIsDisabled } from "../../../util/panel-utils";
import "./_information.scss";

const Information = ({
  state,
  dispatch,
  distribution,
  systemRequirements,
  docLink,
}) => {
  const { t } = useTranslation();
  const { state: globalState, dispatch: globalDispatch } =
    React.useContext(ApplicationContext);

  const distributionName = distribution.name
    ? DISTRIBUTION_LIST.find((x) => x.id === distribution.name).label
    : "";
  const distributionVersion = distribution.version
    ? VERSION_LIST.find((x) => x.id === distribution.version).label
    : "";
  const memorySize = systemRequirements.memory ? systemRequirements.memory : 0;
  const diskSize = systemRequirements.disk ? systemRequirements.disk : 0;
  const machineLevel = systemRequirements.level ? systemRequirements.level : "";

  const DEFAULT_MEMORY_SIZE_UNIT = "GiB";
  const DEFAULT_DISK_SIZE_UNIT = "GiB";

  useEffect(() => {
    const mergedSteps = {
      ...globalState,
      steps: {
        ...globalState.steps,
        information: {
          ...globalState.steps.information,
          complete: true,
          disabled: true,
          invalid: false,
          origin: STATE_ORIGIN_USER,
        },
      },
    };

    globalDispatch({
      type: ACTION_UPDATE_APP_STEPS,
      nextSteps: mergedSteps.steps,
    });
    globalDispatch({
      type: ACTION_UPDATE_APP_IS_DIRTY,
      nextIsDirty: true,
    });
    globalDispatch({
      type: ACTION_UPDATE_APP_IS_DISABLED,
      nextSteps: updateIsDisabled(mergedSteps.steps),
    });

    localStorage.setItem(
      LOCAL_STORAGE_KEY_APP_INFORMATION,
      JSON.stringify({
        ...state,
        origin: STATE_ORIGIN_STORAGE,
      }),
    );
  }, [state]);

  const markup = (
    <Layer>
      <div className="information_heading">
        {t("panel.information.requirementsHeader", { ns: "panels" })}
      </div>
      <div className="information_content">
        <Trans i18nKey="panel.information.requirementsExplanation" ns="panels">
          These are the minimum system requirements for installing the target
          Linux distribution &quot;{{ distributionName }}&quot; with version
          &quot;{{ distributionVersion }}&quot;.
        </Trans>
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
        {t("panel.information.informationExplanation", { ns: "panels" })}{" "}
        <Link href={docLink} target="_blank">
          {distributionName}
        </Link>
      </div>
    </Layer>
  );

  return markup;
};

Information.propTypes = {
  state: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  docLink: PropTypes.string.isRequired,
  distribution: PropTypes.shape({
    name: PropTypes.string.isRequired,
    version: PropTypes.string.isRequired,
  }).isRequired,
  systemRequirements: PropTypes.shape({
    disk: PropTypes.number.isRequired,
    memory: PropTypes.number.isRequired,
    level: PropTypes.string.isRequired,
  }).isRequired,
};

export default Information;
