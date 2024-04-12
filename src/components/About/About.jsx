/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { useRef, useEffect, useContext, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Button, Toggle } from "@carbon/react";
import { Checkmark, Close, Copy, LinuxAlt } from "@carbon/icons-react";
import { ApplicationContext } from "../../contexts";
import { LIGHT_THEME, DARK_THEME } from "../../util/constants";
import "./_about.scss";

const About = ({ closeNotification, pruneSettings }) => {
  const { t } = useTranslation();
  const {
    state: globalState,
    updateTheme,
    updateUseOperatingSystemTheme,
  } = useContext(ApplicationContext);

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
  const theme = globalState?.theme ?? LIGHT_THEME;
  const useLightTheme = theme === LIGHT_THEME;
  const useOperatingSystemTheme = globalState?.useOperatingSystemTheme ?? false;

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
  const toggleElementId = [
    "about-dialog__theme-toggle",
    "about-dialog__theme-from-os-toggle",
  ];

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

  const handleOnBlur = (event) => {
    const onBlurTarget = event.target;

    // the toggle seems to be lossing its focuse once
    // the theme changes thus the manual chack below.
    if (toggleElementId.indexOf(onBlurTarget.id) < 0) {
      closeNotification();
    }
  };

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  return (
    <ul
      id="about-dialog__about-menu"
      className="about-dialog__about-menu"
      ref={wrapperRef}
      role="menu"
      aria-label={t("header.button.profileSettings")}
      onBlur={handleOnBlur}
    >
      <li
        id="about-dialog__about-title"
        className="about-dialog__about__title-section"
        role="none"
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
      <li id="about-dialog__about-build-info" role="none">
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
          <div className="about-dialog__about-build-info__theme">
            <span id="about-dialog__theme-toggle-label">
              {t("dialog.about.themeLabel")}:
            </span>
            <span>
              <Toggle
                size="sm"
                readOnly={useOperatingSystemTheme}
                aria-labelledby="about-dialog__theme-toggle-label"
                labelA={t("dialog.about.darkThemeLabel")}
                labelB={t("dialog.about.lightThemeLabel")}
                id="about-dialog__theme-toggle"
                toggled={useLightTheme}
                onToggle={() => {
                  if (useLightTheme) {
                    updateTheme(DARK_THEME);
                  } else {
                    updateTheme(LIGHT_THEME);
                  }
                }}
              />
            </span>
          </div>
          <div className="about-dialog__about-build-info__theme">
            <span id="about-dialog__theme-from-os-toggle-label">
              {t("dialog.about.themeFromOsLabel")}:
            </span>
            <span>
              <Toggle
                size="sm"
                aria-labelledby="about-dialog__theme-from-os-toggle-label"
                labelA={t("btnLabel.No", { ns: "common" })}
                labelB={t("btnLabel.Yes", { ns: "common" })}
                id="about-dialog__theme-from-os-toggle"
                toggled={useOperatingSystemTheme}
                onToggle={() => {
                  const dataset = document.documentElement.dataset;
                  const osThemeUsesDarkMode =
                    window.matchMedia &&
                    window.matchMedia("(prefers-color-scheme: dark)").matches;
                  const osThemeUsesLightMode =
                    window.matchMedia &&
                    window.matchMedia("(prefers-color-scheme: light)").matches;

                  if (useOperatingSystemTheme) {
                    dataset.useOperatingSystemTheme = "false";
                    updateUseOperatingSystemTheme(false);
                  } else {
                    osThemeUsesDarkMode && updateTheme(DARK_THEME);
                    osThemeUsesLightMode && updateTheme(LIGHT_THEME);
                    dataset.useOperatingSystemTheme = "true";
                    updateUseOperatingSystemTheme(true);
                  }
                }}
              />
            </span>
          </div>
        </div>
      </li>
      <li className="about-dialog__about-kissues-button-container" role="none">
        <Button
          kind="ghost"
          data-title="report"
          id="about-dialog__about-kissues-button"
          href={knownIssuesUrl}
          target="_blank"
          className="about-dialog__about-kissues-button"
          role="menuitem"
        >
          <span>{t("dialog.about.knownIssuesLabel")}</span>
        </Button>
      </li>
      <li className="about-dialog__about-report-button-container" role="none">
        <Button
          kind="ghost"
          data-title="report"
          id="about-dialog__about-report-button"
          href={bugTrackerUrl}
          target="_blank"
          className="about-dialog__about-report-button"
          role="menuitem"
        >
          <span>{t("dialog.about.reportIssueLabel")}</span>
        </Button>
      </li>
      {!globalState.isEditing && (
        <li className="about-dialog__about-prune-button-container" role="none">
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
      )}
    </ul>
  );
};

About.propTypes = {
  closeNotification: PropTypes.func.isRequired,
  pruneSettings: PropTypes.func.isRequired,
};

export default About;
