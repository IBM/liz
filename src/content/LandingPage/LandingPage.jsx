/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import { InlineNotification, Grid, Column } from "@carbon/react";
import PropTypes from "prop-types";
import About from "../../components/About";
import "./_landing-page.scss";

const LandingPage = ({ panelMarkup, showNotification, inlineNotification, closeNotification, localStorageKeys }) => {
  const pruneSettings = () => {
    let i;
    for (i = 0; i < localStorageKeys.length; i++) {
      localStorage.removeItem(localStorageKeys[i]);
    }
    localStorage.removeItem("com.ibm.systems.linux.z.app");
    localStorage.removeItem("com.ibm.systems.linux.z.inlineNotification");
    closeNotification(true);
  }
  const showInlineNotification = inlineNotification ? inlineNotification.show : false;
  const onCloseInlineNotification = () => {
    const localInlineNotification = Object.assign({}, inlineNotification);
    localInlineNotification.show = false;

    localStorage.setItem("com.ibm.systems.linux.z.inlineNotification", JSON.stringify(localInlineNotification));
  };

  return (
    <>
      {showNotification &&
        <About
          closeNotification={closeNotification}
          pruneSettings={pruneSettings}
        />
      }
      {showInlineNotification &&
        <InlineNotification
          actionButtonLabel="Action"
          aria-label="closes notification"
          onClose={onCloseInlineNotification}
          onCloseButtonClick={onCloseInlineNotification}
          statusIconDescription="notification"
          subtitle={inlineNotification.subtitle}
          title={inlineNotification.title}
          kind={inlineNotification.kind}
          className="landing-page__legal-banner"
        />
      }
      <Grid className="landing-page__grid">
        <Column
          sm={6}
          md={8}
          lg={12}
          className="landing-page__grey-column-background"
        >
          {panelMarkup}
        </Column>
      </Grid>
    </>
  );
};

LandingPage.propTypes = {
  panelMarkup: PropTypes.object.isRequired,
  showNotification: PropTypes.bool.isRequired,
  inlineNotification: PropTypes.shape({
    show: PropTypes.bool.isRequired,
    kind: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired
  }).isRequired,
  closeNotification: PropTypes.func.isRequired,
  localStorageKeys: PropTypes.array.isRequired
};

export default LandingPage;
