/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { CodeSnippet, Layer } from "@carbon/react";
import { Decorator } from "@carbon/ibm-products";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { DISTRIBUTION_LIST, VERSION_LIST } from "../../../../../util/constants";
import "./_parmfile.scss";

const Parmfile = ({
    parmfile,
    parmfileWithPasswordsRemoved,
    distributionName,
    distributionVersion,
}) => {
    const { t } = useTranslation();

    // eslint-disable-next-line no-unused-vars
    const [parmfileHasBeenCopied, setParmfileHasBeenCopied] = useState(false);

    const updateCopied = () => {
        setParmfileHasBeenCopied(true);

        const timer = setTimeout(() => {
            setParmfileHasBeenCopied(false);
        }, 2000);
        return () => clearTimeout(timer);
    };

    const linuxDistributionLabel = t(
        "panel.inputFileSelection.chooseDistributionFromeTemplate",
        { ns: "panels" }
    );
    const linuxVersionLabel = t(
        "panel.inputFileSelection.chooseVersionFromeTemplate",
        {
            ns: "panels",
        }
    );
    const distributionNameText = distributionName
        ? DISTRIBUTION_LIST.find((x) => x.id === distributionName).label
        : "";
    const distributionVersionText =
        distributionName && distributionVersion
            ? VERSION_LIST[distributionName].find(
                  (x) => x.id === distributionVersion
              ).label
            : "";

    const parmfileInformation = (
        <div className="parmfile-card__codesnippet-container">
            <div className="parmfile-card__linux-distro-info-text">
                {t("landingPage.expressiveCard.distributionInformation", {
                    ns: "translation",
                })}
            </div>
            <div className="parmfile-card__linux-distro-info">
                <Decorator
                    label={linuxDistributionLabel}
                    score={5}
                    value={distributionNameText}
                />
            </div>
            <div className="parmfile-card__linux-distro-info">
                <Decorator
                    label={linuxVersionLabel}
                    score={5}
                    value={distributionVersionText}
                />
            </div>
            <div className="parmfile-card__linux-distro-info-text">
                {t("panel.downloadParamFile.paramFileTextLabel", {
                    ns: "panels",
                })}
            </div>
            <div className="parmfile-card__codesnippet-contents">
                <CopyToClipboard text={parmfile} onCopy={() => updateCopied()}>
                    <Layer>
                        <CodeSnippet
                            type="multi"
                            feedback={t("copied.long", { ns: "common" })}
                        >
                            {parmfileWithPasswordsRemoved}
                        </CodeSnippet>
                    </Layer>
                </CopyToClipboard>
            </div>
        </div>
    );

    return <>{parmfileInformation}</>;
};

Parmfile.propTypes = {
    parmfile: PropTypes.string,
    parmfileWithPasswordsRemoved: PropTypes.string,
    distributionName: PropTypes.string,
    distributionVersion: PropTypes.string,
};

export default Parmfile;
