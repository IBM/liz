import React, { useState } from "react";
import PropTypes from "prop-types";
import { ListItem, UnorderedList, Grid, Column } from "@carbon/react";
import "./_hint.scss";

const Hint = (patchState) => {
  // eslint-disable-next-line
  const [state, setState] = useState({
  });

  return (
    <Grid className="hint_grid" fullWidth>
      <Column sm={6} md={8} lg={16}>
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
      </Column>
    </Grid>
  );
};

Hint.propTypes = {
  patchState: PropTypes.func.isRequired
};

export default Hint;
