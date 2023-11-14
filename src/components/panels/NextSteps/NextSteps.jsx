/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { useState, useEffect } from "react";
import { Trans, useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import {
  Layer,
  ListItem,
  UnorderedList,
  FlexGrid,
  Row,
  Column,
  ToggletipLabel,
  Toggletip,
  ToggletipButton,
  ToggletipContent,
} from "@carbon/react";
import { Information } from "@carbon/react/icons";
import "./_next-steps.scss";

const NextSteps = (
  useSsh,
  useVnc,
  networkAddress = "<host-IP-address>",
  vncPassword = "<vncpassword>",
  patchState,
  localStorageKey,
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
  const [state, setState] = useState(getInitialState);

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

  const getContent = (value) => {
    return <p>{value}</p>;
  };

  const getLabel = (label, buttonLabel, content) => {
    return (
      <>
        <ToggletipLabel>{label}</ToggletipLabel>
        <Toggletip className="misc-parameters_info-icon" align="right-bottom">
          <ToggletipButton label={buttonLabel}>
            <Information />
          </ToggletipButton>
          <ToggletipContent>{content}</ToggletipContent>
        </Toggletip>
      </>
    );
  };

  const networkAddressForListItem = networkAddress || "<host-IP-address>";

  const gridContentsMarkup = (
    <>
      <div className="next-steps_heading">{t("panel.nextSteps.header")}</div>
      <div className="next-steps_para_bottom">
        {t("panel.nextSteps.explanation1")}
      </div>
      <UnorderedList>
        <ListItem>{t("panel.nextSteps.listItem1")}</ListItem>
        <UnorderedList>
          <ListItem>
            <Trans i18nKey="panel.nextSteps.listItem2">
              The{" "}
              <code className="next-steps__formatted-code">generic.ins</code>{" "}
              file
            </Trans>
          </ListItem>
          <ListItem>
            <Trans i18nKey="panel.nextSteps.listItem3">
              The <code className="next-steps__formatted-code">images</code>{" "}
              directory
            </Trans>
          </ListItem>
        </UnorderedList>
        <ListItem>
          <Trans i18nKey="panel.nextSteps.listItem4">
            Replace the file named{" "}
            <code className="next-steps__formatted-code">genericdvd.prm</code>{" "}
            with the parmfile contents downloaded from this application.
          </Trans>
        </ListItem>
        <ListItem>{t("panel.nextSteps.listItem5")}</ListItem>
        <ListItem>
          <Trans i18nKey="panel.nextSteps.listItem6">
            Go to{" "}
            <code className="next-steps__formatted-code">
              Systems Management
            </code>{" "}
            view for the mainframe containing the LPAR
          </Trans>
        </ListItem>
        <ListItem>{t("panel.nextSteps.listItem7")}</ListItem>
        <ListItem>
          <Trans i18nKey="panel.nextSteps.listItem8">
            Select the task{" "}
            <code className="next-steps__formatted-code">
              Recovery -&gt; Load from Removable Media or Server
            </code>
          </Trans>
        </ListItem>
        <ListItem>{t("panel.nextSteps.listItem9")}</ListItem>
        <ListItem>{t("panel.nextSteps.listItem10")}</ListItem>
      </UnorderedList>
      {useVnc && (
        <>
          <div className="next-steps_para">
            {t("panel.nextSteps.explanation2")}
          </div>
          <UnorderedList>
            <ListItem>
              <Trans i18nKey="panel.nextSteps.listItem11">
                VNC host: {{ networkAddressForListItem }}
              </Trans>
              {!networkAddress &&
                getLabel(
                  "",
                  t("showInformationLabel", { ns: "common" }),
                  getContent("The network address was not yet provided."),
                )}
            </ListItem>
            <ListItem>
              <Trans i18nKey="panel.nextSteps.listItem12">
                VNC password: {{ vncPassword }}
              </Trans>
            </ListItem>
          </UnorderedList>
        </>
      )}
      {useSsh && (
        <>
          <div className="next-steps_para">
            {t("panel.nextSteps.explanation2")}
          </div>
          <UnorderedList>
            <ListItem>
              <Trans i18nKey="panel.nextSteps.listItem13">
                SSH host: installer@{{ networkAddressForListItem }}
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
      )}
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
