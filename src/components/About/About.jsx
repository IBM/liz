/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { useRef, useEffect } from "react";
import { Trans, useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Close, Copy, LinuxAlt } from "@carbon/icons-react";
import "./_about.scss";

const About = ({ closeNotification, pruneSettings }) => {
  const { t } = useTranslation();

  const buildDate = "BUILD_DATE";
  const commitHash = "COMMIT_HASH_SHORT";

  const useOutsideAlerter = (ref) => {
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          closeNotification();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  };

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  return (
    <ul
      id="about-dialog__about-menu"
      className="about-dialog__about-menu"
      ref={wrapperRef}
      onBlur={closeNotification}
    >
      <li
        id="about-dialog__about-title"
        className="about-dialog__about__title-section"
      >
        <div className="about-dialog__about__linux-icon">
          <div>
            <LinuxAlt size="48" />
          </div>
        </div>
        <div className="about-dialog__about__info-section">
          <div title="About">{t("dialog.about.headerLabel")}</div>
          <div title={t("header.productName", { ns: "common" })}>
            {t("header.productName", { ns: "common" })}
          </div>
          <div
            title={t("btnLabel.Close", { ns: "common" })}
            className="about-dialog__about__info-section__icon"
            onClick={closeNotification}
          >
            <Close size="16" />
          </div>
        </div>
      </li>
      <li>
        <div className="about-dialog__about-build-info">
          <div className="about-dialog__about-build-info__date">
            <span>
              <Trans i18nKey="dialog.about.buildDateLabel">
                Build date: <code>{{ buildDate }}</code>
              </Trans>
            </span>
            <span title={t("btnLabel.Copy", { ns: "common" })}>
              <CopyToClipboard text="{{buildDate}}">
                <Copy size="16" />
              </CopyToClipboard>
            </span>
          </div>
          <div className="about-dialog__about-build-info__commit-hash">
            <span>
              <Trans i18nKey="dialog.about.commitHashLabel">
                Commit hash: <code>{{ commitHash }}</code>
              </Trans>
            </span>
            <span title={t("btnLabel.Copy", { ns: "common" })}>
              <CopyToClipboard text={{ commitHash }}>
                <Copy size="16" />
              </CopyToClipboard>
            </span>
          </div>
        </div>
      </li>
      <li className="about-dialog__about-report-button-container">
        <a
          href="BUG_TRACKER"
          data-title="report"
          id="about-dialog__about-report-button"
          target="_blank"
        >
          <span>{t("dialog.about.reportIssueLabel")}</span>
        </a>
      </li>
      <li className="about-dialog__about-prune-button-container">
        <a
          href="#"
          data-title="prune"
          id="about-dialog__about-prune-button"
          onClick={pruneSettings}
        >
          <span>{t("dialog.about.pruneSettingsLabel")}</span>
        </a>
      </li>
    </ul>
  );
};

About.propTypes = {
  closeNotification: PropTypes.func.isRequired,
  pruneSettings: PropTypes.func.isRequired,
};

export default About;
