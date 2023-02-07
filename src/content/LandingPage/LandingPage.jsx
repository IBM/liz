import React, { useState } from "react";
import { Grid, Column } from "@carbon/react";
import {
  Information,
  InputFileSelection,
  InstallationParameters,
  MiscParameters,
  NetworkAddress,
  NetworkDevice,
} from "../../components/panels";
import InstallerFlow from "../../components/InstallerFlow";
import "./_landing-page.scss";

const renderPanel = (step) => {
  let markup;

  switch (step) {
    case 0:
      markup = InputFileSelection();
      break;
    case 1:
      markup = Information();
      break;
    case 2:
      markup = NetworkDevice();
      break;
    case 3:
      markup = NetworkAddress();
      break;
    case 4:
      markup = InstallationParameters();
      break;
    case 5:
      markup = MiscParameters();
      break;
    default:
      markup = <div>Panel not yet implemented.</div>;
  }

  return markup;
};

const LandingPage = () => {
  const [step, setStep] = useState(0);
  const panelMarkup = renderPanel(step);

  return (
    <>
      <Grid className="landing-page__grid">
        <Column sm={2} md={3} lg={4} className="landing-page__installer-steps">
          <InstallerFlow onProgress={setStep} progressStep={step} />
        </Column>
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

export default LandingPage;
