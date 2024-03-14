/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import PropTypes from "prop-types";
import { Trans, useTranslation } from "react-i18next";
import {
  Button,
  UnorderedList,
  ListItem,
  InlineNotification,
  Accordion,
  AccordionItem,
} from "@carbon/react";
import { NextOutline } from "@carbon/icons-react";
import { getLabel, getContent } from "../../../uiUtil/help-util";
import "./_landing-page.scss";

const LandingPage = ({
  hasMultipleSteps,
  currentHelpStep,
  updateCurrentHelpStep,
  useSsh,
  useVnc,
  networkAddress,
  vncPassword,
}) => {
  const { t } = useTranslation();

  const systemRequirementInformation = (
    <>
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
        {t("panel.nextSteps.explanation3", { ns: "panels" })}
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
      lowContrast
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

  const nextStepsInformation = (
    <>
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
            &nbsp;view for the mainframe containing the LPAR or DPM partition.
          </Trans>
        </ListItem>
        <Accordion className="next-steps__accordion">
          <AccordionItem
            title={t("panel.nextSteps.listItem14", { ns: "panels" })}
          >
            <UnorderedList>
              <ListItem>
                <Trans i18nKey="panel.nextSteps.listItem8" ns="panels">
                  Select the task&nbsp;
                  <code className="next-steps__formatted-code">
                    Recovery -&gt; Load from Removable Media or Server
                  </code>
                  .
                </Trans>
              </ListItem>
              <ListItem>
                <Trans i18nKey="panel.nextSteps.listItem16" ns="panels">
                  Select&nbsp;
                  <code className="next-steps__formatted-code">FTP server</code>
                  and enter server host name, user name, and password.
                </Trans>
              </ListItem>
              <ListItem>
                <Trans i18nKey="panel.nextSteps.listItem17" ns="panels">
                  Select&nbsp;
                  <code className="next-steps__formatted-code">Ok</code>.
                </Trans>
              </ListItem>
            </UnorderedList>
          </AccordionItem>
          <AccordionItem
            title={t("panel.nextSteps.listItem18", { ns: "panels" })}
          >
            <UnorderedList>
              <ListItem>
                <Trans i18nKey="panel.nextSteps.listItem19" ns="panels">
                  Select the task&nbsp;
                  <code className="next-steps__formatted-code">
                    Partition details -&gt; Boot
                  </code>
                  .
                </Trans>
              </ListItem>
              <ListItem>
                <Trans i18nKey="panel.nextSteps.listItem20" ns="panels">
                  Select&nbsp;
                  <code className="next-steps__formatted-code">
                    Boot from -&gt; FTP server
                  </code>
                  &nbsp;and enter server host name, user name, and password.
                </Trans>
              </ListItem>
              <ListItem>
                <Trans i18nKey="panel.nextSteps.listItem21" ns="panels">
                  Specify the path to the generic.ins file or use the&nbsp;
                  <code className="next-steps__formatted-code">Browse</code>
                  &nbsp;button to locate it.
                </Trans>
              </ListItem>
              <ListItem>
                <Trans i18nKey="panel.nextSteps.listItem22" ns="panels">
                  Select&nbsp;
                  <code className="next-steps__formatted-code">Apply</code>
                  &nbsp;then&nbsp;
                  <code className="next-steps__formatted-code">Start</code>.
                </Trans>
              </ListItem>
            </UnorderedList>
          </AccordionItem>
        </Accordion>
      </UnorderedList>
      {useVnc && vncInstructionsMarkup}
      {useSsh && sshInstructionsMarkup}
      {remoteAccessConfigIsMissing && missingRemoteAccessNotification}
    </>
  );

  return (
    <>
      {currentHelpStep === 0 && (
        <>
          <div className="help-panel__landing-page__header">
            <span>{t("helpPanelHeader.landingPage", { ns: "help" })}</span>
          </div>
          <div className="help-panel__landing-page__content">
            <Trans i18nKey="helpPanelContents.landingPage" ns="help" />
          </div>
          <div className="help-panel__landing-page__footer">
            <Button
              kind="tertiary"
              onClick={() => updateCurrentHelpStep(currentHelpStep + 1)}
              renderIcon={(props) => <NextOutline size={24} {...props} />}
            >
              {t("btnLabel.SystemRequirements", { ns: "common" })}
            </Button>
          </div>
        </>
      )}
      {currentHelpStep === 1 && (
        <>
          <div className="help-panel__landing-page__header">
            <span>{t("btnLabel.SystemRequirements", { ns: "common" })}</span>
          </div>
          <div className="help-panel__landing-page__content">
            {systemRequirementInformation}
          </div>
          <div className="help-panel__landing-page__footer">
            <Button
              kind="tertiary"
              onClick={() => updateCurrentHelpStep(currentHelpStep + 1)}
              renderIcon={(props) => <NextOutline size={24} {...props} />}
            >
              {t("btnLabel.NextSteps", { ns: "common" })}
            </Button>
          </div>
        </>
      )}
      {currentHelpStep === 2 && (
        <>
          <div className="help-panel__landing-page__header">
            <span>{t("btnLabel.NextSteps", { ns: "common" })}</span>
          </div>
          <div className="help-panel__landing-page__content">
            {nextStepsInformation}
          </div>
        </>
      )}
    </>
  );
};

LandingPage.propTypes = {
  hasMultipleSteps: PropTypes.bool,
  currentHelpStep: PropTypes.number,
  updateCurrentHelpStep: PropTypes.func,
  useSsh: PropTypes.bool,
  useVnc: PropTypes.bool,
  networkAddress: PropTypes.string,
  vncPassword: PropTypes.string,
};

export default LandingPage;
