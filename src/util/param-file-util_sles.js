/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import { DEVICE_TYPE_OSA } from './constants'

import {
    stateToNetworkAddressParams as stateToNetworkAddressParamsSlesOSA,
    stateToOsaNetworkDeviceParams,
} from './param-file-util_sles_osa'
import { stateToNetworkAddressParams as stateToNetworkAddressParamsSlesRoCE } from './param-file-util_sles_roce'

const stateToNetworkAddressParams = (state) => {
    const deviceType =
        state?.steps?.networkDevice?.deviceType ?? DEVICE_TYPE_OSA
    return deviceType === DEVICE_TYPE_OSA
        ? stateToNetworkAddressParamsSlesOSA(state)
        : stateToNetworkAddressParamsSlesRoCE(state)
}

const stateToNetworkDeviceParams = (state) => {
    const installationParameters = state?.steps?.networkDevice ?? {}
    const networkDeviceSettings =
        installationParameters.deviceType === DEVICE_TYPE_OSA
            ? stateToOsaNetworkDeviceParams(installationParameters)
            : ``
    let paramFileContents = {
        contents: '',
        complete: false,
        label: '',
        index: 0,
    }

    // => rd.znet...
    if (installationParameters) {
        const installationRepoLine = `${networkDeviceSettings}`
        paramFileContents = {
            contents: `${installationRepoLine}`,
            complete: installationParameters.complete,
            invalid: installationParameters.invalid,
            index: installationParameters.index,
        }
    }

    return paramFileContents
}

const stateToInstallationRepoParams = (state) => {
    const installationParameters = state?.steps?.installationParameters ?? {}
    const networkInstallationUrl =
        installationParameters?.networkInstallationUrl ?? ''
    let paramFileContents = {
        contents: '',
        complete: false,
        index: 0,
    }

    // => inst.repo=...
    const installationRepoLine = `install=${networkInstallationUrl}`
    paramFileContents = {
        contents: `${installationRepoLine}`,
        complete: installationParameters.complete,
        invalid: installationParameters.invalid,
        index: installationParameters.index,
    }

    return paramFileContents
}

const stateToVncParams = (state) => {
    const installationParameters = state?.steps?.installationParameters ?? {}
    let paramFileContents = {
        contents: '',
        complete: false,
        index: 0,
    }

    // => inst.vnc inst.vncpassword=...
    if (
        installationParameters &&
        installationParameters.vnc &&
        installationParameters.vnc.enabled === true
    ) {
        if (
            installationParameters.vnc.password &&
            installationParameters.vnc.password.value &&
            installationParameters.vnc.password.value.length > 0
        ) {
            const vncServerLine = `vnc=1 vncpassword=${installationParameters.vnc.password.value}`
            paramFileContents = {
                contents: `${vncServerLine}`,
                complete: installationParameters.complete,
                invalid: installationParameters.invalid,
                index: installationParameters.index,
            }
        } else {
            const vncServerLine = `vnc=1`
            paramFileContents = {
                contents: `${vncServerLine}`,
                complete: installationParameters.complete,
                invalid: installationParameters.invalid,
                index: installationParameters.index,
            }
        }
    }

    return paramFileContents
}

const stateToSshParams = (state) => {
    const installationParameters = state?.steps?.installationParameters ?? {}
    let paramFileContents = {
        contents: '',
        complete: false,
        index: 0,
    }

    // => inst.sshd
    if (
        installationParameters &&
        installationParameters.ssh &&
        installationParameters.ssh.enabled === true
    ) {
        const hasSshPassword = !!(
            installationParameters.ssh.password &&
            installationParameters.ssh.password.value &&
            installationParameters.ssh.password.value.length > 0
        )
        const sshServerLine = `ssh=1${hasSshPassword ? ` ssh.password=${installationParameters.ssh.password.value}` : ''}`
        paramFileContents = {
            contents: `${sshServerLine}`,
            complete: installationParameters.complete,
            invalid: installationParameters.invalid,
            index: installationParameters.index,
        }
    }

    return paramFileContents
}

export {
    stateToNetworkAddressParams,
    stateToNetworkDeviceParams,
    stateToInstallationRepoParams,
    stateToVncParams,
    stateToSshParams,
}
