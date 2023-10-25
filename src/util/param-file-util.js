/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import {
    getInterfaceName,
    toChannelSegments
} from "./network-device-util";

const DEVICE_TYPE_OSA = "network-device_osa-option";
const ADDRESS_TYPE_IPV4 = "radio-ipv4";

const getNetdevName = (vlanId = "", interfaceName = "") => {
  if (
    vlanId &&
    typeof vlanId === "string" &&
    vlanId.length > 0 &&
    interfaceName &&
    typeof interfaceName === "string" &&
    interfaceName.length > 0
  ) {
    return getVlanName(interfaceName, vlanId);
  } else if (
    interfaceName &&
    typeof interfaceName === "string" &&
    interfaceName.length > 0
  ) {
    return interfaceName;
  }

  return ``;
}

const getVlanName = (interfaceName, vlanId) => {
  if (interfaceName && vlanId) {
    return `${interfaceName}.${vlanId}`;
  }
  return ``;
}

const stateToIpv4NetworkAddressParams = (state) => {
  const installationParameters = state?.steps?.networkAddress ?? {};
  const networkDeviceInstallationParameters = state?.steps?.networkDevice ?? {};
  const ipAddress = installationParameters?.ipv4?.address ?? "";
  const gatewayIpAddress = installationParameters?.gatewayIpAddress ?? "";
  const prefixLength = installationParameters?.ipv4?.cidr ?? "";
  const vlanId = networkDeviceInstallationParameters?.vlanId ?? "";
  const hostName = installationParameters?.hostName ?? "";
  const interfaceName = getInterfaceNameParamContents(networkDeviceInstallationParameters) || "";
  const netdevName = getNetdevName(vlanId, interfaceName) || "";

  return `ip=${ipAddress}::${gatewayIpAddress}:${prefixLength}:${hostName}:${netdevName}:none`;
}

const stateToIpv6NetworkAddressParams = (state) => {
  const installationParameters = state?.steps?.networkAddress ?? {};
  const networkDeviceInstallationParameters = state?.steps?.networkDevice ?? {};
  const ipAddress = installationParameters?.ipv6?.address ?? "";
  const gatewayIpAddress = installationParameters?.gatewayIpAddress ?? "";
  const prefixLength = installationParameters?.ipv6?.cidr ?? "";
  const vlanId = networkDeviceInstallationParameters?.vlanId ?? "";
  const hostName = installationParameters?.hostName ?? "";
  const interfaceName = getInterfaceNameParamContents(networkDeviceInstallationParameters) || "";
  const netdevName = getNetdevName(vlanId, interfaceName) || "";

  return `ip=${ipAddress}::${gatewayIpAddress}:${prefixLength}:${hostName}:${netdevName}:none`;
}

const stateToNetworkAddressParams = (state) => {
  const installationParameters = state?.steps?.networkAddress ?? {};
  let paramFileContents = {
    contents: "",
    complete: false,
    invalid: false
  };

  // => ip=...
  if (
    installationParameters &&
    installationParameters.addressType
  ) {
    const ipAddressParemeters = installationParameters.addressType === ADDRESS_TYPE_IPV4
      ? stateToIpv4NetworkAddressParams(state)
      : stateToIpv6NetworkAddressParams(state);
    const nameserver = `nameserver=${installationParameters.nameserverIpAddress}`;
    const installationRepoLine = `${ipAddressParemeters}
${nameserver}
`;
    paramFileContents = {
      contents: `${installationRepoLine}`,
      complete: installationParameters.complete,
      invalid: installationParameters.invalid
    };
  }

  return paramFileContents;
}

const stateToOsaNetworkDeviceParams = (installationParameters) => {
  const readChannel = installationParameters?.osa?.readChannel ?? "";
  const sanitisedReadChannel = toChannelSegments(readChannel.toLowerCase()).join(".");

  const writeChannel = installationParameters?.osa?.writeChannel ?? "";
  const sanitisedWriteChannel = toChannelSegments(writeChannel.toLowerCase()).join(".");

  const dataChannel = installationParameters?.osa?.dataChannel ?? "";
  const sanitisedDataChannel = toChannelSegments(dataChannel.toLowerCase()).join(".");

  const layer = installationParameters?.osa?.layer ?? "";
  const portNumber = installationParameters?.osa?.portNumber ?? "";

  return `rd.znet=qeth,${sanitisedReadChannel},${sanitisedWriteChannel},${sanitisedDataChannel},layer2=${layer},portno=${portNumber}`;
}

const getInterfaceNameFromFidUid = (installationParameters) => {
  const fid = installationParameters?.roce?.fid ?? "";
  const uid = installationParameters?.roce?.uid ?? "";

  return getInterfaceName("", fid, uid);
}

const getInterfaceNameFromReadChannel = (installationParameters) => {
  const readChannel = installationParameters?.osa?.readChannel;

  return getInterfaceName(readChannel);
}

const getInterfaceNameParamContents = (installationParameters) => {
  const interfaceName = installationParameters.deviceType === DEVICE_TYPE_OSA
    ? getInterfaceNameFromReadChannel(installationParameters)
    : getInterfaceNameFromFidUid(installationParameters);

  return interfaceName;
}

const stateToNetworkDeviceParams = (state) => {
  const installationParameters = state?.steps?.networkDevice ?? {};
  const networkDeviceSettings = installationParameters.deviceType === DEVICE_TYPE_OSA
    ? stateToOsaNetworkDeviceParams(installationParameters)
    : ``;
  const hasVlanId = installationParameters.vlanId &&
    installationParameters.vlanId.length > 0;
  let paramFileContents = {
    contents: "",
    complete: false
  };

  // => rd.znet...
  if (installationParameters) {
    const interfaceName = getInterfaceNameParamContents(installationParameters) || "";

    if (hasVlanId) {
      const vlanId = `vlan=${getVlanName(interfaceName, installationParameters.vlanId)}:${interfaceName}`;
      const installationRepoLine = `${networkDeviceSettings}
${vlanId}
`;
          paramFileContents = {
            contents: `${installationRepoLine}`,
            complete: installationParameters.complete,
            invalid: installationParameters.invalid
          };
    } else {
      const installationRepoLine = `${networkDeviceSettings}`;
          paramFileContents = {
            contents: `${installationRepoLine}`,
            complete: installationParameters.complete,
            invalid: installationParameters.invalid
          };
    }
  }

  return paramFileContents;
}

const stateToInstallationRepoParams = (state) => {
  const installationParameters = state?.steps?.installationParameters ?? {};
  const networkInstallationUrl = installationParameters?.networkInstallationUrl ?? "";
  let paramFileContents = {
    contents: "",
    complete: false
  };

  // => inst.repo=...
  const installationRepoLine = `inst.repo=${networkInstallationUrl}`;
  paramFileContents = {
    contents: `${installationRepoLine}`,
    complete: installationParameters.complete,
    invalid: installationParameters.invalid
  };

  return paramFileContents;
}

const stateToVncParams = (state) => {
  const installationParameters = state?.steps?.installationParameters ?? {};
  let paramFileContents = {
    contents: "",
    complete: false
  };

  // => inst.vnc inst.vncpassword=...
  if (
    installationParameters &&
    installationParameters.vnc &&
    installationParameters.vnc.enabled === true
  ) {
    if (
      installationParameters.vnc.password &&
      installationParameters.vnc.password.length > 0
    ) {
      const vncServerLine = `inst.vnc inst.vncpassword=${installationParameters.vnc.password}`;
      paramFileContents = {
        contents: `${vncServerLine}`,
        complete: installationParameters.complete,
        invalid: installationParameters.invalid
      };
    } else {
      const vncServerLine = `inst.vnc`;
      paramFileContents = {
        contents: `${vncServerLine}`,
        complete: installationParameters.complete,
        invalid: installationParameters.invalid
      };
    }
  }

  return paramFileContents;
}

const stateToSshParams = (state) => {
  const installationParameters = state?.steps?.installationParameters ?? {};
  let paramFileContents = {
    contents: "",
    complete: false
  };

  // => inst.sshd
  if (
    installationParameters &&
    installationParameters.ssh &&
    installationParameters.ssh.enabled === true
  ) {
    const sshServerLine = `inst.sshd`;
    paramFileContents = {
      contents: `${sshServerLine}`,
      complete: installationParameters.complete,
      invalid: installationParameters.invalid
    };
  }

  return paramFileContents;
}

const stateToMiscParams = (state) => {
  const miscParameters = state?.steps?.miscParameters ?? {};
  let paramFileContents = {
    contents: "",
    complete: false
  };

  if (
    miscParameters &&
    miscParameters.params &&
    miscParameters.params.length > 0
  ) {
    paramFileContents = {
      contents: `${miscParameters.params}`,
      complete: true,
      invalid: false
    };
  }

  return paramFileContents;
}

const removeEmptyLines = str => str.split(/\r?\n/).filter(line => line.trim() !== '').join('\n');

const hasIncompleteData = (steps) => {
    for (const property in steps) {
        if (steps[property].complete === false) {
            return true;
        }
    }
    return false;
}

const hasInvalidData = (steps) => {
    for (const property in steps) {
        if (steps[property].invalid === true) {
            return true;
        }
    }
    return false;
}

const stateToParamFile = (state) => {
  const stateToInstallationRepoParamsResult = stateToInstallationRepoParams(state);
  const stateToVncParamsResult = stateToVncParams(state);
  const stateToSshParamsResult = stateToSshParams(state);
  const stateToMiscParamsResult = stateToMiscParams(state);
  const stateToNetworkDeviceParamsResult = stateToNetworkDeviceParams(state);
  const stateToNetworkAddressParamsResult = stateToNetworkAddressParams(state);

  const data = removeEmptyLines(`${stateToNetworkDeviceParamsResult.contents}
${stateToNetworkAddressParamsResult.contents}
${stateToInstallationRepoParamsResult.contents}
${stateToVncParamsResult.contents}
${stateToSshParamsResult.contents}
${stateToMiscParamsResult.contents}
`);
  const steps = {
    installationParameters: {
        complete: stateToInstallationRepoParamsResult.complete,
        invalid: stateToInstallationRepoParamsResult.invalid
    },
    miscParameters: {
        complete: stateToMiscParamsResult.complete,
        invalid: stateToMiscParamsResult.invalid
    },
    networkAddress: {
        complete: stateToNetworkAddressParamsResult.complete,
        invalid: stateToNetworkAddressParamsResult.invalid
    },
    networkDevice: {
        complete: stateToNetworkDeviceParamsResult.complete,
        invalid: stateToNetworkDeviceParamsResult.invalid
    }
  }
  const metadata = {
    hasIncompleteData: hasIncompleteData(steps),
    hasInvalidData: hasInvalidData(steps),
    steps
  };

  return {
    data,
    metadata
  };
}

export {
    stateToParamFile
};
