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

const renderPanel = (step, patchState, state) => {
  let markup;

  switch (step) {
    case 0:
      markup = InputFileSelection(patchState);
      break;
    case 1:
      markup = Information(patchState, {
        name: state.information.distributionName,
        version: state.information.distributionVersion
      },
      {
        disk: state.information.diskSize,
        memory: state.information.memorySize,
        level: state.information.machineLevel
      },
      state.information.docLink);
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
      distributionName: "",
      distributionVersion: "",
      mainMemoryRequirement: 0,
      diskRequirement: 10,
      minMachineLevel: "",
      docLink: ""
    },
    downloadParamFile: {
      contents: ""
    },
    hint: {

    },
    information: {
      distributionName: "Red Hat Enterprise Linux 9 (RHEL 9)",
      distributionVersion: "9.0",
      memorySize: 3,
      diskSize: 10,
      machineLevel: "IBM z14(r), IBM LinuxONE Emperor II or Rockhopper II",
      docLink: "https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/9"

    },
    installationParameters: {
      networkInstallationUrl: "",
      vnc: {
        host: "",
        password: ""
      },
      ssh: {
        host: ""
      }
    },
    miscParameters: {
      params: ""
    },
    networkAdress: {
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
      nameserverIpAddress: ""
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
      vlanId: ""
    },
    nextStep: {

    }
  });
  const patchState = (patch) => {
    const newState = Object.assign(state, patch);
    setState(newState);
    console.log(newState);
  }
  const panelMarkup = renderPanel(step, patchState, state);

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
