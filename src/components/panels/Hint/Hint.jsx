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

const Hint = (patchState, localStorageKey) => {
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
      <div className="hint_heading">{t("panel.hint.header")}</div>
      <div className="hint_intro">{t("panel.hint.explanation")}</div>
      <UnorderedList>
        <ListItem>{t("panel.hint.listItem1")}</ListItem>
        <UnorderedList>
          <ListItem>{t("panel.hint.listItem2")}</ListItem>
          <ListItem>{t("panel.hint.listItem3")}</ListItem>
          <ListItem>{t("panel.hint.listItem4")}</ListItem>
        </UnorderedList>
        <ListItem>{t("panel.hint.listItem5")}</ListItem>
        <UnorderedList>
          <ListItem>{t("panel.hint.listItem6")}</ListItem>
          <ListItem>{t("panel.hint.listItem7")}</ListItem>
          <ListItem>{t("panel.hint.listItem8")}</ListItem>
          <ListItem>{t("panel.hint.listItem9")}</ListItem>
          <ListItem>{t("panel.hint.listItem10")}</ListItem>
        </UnorderedList>
        <ListItem>{t("panel.hint.listItem11")}</ListItem>
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
