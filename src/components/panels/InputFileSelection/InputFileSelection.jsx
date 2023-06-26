import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Dropdown, /* FileUploader, */ Grid, Column } from "@carbon/react";
import "./_input-file-selection.scss";

const InputFileSelection = (patchState, systemRequirements, docLink, localStorageKey) => {
  const getInitialState = () => {
    const initialState = JSON.parse(localStorage.getItem(localStorageKey));
    const defaultState = {
      selectedDistributionName: {},
      selectedDistributionVersion: {}
    };

    if (initialState) {
      return initialState
    }
    return defaultState;
  }
  const [state, setState] = useState(getInitialState);

  const distributionList = [
    {
      id: "rhel",
      label: "Red Hat Enterprise Linux 9 (RHEL 9)",
    }
  ];
  const versionList = [
    {
      id: "version-9.0",
      label: "9.0",
    }
  ];

  const updateSelectedDistributionName = (selectedDistributionName) => {
    setState(Object.assign(state, { selectedDistributionName }));
  }

  const updateSelectedDistributionVersion = (selectedDistributionVersion) => {
    setState(Object.assign(state, { selectedDistributionVersion }));
  }

  const isComplete = () => {
    if (
      typeof state.selectedDistributionName === "object" &&
      typeof state.selectedDistributionName.label === "string" &&
      state.selectedDistributionName.label.length > 0 &&
      typeof state.selectedDistributionVersion === "object" &&
      typeof state.selectedDistributionVersion.label === "string" &&
      state.selectedDistributionVersion.label.length > 0
    ) {
      return true;
    }
    return false;
  }

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(state))
  }, [localStorageKey, state]);

  return (
    <>
      <Grid className="input-file-selection__grid">
        <Column sm={4} md={8} lg={16}>
          {/* <div className="input-file-selection__heading">edgedancer9487</div> */}
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
                onChange={({ selectedItem }) => {
                  updateSelectedDistributionName(selectedItem);
                  patchState({
                    inputFileSelection: {
                      distributionName: state.selectedDistributionName && state.selectedDistributionName.label ? state.selectedDistributionName.label : "",
                      distributionVersion: state.selectedDistributionVersion && state.selectedDistributionVersion.label ? state.selectedDistributionVersion.label : "",
                      memorySize: systemRequirements && systemRequirements.memory ? systemRequirements.memory : 0,
                      diskSize: systemRequirements && systemRequirements.disk ? systemRequirements.disk : 0,
                      machineLevel: systemRequirements && systemRequirements.level ? systemRequirements.level : "",
                      docLink,
                      complete: isComplete() || false,
                      localStorageKey
                    }
                  });
                }}
                selectedItem={state.selectedDistributionName}
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
                onChange={({ selectedItem }) => {
                  updateSelectedDistributionVersion(selectedItem);
                  patchState({
                    inputFileSelection: {
                      distributionName: state.selectedDistributionName && state.selectedDistributionName.label ? state.selectedDistributionName.label : "",
                      distributionVersion: state.selectedDistributionVersion && state.selectedDistributionVersion.label ? state.selectedDistributionVersion.label : "",
                      memorySize: systemRequirements && systemRequirements.memory ? systemRequirements.memory : 0,
                      diskSize: systemRequirements && systemRequirements.disk ? systemRequirements.disk : 0,
                      machineLevel: systemRequirements && systemRequirements.level ? systemRequirements.level : "",
                      docLink,
                      complete: isComplete() || false,
                      localStorageKey
                    }
                  });
                }}
                selectedItem={state.selectedDistributionVersion}
              />
            </div>
          </div>
        </Column>
        <Column sm={4} md={6} lg={8}>
          <div>
            <div></div>
            <div>
              {/*
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
              */}
            </div>
          </div>
        </Column>
      </Grid>
    </>
  );
};

InputFileSelection.propTypes = {
  patchState: PropTypes.func.isRequired,
  systemRequirements: PropTypes.shape({
    disk: PropTypes.number.isRequired,
    memory: PropTypes.number.isRequired,
    level: PropTypes.string.isRequired
  }).isRequired,
  docLink: PropTypes.string.isRequired,
  localStorageKey: PropTypes.string.isRequired
};

export default InputFileSelection;
