/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Layer, Toggle, FlexGrid, Row, Column, TextInput } from "@carbon/react";
import {
  ACTION_UPDATE_APP_STEPS,
  ACTION_UPDATE_APP_IS_DIRTY,
  ACTION_UPDATE_APP_IS_DISABLED,
  LOCAL_STORAGE_KEY_APP_SUMMARY,
  STATE_ORIGIN_USER,
  STATE_ORIGIN_STORAGE,
  ACTION_UPDATE_SUMMARY_DOWNLOAD_PARMFILE,
  ACTION_UPDATE_SUMMARY_DOWNLOAD_PARMFILE_NAME,
} from "../../../util/constants";
import { ApplicationContext } from "../../../App";
import { updateIsDisabled } from "../../../util/panel-utils";
import "./_summary.scss";

const Summary = forwardRef(function Summary(props, ref) {
  const { state: globalState, dispatch: globalDispatch } =
    React.useContext(ApplicationContext);
  const { t } = useTranslation();

  const { dispatch, state } = props;
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

  const updateDownloadParmfile = (flag) => {
    dispatch({
      type: ACTION_UPDATE_SUMMARY_DOWNLOAD_PARMFILE,
      nextOrigin: STATE_ORIGIN_USER,
      nextDownloadParmfile: flag,
    });
  };

  const updateDownloadParmfileName = (name) => {
    dispatch({
      type: ACTION_UPDATE_SUMMARY_DOWNLOAD_PARMFILE_NAME,
      nextOrigin: STATE_ORIGIN_USER,
      nextDownloadParmfileName: name,
    });
  };

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

Summary.propTypes = {
  state: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default Summary;
