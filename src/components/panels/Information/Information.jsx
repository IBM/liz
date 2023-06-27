import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "@carbon/react";
// import { IsoFilled } from "@carbon/icons-react";
import "./_information.scss";

const Information = (patchStat, distribution, systemRequirements, docLink, localStorageKey) => {
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
  const distributionName = distribution && distribution.name ? distribution.name : "";
  const distributionVersion = distribution && distribution.version ? distribution.version : "";
  const memorySize = systemRequirements && systemRequirements.memory ? systemRequirements.memory : 0;
  const diskSize = systemRequirements && systemRequirements.disk ? systemRequirements.disk : 0;
  const machineLevel = systemRequirements && systemRequirements.level ? systemRequirements.level : "";

  const DEFAULT_MEMORY_SIZE_UNIT = "GiB";
  const DEFAULT_DISK_SIZE_UNIT = "GiB";
  
  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(state));
  });

  return (
    <>
      <div className="information_heading">Requirements</div>
      <div className="information_content">
        The requirements shown are minimum requirements as indicated in the documentation.
      </div>
      <div className="table-container" role="table" aria-label="Display Information">
        <div className="flex-table row" id="display-iformation__table-header-row" role="rowgroup">
          <div className="flex-row" id="display-iformation__table-header-row__name" role="columnheader">Name OS</div>
          <div className="flex-row" id="display-iformation__table-content-row__name" role="cell">{distributionName}</div>
        </div>
        <div className="flex-table row" id="display-iformation__table-header-row" role="rowgroup">
          <div className="flex-row" id="display-iformation__table-header-row__version" role="columnheader">Version</div>
          <div className="flex-row" id="display-iformation__table-content-row__version" role="cell">{distributionVersion}</div>
        </div>
        <div className="flex-table row" id="display-iformation__table-header-row" role="rowgroup">
          <div className="flex-row" id="display-iformation__table-header-row__distribution" role="columnheader">Memory</div>
          <div className="flex-row" id="display-iformation__table-content-row__memory-size" role="cell">{memorySize} {DEFAULT_MEMORY_SIZE_UNIT}</div>
        </div>
        <div className="flex-table row" id="display-iformation__table-header-row" role="rowgroup">
          <div className="flex-row" id="display-iformation__table-header-row__distribution" role="columnheader">Disk</div>
          <div className="flex-row" id="display-iformation__table-content-row__disk-size" role="cell">{diskSize} {DEFAULT_DISK_SIZE_UNIT}</div>
        </div>
        <div className="flex-table row" id="display-iformation__table-header-row" role="rowgroup">
          <div className="flex-row" id="display-iformation__table-header-row__distribution" role="columnheader">Machine Level</div>
          <div className="flex-row" id="display-iformation__table-content-row__machine-level" role="cell">{machineLevel}</div>
        </div>
        {/*
        <div className="flex-table row" id="display-iformation__table-header-row" role="rowgroup">
          <div className="flex-row" id="display-iformation__table-header-row__status" role="columnheader">Status</div>
          <div className="flex-row" id="display-iformation__table-content-row__status" role="cell">
            <span className="isoIcon icon"><IsoFilled size="24" /></span>
            <span className="isoIcon label">ISO inserted</span>
          </div>
        </div>
        */}
      </div>
      <div className="information_heading">Information</div>
      <div className="information_content">
        Link to distribution-specific documentation: <Link href={docLink} target="_blank">{distributionName}</Link>
      </div>
    </>
  );
};

Information.propTypes = {
  patchState: PropTypes.func.isRequired,
  distribution: PropTypes.shape({
    name: PropTypes.string.isRequired,
    version: PropTypes.string.isRequired
  }).isRequired,
  systemRequirements: PropTypes.shape({
    disk: PropTypes.number.isRequired,
    memory: PropTypes.number.isRequired,
    level: PropTypes.string.isRequired
  }).isRequired,
  docLink: PropTypes.string.isRequired,
  localStorageKey: PropTypes.string.isRequired
};

export default Information;
