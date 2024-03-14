/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { useRef, useEffect } from "react";
import { Trans, useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Button } from "@carbon/react";
import { Close, Copy, LinuxAlt } from "@carbon/icons-react";
import "./_about.scss";

const About = ({ closeNotification, pruneSettings }) => {
  const { t } = useTranslation();

  const buildDate = "BUILD_DATE";
  const commitHashShort = "COMMIT_HASH_SHORT";
  const commitHashLong = "COMMIT_HASH_LONG";

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
              <CopyToClipboard text={buildDate}>
                <Copy size="16" />
              </CopyToClipboard>
            </span>
          </div>
          <div className="about-dialog__about-build-info__commit-hash">
            <span>
              <Trans i18nKey="dialog.about.commitHashLabel">
                Commit hash: <code>{{ commitHashShort }}</code>
              </Trans>
            </span>
            <span title={t("btnLabel.Copy", { ns: "common" })}>
              <CopyToClipboard text={commitHashLong}>
                <Copy size="16" />
              </CopyToClipboard>
            </span>
          </div>
        </div>
      </li>
      <li className="about-dialog__about-report-button-container">
        <Button
          kind="ghost"
          data-title="report"
          id="about-dialog__about-report-button"
          href="BUG_TRACKER"
          target="_blank"
          className="about-dialog__about-report-button"
        >
          <span>{t("dialog.about.reportIssueLabel")}</span>
        </Button>
      </li>
      <li className="about-dialog__about-prune-button-container">
        <Button
          kind="ghost"
          data-title="prune"
          id="about-dialog__about-prune-button"
          onClick={pruneSettings}
          className="about-dialog__about-prune-button"
        >
          <span>{t("dialog.about.pruneSettingsLabel")}</span>
        </Button>
      </li>
    </ul>
  );
};

About.propTypes = {
  closeNotification: PropTypes.func.isRequired,
  pruneSettings: PropTypes.func.isRequired,
};

export default About;
