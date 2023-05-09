import React, { useState } from "react";
import { Content } from "@carbon/react";
import { Routes, Route } from "react-router-dom";
import InstallerHeader from "./components/InstallerHeader";
import {
  Information,
  InputFileSelection,
  InstallationParameters,
  MiscParameters,
  NetworkAddress,
  NetworkDevice,
} from "./components/panels";
import LandingPage from "./content/LandingPage";
import "./App.scss";

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

const App = () => {
  const [step, setStep] = useState(0);
  const panelMarkup = renderPanel(step);

  return (
    <>
      <InstallerHeader onProgress={setStep} progressStep={step} />
      <Content className="app__full-height">
        <Routes>
          <Route
            exact={true}
            path={import.meta.env.VITE_URL_PATH_PREFIX}
            element={<LandingPage panelMarkup={panelMarkup} />}
          />
        </Routes>
      </Content>
    </>
  );
};

export default App;
