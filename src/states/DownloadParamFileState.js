/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import {
    LOCAL_STORAGE_KEY_APP_DOWNLOAD_PARAM_FILE,
    STATE_ORIGIN_DEFAULT,
} from "../util/local-storage-constants";
import { getItem } from "../util/local-storage-util";

const createInitialState = (skipLocalStorageUsage = false) => {
    const initialState = getItem(LOCAL_STORAGE_KEY_APP_DOWNLOAD_PARAM_FILE);
    const defaultState = {
        paramFileContentCopied: false,
        paramFileContentModified: false,
        paramFileContent: "",
        showPasswords: false,
        overrideGlobalState: false,
        isEditing: false,
        origin: STATE_ORIGIN_DEFAULT,
    };

    if (initialState && !skipLocalStorageUsage) {
        return initialState;
    }

    return defaultState;
};

export { createInitialState };
