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

const stateToParamFile = (state) => {
  let stateToParamFile = `rd.znet=qeth,0.0.bdf0,0.0.bdf1,0.0.bdf2,
layer2=1,
portno=0,
ip=172.18.132.1::172.18.0.1:15:t3560001.lnxne.boe:encbdf0:none,
nameserver=172.18.0.1  
`;

if (state && state.miscParameters && state.miscParameters.params && state.miscParameters.params.length > 0) {
  stateToParamFile = `${stateToParamFile}${state.miscParameters.params}`;
}

return stateToParamFile;
}

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
      state.inputFileSelection.docLink,
      state.inputFileSelection.localStorageKey);
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
      state.inputFileSelection.docLink,
      state.information.localStorageKey);
      break;
    case 2:
      markup = Hint(patchState, state.hint.localStorageKey);
      break;
    case 3:
      markup = NetworkDevice(patchState, state.networkDevice.localStorageKey);
      break;
    case 4:
      markup = NetworkAddress(patchState, state.networkAddress.localStorageKey);
      break;
    case 5:
      markup = InstallationParameters(patchState, state.installationParameters.localStorageKey);
      break;
    case 6:
      markup = MiscParameters(patchState, state.miscParameters.localStorageKey);
      break;
    case 7:
      markup = DownloadParamFile(patchState, stateToParamFile, state, state.downloadParamFile.localStorageKey);
      break;
    case 8:
      markup = NextSteps(patchState, state.nextStep.localStorageKey);
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
      complete: false,
      localStorageKey: "com.ibm.systems.linux.z.inputFileSelection"
    },
    information: {
      complete: true,
      localStorageKey: "com.ibm.systems.linux.z.information"
    },
    downloadParamFile: {
      contents: "",
      complete: false,
      localStorageKey: "com.ibm.systems.linux.z.downloadParamFile"
    },
    hint: {
      complete: true,
      localStorageKey: "com.ibm.systems.linux.z.hint"
    },
    installationParameters: {
      networkInstallationUrl: "",
      vnc: {
        password: "",
        enabled: false
      },
      ssh: {
        enabled: false
      },
      complete: false,
      localStorageKey: "com.ibm.systems.linux.z.installationParameters"
    },
    miscParameters: {
      params: "",
      complete: true,
      localStorageKey: "com.ibm.systems.linux.z.miscParameters"
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
      complete: false,
      localStorageKey: "com.ibm.systems.linux.z.networkAddress"
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
      complete: false,
      localStorageKey: "com.ibm.systems.linux.z.networkDevice"
    },
    nextStep: {
      complete: true,
      localStorageKey: "com.ibm.systems.linux.z.nextStep"
    },
    showNotification: false,
    isDirty: false
  });
  const patchState = (patch) => {;
    setState(Object.assign(state, patch));
    updateIsDirty(true);
    console.log(state);
  }
  const updateShowNotification = (showNotification) => {
    setState({ ...state, showNotification });
  }
  const updateIsDirty = (isDirty) => {
    setState({ ...state, isDirty });
  }
  const panelMarkup = renderPanel(step, patchState, state);
  const showNotification = () => {
    return state.showNotification ? updateShowNotification(false) : updateShowNotification(true);
  }
  const closeNotification = () => {
    updateShowNotification(false);
  }
  const progressStepCompletion = getProgressStepCompletion(state);
  const getLocalStorageKeys = () => {
    const keys = Object.keys(state);
    const localStorageKeys = [];

    let i;
    for (i = 0; i < keys.length; i++) {
      const stateKey = keys[i];
      const currentLocalStorageKey = state[stateKey].localStorageKey;
      localStorageKeys.push(currentLocalStorageKey);
    }
    return localStorageKeys;
  }

  window.addEventListener('beforeunload', (event) => {
    if (state.isDirty) {
      event.returnValue = `Are you sure you want to leave?`;
    }
  });

  return (
    <>
      <InstallerHeader
        showNotification={state.showNotification}
        onShowNotification={showNotification}
        onProgress={setStep}
        progressStep={step}
        progressStepCompletion={progressStepCompletion}
      />
      <Content className="app__full-height">
        <Routes>
          <Route
            exact={true}
            path={import.meta.env.VITE_URL_PATH_PREFIX}
            element={
              <LandingPage
                panelMarkup={panelMarkup}
                showNotification={state.showNotification}
                closeNotification={closeNotification}
                localStorageKeys={getLocalStorageKeys()}
              />
            }
          />
        </Routes>
      </Content>
    </>
  );
};

export default App;
