/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Toggle, PasswordInput } from "@carbon/react";
import { InstallationParameterContext } from "../../../../../../contexts";
import "../../../_installation-parameters.scss";

const SshView = ({
    paramFileHasBeenModifiedFromState,
    useSshToggled,
    sshPassword,
    showPasswords,
    isPasswordInputValid,
}) => {
    const { t } = useTranslation();
    const { updateUseSsh, updateSshPassword } = React.useContext(
        InstallationParameterContext
    );

    return (
        <div className="installation-parameters_column-right">
            <Toggle
                readOnly={paramFileHasBeenModifiedFromState}
                labelText={t("panel.installationParameter.sshToggleTextLabel", {
                    ns: "panels",
                })}
                labelA={t("btnLabel.No", { ns: "common" })}
                labelB={t("btnLabel.Yes", { ns: "common" })}
                id="ssh-toggle"
                toggled={useSshToggled}
                onToggle={() => {
                    if (paramFileHasBeenModifiedFromState) return;

                    if (useSshToggled) {
                        updateUseSsh(false);
                    } else {
                        updateUseSsh(true);
                    }
                }}
                onFocus={() => {
                    document
                        .getElementById(
                            "helpPanelContents_installationParameters_para6"
                        )
                        ?.classList?.add(
                            "help-panel__installation-parameters__content__active"
                        );
                }}
                onBlur={() => {
                    document
                        .getElementById(
                            "helpPanelContents_installationParameters_para6"
                        )
                        ?.classList?.remove(
                            "help-panel__installation-parameters__content__active"
                        );
                }}
            />
            {useSshToggled && (
                <PasswordInput
                    readOnly={paramFileHasBeenModifiedFromState}
                    type={showPasswords ? "text" : "password"}
                    autoComplete="on"
                    helperText={t(
                        "panel.installationParameter.sshPasswordHelp",
                        {
                            ns: "panels",
                        }
                    )}
                    id="ssh-password-input"
                    invalid={sshPassword ? !sshPassword.valid : false}
                    invalidText={t("invalidTextLabel", { ns: "common" })}
                    maxLength={64}
                    labelText={t(
                        "panel.installationParameter.sshPasswordTextLabelNoOptional",
                        {
                            ns: "panels",
                        }
                    )}
                    placeholder={t(
                        "panel.installationParameter.sshPasswordPlaceholder",
                        {
                            ns: "panels",
                        }
                    )}
                    value={sshPassword ? sshPassword.value : ""}
                    onChange={(password) => {
                        if (paramFileHasBeenModifiedFromState) return;

                        const passwordValue =
                            password && password.target
                                ? password.target.value
                                : "";

                        updateSshPassword({
                            password: passwordValue,
                            valid: true,
                        });
                    }}
                    onBlur={(password) => {
                        const passwordValue =
                            password && password.target
                                ? password.target.value
                                : "";
                        const passwordValueIsValid =
                            isPasswordInputValid(passwordValue);

                        updateSshPassword({
                            password: passwordValue,
                            valid: passwordValueIsValid,
                        });

                        document
                            .getElementById(
                                "helpPanelContents_installationParameters_para3"
                            )
                            ?.classList?.remove(
                                "help-panel__installation-parameters__content__active"
                            );
                        document
                            .getElementById(
                                "helpPanelContents_installationParameters_para6"
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
                        document
                            .getElementById(
                                "helpPanelContents_installationParameters_para6"
                            )
                            ?.classList?.add(
                                "help-panel__installation-parameters__content__active"
                            );
                    }}
                />
            )}
        </div>
    );
};

SshView.propTypes = {
    paramFileHasBeenModifiedFromState: PropTypes.bool.isRequired,
    useSshToggled: PropTypes.bool.isRequired,
    showPasswords: PropTypes.bool.isRequired,
    isPasswordInputValid: PropTypes.func.isRequired,
    sshPassword: PropTypes.object,
};

export default SshView;
