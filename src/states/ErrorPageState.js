/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import {
    LOCAL_STORAGE_KEY_APP_ERROR_PAGE,
    STATE_ORIGIN_DEFAULT,
} from '../util/local-storage-constants'
import { getItem } from '../util/local-storage-util'

const createInitialState = (skipLocalStorageUsage = false) => {
    const initialState = getItem(LOCAL_STORAGE_KEY_APP_ERROR_PAGE)
    const defaultState = {
        origin: STATE_ORIGIN_DEFAULT,
    }

    if (initialState && !skipLocalStorageUsage) {
        return initialState
    }

    return defaultState
}

export { createInitialState }
