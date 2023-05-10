import React from "react";
import "./_information.scss";

const Information = () => {
  return (
    <div className="table-container" role="table" aria-label="Display Information">
      <div className="flex-table header" id="display-iformation__table-header-row" role="rowgroup">
        <div className="flex-row" id="display-iformation__table-header-row__name" role="columnheader">Name OS</div>
        <div className="flex-row" id="display-iformation__table-header-row__distribution" role="columnheader">Distribution</div>
        <div className="flex-row" id="display-iformation__table-header-row__version" role="columnheader">Version</div>
        <div className="flex-row" id="display-iformation__table-header-row__status" role="columnheader">Status</div>
      </div>
      <div className="flex-table row" id="display-iformation__table-content-row" role="rowgroup">
        <div className="flex-row" id="display-iformation__table-content-row__name" role="cell">SUSE 8.4.1</div>
        <div className="flex-row" id="display-iformation__table-content-row__distribution" role="cell">Not detected</div>
        <div className="flex-row" id="display-iformation__table-content-row__version" role="cell">8.4.1</div>
        <div className="flex-row" id="display-iformation__table-content-row__status" role="cell">ISO inserted</div>
      </div>
    </div>
  );
};

export default Information;
