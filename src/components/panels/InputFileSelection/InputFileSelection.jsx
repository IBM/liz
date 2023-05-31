import React, { useState } from "react";
import { Dropdown, FileUploader, Grid, Column } from "@carbon/react";
import "./_input-file-selection.scss";

const InputFileSelection = () => {
  // eslint-disable-next-line
  const [state, setState] = useState({
  });

  const distributionList = [
    {
      id: "option-1",
      label: "Option 1",
    },
    {
      id: "option-2",
      label: "Option 2",
    },
    {
      id: "option-3",
      label: "Option 3",
    },
    {
      id: "option-4",
      label: "Option 4",
    },
  ];
  const versionList = [
    {
      id: "option-1",
      label: "Option 1",
    },
    {
      id: "option-2",
      label: "Option 2",
    },
    {
      id: "option-3",
      label: "Option 3",
    },
    {
      id: "option-4",
      label: "Option 4",
    },
  ];
  return (
    <>
      <Grid className="input-file-selection__grid">
        <Column sm={4} md={8} lg={16}>
          <div className="input-file-selection__heading">edgedancer9487</div>
        </Column>
        <Column sm={4} md={8} lg={16}>
          <div>
            <div className="input-file-selection__subheading">Host OS</div>
          </div>
        </Column>
        <Column sm={4} md={6} lg={8}>
          <div>
            <div className="input-file-selection__contentRowIntro">
              Choose from a base template
            </div>
            <div className="input-file-selection__contentRowDropdowns">
              <Dropdown
                ariaLabel="Select a distribution"
                id="distribution-selection"
                items={distributionList}
                label="Dropdown menu options"
                size="md"
                warn={false}
                invalid={false}
                disabled={false}
              />
              <Dropdown
                ariaLabel="Select a version"
                id="version-selection"
                items={versionList}
                label="Select a version"
                size="md"
                warn={false}
                invalid={false}
                disabled={false}
              />
            </div>
          </div>
        </Column>
        <Column sm={4} md={6} lg={8}>
          <div>
            <div></div>
            <div>
              <FileUploader
                labelTitle="Already have a custom ISO file?"
                labelDescription="Drag and drop or upload your ISO file here."
                buttonLabel="Add file"
                buttonKind="primary"
                size="md"
                filenameStatus="edit"
                role="button"
                accept={[".iso"]}
                multiple={true}
                disabled={false}
                iconDescription="Delete file"
                name=""
              />
            </div>
          </div>
        </Column>
      </Grid>
    </>
  );
};

export default InputFileSelection;
