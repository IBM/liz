/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { useState, useEffect } from "react";
import { Trans, useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import {
  InlineNotification,
  Layer,
  ListItem,
  UnorderedList,
  FlexGrid,
  Row,
  Column,
} from "@carbon/react";
import { getLabel, getContent } from "../../../uiUtil/help-util";
import "./_next-steps.scss";

const NextSteps = (
  useSsh,
  useVnc,
  networkAddress,
  vncPassword,
  patchState,
  localStorageKey,
  label,
) => {
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
        nextSteps: {
          complete: true,
          disabled: true,
          invalid: false,
        },
      },
    });
  }, []);

  const networkAddressForListItem = networkAddress || "[host-IP-address]";
  const remoteAccessConfigIsMissing = !useSsh && !useVnc;

  const vncInstructionsMarkup = (
    <>
      <div className="next-steps_para">
        {t("panel.nextSteps.explanation2", { ns: "panels" })}
      </div>
      <UnorderedList>
        <ListItem>
          <Trans i18nKey="panel.nextSteps.listItem11" ns="panels">
            VNC host:&nbsp;
            <code className="next-steps__formatted-code">
              {{ networkAddressForListItem }}
            </code>
          </Trans>
          {!networkAddress &&
            getLabel(
              "",
              t("showInformationLabel", { ns: "common" }),
              getContent("The network address was not yet provided."),
            )}
        </ListItem>
        {vncPassword && (
          <ListItem>
            <Trans i18nKey="panel.nextSteps.listItem12" ns="panels">
              VNC password:&nbsp;
              <code className="next-steps__formatted-code">
                {{ vncPassword }}
              </code>
            </Trans>
          </ListItem>
        )}
      </UnorderedList>
    </>
  );

  const sshInstructionsMarkup = (
    <>
      <div className="next-steps_para">
        {t("panel.nextSteps.explanation2", { ns: "panels" })}
      </div>
      <UnorderedList>
        <ListItem>
          <Trans i18nKey="panel.nextSteps.listItem13" ns="panels">
            SSH host:&nbsp;
            <code className="next-steps__formatted-code">
              installer@{{ networkAddressForListItem }}
            </code>
          </Trans>
          {!networkAddress &&
            getLabel(
              "",
              t("showInformationLabel", { ns: "common" }),
              getContent("The network address was not yet provided."),
            )}
        </ListItem>
      </UnorderedList>
    </>
  );

  const missingRemoteAccessNotification = (
    <InlineNotification
      hideCloseButton
      statusIconDescription="notification"
      subtitle={t("panel.nextSteps.missingRemoteAccessNotificationSubtitle", {
        ns: "panels",
      })}
      title={t("panel.nextSteps.missingRemoteAccessNotificationTitle", {
        ns: "panels",
      })}
      kind="warning"
      className="next-steps_missing-remote-access-banner"
    />
  );

  const gridContentsMarkup = (
    <>
      <div className="next-steps_heading">
        {t("panel.nextSteps.header", { ns: "panels" })}
      </div>
      <div className="next-steps_para_bottom">
        {t("panel.nextSteps.explanation1", { ns: "panels" })}
      </div>
      <UnorderedList>
        <ListItem>{t("panel.nextSteps.listItem1", { ns: "panels" })}</ListItem>
        <UnorderedList>
          <ListItem>
            <Trans i18nKey="panel.nextSteps.listItem2" ns="panels">
              The&nbsp;
              <code className="next-steps__formatted-code">generic.ins</code>
              &nbsp;File
            </Trans>
          </ListItem>
          <ListItem>
            <Trans i18nKey="panel.nextSteps.listItem3" ns="panels">
              The&nbsp;
              <code className="next-steps__formatted-code">images</code>
              &nbsp;directory
            </Trans>
          </ListItem>
        </UnorderedList>
        <ListItem>
          <Trans i18nKey="panel.nextSteps.listItem4" ns="panels">
            Replace the file named&nbsp;
            <code className="next-steps__formatted-code">genericdvd.prm</code>
            &nbsp;with the parmfile contents downloaded from this application.
          </Trans>
        </ListItem>
        <ListItem>{t("panel.nextSteps.listItem5", { ns: "panels" })}</ListItem>
        <ListItem>
          <Trans i18nKey="panel.nextSteps.listItem6" ns="panels">
            Go to the&nbsp;
            <code className="next-steps__formatted-code">
              Systems Management
            </code>
            &nbsp;view for the mainframe containing the LPAR.
          </Trans>
        </ListItem>
        <ListItem>{t("panel.nextSteps.listItem7", { ns: "panels" })}</ListItem>
        <ListItem>
          <Trans i18nKey="panel.nextSteps.listItem8" ns="panels">
            Select the task&nbsp;
            <code className="next-steps__formatted-code">
              Recovery -&gt; Load from Removable Media or Server
            </code>
            .
          </Trans>
        </ListItem>
        <ListItem>{t("panel.nextSteps.listItem9", { ns: "panels" })}</ListItem>
        <ListItem>{t("panel.nextSteps.listItem10", { ns: "panels" })}</ListItem>
      </UnorderedList>
      {useVnc && vncInstructionsMarkup}
      {useSsh && sshInstructionsMarkup}
      {remoteAccessConfigIsMissing && missingRemoteAccessNotification}
    </>
  );
  const markup = (
    <Layer>
      <FlexGrid className="next-steps_grid">
        <Row>
          <Column>{gridContentsMarkup}</Column>
        </Row>
      </FlexGrid>
    </Layer>
  );

  return markup;
};

NextSteps.propTypes = {
  useVnc: PropTypes.bool.isRequired,
  useSsh: PropTypes.bool.isRequired,
  patchState: PropTypes.func.isRequired,
  localStorageKey: PropTypes.string.isRequired,
  networkAddress: PropTypes.string,
  vncPassword: PropTypes.string,
};

export default NextSteps;
