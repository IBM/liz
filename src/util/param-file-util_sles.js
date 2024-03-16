/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import { toChannelSegments } from "./network-device-util";
import { ADDRESS_TYPE_IPV4, DEVICE_TYPE_OSA } from "./constants";

const stateToIpv4NetworkAddressParams = (state) => {
  const installationParameters = state?.steps?.networkAddress ?? {};
  const ipAddress = installationParameters?.ipv4?.address ?? "";
  const gatewayIpAddress = installationParameters?.gatewayIpAddress ?? "";
  const prefixLength = installationParameters?.ipv4?.cidr ?? 1;
  const hostName = installationParameters?.hostName ?? "";

  return `Hostname=${hostName} HostIP=${ipAddress}/${prefixLength}
Gateway=${gatewayIpAddress}
`;
};

const stateToIpv6NetworkAddressParams = (state) => {
  const installationParameters = state?.steps?.networkAddress ?? {};
  const ipAddress = installationParameters?.ipv6?.address ?? "";
  const gatewayIpAddress = installationParameters?.gatewayIpAddress ?? "";
  const prefixLength = installationParameters?.ipv6?.cidr ?? 1;
  const hostName = installationParameters?.hostName ?? "";

  return `Hostname=${hostName} HostIP=${ipAddress}/${prefixLength}
Gateway=${gatewayIpAddress}
`;
};

const stateToNetworkAddressParams = (state) => {
  const installationParameters = state?.steps?.networkAddress ?? {};
  let paramFileContents = {
    contents: "",
    complete: false,
    invalid: false,
    label: "",
    index: 0,
  };

  // => ip=...
  if (installationParameters && installationParameters.addressType) {
    const ipAddressParemeters =
      installationParameters.addressType === ADDRESS_TYPE_IPV4
        ? stateToIpv4NetworkAddressParams(state)
        : stateToIpv6NetworkAddressParams(state);
    const nameserver =
      installationParameters.addressType === ADDRESS_TYPE_IPV4
        ? `nameserver=${installationParameters.nameserverIpAddress}`
        : `nameserver=[${installationParameters.nameserverIpAddress}]`;
    const installationRepoLine = `${ipAddressParemeters}
${nameserver}
`;
    paramFileContents = {
      contents: `${installationRepoLine}`,
      complete: installationParameters.complete,
      invalid: installationParameters.invalid,
      index: installationParameters.index,
    };
  }

  return paramFileContents;
};

const stateToOsaNetworkDeviceParams = (installationParameters) => {
  const readChannel = installationParameters?.osa?.readChannel ?? "";
  const sanitisedReadChannel = toChannelSegments(
    readChannel.toLowerCase(),
  ).join(".");

  const writeChannel = installationParameters?.osa?.writeChannel ?? "";
  const sanitisedWriteChannel = toChannelSegments(
    writeChannel.toLowerCase(),
  ).join(".");

  const dataChannel = installationParameters?.osa?.dataChannel ?? "";
  const sanitisedDataChannel = toChannelSegments(
    dataChannel.toLowerCase(),
  ).join(".");

  const layer = installationParameters?.osa?.layer ?? "";
  const portNumber = installationParameters?.osa?.portNumber ?? "";

  return `instnetdev=osa osainterface=qdio layer2=${layer} portno=${portNumber} osahwaddr=
readchannel=${sanitisedReadChannel} writechannel=${sanitisedWriteChannel} datachannel=${sanitisedDataChannel}
`;
};

const stateToNetworkDeviceParams = (state) => {
  const installationParameters = state?.steps?.networkDevice ?? {};
  const networkDeviceSettings =
    installationParameters.deviceType === DEVICE_TYPE_OSA
      ? stateToOsaNetworkDeviceParams(installationParameters)
      : ``;
  let paramFileContents = {
    contents: "",
    complete: false,
    label: "",
    index: 0,
  };

  // => rd.znet...
  if (installationParameters) {
    const installationRepoLine = `${networkDeviceSettings}`;
    paramFileContents = {
      contents: `${installationRepoLine}`,
      complete: installationParameters.complete,
      invalid: installationParameters.invalid,
      index: installationParameters.index,
    };
  }

  return paramFileContents;
};

const stateToInstallationRepoParams = (state) => {
  const installationParameters = state?.steps?.installationParameters ?? {};
  const networkInstallationUrl =
    installationParameters?.networkInstallationUrl ?? "";
  let paramFileContents = {
    contents: "",
    complete: false,
    index: 0,
  };

  // => inst.repo=...
  const installationRepoLine = `install=${networkInstallationUrl}`;
  paramFileContents = {
    contents: `${installationRepoLine}`,
    complete: installationParameters.complete,
    invalid: installationParameters.invalid,
    index: installationParameters.index,
  };

  return paramFileContents;
};

const stateToVncParams = (state) => {
  const installationParameters = state?.steps?.installationParameters ?? {};
  let paramFileContents = {
    contents: "",
    complete: false,
    index: 0,
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
      const vncServerLine = `vnc=1 VNCPassword=${installationParameters.vnc.password}`;
      paramFileContents = {
        contents: `${vncServerLine}`,
        complete: installationParameters.complete,
        invalid: installationParameters.invalid,
        index: installationParameters.index,
      };
    } else {
      const vncServerLine = `vnc=1`;
      paramFileContents = {
        contents: `${vncServerLine}`,
        complete: installationParameters.complete,
        invalid: installationParameters.invalid,
        index: installationParameters.index,
      };
    }
  }

  return paramFileContents;
};

const stateToSshParams = (state) => {
  const installationParameters = state?.steps?.installationParameters ?? {};
  let paramFileContents = {
    contents: "",
    complete: false,
    index: 0,
  };

  // => inst.sshd
  if (
    installationParameters &&
    installationParameters.ssh &&
    installationParameters.ssh.enabled === true
  ) {
    const sshServerLine = `ssh=1${installationParameters.ssh.password ? installationParameters.ssh.password : ""}`;
    paramFileContents = {
      contents: `${sshServerLine}`,
      complete: installationParameters.complete,
      invalid: installationParameters.invalid,
      index: installationParameters.index,
    };
  }

  return paramFileContents;
};

export {
  stateToNetworkAddressParams,
  stateToNetworkDeviceParams,
  stateToInstallationRepoParams,
  stateToVncParams,
  stateToSshParams,
};
