/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, {
    forwardRef,
    lazy,
    Suspense,
    useEffect,
    useImperativeHandle,
} from "react";
import PropTypes from "prop-types";
import { Loading } from "@carbon/react";
import {
    LOCAL_STORAGE_KEY_APP_INSTALLATION_PARAMETERS,
    STATE_ORIGIN_USER,
    STATE_ORIGIN_STORAGE,
} from "../../../util/local-storage-constants";
import {
    UBUNTU_DISTRIBUTION_ID,
    DEFAULT_DISTRIBUTION_ID,
} from "../../../util/constants";
import {
    ApplicationContext,
    InstallationParameterContext,
} from "../../../contexts";
import { updateIsDisabled as updateIsDisabledFromUtils } from "../../../util/panel-util";
import { encryptItem } from "../../../util/local-storage-util";
import { isInstallationAddressInputValid } from "../../../util/installation-address-util";
import "./_installation-parameters.scss";

const CommonView = lazy(
    () => import("./components/common/InstallationParameters")
);

const RhelSshView = lazy(
    () => import("./components/distribution/rhel/SshView")
);
const RhelVncView = lazy(
    () => import("./components/distribution/rhel/VncView")
);
const RhelRemoteAccessWrapperView = lazy(
    () => import("./components/distribution/rhel/RemoteAccessWrapper")
);

const SlesSshView = lazy(
    () => import("./components/distribution/sles/SshView")
);
const SlesVncView = lazy(
    () => import("./components/distribution/sles/VncView")
);
const SlesRemoteAccessWrapperView = lazy(
    () => import("./components/distribution/sles/RemoteAccessWrapper")
);

const UbuntuSshView = lazy(
    () => import("./components/distribution/ubuntu/SshView")
);
const UbuntuVncView = lazy(
    () => import("./components/distribution/ubuntu/VncView")
);
const UbuntuRemoteAccessWrapperView = lazy(
    () => import("./components/distribution/ubuntu/RemoteAccessWrapper")
);

const views = {
    rhel: {
        SshView: RhelSshView,
        VncView: RhelVncView,
        RemoteWrapperView: RhelRemoteAccessWrapperView,
    },
    sles: {
        SshView: SlesSshView,
        VncView: SlesVncView,
        RemoteWrapperView: SlesRemoteAccessWrapperView,
    },
    ubuntu: {
        SshView: UbuntuSshView,
        VncView: UbuntuVncView,
        RemoteWrapperView: UbuntuRemoteAccessWrapperView,
    },
};

const InstallationParameters = forwardRef(
    function InstallationParameters(props, ref) {
        const {
            state: globalState,
            updateNextStep,
            updateIsDirty,
            updateIsDisabled,
        } = React.useContext(ApplicationContext);
        const { state } = React.useContext(InstallationParameterContext);
        const { ipAddressVersion } = props;
        const publicRef = {
            persistState: () => {
                let mergedSteps = {};

                isCompleteAndValid((error, isCompleteAndValid) => {
                    if (!error) {
                        mergedSteps = {
                            ...globalState,
                            steps: {
                                ...globalState.steps,
                                installationParameters: {
                                    ...globalState.steps.installationParameters,
                                    networkInstallationUrl:
                                        state.installationAddress.computed,
                                    networkInstallationUrlWithPasswordsRemoved:
                                        state.installationAddress
                                            .computedWithPasswordsRemoved,
                                    vnc: {
                                        password: state.vncPassword,
                                        enabled: state?.useVnc ?? true,
                                    },
                                    ssh: {
                                        password: state.sshPassword,
                                        enabled: state.useSsh,
                                    },
                                    complete: true,
                                    invalid: false,
                                    origin: STATE_ORIGIN_USER,
                                },
                            },
                        };
                    } else if (isCompleteAndValid.isComplete) {
                        mergedSteps = {
                            ...globalState,
                            steps: {
                                ...globalState.steps,
                                installationParameters: {
                                    ...globalState.steps.installationParameters,
                                    networkInstallationUrl:
                                        state.installationAddress.computed,
                                    networkInstallationUrlWithPasswordsRemoved:
                                        state.installationAddress
                                            .computedWithPasswordsRemoved,
                                    vnc: {
                                        password: state.vncPassword,
                                        enabled: state?.useVnc ?? true,
                                    },
                                    ssh: {
                                        password: state.sshPassword,
                                        enabled: state.useSsh,
                                    },
                                    complete: isCompleteAndValid.isComplete,
                                    invalid: !isCompleteAndValid.isValid,
                                    origin: STATE_ORIGIN_USER,
                                },
                            },
                        };
                    } else {
                        mergedSteps = {
                            ...globalState,
                            steps: {
                                ...globalState.steps,
                                installationParameters: {
                                    ...globalState.steps.installationParameters,
                                    networkInstallationUrl:
                                        state.installationAddress?.computed ??
                                        "",
                                    networkInstallationUrlWithPasswordsRemoved:
                                        state?.installationAddress
                                            ?.computedWithPasswordsRemoved ??
                                        "",
                                    vnc: {
                                        password: state?.vncPassword ?? "",
                                        enabled: state?.useVnc ?? true,
                                    },
                                    ssh: {
                                        password: state.sshPassword,
                                        enabled: state?.useSsh ?? "",
                                    },
                                    disabled: false,
                                    complete: isCompleteAndValid.isComplete,
                                    invalid: !isCompleteAndValid.isValid,
                                    origin: STATE_ORIGIN_USER,
                                },
                            },
                        };
                    }

                    updateNextStep(mergedSteps.steps);
                    updateIsDirty(true);
                    updateIsDisabled(
                        updateIsDisabledFromUtils(mergedSteps.steps)
                    );
                });

                encryptItem(
                    LOCAL_STORAGE_KEY_APP_INSTALLATION_PARAMETERS,
                    JSON.stringify({
                        ...state,
                        origin: STATE_ORIGIN_STORAGE,
                    })
                );
            },
        };

        useEffect(publicRef.persistState, [state]);
        useImperativeHandle(ref, () => publicRef);

        const isPasswordInputValid = (password) => {
            // The password is optional, if it is a zero length string
            // mark it as a valid value.
            if (
                distributionName !== UBUNTU_DISTRIBUTION_ID &&
                typeof password === "string" &&
                password.length === 0
            ) {
                return true;
            } else if (
                distributionName === UBUNTU_DISTRIBUTION_ID &&
                typeof password === "string" &&
                password.length === 0
            ) {
                return false;
            }

            return password.indexOf(" ") === -1;
        };

        const isSshPasswordComplete = () => {
            const password = state?.sshPassword?.value ?? "";

            if (distributionName !== UBUNTU_DISTRIBUTION_ID) {
                return true;
            }
            return typeof password === "string" && password.length > 0;
        };

        const useSshToggled = state?.useSsh ?? false;
        const useVncToggled = state?.useVnc ?? true;
        const showPasswords = globalState?.showPasswords ?? false;
        const paramFileHasBeenModifiedFromState =
            globalState?.steps.downloadParamFile?.modified ?? false;
        const hasDistributionName =
            typeof globalState.steps.inputFileSelection.distributionName ===
                "string" &&
            globalState.steps.inputFileSelection.distributionName.length > 0;
        const distributionName = hasDistributionName
            ? globalState.steps.inputFileSelection.distributionName
            : DEFAULT_DISTRIBUTION_ID;
        const SshView = views[distributionName].SshView;
        const VncView = views[distributionName].VncView;
        const RemoteWrapperView = views[distributionName].RemoteWrapperView;

        const isCompleteAndValid = (callback) => {
            let isComplete = false;
            let isValid = false;

            if (
                typeof state.installationAddress === "object" &&
                typeof state.installationAddress.value === "string" &&
                state.installationAddress.value.length > 0 &&
                isSshPasswordComplete()
            ) {
                isComplete = true;
                isValid =
                    isInstallationAddressInputValid(
                        state.installationAddress.value
                    ) &&
                    state.password.valid &&
                    state.vncPassword.valid &&
                    state.sshPassword.valid;
            }

            if (isComplete && isValid) {
                return callback(null, { isComplete, isValid });
            }

            return callback(new Error("Form data is incomplete or invalid"), {
                isComplete,
                isValid,
            });
        };

        return (
            <Suspense fallback={<Loading />}>
                <CommonView
                    paramFileHasBeenModifiedFromState={
                        paramFileHasBeenModifiedFromState
                    }
                    installationAddress={state.installationAddress}
                    userName={state.userName}
                    password={state.password}
                    ipAddressVersion={ipAddressVersion}
                    showPasswords={showPasswords}
                    distributionName={distributionName}
                >
                    {{
                        remoteWrapperView: (
                            <Suspense fallback={<Loading />}>
                                <RemoteWrapperView>
                                    {{
                                        sshView: (
                                            <Suspense fallback={<Loading />}>
                                                <SshView
                                                    paramFileHasBeenModifiedFromState={
                                                        paramFileHasBeenModifiedFromState
                                                    }
                                                    useSshToggled={
                                                        useSshToggled
                                                    }
                                                    showPasswords={
                                                        showPasswords
                                                    }
                                                    isPasswordInputValid={
                                                        isPasswordInputValid
                                                    }
                                                    sshPassword={
                                                        state.sshPassword
                                                    }
                                                />
                                            </Suspense>
                                        ),
                                        vncView: (
                                            <Suspense fallback={<Loading />}>
                                                <VncView
                                                    paramFileHasBeenModifiedFromState={
                                                        paramFileHasBeenModifiedFromState
                                                    }
                                                    useVncToggled={
                                                        useVncToggled
                                                    }
                                                    showPasswords={
                                                        showPasswords
                                                    }
                                                    isPasswordInputValid={
                                                        isPasswordInputValid
                                                    }
                                                    vncPassword={
                                                        state.vncPassword
                                                    }
                                                />
                                            </Suspense>
                                        ),
                                    }}
                                </RemoteWrapperView>
                            </Suspense>
                        ),
                    }}
                </CommonView>
            </Suspense>
        );
    }
);

InstallationParameters.propTypes = {
    ipAddressVersion: PropTypes.string.isRequired,
};

export default InstallationParameters;
