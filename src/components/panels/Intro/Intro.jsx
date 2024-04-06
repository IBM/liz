/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
} from "react";
import { useTranslation } from "react-i18next";
import {
  Layer,
  Toggle,
  FlexGrid,
  Row,
  Column,
  InlineNotification,
  ActionableNotification,
} from "@carbon/react";
import {
  LOCAL_STORAGE_KEY_APP_INTRO,
  STATE_ORIGIN_USER,
  STATE_ORIGIN_STORAGE,
} from "../../../util/local-storage-constants";
import {
  ApplicationContext,
  DownloadParamFileContext,
  EditPageContext,
  HeaderContext,
  InformationContext,
  InputFileSelectionContext,
  InstallationParameterContext,
  IntroContext,
  LandingPageContext,
  NetworkAddressContext,
  NetworkDeviceContext,
  SummaryContext,
} from "../../../contexts";
import { updateIsDisabled as updateIsDisabledFromUtils } from "../../../util/panel-util";
import { resetParamFileTextAreaData } from "../../../uiUtil/panel-util";
import "./_intro.scss";

const Intro = forwardRef(function Intro(props, ref) {
  const {
    state: globalState,
    updateModified: globalUpdateModified,
    updateNextStep,
    updateIsDirty,
    updateIncludeIntroStep,
    updateIsDisabled,
    updateIsEditing,
    resetToInitialState: globalResetToInitialState,
  } = useContext(ApplicationContext);
  const {
    resetToInitialState: downloadParamFileResetToInitialState,
    updateModified,
    updateParamFileContent,
  } = useContext(DownloadParamFileContext);
  const { resetToInitialState: editPageResetToInitialState } =
    useContext(EditPageContext);
  const { resetToInitialState: headerResetToInitialState } =
    useContext(HeaderContext);
  const { resetToInitialState: informationResetToInitialState } =
    useContext(InformationContext);
  const { resetToInitialState: inputFileSelectionResetToInitialState } =
    useContext(InputFileSelectionContext);
  const { resetToInitialState: installationParameterResetToInitialState } =
    useContext(InstallationParameterContext);
  const {
    state,
    updatePurgeParmfileSettings,
    resetToInitialState: introResetToInitialState,
  } = useContext(IntroContext);
  const { resetToInitialState: landingPageResetToInitialState } =
    useContext(LandingPageContext);
  const { resetToInitialState: networkAddressResetToInitialState } = useContext(
    NetworkAddressContext,
  );
  const { resetToInitialState: networkDeviceResetToInitialState } =
    useContext(NetworkDeviceContext);
  const { resetToInitialState: summaryResetToInitialState } =
    useContext(SummaryContext);
  const { t } = useTranslation();
  const publicRef = {
    pruneSettings: () => {
      if (purgeParmfileSettings) {
        globalResetToInitialState();
        downloadParamFileResetToInitialState();
        editPageResetToInitialState();
        headerResetToInitialState();
        informationResetToInitialState();
        inputFileSelectionResetToInitialState();
        installationParameterResetToInitialState();
        introResetToInitialState();
        landingPageResetToInitialState();
        networkAddressResetToInitialState();
        networkDeviceResetToInitialState();
        summaryResetToInitialState();
        updateIsEditing(true);

        if (panelHasBeenIncluded) {
          updateIncludeIntroStep(true);
        }
      }
    },
    persistState: () => {
      const mergedSteps = {
        ...globalState,
        steps: {
          ...globalState.steps,
          intro: {
            ...globalState.steps.intro,
            complete: true,
            disabled: false,
            invalid: false,
            purgeParmfileSettings,
            origin: STATE_ORIGIN_USER,
          },
        },
      };

      updateNextStep(mergedSteps.steps);
      updateIsDirty(true);
      updateIsDisabled(updateIsDisabledFromUtils(mergedSteps.steps));

      localStorage.setItem(
        LOCAL_STORAGE_KEY_APP_INTRO,
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
  const purgeParmfileSettings = state.purgeParmfileSettings;
  const panelHasBeenIncluded =
    (globalState?.isEditing && globalState?.useStateFromLocalStorage) ?? false;

  const parmfilePurgeNotificationMarkup = (
    <InlineNotification
      hideCloseButton
      statusIconDescription="notification"
      subtitle={t("panel.intro.parmFilePurgeNotificationSubtitle", {
        ns: "panels",
      })}
      title={t("panel.intro.parmFilePurgeNotificationTitle", { ns: "panels" })}
      kind="warning"
      className="intro_parmfile-purge-warning-banner"
    />
  );

  const parmfileHasBeenModifiedNotificationMarkup = (
    <ActionableNotification
      hideCloseButton
      inline
      lowContrast
      className="intro_parmfile-purge-banner"
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

  const gridContentsMarkup = (
    <>
      {paramFileHasBeenModifiedFromState &&
        parmfileHasBeenModifiedNotificationMarkup}
      <Toggle
        labelText={t("panel.intro.purgeParmfileSettingsToggleTextLabel", {
          ns: "panels",
        })}
        labelA={t("btnLabel.No", { ns: "common" })}
        labelB={t("btnLabel.Yes", { ns: "common" })}
        id="intro_purge-parmfile-settings-toggle"
        className="intro_purge-parmfile-settings-toggle"
        toggled={!purgeParmfileSettings}
        onToggle={() => {
          if (purgeParmfileSettings) {
            updatePurgeParmfileSettings(false);
          } else {
            updatePurgeParmfileSettings(true);
          }
        }}
      />
      {purgeParmfileSettings && parmfilePurgeNotificationMarkup}
    </>
  );

  const markup = (
    <Layer className="summary__layer">
      <FlexGrid className="summary__grid">
        <Row>
          <Column>{gridContentsMarkup}</Column>
        </Row>
      </FlexGrid>
    </Layer>
  );

  return markup;
});

export default Intro;
