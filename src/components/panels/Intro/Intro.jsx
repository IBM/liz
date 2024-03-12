/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import React, { forwardRef, useEffect, useImperativeHandle } from "react";
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
import PropTypes from "prop-types";
import {
  ACTION_UPDATE_APP_STEPS,
  ACTION_UPDATE_APP_IS_DIRTY,
  ACTION_UPDATE_APP_IS_DISABLED,
  ACTION_UPDATE_INTRO_PURGE_PARMFILE_SETTINGS,
  LOCAL_STORAGE_KEY_APP_INTRO,
  STATE_ORIGIN_USER,
  STATE_ORIGIN_STORAGE,
} from "../../../util/constants";
import { ApplicationContext } from "../../../App";
import { updateIsDisabled } from "../../../util/panel-utils";
import { resetParamFileTextAreaData } from "../../../uiUtil/panel-utils";
import { pruneSettings } from "../../../util/local-storage-util";
import "./_intro.scss";

const Intro = forwardRef(function Intro(props, ref) {
  const {
    state: globalState,
    dispatch: globalDispatch,
    downloadParamFileDispatch,
  } = React.useContext(ApplicationContext);
  const { t } = useTranslation();

  const { state, dispatch, resetToInitialState, localStorageKeys } = props;
  const publicRef = {
    pruneSettings: () => {
      if (purgeParmfileSettings) {
        pruneSettings(localStorageKeys);
        resetToInitialState();
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

  const updatePurgeParmfileSettings = (flag) => {
    dispatch({
      type: ACTION_UPDATE_INTRO_PURGE_PARMFILE_SETTINGS,
      nextOrigin: STATE_ORIGIN_USER,
      nextPurgeParmfileSettings: flag,
    });
  };

  const parmfilePurgeNotificationMarkup = (
    <InlineNotification
      hideCloseButton
      statusIconDescription="notification"
      subtitle={t("panel.intro.parmFilePurgeNotificationSubtitle", {
        ns: "panels",
      })}
      title={t("panel.intro.parmFilePurgeNotificationTitle", { ns: "panels" })}
      kind="warning"
      className="intro_parmfile-purge-banner"
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
        resetParamFileTextAreaData(
          globalState,
          globalDispatch,
          downloadParamFileDispatch,
        );
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
      <Toggle
        labelText={t("panel.intro.purgeParmfileSettingsToggleTextLabel", {
          ns: "panels",
        })}
        labelA={t("btnLabel.No", { ns: "common" })}
        labelB={t("btnLabel.Yes", { ns: "common" })}
        id="intro_purge-parmfile-settings-toggle"
        className="intro_purge-parmfile-settings-toggle"
        defaultToggled={!purgeParmfileSettings}
        onToggle={() => {
          if (purgeParmfileSettings) {
            updatePurgeParmfileSettings(false);
          } else {
            updatePurgeParmfileSettings(true);
          }
        }}
      />
      {purgeParmfileSettings && parmfilePurgeNotificationMarkup}
      {paramFileHasBeenModifiedFromState &&
        parmfileHasBeenModifiedNotificationMarkup}
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

Intro.propTypes = {
  state: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  resetToInitialState: PropTypes.func.isRequired,
  localStorageKeys: PropTypes.array.isRequired,
};

export default Intro;
