/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import { Button, Grid, Column } from "@carbon/react";
import { Incomplete } from "@carbon/icons-react";
import "./_installer-step-tile.scss";

const InstallerStepTile = () => {
  return (
    <Grid className="installer-step-tile__outline">
      <Column sm={6} md={8} lg={12} className="">
        <div
          id="installer-step-tile_header-title"
          className="installer-step-tile__header-title"
        >
          Display Information
        </div>
        <div
          id="installer-step-tile_header-status"
          className="installer-step-tile__header-status"
        >
          <Incomplete />
        </div>
      </Column>
      <Column sm={6} md={8} lg={12} className="">
        CONTENT
      </Column>
      <Column sm={6} md={8} lg={12} className="">
        <Button className=".installer-step-tile__footer-button">
          Complete and continue
        </Button>
      </Column>
    </Grid>
  );
};

export default InstallerStepTile;
