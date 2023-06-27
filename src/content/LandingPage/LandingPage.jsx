import React from "react";
import { ActionableNotification, Grid, Column } from "@carbon/react";
import PropTypes from "prop-types";
import "./_landing-page.scss";

const LandingPage = ({ panelMarkup, showNotification, closeNotification, localStorageKeys }) => {
  const pruneSettings = () => {
    let i;
    for (i = 0; i < localStorageKeys.length; i++) {
      localStorage.removeItem(localStorageKeys[i]);
    }
    closeNotification(true);
  }

  return (
    <>
      {showNotification &&
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
  closeNotification: PropTypes.func.isRequired,
  localStorageKeys: PropTypes.array.isRequired
};

export default LandingPage;
