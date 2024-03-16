/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import React, { useState } from "react";
import PropTypes from "prop-types";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Trans, useTranslation } from "react-i18next";
import {
  UnorderedList,
  ListItem,
  InlineNotification,
  Accordion,
  AccordionItem,
} from "@carbon/react";
import { Checkmark, Copy } from "@carbon/icons-react";
import { getLabel, getContent } from "../../../../uiUtil/help-util";
import "./_next-steps.scss";

const NextSteps = ({ useSsh, useVnc, networkAddress, vncPassword }) => {
  const { t } = useTranslation();

  const [vncHostHasBeenCopied, setVncHostHasBeenCopied] = useState(false);
  const [vncPasswordHasBeenCopied, setVncPasswordHasBeenCopied] =
    useState(false);
  const [sshHostHasBeenCopied, setSshHostHasBeenCopied] = useState(false);

  const COPY_TYPE_VNC_HOST = 0;
  const COPY_TYPE_VNC_PASSWORD = 1;
  const COPY_TYPE_SSH_HOST = 2;

  const updateCopied = (type) => {
    switch (type) {
      case COPY_TYPE_VNC_HOST:
        setVncHostHasBeenCopied(true);
        break;
      case COPY_TYPE_VNC_PASSWORD:
        setVncPasswordHasBeenCopied(true);
        break;
      case COPY_TYPE_SSH_HOST:
        setSshHostHasBeenCopied(true);
        break;
      default:
        break;
    }

    const timer = setTimeout(() => {
      switch (type) {
        case COPY_TYPE_VNC_HOST:
          setVncHostHasBeenCopied(false);
          break;
        case COPY_TYPE_VNC_PASSWORD:
          setVncPasswordHasBeenCopied(false);
          break;
        case COPY_TYPE_SSH_HOST:
          setSshHostHasBeenCopied(false);
          break;
        default:
          break;
      }
    }, 2000);
    return () => clearTimeout(timer);
  };

  const networkAddressForListItem = networkAddress || "[host-IP-address]";
  const remoteAccessConfigIsMissing = !useSsh && !useVnc;

  const vncHostCopyIcon = vncHostHasBeenCopied ? (
    <Checkmark size="20" />
  ) : (
    <Copy size="20" />
  );
  const vncPasswordCopyIcon = vncPasswordHasBeenCopied ? (
    <Checkmark size="20" />
  ) : (
    <Copy size="20" />
  );
  const sshHostCopyIcon = sshHostHasBeenCopied ? (
    <Checkmark size="20" />
  ) : (
    <Copy size="20" />
  );

  const vncHostCopyClass = vncHostHasBeenCopied
    ? "next-steps_copy-button_copied"
    : "next-steps_copy-button";
  const vncPasswordCopyClass = vncPasswordHasBeenCopied
    ? "next-steps_copy-button_copied"
    : "next-steps_copy-button";
  const sshHostCopyClass = sshHostHasBeenCopied
    ? "next-steps_copy-button_copied"
    : "next-steps_copy-button";

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
          {networkAddress && (
            <span
              className={vncHostCopyClass}
              title={t("btnLabel.Copy", { ns: "common" })}
            >
              <CopyToClipboard
                text={networkAddressForListItem}
                onCopy={() => updateCopied(COPY_TYPE_VNC_HOST)}
              >
                {vncHostCopyIcon}
              </CopyToClipboard>
            </span>
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
            <span
              className={vncPasswordCopyClass}
              title={t("btnLabel.Copy", { ns: "common" })}
            >
              <CopyToClipboard
                text={vncPassword}
                onCopy={() => updateCopied(COPY_TYPE_VNC_PASSWORD)}
              >
                {vncPasswordCopyIcon}
              </CopyToClipboard>
            </span>
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
          {networkAddress && (
            <span
              className={sshHostCopyClass}
              title={t("btnLabel.Copy", { ns: "common" })}
            >
              <CopyToClipboard
                text={`installer@${networkAddressForListItem}`}
                onCopy={() => updateCopied(COPY_TYPE_SSH_HOST)}
              >
                {sshHostCopyIcon}
              </CopyToClipboard>
            </span>
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

  return <>{nextStepsInformation}</>;
};

NextSteps.propTypes = {
  hasMultipleSteps: PropTypes.bool,
  currentHelpStep: PropTypes.number,
  updateCurrentHelpStep: PropTypes.func,
  useSsh: PropTypes.bool,
  useVnc: PropTypes.bool,
  networkAddress: PropTypes.string,
  vncPassword: PropTypes.string,
};

export default NextSteps;
