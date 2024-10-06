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
    getVlanName,
    getNetdevName,
    getInterfaceNameFromFidUid,
    getInterfaceNameFromReadChannel,
    getInterfaceNameParamContents,
};
