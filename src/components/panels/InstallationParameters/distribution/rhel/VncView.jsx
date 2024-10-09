/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Toggle, PasswordInput } from "@carbon/react";
import { InstallationParameterContext } from "../../../../../contexts";
import "../../_installation-parameters.scss";

const VncView = ({
    paramFileHasBeenModifiedFromState,
    useVncToggled,
    showPasswords,
    vncPassword,
    isPasswordInputValid,
}) => {
    const { t } = useTranslation();
    const { updateUseVnc, updateVncPassword } = React.useContext(
        InstallationParameterContext
    );

    return (
        <div className="installation-parameters_column-left">
            <Toggle
                readOnly={paramFileHasBeenModifiedFromState}
                labelText={t("panel.installationParameter.vncToggleTextLabel", {
                    ns: "panels",
                })}
                labelA={t("btnLabel.No", { ns: "common" })}
                labelB={t("btnLabel.Yes", { ns: "common" })}
                id="vnc-toggle"
                toggled={useVncToggled}
                onToggle={() => {
                    if (paramFileHasBeenModifiedFromState) return;

                    if (useVncToggled) {
                        updateUseVnc(false);
                    } else {
                        updateUseVnc(true);
                    }
                }}
                onFocus={() => {
                    document
                        .getElementById(
                            "helpPanelContents_installationParameters_para4"
                        )
                        ?.classList?.add(
                            "help-panel__installation-parameters__content__active"
                        );
                    document
                        .getElementById(
                            "helpPanelContents_installationParameters_para5"
                        )
                        ?.classList?.add(
                            "help-panel__installation-parameters__content__active"
                        );
                }}
                onBlur={() => {
                    document
                        .getElementById(
                            "helpPanelContents_installationParameters_para4"
                        )
                        ?.classList?.remove(
                            "help-panel__installation-parameters__content__active"
                        );
                    document
                        .getElementById(
                            "helpPanelContents_installationParameters_para5"
                        )
                        ?.classList?.remove(
                            "help-panel__installation-parameters__content__active"
                        );
                }}
            />
            {useVncToggled && (
                <PasswordInput
                    readOnly={paramFileHasBeenModifiedFromState}
                    type={showPasswords ? "text" : "password"}
                    autoComplete="on"
                    helperText={t(
                        "panel.installationParameter.vncPasswordHelp",
                        {
                            ns: "panels",
                        }
                    )}
                    id="vnc-password-input"
                    invalid={vncPassword ? !vncPassword.valid : false}
                    invalidText={t("invalidTextLabel", { ns: "common" })}
                    maxLength={64}
                    labelText={t(
                        "panel.installationParameter.vncPasswordTextLabel",
                        {
                            ns: "panels",
                        }
                    )}
                    placeholder={t(
                        "panel.installationParameter.vncPasswordPlaceholder",
                        {
                            ns: "panels",
                        }
                    )}
                    value={vncPassword ? vncPassword.value : ""}
                    onChange={(password) => {
                        if (paramFileHasBeenModifiedFromState) return;

                        const passwordValue =
                            password && password.target
                                ? password.target.value
                                : "";

                        updateVncPassword({
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

                        updateVncPassword({
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
                                "helpPanelContents_installationParameters_para4"
                            )
                            ?.classList?.remove(
                                "help-panel__installation-parameters__content__active"
                            );
                        document
                            .getElementById(
                                "helpPanelContents_installationParameters_para5"
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
                                "helpPanelContents_installationParameters_para4"
                            )
                            ?.classList?.add(
                                "help-panel__installation-parameters__content__active"
                            );
                        document
                            .getElementById(
                                "helpPanelContents_installationParameters_para5"
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

VncView.propTypes = {
    paramFileHasBeenModifiedFromState: PropTypes.bool.isRequired,
    useVncToggled: PropTypes.bool.isRequired,
    showPasswords: PropTypes.bool.isRequired,
    isPasswordInputValid: PropTypes.func.isRequired,
    vncPassword: PropTypes.object,
};

export default VncView;
