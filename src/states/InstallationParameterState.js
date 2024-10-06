/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import {
    LOCAL_STORAGE_KEY_APP_INSTALLATION_PARAMETERS,
    STATE_ORIGIN_DEFAULT,
} from "../util/local-storage-constants";
import { DEFAULT_STRING_OBJECT } from "../util/constants";
import { decryptItem } from "../util/local-storage-util";

const createInitialState = (skipLocalStorageUsage = false) => {
    const initialState = decryptItem(
        LOCAL_STORAGE_KEY_APP_INSTALLATION_PARAMETERS
    );
    const defaultState = {
        useSsh: false,
        useVnc: true,
        installationAddress: {
            value: "",
            computed: "",
            computedWithPasswordsRemoved: "",
            valid: true,
        },
        userName: DEFAULT_STRING_OBJECT,
        password: DEFAULT_STRING_OBJECT,
        userAndPwdAreDisabled: true,
        vncPassword: DEFAULT_STRING_OBJECT,
        sshPassword: DEFAULT_STRING_OBJECT,
        origin: STATE_ORIGIN_DEFAULT,
    };

    if (initialState && !skipLocalStorageUsage) {
        return initialState;
    }

    return defaultState;
};

export { createInitialState };
