/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, {
  forwardRef,
  useEffect,
  useContext,
  useImperativeHandle,
} from "react";
import { useTranslation, Trans } from "react-i18next";
import PropTypes from "prop-types";
import {
  Layer,
  Link,
  ActionableNotification,
  FlexGrid,
  Row,
  Column,
} from "@carbon/react";
import { DISTRIBUTION_LIST, VERSION_LIST } from "../../../util/constants";
import {
  LOCAL_STORAGE_KEY_APP_INFORMATION,
  STATE_ORIGIN_USER,
  STATE_ORIGIN_STORAGE,
} from "../../../util/local-storage-constants";
import {
  ApplicationContext,
  InformationContext,
  DownloadParamFileContext,
} from "../../../contexts";
import { updateIsDisabled as updateIsDisabledFromUtils } from "../../../util/panel-util";
import { resetParamFileTextAreaData } from "../../../uiUtil/panel-util";
import "./_information.scss";

const Information = forwardRef(function Information(props, ref) {
  const {
    state: globalState,
    updateModified: globalUpdateModified,
    updateNextStep,
    updateIsDirty,
    updateIsDisabled,
  } = useContext(ApplicationContext);
  const { updateModified, updateParamFileContent } = useContext(
    DownloadParamFileContext,
  );
  const { state } = useContext(InformationContext);
  const { t } = useTranslation();
  const { distribution, systemRequirements } = props;
  const publicRef = {
    persistState: () => {
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

      updateNextStep(mergedSteps.steps);
      updateIsDirty(true);
      updateIsDisabled(updateIsDisabledFromUtils(mergedSteps.steps));

      localStorage.setItem(
        LOCAL_STORAGE_KEY_APP_INFORMATION,
        JSON.stringify({
          ...state,
          origin: STATE_ORIGIN_STORAGE,
        }),
      );
    },
  };

  useEffect(publicRef.persistState, [state]);
  useImperativeHandle(ref, () => publicRef);

  const paramFileHasBeenModifiedFromState =
    globalState?.steps.downloadParamFile?.modified ?? false;
  const distributionName = distribution.name
    ? DISTRIBUTION_LIST.find((x) => x.id === distribution.name).label
    : "";
  const distributionVersion =
    distribution.name && distribution.version
      ? VERSION_LIST[distribution.name].find(
          (x) => x.id === distribution.version,
        ).label
      : "";
  const memorySize = systemRequirements.memorySize
    ? systemRequirements.memorySize
    : 0;
  const diskSize = systemRequirements.diskSize
    ? systemRequirements.diskSize
    : 0;
  const machineLevel = systemRequirements.machineLevel
    ? systemRequirements.machineLevel
    : "";
  const docLink = systemRequirements.docLink ? systemRequirements.docLink : "";

  const DEFAULT_MEMORY_SIZE_UNIT = "GiB";
  const DEFAULT_DISK_SIZE_UNIT = "GiB";

  const parmfileHasBeenModifiedNotificationMarkup = (
    <ActionableNotification
      hideCloseButton
      inline
      lowContrast
      className="information_parmfile-purge-banner"
      actionButtonLabel={t("btnLabel.Reset", { ns: "common" })}
      aria-label="closes notification"
      kind="info"
      onActionButtonClick={() => {
        resetParamFileTextAreaData({
          updateParamFileContent,
          globalUpdateModified,
          updateModified,
          state: globalState,
        });
      }}
      onClose={function noRefCheck() {}}
      onCloseButtonClick={function noRefCheck() {}}
      statusIconDescription="notification"
      subtitle={t("panel.parmFileHasBeenModifiedNotificationSubtitle", {
        ns: "common",
      })}
      title={t("modalHeading.discardParamFileModificationsPrompt")}
    />
  );

  const markup = (
    <>
      {paramFileHasBeenModifiedFromState &&
        parmfileHasBeenModifiedNotificationMarkup}
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
    </>
  );

  return (
    <Layer className="information__layer">
      <FlexGrid className="information__grid">
        <Row>
          <Column>{markup}</Column>
        </Row>
      </FlexGrid>
    </Layer>
  );
});

Information.propTypes = {
  distribution: PropTypes.shape({
    name: PropTypes.string.isRequired,
    version: PropTypes.string.isRequired,
  }).isRequired,
  systemRequirements: PropTypes.shape({
    diskSize: PropTypes.number,
    memorySize: PropTypes.number,
    machineLevel: PropTypes.string,
    docLink: PropTypes.string,
  }),
};

export default Information;
