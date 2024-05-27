/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import { toChannelSegments } from './network-device-util'
import {
    ADDRESS_TYPE_IPV4,
    ADDRESS_TYPE_IPV6,
    DEVICE_TYPE_OSA,
} from './constants'

const stateToIpv4NetworkAddressParams = (state) => {
    const installationParameters = state?.steps?.networkAddress ?? {}
    const installationParametersForDeviceType =
        state?.steps?.networkDevice ?? {}
    const hasVlanId =
        installationParametersForDeviceType.vlan.enabled &&
        typeof installationParametersForDeviceType.vlan === 'object' &&
        typeof installationParametersForDeviceType.vlan.id === 'number' &&
        installationParametersForDeviceType.vlan.id > 0
    const vlanId = `${installationParametersForDeviceType.vlan.id}`
    const ipAddress = installationParameters?.ipv4?.address ?? ''
    const gatewayIpAddress = installationParameters?.gatewayIpAddress ?? ''
    const prefixLength = installationParameters?.ipv4?.cidr ?? 1
    const nameserver = `${installationParameters.nameserverIpAddress}`
    const hasDomainSearchPath = !!(
        installationParameters.domainSearchPath &&
        installationParameters.domainSearchPath.length > 0
    )

    return `ifcfg=${hasVlanId ? `*.${vlanId}` : '*'}=${ipAddress}/${prefixLength},${gatewayIpAddress},${nameserver},${hasDomainSearchPath ? `${installationParameters.domainSearchPath}` : ''}`
}

const stateToIpv6NetworkAddressParams = (state) => {
    const installationParameters = state?.steps?.networkAddress ?? {}
    const installationParametersForDeviceType =
        state?.steps?.networkDevice ?? {}
    const hasVlanId =
        installationParametersForDeviceType.vlan.enabled &&
        typeof installationParametersForDeviceType.vlan === 'object' &&
        typeof installationParametersForDeviceType.vlan.id === 'number' &&
        installationParametersForDeviceType.vlan.id > 0
    const vlanId = `${installationParametersForDeviceType.vlan.id}`
    const ipAddress = installationParameters?.ipv6?.address ?? ''
    const gatewayIpAddress = installationParameters?.gatewayIpAddress ?? ''
    const prefixLength = installationParameters?.ipv6?.cidr ?? 1
    const nameserver = `${installationParameters.nameserverIpAddress}`
    const hasDomainSearchPath = !!(
        installationParameters.domainSearchPath &&
        installationParameters.domainSearchPath.length > 0
    )

    return `ifcfg=${hasVlanId ? `*.${vlanId}` : '*'}=${ipAddress}/${prefixLength},${gatewayIpAddress},${nameserver},${hasDomainSearchPath ? `${installationParameters.domainSearchPath}` : ''}`
}

const stateToNetworkAddressParams = (state) => {
    const installationParameters = state?.steps?.networkAddress ?? {}
    const hostName = installationParameters?.hostName ?? ''
    const hasHostName = !!(
        state?.steps?.networkAddress.hostName &&
        state?.steps?.networkAddress.hostName.length > 0
    )
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
                : stateToIpv6NetworkAddressParams(state)
        const installationRepoLine = `${ipAddressParemeters}
${installationParameters.addressType === ADDRESS_TYPE_IPV6 ? 'ipv6=1 ' : ''}${hasHostName ? `hostname=${hostName} ` : ''}
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

const stateToOsaNetworkDeviceParams = (installationParameters) => {
    const readChannel = installationParameters?.osa?.readChannel ?? ''
    const sanitisedReadChannel = toChannelSegments(
        readChannel.toLowerCase()
    ).join('.')

    const writeChannel = installationParameters?.osa?.writeChannel ?? ''
    const sanitisedWriteChannel = toChannelSegments(
        writeChannel.toLowerCase()
    ).join('.')

    const dataChannel = installationParameters?.osa?.dataChannel ?? ''
    const sanitisedDataChannel = toChannelSegments(
        dataChannel.toLowerCase()
    ).join('.')

    const layer = installationParameters?.osa?.layer ?? ''
    const portNumber = installationParameters?.osa?.portNumber ?? ''

    return `instnetdev=osa osainterface=qdio layer2=${layer} portno=${portNumber} osahwaddr=
readchannel=${sanitisedReadChannel} writechannel=${sanitisedWriteChannel} datachannel=${sanitisedDataChannel}`
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
            const vncServerLine = `vnc=1 vncpassword=${installationParameters.vnc.password}`
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
        const sshServerLine = `ssh=1${hasSshPassword ? ` ssh.password=${installationParameters.ssh.password}` : ''}`
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
