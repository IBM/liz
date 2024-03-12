/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { forwardRef, useEffect, useImperativeHandle } from "react";
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
import {
  ACTION_UPDATE_APP_STEPS,
  ACTION_UPDATE_APP_IS_DIRTY,
  ACTION_UPDATE_APP_IS_DISABLED,
  LOCAL_STORAGE_KEY_APP_NEXT_STEPS,
  STATE_ORIGIN_USER,
  STATE_ORIGIN_STORAGE,
} from "../../../util/constants";
import { ApplicationContext } from "../../../App";
import { updateIsDisabled } from "../../../util/panel-utils";
import { getLabel, getContent } from "../../../uiUtil/help-util";
import "./_next-steps.scss";

const NextSteps = forwardRef(function NextSteps(props, ref) {
  const { state: globalState, dispatch: globalDispatch } =
    React.useContext(ApplicationContext);
  const { t } = useTranslation();

  const { state, useVnc, useSsh, networkAddress, vncPassword } = props;
  const publicRef = {
    persistState: () => {
      const mergedSteps = {
        ...globalState,
        steps: {
          ...globalState.steps,
          nextSteps: {
            ...globalState.steps.nextSteps,
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
        LOCAL_STORAGE_KEY_APP_NEXT_STEPS,
        JSON.stringify({
          ...state,
          origin: STATE_ORIGIN_STORAGE,
        }),
      );
    },
  };

  useEffect(publicRef.persistState, [state]);
  useImperativeHandle(ref, () => publicRef);

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
});

NextSteps.propTypes = {
  useVnc: PropTypes.bool.isRequired,
  useSsh: PropTypes.bool.isRequired,
  networkAddress: PropTypes.string,
  vncPassword: PropTypes.string,
  state: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default NextSteps;
