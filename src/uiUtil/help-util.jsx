/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import {
  ToggletipLabel,
  Toggletip,
  ToggletipButton,
  ToggletipContent,
} from "@carbon/react";
import { Information } from "@carbon/react/icons";

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

export { getContent, getLabel };
