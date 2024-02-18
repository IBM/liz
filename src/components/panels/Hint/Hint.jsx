/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import {
  Layer,
  ListItem,
  UnorderedList,
  FlexGrid,
  Row,
  Column,
} from "@carbon/react";
import {
  ACTION_UPDATE_APP_STEPS,
  ACTION_UPDATE_APP_IS_DIRTY,
  ACTION_UPDATE_APP_IS_DISABLED,
  LOCAL_STORAGE_KEY_APP_HINT,
  STATE_ORIGIN_USER,
  STATE_ORIGIN_STORAGE,
} from "../../../util/constants";
import { ApplicationContext } from "../../../App";
import { updateIsDisabled } from "../../../util/panel-utils";
import "./_hint.scss";

const Hint = ({ state, dispatch }) => {
  const { t } = useTranslation();
  const { state: globalState, dispatch: globalDispatch } =
    React.useContext(ApplicationContext);

  useEffect(() => {
    const mergedSteps = {
      ...globalState,
      steps: {
        ...globalState.steps,
        hint: {
          ...globalState.steps.hint,
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
      LOCAL_STORAGE_KEY_APP_HINT,
      JSON.stringify({
        ...state,
        origin: STATE_ORIGIN_STORAGE,
      }),
    );
  }, [state]);

  const gridContentsMarkup = (
    <>
      <div className="hint_heading">
        {t("panel.hint.header", { ns: "panels" })}
      </div>
      <div className="hint_intro">
        {t("panel.hint.explanation", { ns: "panels" })}
      </div>
      <UnorderedList>
        <ListItem>{t("panel.hint.listItem1", { ns: "panels" })}</ListItem>
        <UnorderedList>
          <ListItem>{t("panel.hint.listItem2", { ns: "panels" })}</ListItem>
          <ListItem>{t("panel.hint.listItem3", { ns: "panels" })}</ListItem>
          <ListItem>{t("panel.hint.listItem4", { ns: "panels" })}</ListItem>
        </UnorderedList>
        <ListItem>{t("panel.hint.listItem5", { ns: "panels" })}</ListItem>
        <UnorderedList>
          <ListItem>{t("panel.hint.listItem6", { ns: "panels" })}</ListItem>
          <ListItem>{t("panel.hint.listItem7", { ns: "panels" })}</ListItem>
          <ListItem>{t("panel.hint.listItem8", { ns: "panels" })}</ListItem>
          <ListItem>{t("panel.hint.listItem9", { ns: "panels" })}</ListItem>
          <ListItem>{t("panel.hint.listItem10", { ns: "panels" })}</ListItem>
        </UnorderedList>
        <ListItem>{t("panel.hint.listItem11", { ns: "panels" })}</ListItem>
        <UnorderedList>
          <ListItem>{t("panel.hint.listItem12", { ns: "panels" })}</ListItem>
          <ListItem>{t("panel.hint.listItem13", { ns: "panels" })}</ListItem>
        </UnorderedList>
      </UnorderedList>
    </>
  );
  const markup = (
    <Layer>
      <FlexGrid className="hint_grid">
        <Row>
          <Column>{gridContentsMarkup}</Column>
        </Row>
      </FlexGrid>
    </Layer>
  );

  return markup;
};

Hint.propTypes = {
  state: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default Hint;
