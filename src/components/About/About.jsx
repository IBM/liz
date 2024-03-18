/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { useRef, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Button } from "@carbon/react";
import { Checkmark, Close, Copy, LinuxAlt } from "@carbon/icons-react";
import "./_about.scss";

const About = ({ closeNotification, pruneSettings }) => {
  const { t } = useTranslation();

  const [buildDateBeenCopied, setBuildDateHasBeenCopied] = useState(false);
  const [commitHashHasBeenCopied, setCommitHashHasBeenCopied] = useState(false);
  const [appConfig, setAppConfig] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_URL_PATH_PREFIX}config/app/config.json`,
      );
      const config = await response.json();

      setAppConfig(config);
    };

    fetchData();
  }, []);

  const COPY_TYPE_BUILD_DATE = 0;
  const COPY_TYPE_COMMIT_HASH = 1;

  const updateCopied = (type) => {
    switch (type) {
      case COPY_TYPE_BUILD_DATE:
        setBuildDateHasBeenCopied(true);
        break;
      case COPY_TYPE_COMMIT_HASH:
        setCommitHashHasBeenCopied(true);
        break;
      default:
        break;
    }

    const timer = setTimeout(() => {
      switch (type) {
        case COPY_TYPE_BUILD_DATE:
          setBuildDateHasBeenCopied(false);
          break;
        case COPY_TYPE_COMMIT_HASH:
          setCommitHashHasBeenCopied(false);
          break;
        default:
          break;
      }
    }, 2000);
    return () => clearTimeout(timer);
  };

  const buildDate = appConfig?.config?.buildDate ?? "";
  const commitHashShort = appConfig?.config?.commitHashShort ?? "";
  const commitHashLong = appConfig?.config?.commitHashLong ?? "";
  const bugTrackerUrl = appConfig?.config?.bugTrackerUrl ?? "";
  const knownIssuesUrl = appConfig?.config?.knownIssuesUrl ?? "";

  const buildDateCopyIcon = buildDateBeenCopied ? (
    <Checkmark size="20" />
  ) : (
    <Copy size="20" />
  );
  const commitHashCopyIcon = commitHashHasBeenCopied ? (
    <Checkmark size="20" />
  ) : (
    <Copy size="20" />
  );

  const buildDateCopyClass = buildDateBeenCopied
    ? "about-dialog__about-build-info__date__copied"
    : "about-dialog__about-build-info__date";
  const commitHashCopyClass = commitHashHasBeenCopied
    ? "about-dialog__about-build-info__commit-hash__copied"
    : "about-dialog__about-build-info__commit-hash";

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
          <div className={buildDateCopyClass}>
            <span>
              <Trans i18nKey="dialog.about.buildDateLabel">
                Build date: <code>{{ buildDate }}</code>
              </Trans>
            </span>
            <span title={t("btnLabel.Copy", { ns: "common" })}>
              <CopyToClipboard
                text={buildDate}
                onCopy={() => updateCopied(COPY_TYPE_BUILD_DATE)}
              >
                {buildDateCopyIcon}
              </CopyToClipboard>
            </span>
          </div>
          <div className={commitHashCopyClass}>
            <span>
              <Trans i18nKey="dialog.about.commitHashLabel">
                Commit hash: <code>{{ commitHashShort }}</code>
              </Trans>
            </span>
            <span title={t("btnLabel.Copy", { ns: "common" })}>
              <CopyToClipboard
                text={commitHashLong}
                onCopy={() => updateCopied(COPY_TYPE_COMMIT_HASH)}
              >
                {commitHashCopyIcon}
              </CopyToClipboard>
            </span>
          </div>
        </div>
      </li>
      <li className="about-dialog__about-kissues-button-container">
        <Button
          kind="ghost"
          data-title="report"
          id="about-dialog__about-kissues-button"
          href={knownIssuesUrl}
          target="_blank"
          className="about-dialog__about-kissues-button"
        >
          <span>{t("dialog.about.knownIssuesLabel")}</span>
        </Button>
      </li>
      <li className="about-dialog__about-report-button-container">
        <Button
          kind="ghost"
          data-title="report"
          id="about-dialog__about-report-button"
          href={bugTrackerUrl}
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
