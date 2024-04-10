/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
import { Layer, Toggle, FlexGrid, Row, Column, TextInput } from "@carbon/react";
import {
  LOCAL_STORAGE_KEY_APP_SUMMARY,
  STATE_ORIGIN_USER,
  STATE_ORIGIN_STORAGE,
} from "../../../util/local-storage-constants";
import { ApplicationContext, SummaryContext } from "../../../contexts";
import { updateIsDisabled as updateIsDisabledFromUtils } from "../../../util/panel-util";
import { setItem } from "../../../util/local-storage-util";
import "./_summary.scss";

const Summary = forwardRef(function Summary(props, ref) {
  const {
    state: globalState,
    updateNextStep,
    updateIsDirty,
    updateIsDisabled,
  } = React.useContext(ApplicationContext);
  const { state, updateDownloadParmfile, updateDownloadParmfileName } =
    React.useContext(SummaryContext);
  const { t } = useTranslation();
  const publicRef = {
    persistState: () => {
      const mergedSteps = {
        ...globalState,
        steps: {
          ...globalState.steps,
          summary: {
            ...globalState.steps.summary,
            complete: true,
            disabled: true,
            invalid: false,
            downloadParmfile,
            downloadParmfileName,
            origin: STATE_ORIGIN_USER,
          },
        },
      };

      updateNextStep(mergedSteps.steps);
      updateIsDirty(true);
      updateIsDisabled(updateIsDisabledFromUtils(mergedSteps.steps));

      setItem(
        LOCAL_STORAGE_KEY_APP_SUMMARY,
        JSON.stringify({
          ...state,
          origin: STATE_ORIGIN_STORAGE,
        }),
      );
    },
  };

  useEffect(publicRef.persistState, [state]);
  useImperativeHandle(ref, () => publicRef);

  const downloadParmfile = state.downloadParmfile;
  const downloadParmfileName = state.downloadParmfileName;

  const gridContentsMarkup = (
    <>
      <Toggle
        labelText={t("panel.summary.downloadParmfileToggleTextLabel", {
          ns: "panels",
        })}
        labelA={t("btnLabel.No", { ns: "common" })}
        labelB={t("btnLabel.Yes", { ns: "common" })}
        id="summary_download-parmfile-toggle"
        className="summary_download-parmfile-toggle"
        toggled={downloadParmfile}
        onToggle={() => {
          if (downloadParmfile) {
            updateDownloadParmfile(false);
          } else {
            updateDownloadParmfile(true);
          }
        }}
      />
      {downloadParmfile && (
        <TextInput
          autoComplete="true"
          helperText={t("panel.summary.downloadParmfileNameTextHelp", {
            ns: "panels",
          })}
          id="vnc-parmfile-name-input"
          invalidText={t("invalidTextLabel", { ns: "common" })}
          labelText={t("panel.summary.downloadParmfileNameTextLabel", {
            ns: "panels",
          })}
          placeholder={t("panel.summary.downloadParmfileNamePlaceholder", {
            ns: "panels",
          })}
          value={downloadParmfileName}
          onChange={(parmfileName) => {
            updateDownloadParmfileName(
              parmfileName && parmfileName.target
                ? parmfileName.target.value
                : "",
            );
          }}
          onBlur={(parmfileName) => {
            updateDownloadParmfileName(
              parmfileName && parmfileName.target
                ? parmfileName.target.value
                : "",
            );
          }}
        />
      )}
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

export default Summary;
