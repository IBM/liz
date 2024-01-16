/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { useState, useEffect } from "react";
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
import "./_hint.scss";

const Hint = (patchState, localStorageKey, label, index) => {
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
  const [state, setState] = useState(getInitialState());

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(state));
    patchState({
      steps: {
        hint: {
          complete: true,
          disabled: true,
          invalid: false,
        },
      },
    });
  }, []);

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
  patchState: PropTypes.func.isRequired,
  localStorageKey: PropTypes.string.isRequired,
};

export default Hint;
