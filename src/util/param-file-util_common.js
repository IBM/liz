/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import { getInterfaceName } from "./network-device-util";
import { DEVICE_TYPE_OSA } from "./constants";

const getInterfaceNameFromFidUid = (installationParameters) => {
  const fid = installationParameters?.roce?.fid ?? "";
  const uid = installationParameters?.roce?.uid ?? "";

  return getInterfaceName("", fid, uid);
};

const getInterfaceNameFromReadChannel = (installationParameters) => {
  const readChannel = installationParameters?.osa?.readChannel;

  return getInterfaceName(readChannel);
};

const getInterfaceNameParamContents = (installationParameters) => {
  const interfaceName =
    installationParameters.deviceType === DEVICE_TYPE_OSA
      ? getInterfaceNameFromReadChannel(installationParameters)
      : getInterfaceNameFromFidUid(installationParameters);

  return interfaceName;
};

export {
  getInterfaceNameFromFidUid,
  getInterfaceNameFromReadChannel,
  getInterfaceNameParamContents,
};
