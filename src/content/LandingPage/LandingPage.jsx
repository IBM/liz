/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import { InlineNotification, Grid, Column } from "@carbon/react";
import PropTypes from "prop-types";
import { LinuxAlt } from "@carbon/icons-react";
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
        <>
          {/*
          <ActionableNotification
            actionButtonLabel="Prune"
            aria-label="closes notification"
            onActionButtonClick={pruneSettings}
            onClose={closeNotification}
            onCloseButtonClick={closeNotification}
            statusIconDescription="notification"
            subtitle="Prune param file settings from your browser cache."
            title="Prune settings"
            className="landing-page__notification"
          />
          */}
          <ul id="landing-page__about-menu" className="landing-page__about-menu">
            <li id="landing-page__about-title" className="landing-page__about__title-section">
              <div className="landing-page__about__linux-icon">
                <div>
                  <LinuxAlt size="48" />
                </div>
              </div>
              <div className="landing-page__about__info-section">
                <div title="About">About</div>
              </div>
            </li>
            <li>
              <div className="landing-page__about-build-info">
                <div className="landing-page__about-build-info__date">Build date: BUILD_DATE</div>
                <div className="landing-page__about-build-info__commit-hash">Commit: COMMIT_HASH</div>
              </div>
            </li>
            <li className="landing-page__about-prune-button-container">
              <a href="#" data-title="prune" id="landing-page__about-prune-button" onClick={pruneSettings}>
                <span>Prune Settings</span>
              </a>
            </li>
          </ul>
        </>
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
