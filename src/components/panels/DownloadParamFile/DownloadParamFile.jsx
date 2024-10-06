/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, {
    forwardRef,
    useEffect,
    useContext,
    useImperativeHandle,
} from "react";
import { Trans, useTranslation } from "react-i18next";
import {
    Layer,
    InlineNotification,
    ActionableNotification,
    FlexGrid,
    Row,
    Column,
    Link,
} from "@carbon/react";
import { ParamFileTextArea } from "../../ParamFileTextArea";
import {
    LOCAL_STORAGE_KEY_APP_DOWNLOAD_PARAM_FILE,
    STATE_ORIGIN_USER,
    STATE_ORIGIN_STORAGE,
} from "../../../util/local-storage-constants";
import {
    DEFAULT_PARAM_FILE_NAME,
    RHEL_DISTRIBUTION_ID,
    PRESETS,
} from "../../../util/constants";
import {
    ApplicationContext,
    DownloadParamFileContext,
    InstallationParameterContext,
} from "../../../contexts";
import { updateIsDisabled as updateIsDisabledFromUtils } from "../../../util/panel-util";
import { resetParamFileTextAreaData } from "../../../uiUtil/panel-util";
import {
    saveParamFileContent,
    stateToParamFile,
} from "../../../util/param-file-util";
import { setItem } from "../../../util/local-storage-util";
import { toUrl } from "../../../util/network-address-util";
import "./_download-param-file.scss";

const DownloadParamFile = forwardRef(function DownloadParamFile(props, ref) {
    const {
        state: globalState,
        updateModified: globalUpdateModified,
        updateNextStep,
        updateIsDirty,
        updateIsDisabled,
    } = useContext(ApplicationContext);
    const { t } = useTranslation();
    const {
        state,
        updatParamFileCopied,
        updateModified,
        updateParamFileContent,
        updateShowPasswords,
        updateOverrideGlobalState,
        updateIsEditing,
    } = useContext(DownloadParamFileContext);
    const { state: installationParameterState } = useContext(
        InstallationParameterContext
    );
    const distributionName =
        globalState.steps.inputFileSelection.distributionName ??
        RHEL_DISTRIBUTION_ID;
    const presets = PRESETS[distributionName];
    const publicRef = {
        persistState: () => {
            const paramFileContentToBePersisted =
                stateHasValidParamFileContents()
                    ? state.paramFileContent
                    : paramFileContent.data;
            const paramFileContentToBePersistedWithPasswordsRemoved =
                stateHasValidParamFileContents()
                    ? state.paramFileContent
                    : paramFileContent.dataWithPasswordsRemoved;

            isCompleteAndValid((error, isCompleteAndValid) => {
                let mergedSteps = {};

                if (!error) {
                    mergedSteps = {
                        ...globalState,
                        steps: {
                            ...globalState.steps,
                            downloadParamFile: {
                                ...globalState.steps.downloadParamFile,
                                contents: paramFileContentToBePersisted,
                                contentsWithPasswordsRemoved:
                                    paramFileContentToBePersistedWithPasswordsRemoved,
                                presets,
                                modified: state.paramFileContentModified,
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
                            downloadParamFile: {
                                ...globalState.steps.downloadParamFile,
                                contents: paramFileContentToBePersisted,
                                contentsWithPasswordsRemoved:
                                    paramFileContentToBePersistedWithPasswordsRemoved,
                                presets,
                                modified: state.paramFileContentModified,
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
                            downloadParamFile: {
                                ...globalState.steps.downloadParamFile,
                                contents: paramFileContentToBePersisted,
                                contentsWithPasswordsRemoved:
                                    paramFileContentToBePersistedWithPasswordsRemoved,
                                presets,
                                modified: state.paramFileContentModified,
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
                updateIsDisabled(updateIsDisabledFromUtils(mergedSteps.steps));
            });

            setItem(
                LOCAL_STORAGE_KEY_APP_DOWNLOAD_PARAM_FILE,
                JSON.stringify({
                    ...state,
                    paramFileContent: paramFileContentToBePersisted,
                    origin: STATE_ORIGIN_STORAGE,
                })
            );
        },
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            const code = event.which || event.keyCode;
            const charCode = String.fromCharCode(code).toLowerCase();

            if (
                (event.ctrlKey || event.metaKey) &&
                charCode === "c" &&
                event.target.id === "liz__param-file-text-area" &&
                event.target.selectionStart !== event.target.selectionEnd
            ) {
                event.preventDefault();

                updateCopied();
                navigator.clipboard.writeText(
                    stateHasValidParamFileContents()
                        ? state.paramFileContent
                        : stateToParamFile(globalState).data
                );
            }
            return true;
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [state, globalState]);

    useEffect(publicRef.persistState, [state]);
    useImperativeHandle(ref, () => publicRef);

    const paramFileContent = stateToParamFile(globalState);
    const globalShowPasswords = globalState?.showPasswords ?? false;

    const onShowPassword = () => {
        updateOverrideGlobalState(true);

        if (state.showPasswords) {
            updateShowPasswords(false);
        } else {
            updateShowPasswords(true);
        }
    };

    const isEditing = () => {
        if (state.isEditing) {
            updateIsEditing(false);
        } else {
            updateIsEditing(true);
        }
    };

    const updateCopied = () => {
        updatParamFileCopied(true);

        const timer = setTimeout(() => {
            updatParamFileCopied(false);
        }, 2000);
        return () => clearTimeout(timer);
    };

    const saveParamFileContentProxy = () => {
        saveParamFileContent(
            stateHasValidParamFileContents()
                ? state.paramFileContent
                : paramFileContent.data,
            DEFAULT_PARAM_FILE_NAME
        );
    };

    const stateHasValidParamFileContents = () => {
        if (
            typeof state.paramFileContent === "string" &&
            state.paramFileContentModified
        ) {
            return true;
        }
        return false;
    };

    const hasPasswords = () => {
        const installationAddress =
            installationParameterState?.installationAddress?.value ?? "";
        const password = installationParameterState?.password?.value ?? "";
        const sshPassword =
            installationParameterState?.sshPassword?.value ?? "";
        const vncPassword =
            installationParameterState?.vncPassword?.value ?? "";
        const installationAddressUrl = toUrl(installationAddress);

        if (password && password.length > 0) {
            return true;
        } else if (sshPassword && sshPassword.length > 0) {
            return true;
        } else if (vncPassword && vncPassword.length > 0) {
            return true;
        } else if (
            installationAddressUrl &&
            installationAddressUrl.password &&
            installationAddressUrl.password.length > 0
        ) {
            return true;
        }
        return false;
    };

    const notificationMarkup = (
        <InlineNotification
            hideCloseButton
            statusIconDescription="notification"
            subtitle={t(
                "panel.downloadParamFile.incompletOrInvalidDataNotificationSubtitle",
                { ns: "panels" }
            )}
            title={t(
                "panel.downloadParamFile.incompletOrInvalidDataNotificationTitle",
                { ns: "panels" }
            )}
            kind="info"
            className="download-param-file__incomplete-data-banner"
        />
    );
    const modifiedDataMessageMarkup = (
        <>
            <span className="download-param-file_modified-data-message-text">
                {t("panel.downloadParamFile.modifiedDataNotificationSubtitle", {
                    ns: "panels",
                })}
            </span>
            {state.paramFileContentModified && (
                <>
                    <span>&nbsp;</span>
                    <span className="download-param-file_modified-data-message-link-text">
                        <Trans
                            i18nKey="panel.downloadParamFile.modifiedDataNotificationLinkText"
                            ns="panels"
                        >
                            You may&nbsp;
                            <Link
                                onClick={() => {
                                    resetParamFileTextAreaData({
                                        updateParamFileContent,
                                        globalUpdateModified,
                                        updateModified,
                                        state: globalState,
                                    });
                                }}
                                className="download-param-file_modified-data-message-link-anchor"
                            >
                                reset
                            </Link>
                            &nbsp; the generated data to its original state.
                        </Trans>
                    </span>
                </>
            )}
        </>
    );
    const gridContentsMarkup = (
        <>
            <div className="download-param-file_textarea-container">
                <ParamFileTextArea
                    id="download-param-file_textarea"
                    contents={
                        stateHasValidParamFileContents()
                            ? state.paramFileContent
                            : paramFileContent.data
                    }
                    contentsWithPasswordsRemoved={
                        stateHasValidParamFileContents()
                            ? state.paramFileContent
                            : paramFileContent.dataWithPasswordsRemoved
                    }
                    copyContents={updateCopied}
                    onShowPassword={onShowPassword}
                    showPasswords={
                        globalShowPasswords && !state.overrideGlobalState
                            ? true
                            : state.showPasswords
                    }
                    hasPasswords={hasPasswords()}
                    onEditing={isEditing}
                    editing={state.isEditing}
                    resetContents={() => {
                        resetParamFileTextAreaData({
                            updateParamFileContent,
                            globalUpdateModified,
                            updateModified,
                            state: globalState,
                        });
                    }}
                    downloadContents={saveParamFileContentProxy}
                    onChange={(localParamFileContent) => {
                        const localParamFileContentValue =
                            localParamFileContent &&
                            localParamFileContent.target &&
                            localParamFileContent.target.value
                                ? localParamFileContent.target.value
                                : "";

                        updateParamFileContent(localParamFileContentValue);
                        if (
                            localParamFileContentValue === paramFileContent.data
                        ) {
                            updateModified(false);
                        } else {
                            updateModified(true);
                        }
                    }}
                    onFocus={() => {
                        document
                            .getElementById(
                                "helpPanelContents_downloadParamFile_para1"
                            )
                            ?.classList?.add(
                                "help-panel__download-param-file__content__active"
                            );
                        document
                            .getElementById(
                                "helpPanelContents_downloadParamFile_para2"
                            )
                            ?.classList?.add(
                                "help-panel__download-param-file__content__active"
                            );
                        document
                            .getElementById(
                                "helpPanelContents_downloadParamFile_para3"
                            )
                            ?.classList?.add(
                                "help-panel__download-param-file__content__active"
                            );
                    }}
                    onBlur={() => {
                        document
                            .getElementById(
                                "helpPanelContents_downloadParamFile_para1"
                            )
                            ?.classList?.remove(
                                "help-panel__download-param-file__content__active"
                            );
                        document
                            .getElementById(
                                "helpPanelContents_downloadParamFile_para2"
                            )
                            ?.classList?.remove(
                                "help-panel__download-param-file__content__active"
                            );
                        document
                            .getElementById(
                                "helpPanelContents_downloadParamFile_para3"
                            )
                            ?.classList?.remove(
                                "help-panel__download-param-file__content__active"
                            );
                    }}
                    allowCopy
                    allowReset={state.paramFileContentModified}
                    allowDownload
                    label={{
                        text: t("panel.downloadParamFile.paramFileTextLabel", {
                            ns: "panels",
                        }),
                        content: t("panel.downloadParamFile.paramFileHelp", {
                            ns: "panels",
                        }),
                    }}
                />
            </div>
            {state.paramFileContentModified && (
                <ActionableNotification
                    inline
                    hideCloseButton
                    statusIconDescription="notification"
                    subtitle={modifiedDataMessageMarkup}
                    title={t(
                        "panel.downloadParamFile.modifiedDataNotificationTitle",
                        {
                            ns: "panels",
                        }
                    )}
                    kind="warning"
                    className="download-param-file__incomplete-data-banner"
                />
            )}
            {(paramFileContent.metadata.hasIncompleteData ||
                paramFileContent.metadata.hasInvalidData) &&
                notificationMarkup}
            {state.paramFileContentCopied ? (
                <span className="download-param-file_copied-label">
                    {t("copied.short", { ns: "common" })}.
                </span>
            ) : null}
        </>
    );
    const markup = (
        <Layer className="download-param-file_layer">
            <FlexGrid className="download-param-file_grid">
                <Row>
                    <Column>{gridContentsMarkup}</Column>
                </Row>
            </FlexGrid>
        </Layer>
    );

    const isCompleteAndValid = (callback) => {
        let isComplete = false;
        let isValid = false;

        if (
            typeof state.paramFileContent === "string" &&
            state.paramFileContent.length > 0
        ) {
            isComplete = true;
            isValid = !paramFileContent.metadata.hasIncompleteData;

            if (isComplete && isValid) {
                return callback(null, { isComplete, isValid });
            }
        }
        if (
            typeof paramFileContent.data === "string" &&
            paramFileContent.data.length > 0 &&
            !state.paramFileContentModified
        ) {
            isComplete = true;
            isValid = !paramFileContent.metadata.hasIncompleteData;

            if (isComplete && isValid) {
                return callback(null, { isComplete, isValid });
            }
        }

        return callback(new Error("Form data is incomplete or invalid"), {
            isComplete,
            isValid,
        });
    };

    return markup;
});

export default DownloadParamFile;
