/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import { DEVICE_TYPE_OSA } from './constants'

import {
    stateToNetworkAddressParams as stateToNetworkAddressParamsSlesOSA,
    stateToNetworkDeviceParams as stateToNetworkDeviceParamsSlesOSA,
    stateToSshParams as stateToSshParamsSlesOSA,
    stateToVncParams as stateToVncParamsSlesOSA,
    stateToInstallationRepoParams as stateToInstallationRepoParamsSlesOSA,
} from './param-file-util_sles_osa'
import {
    stateToNetworkAddressParams as stateToNetworkAddressParamsSlesRoCE,
    stateToNetworkDeviceParams as stateToNetworkDeviceParamsSlesRoCE,
    stateToSshParams as stateToSshParamsSlesRoCE,
    stateToVncParams as stateToVncParamsSlesRoCE,
    stateToInstallationRepoParams as stateToInstallationRepoParamsSlesRoCE,
} from './param-file-util_sles_roce'

const stateToNetworkAddressParams = (state) => {
    const deviceType =
        state?.steps?.networkDevice?.deviceType ?? DEVICE_TYPE_OSA
    return deviceType === DEVICE_TYPE_OSA
        ? stateToNetworkAddressParamsSlesOSA(state)
        : stateToNetworkAddressParamsSlesRoCE(state)
}

const stateToNetworkDeviceParams = (state) => {
    const deviceType =
        state?.steps?.networkDevice?.deviceType ?? DEVICE_TYPE_OSA
    return deviceType === DEVICE_TYPE_OSA
        ? stateToNetworkDeviceParamsSlesOSA(state)
        : stateToNetworkDeviceParamsSlesRoCE(state)
}

const stateToInstallationRepoParams = (state) => {
    const deviceType =
        state?.steps?.networkDevice?.deviceType ?? DEVICE_TYPE_OSA
    return deviceType === DEVICE_TYPE_OSA
        ? stateToSshParamsSlesOSA(state)
        : stateToSshParamsSlesRoCE(state)
}

const stateToVncParams = (state) => {
    const deviceType =
        state?.steps?.networkDevice?.deviceType ?? DEVICE_TYPE_OSA
    return deviceType === DEVICE_TYPE_OSA
        ? stateToVncParamsSlesOSA(state)
        : stateToVncParamsSlesRoCE(state)
}

const stateToSshParams = (state) => {
    const deviceType =
        state?.steps?.networkDevice?.deviceType ?? DEVICE_TYPE_OSA
    return deviceType === DEVICE_TYPE_OSA
        ? stateToInstallationRepoParamsSlesOSA(state)
        : stateToInstallationRepoParamsSlesRoCE(state)
}

export {
    stateToNetworkAddressParams,
    stateToNetworkDeviceParams,
    stateToInstallationRepoParams,
    stateToVncParams,
    stateToSshParams,
}
