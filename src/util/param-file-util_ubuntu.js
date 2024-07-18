/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import { ADDRESS_TYPE_IPV4 } from './constants'
import {
    getInterfaceNameParamContents,
    getNetdevName,
    getVlanName
} from './param-file-util_common'
import { hexEncodePassword } from "./password-util";

const stateToIpv4NetworkAddressParams = (state) => {
    const installationParameters = state?.steps?.networkAddress ?? {}
    const networkDeviceInstallationParameters =
        state?.steps?.networkDevice ?? {}
    const ipAddress = installationParameters?.ipv4?.address ?? ''
    const gatewayIpAddress = installationParameters?.gatewayIpAddress ?? ''
    const netmask = installationParameters?.ipv4?.netmask
    const hostName = installationParameters?.hostName ?? ''
    const hasHostName = !!(
        state?.steps?.networkAddress.hostName &&
        state?.steps?.networkAddress.hostName.length > 0
    )
    const vlanId = networkDeviceInstallationParameters.vlan.enabled
        ? networkDeviceInstallationParameters?.vlan?.id ?? 1
        : null
    const interfaceName =
        getInterfaceNameParamContents(networkDeviceInstallationParameters) || ''
    const netdevName = getNetdevName(vlanId, interfaceName) || ''

    return `ip=${ipAddress}::${gatewayIpAddress}:${netmask}:${hasHostName ? `hostname=${hostName}` : ''}:${netdevName}:none:${installationParameters.nameserverIpAddress}`
}

const stateToNetworkAddressParams = (state) => {
    const installationParameters = state?.steps?.networkAddress ?? {}
    let paramFileContents = {
        contents: '',
        complete: false,
        invalid: false,
        label: '',
        index: 0,
    }

    // => ip=...
    if (installationParameters && installationParameters.addressType) {
        const ipAddressParemeters =
            installationParameters.addressType === ADDRESS_TYPE_IPV4
                ? stateToIpv4NetworkAddressParams(state)
                : ''
        const installationRepoLine = `${ipAddressParemeters}
`
        paramFileContents = {
            contents: `${installationRepoLine}`,
            complete: installationParameters.complete,
            invalid: installationParameters.invalid,
            index: installationParameters.index,
        }
    }

    return paramFileContents
}

const stateToNetworkDeviceParams = (state) => {
    const installationParameters = state?.steps?.networkDevice ?? {}
    const hasVlanId =
        installationParameters.vlan.enabled &&
        typeof installationParameters.vlan === 'object' &&
        typeof installationParameters.vlan.id === 'number' &&
        installationParameters.vlan.id > 0
    let paramFileContents = {
        contents: '',
        complete: false,
        label: '',
        index: 0,
    }

    // => rd.znet...
    if (installationParameters) {
        const interfaceName =
            getInterfaceNameParamContents(installationParameters) || ''

        if (hasVlanId) {
            const vlanId = `vlan=${getVlanName(
                interfaceName,
                installationParameters.vlan.id
            )}:${interfaceName}`
            const installationRepoLine = `
${vlanId}
`
            paramFileContents = {
                contents: `${installationRepoLine}`,
                complete: installationParameters.complete,
                invalid: installationParameters.invalid,
                index: installationParameters.index,
            }
        } else {
            const installationRepoLine = ``
            paramFileContents = {
                contents: `${installationRepoLine}`,
                complete: installationParameters.complete,
                invalid: installationParameters.invalid,
                index: installationParameters.index,
            }
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
    const installationRepoLine = `url=${networkInstallationUrl}`
    paramFileContents = {
        contents: `${installationRepoLine}`,
        complete: installationParameters.complete,
        invalid: installationParameters.invalid,
        index: installationParameters.index,
    }

    return paramFileContents
}

const stateToVncParams = (state) => {
    const paramFileContents = {
        contents: '',
        complete: false,
        index: 0,
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
        const sshServerLine = `${hasSshPassword ? `cc: password: ${hexEncodePassword(installationParameters.ssh.password.value)} end_cc` : ''}`
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
