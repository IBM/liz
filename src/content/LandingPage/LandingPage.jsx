import React from "react";
import { Grid, Column } from "@carbon/react";
import PropTypes from "prop-types";
import "./_landing-page.scss";

const LandingPage = ({ panelMarkup }) => {
  return (
    <>
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
  panelMarkup: PropTypes.object,
};

export default LandingPage;
