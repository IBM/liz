/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import { toChannelSegments } from "./network-device-util";
import { ADDRESS_TYPE_IPV4, DEVICE_TYPE_OSA } from "./constants";
import { getInterfaceNameParamContents } from "./param-file-util_common";

const stateToIpv4NetworkAddressParams = (state) => {
  const installationParameters = state?.steps?.networkAddress ?? {};
  const networkDeviceInstallationParameters = state?.steps?.networkDevice ?? {};
  const ipAddress = installationParameters?.ipv4?.address ?? "";
  const gatewayIpAddress = installationParameters?.gatewayIpAddress ?? "";
  const prefixLength = installationParameters?.ipv4?.cidr ?? 1;
  const vlanId = networkDeviceInstallationParameters.vlan.enabled
    ? networkDeviceInstallationParameters?.vlan?.id ?? 1
    : null;
  const hostName = installationParameters?.hostName ?? "";
  const interfaceName =
    getInterfaceNameParamContents(networkDeviceInstallationParameters) || "";
  const netdevName = getNetdevName(vlanId, interfaceName) || "";

  return `ip=${ipAddress}::${gatewayIpAddress}:${prefixLength}:${hostName}:${netdevName}:none`;
};

const stateToIpv6NetworkAddressParams = (state) => {
  const installationParameters = state?.steps?.networkAddress ?? {};
  const networkDeviceInstallationParameters = state?.steps?.networkDevice ?? {};
  const ipAddress = installationParameters?.ipv6?.address ?? "";
  const gatewayIpAddress = installationParameters?.gatewayIpAddress ?? "";
  const prefixLength = installationParameters?.ipv6?.cidr ?? 1;
  const vlanId = networkDeviceInstallationParameters.vlan.enabled
    ? networkDeviceInstallationParameters?.vlan?.id ?? 1
    : null;
  const hostName = installationParameters?.hostName ?? "";
  const interfaceName =
    getInterfaceNameParamContents(networkDeviceInstallationParameters) || "";
  const netdevName = getNetdevName(vlanId, interfaceName) || "";

  return `ip=[${ipAddress}]::[${gatewayIpAddress}]:${prefixLength}:${hostName}:${netdevName}:none`;
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

  return `rd.znet=qeth,${sanitisedReadChannel},${sanitisedWriteChannel},${sanitisedDataChannel},layer2=${layer},portno=${portNumber}`;
};

const stateToNetworkDeviceParams = (state) => {
  const installationParameters = state?.steps?.networkDevice ?? {};
  const networkDeviceSettings =
    installationParameters.deviceType === DEVICE_TYPE_OSA
      ? stateToOsaNetworkDeviceParams(installationParameters)
      : ``;
  const hasVlanId =
    installationParameters.vlan.enabled &&
    typeof installationParameters.vlan === "object" &&
    typeof installationParameters.vlan.id === "number" &&
    installationParameters.vlan.id > 0;
  let paramFileContents = {
    contents: "",
    complete: false,
    label: "",
    index: 0,
  };

  // => rd.znet...
  if (installationParameters) {
    const interfaceName =
      getInterfaceNameParamContents(installationParameters) || "";

    if (hasVlanId) {
      const vlanId = `vlan=${getVlanName(
        interfaceName,
        installationParameters.vlan.id,
      )}:${interfaceName}`;
      const installationRepoLine = `${networkDeviceSettings}
${vlanId}
`;
      paramFileContents = {
        contents: `${installationRepoLine}`,
        complete: installationParameters.complete,
        invalid: installationParameters.invalid,
        index: installationParameters.index,
      };
    } else {
      const installationRepoLine = `${networkDeviceSettings}`;
      paramFileContents = {
        contents: `${installationRepoLine}`,
        complete: installationParameters.complete,
        invalid: installationParameters.invalid,
        index: installationParameters.index,
      };
    }
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
  const installationRepoLine = `inst.repo=${networkInstallationUrl}`;
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
      const vncServerLine = `inst.vnc inst.vncpassword=${installationParameters.vnc.password}`;
      paramFileContents = {
        contents: `${vncServerLine}`,
        complete: installationParameters.complete,
        invalid: installationParameters.invalid,
        index: installationParameters.index,
      };
    } else {
      const vncServerLine = `inst.vnc`;
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
    const sshServerLine = `inst.sshd`;
    paramFileContents = {
      contents: `${sshServerLine}`,
      complete: installationParameters.complete,
      invalid: installationParameters.invalid,
      index: installationParameters.index,
    };
  }

  return paramFileContents;
};

const getNetdevName = (vlanId = "", interfaceName = "") => {
  if (
    vlanId &&
    typeof vlanId === "number" &&
    interfaceName &&
    typeof interfaceName === "string" &&
    interfaceName.length > 0
  ) {
    return `${getVlanName(interfaceName, vlanId)}`;
  } else if (
    interfaceName &&
    typeof interfaceName === "string" &&
    interfaceName.length > 0
  ) {
    return interfaceName;
  }

  return ``;
};

const getVlanName = (interfaceName, vlanId) => {
  if (interfaceName && vlanId) {
    return `${interfaceName}.${vlanId}`;
  }
  return ``;
};

export {
  stateToNetworkAddressParams,
  stateToNetworkDeviceParams,
  stateToSshParams,
  stateToVncParams,
  stateToInstallationRepoParams,
};
