import React, { useState } from "react";
import { Content } from "@carbon/react";
import { Routes, Route } from "react-router-dom";
import InstallerHeader from "./components/InstallerHeader";
import {
  Information,
  InputFileSelection,
  InstallationParameters,
  Hint,
  MiscParameters,
  NetworkAddress,
  NetworkDevice,
  NextSteps,
  DownloadParamFile
} from "./components/panels";
import LandingPage from "./content/LandingPage";
import "./App.scss";

const getProgressStepCompletion = (state) => {
  return {
    inputFileSelection: state.inputFileSelection.complete,
    information: state.information.complete,
    hint: state.hint.complete,
    networkDevice: state.networkDevice.complete,
    networkAddress: state.networkAddress.complete,
    installationParameters: state.miscParameters.complete,
    miscParameters: state.miscParameters.complete,
    downloadParamFile: state.downloadParamFile.complete,
    nextStep: state.nextStep.complete
  }
}

const renderPanel = (step, patchState, state) => {
  let markup;

  switch (step) {
    case 0:
      markup = InputFileSelection(patchState, {
        disk: state.inputFileSelection.diskSize,
        memory: state.inputFileSelection.memorySize,
        level: state.inputFileSelection.machineLevel
      },
      state.inputFileSelection.docLink);
      break;
    case 1:
      markup = Information(patchState, {
        name: state.inputFileSelection.distributionName,
        version: state.inputFileSelection.distributionVersion
      },
      {
        disk: state.inputFileSelection.diskSize,
        memory: state.inputFileSelection.memorySize,
        level: state.inputFileSelection.machineLevel
      },
      state.inputFileSelection.docLink);
      break;
    case 2:
      markup = Hint(patchState);
      break;
    case 3:
      markup = NetworkDevice(patchState);
      break;
    case 4:
      markup = NetworkAddress(patchState);
      break;
    case 5:
      markup = InstallationParameters(patchState);
      break;
    case 6:
      markup = MiscParameters(patchState);
      break;
    case 7:
      markup = DownloadParamFile(patchState);
      break;
    case 8:
      markup = NextSteps(patchState);
      break;
    default:
      markup = <div>Panel not yet implemented.</div>;
  }

  return markup;
};

const App = () => {
  const [step, setStep] = useState(0);
  const [state, setState] = useState({
    inputFileSelection: {
      distributionName: "Red Hat Enterprise Linux 9 (RHEL 9)",
      distributionVersion: "9.0",
      memorySize: 3,
      diskSize: 10,
      machineLevel: "IBM z14(r), IBM LinuxONE Emperor II or Rockhopper II",
      docLink: "https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/9",
      complete: false
    },
    information: {
      complete: true
    },
    downloadParamFile: {
      contents: "",
      complete: false
    },
    hint: {
      complete: true
    },
    installationParameters: {
      networkInstallationUrl: "",
      vnc: {
        host: "",
        password: ""
      },
      ssh: {
        host: ""
      },
      complete: false
    },
    miscParameters: {
      params: "",
      complete: true
    },
    networkAddress: {
      addressType: "",
      ipv4Address: "",
      ipv6Address: "",
      hostName: "",
      domainSearchPath: "",
      hostIpAddress: "",
      betmaskPrefix: "",
      ipv4Netmask: "",
      ipv6Prefix: "",
      broadcastIpAddress: "",
      gatewayIpAddress: "",
      nameserverIpAddress: "",
      complete: false
    },
    networkDevice: {
      deviceType: "",
      osa: {
        readChannel: "",
        writeChannel: "",
        dataChannel: "",
        portNumber: 0,
        layer: 0,

      },
      roce: {
        fid: "",
        uid: ""
      },
      vlanId: "",
      complete: false
    },
    nextStep: {
      complete: true
    }
  });
  const patchState = (patch) => {
    const newState = Object.assign(state, patch);
    setState(newState);
    console.log(newState);
  }
  const panelMarkup = renderPanel(step, patchState, state);
  const progressStepCompletion = getProgressStepCompletion(state);

  return (
    <>
      <InstallerHeader onProgress={setStep} progressStep={step} progressStepCompletion={progressStepCompletion} />
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
