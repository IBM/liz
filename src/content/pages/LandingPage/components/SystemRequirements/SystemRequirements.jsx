/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import React from "react";
import { useTranslation } from "react-i18next";
import { UnorderedList, ListItem } from "@carbon/react";
import "./_system-requirements.scss";

const SystemRequirements = () => {
  const { t } = useTranslation();

  const systemRequirementInformation = (
    <>
      <div className="liz__system-requirements_intro">
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

  return <>{systemRequirementInformation}</>;
};

export default SystemRequirements;
