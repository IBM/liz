/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Toggle } from "@carbon/react";
import { InstallationParameterContext } from "../../../../../../contexts";
import "../../../_installation-parameters.scss";

const SshView = ({ paramFileHasBeenModifiedFromState, useSshToggled }) => {
    const { updateUseSsh } = React.useContext(InstallationParameterContext);
    const { t } = useTranslation();

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
        </div>
    );
};

SshView.propTypes = {
    paramFileHasBeenModifiedFromState: PropTypes.bool.isRequired,
    useSshToggled: PropTypes.bool.isRequired,
};

export default SshView;
