/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Layer, ListItem, UnorderedList, FlexGrid, Row, Column } from "@carbon/react";
import "./_hint.scss";

const Hint = (patchState, localStorageKey) => {
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
        hint: {
          complete: true,
          disabled: true,
          invalid: false
        }
      }
    });
  }, []);

  const gridContentsMarkup = (
    <>
      <div className="hint_heading">Before you begin</div>
      <div className="hint_intro">
        You will need the following information to complete this dialog.
        The listed information is typically provided by hardware or network administrators of the system to be installed.
      </div>
      <UnorderedList>
        <ListItem>Networking device parameters</ListItem>
        <UnorderedList>
          <ListItem>OSA device number, layer 2 setting and port number, or</ListItem>
          <ListItem>PCI device FID or UID</ListItem>
          <ListItem>VLAN ID (if applicable)</ListItem>
        </UnorderedList>
        <ListItem>Networking parameters</ListItem>
        <UnorderedList>
          <ListItem>Hostname and domain name</ListItem>
          <ListItem>IP address</ListItem>
          <ListItem>IP netmask or prefix</ListItem>
          <ListItem>IP gateway address</ListItem>
          <ListItem>Nameserver IP addres</ListItem>
        </UnorderedList>          
        <ListItem>Network URL of installation source</ListItem>
      </UnorderedList>
    </>
  );
  const markup = (
    <Layer>
      <FlexGrid className="hint_grid">
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

Hint.propTypes = {
  patchState: PropTypes.func.isRequired,
  localStorageKey: PropTypes.string.isRequired
};

export default Hint;
