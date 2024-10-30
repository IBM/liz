/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
    InlineNotification,
    Layer,
    FlexGrid,
    Row,
    Column,
    TextInput,
    PasswordInput,
    ActionableNotification,
} from "@carbon/react";
import { resetParamFileTextAreaData } from "../../../../../uiUtil/panel-util";
import { toUrl } from "../../../../../util/network-address-util";
import { isInstallationAddressInputValid } from "../../../../../util/installation-address-util";
import {
    InstallationParameterContext,
    ApplicationContext,
    DownloadParamFileContext,
} from "../../../../../contexts";
import {
    hexEncodePassword,
    toAsteriskRepresentation,
} from "../../../../../util/password-util";
import { UBUNTU_DISTRIBUTION_ID } from "../../../../../util/constants";
import "../../_installation-parameters.scss";

const InstallationParameters = ({
    children,
    paramFileHasBeenModifiedFromState,
    installationAddress,
    userName,
    password,
    ipAddressVersion,
    showPasswords,
    distributionName,
}) => {
    const { state: globalState, updateModified: globalUpdateModified } =
        React.useContext(ApplicationContext);
    const { updateModified, updateParamFileContent } = React.useContext(
        DownloadParamFileContext
    );
    const { state, updateInstallationAddress, updateUserName, updatePassword } =
        React.useContext(InstallationParameterContext);
    const { t } = useTranslation();

    const computeInstallationAddress = ({
        url = "",
        uid = "",
        pwd = "",
        clearUid = false,
        clearPwd = false,
    }) => {
        const address = url || (installationAddress?.value ?? "");
        const localUserName = clearUid ? "" : uid || (userName?.value ?? "");
        const localPassword = clearPwd ? "" : pwd || (password?.value ?? "");

        if (address && address.length > 0) {
            const installationAddressUrl = toUrl(address);
            if (
                installationAddressUrl &&
                localUserName &&
                localUserName.length > 0
            ) {
                installationAddressUrl.username = localUserName;
            }
            if (
                installationAddressUrl &&
                installationAddressUrl.password &&
                installationAddressUrl.password.length > 0
            ) {
                installationAddressUrl.password = hexEncodePassword(
                    installationAddressUrl.password
                );
            }
            if (
                installationAddressUrl &&
                !installationAddressUrl.password &&
                localPassword &&
                localPassword.length > 0
            ) {
                installationAddressUrl.password =
                    hexEncodePassword(localPassword);
            }
            return installationAddressUrl
                ? installationAddressUrl.toString()
                : "";
        }
        return "";
    };

    const computeInstallationAddresWithPasswordsRemoved = ({
        url = "",
        uid = "",
        pwd = "",
        clearUid = false,
        clearPwd = false,
    }) => {
        const address = url || (installationAddress?.value ?? "");
        const localUserName = clearUid ? "" : uid || (userName?.value ?? "");
        const localPassword = clearPwd ? "" : pwd || (password?.value ?? "");

        if (address && address.length > 0) {
            const installationAddressUrl = toUrl(address);
            if (
                installationAddressUrl &&
                localUserName &&
                localUserName.length > 0
            ) {
                installationAddressUrl.username = localUserName;
            }
            if (
                installationAddressUrl &&
                installationAddressUrl.password &&
                installationAddressUrl.password.length > 0
            ) {
                installationAddressUrl.password = toAsteriskRepresentation(
                    hexEncodePassword(installationAddressUrl.password)
                );
            }
            if (
                installationAddressUrl &&
                !installationAddressUrl.password &&
                localPassword &&
                localPassword.length > 0
            ) {
                installationAddressUrl.password = toAsteriskRepresentation(
                    hexEncodePassword(localPassword)
                );
            }
            return installationAddressUrl
                ? installationAddressUrl.toString()
                : "";
        }
        return "";
    };

    const ipAddressVersionMissmatchExists = () => {
        const urlObject = toUrl(installationAddress?.value ?? "");

        if (
            urlObject &&
            urlObject.isIP &&
            urlObject.ipVersion &&
            urlObject.ipVersion !== ipAddressVersion
        ) {
            return true;
        }

        return false;
    };

    const isUserNameInputValid = (userName) => {
        // The username is optional, if it is a zero length string
        // mark it as a valid value.
        if (typeof userName === "string" && userName.length >= 0) {
            return true;
        }
        return false;
    };

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

    const ipVersionMissmatchNotification = (
        <InlineNotification
            hideCloseButton
            statusIconDescription="notification"
            subtitle={t(
                "panel.installationParameter.missingRemoteAccessNotificationSubtitle",
                {
                    ns: "panels",
                }
            )}
            title={t(
                "panel.installationParameter.missingRemoteAccessNotificationTitle",
                {
                    ns: "panels",
                }
            )}
            kind="info"
            className="installation-address_ip-version-missmatch-banner"
        />
    );

    const gridContentsMarkupRowOne = (
        <>
            <TextInput
                readOnly={paramFileHasBeenModifiedFromState}
                type="url"
                id="installation-address-input"
                key="installation-address-input"
                invalid={
                    installationAddress ? !installationAddress.valid : false
                }
                invalidText={t("invalidTextLabel", { ns: "common" })}
                maxLength={256}
                labelText={t(
                    "panel.installationParameter.installationAddressTextLabel",
                    {
                        ns: "panels",
                    }
                )}
                helperText={t(
                    "panel.installationParameter.installationAddressHelp",
                    {
                        ns: "panels",
                    }
                )}
                placeholder={t(
                    "panel.installationParameter.installationAddressPlaceholder",
                    { ns: "panels" }
                )}
                className="installation-parameters_installation-address-input"
                value={installationAddress ? installationAddress.value : ""}
                onChange={(url) => {
                    if (paramFileHasBeenModifiedFromState) return;

                    const urlValue = url && url.target ? url.target.value : "";
                    const computedUrlValue = computeInstallationAddress({
                        url: urlValue,
                    });
                    const computedWithPasswordsRemovedUrlValue =
                        computeInstallationAddresWithPasswordsRemoved({
                            url: urlValue,
                        });
                    // while editing we don't update the validity but set it to true
                    // cause we don't want to have the form validation logic kick in.
                    updateInstallationAddress({
                        address: urlValue,
                        computedAddress: computedUrlValue,
                        computedWithPasswordsRemovedAddress:
                            computedWithPasswordsRemovedUrlValue,
                        valid: true,
                    });
                }}
                onBlur={(url) => {
                    if (paramFileHasBeenModifiedFromState) return;

                    const urlValue = url && url.target ? url.target.value : "";
                    const computedUrlValue = computeInstallationAddress({
                        url: urlValue,
                    });
                    const computedWithPasswordsRemovedUrlValue =
                        computeInstallationAddresWithPasswordsRemoved({
                            url: urlValue,
                        });
                    const urlValueIsValid =
                        isInstallationAddressInputValid(urlValue);

                    if (!urlValueIsValid) {
                        updateInstallationAddress({
                            address: urlValue,
                            computedAddress: computedUrlValue,
                            computedWithPasswordsRemovedAddress:
                                computedWithPasswordsRemovedUrlValue,
                            valid: urlValueIsValid,
                        });
                    }

                    document
                        .getElementById(
                            "helpPanelContents_installationParameters_para1"
                        )
                        ?.classList?.remove(
                            "help-panel__installation-parameters__content__active"
                        );
                    document
                        .getElementById(
                            "helpPanelContents_installationParameters_para2"
                        )
                        ?.classList?.remove(
                            "help-panel__installation-parameters__content__active"
                        );
                }}
                onFocus={() => {
                    document
                        .getElementById(
                            "helpPanelContents_installationParameters_para1"
                        )
                        ?.classList?.add(
                            "help-panel__installation-parameters__content__active"
                        );
                    document
                        .getElementById(
                            "helpPanelContents_installationParameters_para2"
                        )
                        ?.classList?.add(
                            "help-panel__installation-parameters__content__active"
                        );
                }}
            />
            {ipAddressVersionMissmatchExists() &&
                ipVersionMissmatchNotification}
        </>
    );

    const gridContentsMarkupRowTwoColumnOne = (
        <div className="installation-parameters_column-left">
            <TextInput
                readOnly={paramFileHasBeenModifiedFromState}
                disabled={state?.userAndPwdAreDisabled ?? true}
                helperText={t("panel.installationParameter.usernameHelp", {
                    ns: "panels",
                })}
                id="username-input"
                key="username-input"
                invalid={
                    state && state.userName ? !state.userName.valid : false
                }
                invalidText={t("invalidTextLabel", { ns: "common" })}
                maxLength={64}
                labelText={t("panel.installationParameter.usernameTextLabel", {
                    ns: "panels",
                })}
                placeholder={t(
                    "panel.installationParameter.usernamePlaceholder",
                    {
                        ns: "panels",
                    }
                )}
                className="installation-parameters_username-input"
                value={state.userName ? state.userName.value : ""}
                onChange={(userName) => {
                    if (paramFileHasBeenModifiedFromState) return;

                    const userNameValue =
                        userName && userName.target
                            ? userName.target.value
                            : "";
                    const computedUrlValue = state.installationAddress
                        ? computeInstallationAddress({
                              url: state.installationAddress.value,
                              uid: userNameValue,
                              clearUid: userNameValue.length === 0,
                          })
                        : "";
                    const computedWithPasswordsRemovedUrlValue =
                        state.installationAddress
                            ? computeInstallationAddresWithPasswordsRemoved({
                                  url: state.installationAddress.value,
                                  uid: userNameValue,
                                  clearUid: userNameValue.length === 0,
                              })
                            : "";
                    // while editing we don't update the validity but set it to true
                    // cause we don't want to have the form validation logic kick in.
                    updateUserName({
                        userName: userNameValue,
                        valid: true,
                    });
                    updateInstallationAddress({
                        address: state?.installationAddress?.value ?? "",
                        computedAddress: computedUrlValue,
                        computedWithPasswordsRemovedAddress:
                            computedWithPasswordsRemovedUrlValue,
                        valid: true,
                    });
                }}
                onBlur={(userName) => {
                    if (paramFileHasBeenModifiedFromState) return;

                    const userNameValue =
                        userName && userName.target
                            ? userName.target.value
                            : "";
                    const computedUrlValue = state.installationAddress
                        ? computeInstallationAddress({
                              url: state.installationAddress.value,
                              uid: userNameValue,
                              clearUid: userNameValue.length === 0,
                          })
                        : "";
                    const computedWithPasswordsRemovedUrlValue =
                        state.installationAddress
                            ? computeInstallationAddresWithPasswordsRemoved({
                                  url: state.installationAddress.value,
                                  uid: userNameValue,
                                  clearUid: userNameValue.length === 0,
                              })
                            : "";
                    const userNameValueIsValid =
                        isUserNameInputValid(userNameValue);

                    if (!userNameValueIsValid) {
                        updateUserName({
                            userName: userNameValue,
                            valid: userNameValueIsValid,
                        });
                        updateInstallationAddress({
                            address: state?.installationAddress?.value ?? "",
                            computedAddress: computedUrlValue,
                            computedWithPasswordsRemovedAddress:
                                computedWithPasswordsRemovedUrlValue,
                            valid: true,
                        });
                    }

                    document
                        .getElementById(
                            "helpPanelContents_installationParameters_para1"
                        )
                        ?.classList?.remove(
                            "help-panel__installation-parameters__content__active"
                        );
                    document
                        .getElementById(
                            "helpPanelContents_installationParameters_para2"
                        )
                        ?.classList?.remove(
                            "help-panel__installation-parameters__content__active"
                        );
                }}
                onFocus={() => {
                    document
                        .getElementById(
                            "helpPanelContents_installationParameters_para1"
                        )
                        ?.classList?.add(
                            "help-panel__installation-parameters__content__active"
                        );
                    document
                        .getElementById(
                            "helpPanelContents_installationParameters_para2"
                        )
                        ?.classList?.add(
                            "help-panel__installation-parameters__content__active"
                        );
                }}
            />
        </div>
    );

    const gridContentsMarkupRowTwoColumnTwo = (
        <div className="installation-parameters_column-right">
            <PasswordInput
                readOnly={paramFileHasBeenModifiedFromState}
                disabled={state?.userAndPwdAreDisabled ?? true}
                type={showPasswords ? "text" : "password"}
                autoComplete="on"
                helperText={t("panel.installationParameter.passwordHelp", {
                    ns: "panels",
                })}
                id="password-input"
                key="password-input"
                invalid={
                    state && state.password ? !state.password.valid : false
                }
                invalidText={t("invalidTextLabel", { ns: "common" })}
                maxLength={64}
                labelText={t("panel.installationParameter.passwordTextLabel", {
                    ns: "panels",
                })}
                placeholder={t(
                    "panel.installationParameter.passwordPlaceholder",
                    {
                        ns: "panels",
                    }
                )}
                className="installation-parameters_password-input"
                value={state.password ? state.password.value : ""}
                onChange={(password) => {
                    if (paramFileHasBeenModifiedFromState) return;

                    const passwordValue =
                        password && password.target
                            ? password.target.value
                            : "";
                    const computedUrlValue = state.installationAddress
                        ? computeInstallationAddress({
                              url: state.installationAddress.value,
                              uid: state?.userName?.value ?? "",
                              clearUid:
                                  typeof state.userName.value !== "string" ||
                                  state.userName.value.length === 0,
                              pwd: passwordValue,
                              clearPwd: passwordValue.length === 0,
                          })
                        : "";
                    const computedWithPasswordsRemovedUrlValue =
                        state.installationAddress
                            ? computeInstallationAddresWithPasswordsRemoved({
                                  url: state.installationAddress.value,
                                  uid: state?.userName?.value ?? "",
                                  clearUid:
                                      typeof state.userName.value !==
                                          "string" ||
                                      state.userName.value.length === 0,
                                  pwd: passwordValue,
                                  clearPwd: passwordValue.length === 0,
                              })
                            : "";
                    // while editing we don't update the validity but set it to true
                    // cause we don't want to have the form validation logic kick in.
                    updatePassword({
                        password: passwordValue,
                        valid: true,
                    });
                    updateInstallationAddress({
                        address: state?.installationAddress?.value ?? "",
                        computedAddress: computedUrlValue,
                        computedWithPasswordsRemovedAddress:
                            computedWithPasswordsRemovedUrlValue,
                        valid: true,
                    });
                }}
                onBlur={(password) => {
                    if (paramFileHasBeenModifiedFromState) return;

                    const passwordValue =
                        password && password.target
                            ? password.target.value
                            : "";
                    const computedUrlValue = state.installationAddress
                        ? computeInstallationAddress({
                              url: state.installationAddress.value,
                              uid: state?.userName?.value ?? "",
                              clearUid:
                                  typeof state.userName.value !== "string" ||
                                  state.userName.value.length === 0,
                              pwd: passwordValue,
                              clearPwd: passwordValue.length === 0,
                          })
                        : "";
                    const computedWithPasswordsRemovedUrlValue =
                        state.installationAddress
                            ? computeInstallationAddresWithPasswordsRemoved({
                                  url: state.installationAddress.value,
                                  uid: state?.userName?.value ?? "",
                                  clearUid:
                                      typeof state.userName.value !==
                                          "string" ||
                                      state.userName.value.length === 0,
                                  pwd: passwordValue,
                                  clearPwd: passwordValue.length === 0,
                              })
                            : "";
                    const passwordValueIsValid =
                        isPasswordInputValid(passwordValue);

                    if (!passwordValueIsValid) {
                        updatePassword({
                            password: passwordValue,
                            valid: passwordValueIsValid,
                        });
                        updateInstallationAddress({
                            address: state?.installationAddress?.value ?? "",
                            computedAddress: computedUrlValue,
                            computedWithPasswordsRemovedAddress:
                                computedWithPasswordsRemovedUrlValue,
                            valid: true,
                        });
                    }

                    document
                        .getElementById(
                            "helpPanelContents_installationParameters_para3"
                        )
                        ?.classList?.remove(
                            "help-panel__installation-parameters__content__active"
                        );
                }}
                onFocus={() => {
                    document
                        .getElementById(
                            "helpPanelContents_installationParameters_para3"
                        )
                        ?.classList?.add(
                            "help-panel__installation-parameters__content__active"
                        );
                }}
            />
        </div>
    );

    const parmfileHasBeenModifiedNotificationMarkup = (
        <ActionableNotification
            hideCloseButton
            inline
            lowContrast
            className="intro_parmfile-purge-banner"
            actionButtonLabel={t("btnLabel.Reset", { ns: "common" })}
            aria-label="closes notification"
            kind="info"
            onActionButtonClick={() => {
                resetParamFileTextAreaData({
                    updateParamFileContent,
                    globalUpdateModified,
                    updateModified,
                    state: globalState,
                });
            }}
            onClose={function noRefCheck() {}}
            onCloseButtonClick={function noRefCheck() {}}
            statusIconDescription="notification"
            subtitle={t("panel.parmFileHasBeenModifiedNotificationSubtitle", {
                ns: "common",
            })}
            title={t("modalHeading.discardParamFileModificationsPrompt")}
        />
    );

    return (
        <Layer className="installation-parameters__layer">
            <FlexGrid className="installation-parameters__grid">
                <Row>
                    <Column>
                        {paramFileHasBeenModifiedFromState &&
                            parmfileHasBeenModifiedNotificationMarkup}
                    </Column>
                </Row>
                <Row>
                    <Column>{gridContentsMarkupRowOne}</Column>
                </Row>
                <Row>
                    <Column>{gridContentsMarkupRowTwoColumnOne}</Column>
                    <Column>{gridContentsMarkupRowTwoColumnTwo}</Column>
                </Row>
                {children.remoteWrapperView}
            </FlexGrid>
        </Layer>
    );
};

InstallationParameters.propTypes = {
    children: PropTypes.object.isRequired,
    paramFileHasBeenModifiedFromState: PropTypes.bool.isRequired,
    installationAddress: PropTypes.object.isRequired,
    userName: PropTypes.object.isRequired,
    password: PropTypes.object.isRequired,
    ipAddressVersion: PropTypes.string.isRequired,
    showPasswords: PropTypes.bool.isRequired,
    distributionName: PropTypes.string.isRequired,
};

export default InstallationParameters;
