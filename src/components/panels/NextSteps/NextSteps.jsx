/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { useState, useEffect } from "react";
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
  ToggletipContent
} from "@carbon/react";
import { Information } from '@carbon/react/icons';
import "./_next-steps.scss";

const NextSteps = (useSsh, useVnc, networkAddress = "<host-IP-address>", vncPassword = "<vncpassword>", patchState, localStorageKey) => {
  const getInitialState = () => {
    const initialState = JSON.parse(localStorage.getItem(localStorageKey));
    const defaultState = {
    };

    if (initialState) {
      return initialState
    }
    return defaultState;
  }
  // eslint-disable-next-line
  const [state, setState] = useState(getInitialState);

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(state));
    patchState({
      steps: {
        nextSteps: {
          complete: true,
          disabled: true,
          invalid: false
        }
      }
    });
  }, []);

  const getContent = (value) => {
    return (
      <p>
        {value}
      </p>
    );
  }

  const getLabel = (label, buttonLabel, content) => {
    return (
      <>
        <ToggletipLabel>{label}</ToggletipLabel>
        <Toggletip className="misc-parameters_info-icon" align="right-bottom">
          <ToggletipButton label={buttonLabel}>
            <Information/>
          </ToggletipButton>
          <ToggletipContent>
            {content}
          </ToggletipContent>
        </Toggletip>
      </>
    );
  }

  const gridContentsMarkup = (
    <>
      <div className="next-steps_heading">Next steps</div>
      <div className="next-steps_para_bottom">
        For LPAR installation:
      </div>
      <UnorderedList>
        <ListItem>Prepare an FTP server with the installer boot files from the RHEL installer ISO:</ListItem>
        <UnorderedList>
          <ListItem>The <code className="next-steps__formatted-code">generic.ins</code> file</ListItem>
          <ListItem>The <code className="next-steps__formatted-code">images</code> directory</ListItem>
        </UnorderedList>
        <ListItem>Replace the file named genericdvd.prm with the parmfile contents downloaded from this application.</ListItem>        
        <ListItem>Log on to the IBM Z Hardware Management Console (HMC) that manages the LPAR</ListItem>
        <ListItem>Go to <code className="next-steps__formatted-code">Systems Management</code> view for the mainframe containing the LPAR</ListItem>
        <ListItem>Select the target LPAR</ListItem>
        <ListItem>Select the task <code className="next-steps__formatted-code">Recovery -&gt; Load from Removable Media or Server</code></ListItem>
        <ListItem>Enter the parameters for the FTP server</ListItem>
        <ListItem>Select OK</ListItem>
      </UnorderedList>
      {useVnc &&
        <>
          <div className="next-steps_para">
            Once the installer is started, use a VNC client to connect to the system at the following address:
          </div>
          <UnorderedList>
            <ListItem>VNC host: {networkAddress || "<host-IP-address>"}{!networkAddress &&
              getLabel(
                "",
                "Show information",
                getContent("The network address was not yet provided.")
              )
            }</ListItem>
            <ListItem>VNC password: {vncPassword}</ListItem>
          </UnorderedList>
        </>
      }
      {useSsh &&
        <>
          <div className="next-steps_para">
            Once the installer is started, use an SSH client to connect to the system at the following address:
          </div>
          <UnorderedList>
            <ListItem>SSH host: installer@{networkAddress || "<host-IP-address>"}{!networkAddress &&
              getLabel(
                "",
                "Show information",
                getContent("The network address was not yet provided.")
              )
            }</ListItem>
          </UnorderedList>
        </>
      }
    </>
  );
  const markup = (
    <Layer>
      <FlexGrid className="next-steps_grid">
        <Row>
          <Column>
            {gridContentsMarkup}
          </Column>
        </Row>
      </FlexGrid>
    </Layer>
  );

  return (markup);
};

NextSteps.propTypes = {
  useVnc: PropTypes.bool.isRequired,
  useSsh: PropTypes.bool.isRequired,
  patchState: PropTypes.func.isRequired,
  localStorageKey: PropTypes.string.isRequired,
  networkAddress: PropTypes.string,
  vncPassword: PropTypes.string
};

export default NextSteps;
