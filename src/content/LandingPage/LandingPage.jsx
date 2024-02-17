/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import { InlineNotification, Grid, Column } from "@carbon/react";
import PropTypes from "prop-types";
import About from "../../components/About";
import {
  Information,
  InputFileSelection,
  InstallationParameters,
  Hint,
  NetworkAddress,
  NetworkDevice,
  NextSteps,
  DownloadParamFile,
} from "../../components/panels";
import {
  PANEL_DOWNLOAD_PARAM_FILE,
  PANEL_HINT,
  PANEL_INFORMATION,
  PANEL_INPUT_FILE_SELECTION,
  PANEL_INSTALLATION_PARAMETERS,
  PANEL_NETWORK_ADDRESS,
  PANEL_NETWORK_DEVICE,
  PANEL_NEXT_STEPS,
  LOCAL_STORAGE_KEY_APP,
  LOCAL_STORAGE_KEY_APP_INLINE_NOTIFICATION,
} from "../../util/constants";
import "./_landing-page.scss";

const LandingPage = ({
  panelConfig,
  showNotification,
  inlineNotification,
  closeNotification,
  localStorageKeys,
}) => {
  const pruneSettings = () => {
    let i;
    for (i = 0; i < localStorageKeys.length; i++) {
      localStorage.removeItem(localStorageKeys[i]);
    }
    localStorage.removeItem(LOCAL_STORAGE_KEY_APP);
    localStorage.removeItem(LOCAL_STORAGE_KEY_APP_INLINE_NOTIFICATION);
    closeNotification(true);
  };
  const showInlineNotification = inlineNotification
    ? inlineNotification.show
    : false;
  const onCloseInlineNotification = () => {
    const localInlineNotification = Object.assign({}, inlineNotification);
    localInlineNotification.show = false;

    localStorage.setItem(
      LOCAL_STORAGE_KEY_APP_INLINE_NOTIFICATION,
      JSON.stringify(localInlineNotification),
    );
  };
  const getPanel = (panel) => {
    switch (panel) {
      case PANEL_DOWNLOAD_PARAM_FILE:
        return (
          <DownloadParamFile
            state={panelConfig.state}
            dispatch={panelConfig.dispatch}
            setStep={panelConfig.params.setStep}
            stateToParamFile={panelConfig.params.stateToParamFile}
          />
        );
      case PANEL_HINT:
        return (
          <Hint state={panelConfig.state} dispatch={panelConfig.dispatch} />
        );
      case PANEL_INFORMATION:
        return (
          <Information
            state={panelConfig.state}
            dispatch={panelConfig.dispatch}
            distribution={panelConfig.params.distribution}
            systemRequirements={panelConfig.params.systemRequirements}
            docLink={panelConfig.params.docLink}
          />
        );
      case PANEL_INPUT_FILE_SELECTION:
        return (
          <InputFileSelection
            state={panelConfig.state}
            dispatch={panelConfig.dispatch}
          />
        );
      case PANEL_INSTALLATION_PARAMETERS:
        return (
          <InstallationParameters
            state={panelConfig.state}
            dispatch={panelConfig.dispatch}
            ipAddressVersion={panelConfig.params.ipAddressVersion}
          />
        );
      case PANEL_NETWORK_ADDRESS:
        return (
          <NetworkAddress
            state={panelConfig.state}
            dispatch={panelConfig.dispatch}
          />
        );
      case PANEL_NETWORK_DEVICE:
        return (
          <NetworkDevice
            state={panelConfig.state}
            dispatch={panelConfig.dispatch}
          />
        );
      case PANEL_NEXT_STEPS:
        return (
          <NextSteps
            state={panelConfig.state}
            dispatch={panelConfig.dispatch}
            useVnc={panelConfig.params.useVnc}
            useSsh={panelConfig.params.useSsh}
            networkAddress={panelConfig.params.networkAddress}
            vncPassword={panelConfig.params.vncPassword}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {showNotification && (
        <About
          closeNotification={closeNotification}
          pruneSettings={pruneSettings}
        />
      )}
      {showInlineNotification && (
        <InlineNotification
          aria-label="closes notification"
          onClose={onCloseInlineNotification}
          onCloseButtonClick={onCloseInlineNotification}
          statusIconDescription="notification"
          subtitle={inlineNotification.subtitle}
          title={inlineNotification.title}
          kind={inlineNotification.kind}
          className="landing-page__legal-banner"
        />
      )}
      <Grid className="landing-page__grid">
        <Column
          sm={6}
          md={8}
          lg={12}
          className="landing-page__grey-column-background"
        >
          {getPanel(panelConfig.panel)}
        </Column>
      </Grid>
    </>
  );
};

LandingPage.propTypes = {
  panelConfig: PropTypes.shape({
    panel: PropTypes.string.isRequired,
    state: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object,
  }).isRequired,
  showNotification: PropTypes.bool.isRequired,
  inlineNotification: PropTypes.shape({
    show: PropTypes.bool.isRequired,
    kind: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
  }).isRequired,
  closeNotification: PropTypes.func.isRequired,
  localStorageKeys: PropTypes.array.isRequired,
};

export default LandingPage;
