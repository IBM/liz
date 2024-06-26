/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import {
    LOCAL_STORAGE_KEY_APP_NETWORK_ADDRESS,
    STATE_ORIGIN_DEFAULT,
} from '../util/local-storage-constants'
import { DEFAULT_STRING_OBJECT, ADDRESS_TYPE_IPV4 } from '../util/constants'
import { getItem } from '../util/local-storage-util'

const createInitialState = (skipLocalStorageUsage = false) => {
    const initialState = getItem(LOCAL_STORAGE_KEY_APP_NETWORK_ADDRESS)
    const defaultState = {
        ipv4: {
            netmask: {
                value: '255.255.255.0',
                valid: true,
                computed: false,
            },
            ipv4Cidr: {
                value: 24,
                valid: true,
                computed: false,
            },
            binary: '11111111.11111111.11111111.00000000',
            ipv4Address: DEFAULT_STRING_OBJECT,
            gatewayIpAddress: DEFAULT_STRING_OBJECT,
            nameserverIpAddress: DEFAULT_STRING_OBJECT,
            hostName: DEFAULT_STRING_OBJECT,
            domainSearchPath: DEFAULT_STRING_OBJECT,
        },
        ipv6: {
            ipv6Cidr: {
                value: 64,
                valid: true,
            },
            ipv6Address: DEFAULT_STRING_OBJECT,
            gatewayIpAddress: DEFAULT_STRING_OBJECT,
            nameserverIpAddress: DEFAULT_STRING_OBJECT,
            hostName: DEFAULT_STRING_OBJECT,
            domainSearchPath: DEFAULT_STRING_OBJECT,
        },
        addressType: ADDRESS_TYPE_IPV4,
        origin: STATE_ORIGIN_DEFAULT,
    }

    if (initialState && !skipLocalStorageUsage) {
        return initialState
    }

    return defaultState
}

export { createInitialState }
