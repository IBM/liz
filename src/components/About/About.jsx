/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, {
  useRef,
  useEffect,
  useContext,
  useState,
  forwardRef,
} from "react";
import { Trans, useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Button, Toggle } from "@carbon/react";
import { Checkmark, Close, Copy, LinuxAlt, Launch } from "@carbon/icons-react";
import { ApplicationContext } from "../../contexts";
import { LIGHT_THEME, DARK_THEME } from "../../util/constants";
import {
  ARROW_KEY_DOWN_EVENT,
  ARROW_KEY_UP_EVENT,
  HOME_KEY_EVENT,
  END_KEY_EVENT,
  ESCAPE_KEY_EVENT,
  TAB_KEY_EVENT,
} from "../../util/event-handler-constants";
import "./_about.scss";

const About = forwardRef(function About(props, ref) {
  const { t } = useTranslation();
  const { closeNotification, pruneSettings } = props;
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

  const buildDateCopyIcon = buildDateBeenCopied ? Checkmark : Copy;
  const commitHashCopyIcon = commitHashHasBeenCopied ? Checkmark : Copy;

  const buildDateCopyClass = buildDateBeenCopied
    ? "about-dialog__about-build-info__date__copied"
    : "about-dialog__about-build-info__date";
  const commitHashCopyClass = commitHashHasBeenCopied
    ? "about-dialog__about-build-info__commit-hash__copied"
    : "about-dialog__about-build-info__commit-hash";
  const buildDateCopyAriaProps = buildDateBeenCopied
    ? {
        "aria-checked": "true",
      }
    : {
        "aria-checked": "false",
      };
  const commitHashCopyAriaProps = commitHashHasBeenCopied
    ? {
        "aria-checked": "true",
      }
    : {
        "aria-checked": "false",
      };
  const externalLinkKnownIssueAriaProps = {
    "aria-describedby": "about-dialog__about-external-link-hint__kissues",
  };
  const externalLinkReportIssueAriaProps = {
    "aria-describedby": "about-dialog__about-external-link-hint__rissues",
  };
  const useLightThemeAriaProps = useOperatingSystemTheme
    ? {
        "aria-readonly": "true",
      }
    : {
        "aria-readonly": "false",
      };

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
    const targetId = event?.target?.id ?? "";
    const relatedTargetId = event?.relatedTarget?.id ?? "";

    if (targetId === "about-dialog__about-menu" && !relatedTargetId) {
      return closeNotification();
    } else if (
      !globalState.isEditing &&
      targetId === "about-dialog__about-prune-button" &&
      relatedTargetId === "liz__skip-to-content"
    ) {
      return closeNotification();
    } else if (
      globalState.isEditing &&
      targetId === "about-dialog__about-report-button" &&
      relatedTargetId === "liz__skip-to-content"
    ) {
      return closeNotification();
    }
  };

  const handleOnKeyDown = (event) => {
    switch (event.code) {
      case ESCAPE_KEY_EVENT:
        event.preventDefault();
        closeNotification();
        break;
    }
  };

  const handleTabElementOnBlur = (event) => {
    const relatedTarget = event.relatedTarget;

    relatedTarget?.focus();
  };

  const handleTabElementOnKeyDown = (event) => {
    if (event.code && event.code === TAB_KEY_EVENT) {
      return;
    }

    event.stopPropagation();

    const target = event.target;
    const menu = document.getElementById("about-dialog__about-menu");

    if (
      target.dataset &&
      target.dataset.a11yPrevious &&
      target.dataset.a11yNext &&
      menu.dataset &&
      menu.dataset.a11yFirst &&
      menu.dataset.a11yLast
    ) {
      const previous = document.getElementById(target.dataset.a11yPrevious);
      const next = document.getElementById(target.dataset.a11yNext);
      const first = document.getElementById(menu.dataset.a11yFirst);
      const last = document.getElementById(menu.dataset.a11yLast);

      switch (event.code) {
        case ARROW_KEY_UP_EVENT:
          event.preventDefault();
          previous?.focus();
          break;
        case ARROW_KEY_DOWN_EVENT:
          event.preventDefault();
          next?.focus();
          break;
        case END_KEY_EVENT:
          event.preventDefault();
          last?.focus();
          break;
        case HOME_KEY_EVENT:
          event.preventDefault();
          first?.focus();
          break;
        case ESCAPE_KEY_EVENT:
          event.preventDefault();
          closeNotification();
          break;
      }
    }
  };

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  return (
    <ul
      tabIndex="0"
      id="about-dialog__about-menu"
      className="about-dialog__about-menu"
      ref={wrapperRef}
      role="menu"
      aria-orientation="vertical"
      aria-label={t("header.button.profileSettings")}
      onBlur={handleOnBlur}
      onKeyDown={handleOnKeyDown}
      data-a11y-first="about-dialog__close-button"
      data-a11y-last={
        !globalState.isEditing
          ? "about-dialog__about-prune-button"
          : "about-dialog__about-report-button"
      }
    >
      <li
        id="about-dialog__about-title"
        className="about-dialog__about__title-section"
        aria-owns="about-dialog__about__title-section-group"
        role="none"
      >
        <div
          className="about-dialog__about__title-section-group"
          id="about-dialog__about__title-section-group"
          role="group"
        >
          <div className="about-dialog__about__linux-icon">
            <div role="presentation">
              <LinuxAlt size="48" />
            </div>
          </div>
          <div className="about-dialog__about__info-section">
            <div
              title={t("dialog.about.headerLabel")}
              className="about-dialog__about__info-section__app-title"
            >
              {t("dialog.about.headerLabel")}
            </div>
            <div
              title={t("header.productName", { ns: "common" })}
              className="about-dialog__about__info-section__app-subtitle"
            >
              {t("header.productName", { ns: "common" })}
            </div>
            <div className="about-dialog__about__info-section__icon">
              <Button
                ref={ref}
                hasIconOnly
                size="sm"
                kind="ghost"
                id="about-dialog__close-button"
                iconDescription={t("btnLabel.Close", { ns: "common" })}
                onClick={closeNotification}
                onBlur={handleTabElementOnBlur}
                onKeyDown={handleTabElementOnKeyDown}
                renderIcon={Close}
                tooltipPosition="left"
                data-a11y-previous={
                  !globalState.isEditing
                    ? "about-dialog__about-prune-button"
                    : "about-dialog__about-report-button"
                }
                data-a11y-next="about-dialog__copy-button__build-date"
              />
            </div>
          </div>
        </div>
      </li>
      <li
        id="about-dialog__about-build-info"
        role="none"
        aria-owns="about-dialog__about-build-info-group"
      >
        <div
          className="about-dialog__about-build-info"
          id="about-dialog__about-build-info-group"
          role="group"
        >
          <div className={buildDateCopyClass}>
            <div className="about-dialog__about-build-info__date__left-column">
              <Trans i18nKey="dialog.about.buildDateLabel">
                <span>Build date:</span>
                <code role="presentation">{{ buildDate }}</code>
              </Trans>
            </div>
            <div className="about-dialog__about-build-info__date__right-column">
              <CopyToClipboard
                text={buildDate}
                onCopy={() => updateCopied(COPY_TYPE_BUILD_DATE)}
              >
                <Button
                  hasIconOnly
                  size="sm"
                  kind="ghost"
                  id="about-dialog__copy-button__build-date"
                  iconDescription={t("btnLabel.Copy", { ns: "common" })}
                  onClick={function noRefCheck() {}}
                  onBlur={handleTabElementOnBlur}
                  onKeyDown={handleTabElementOnKeyDown}
                  renderIcon={buildDateCopyIcon}
                  role="menuitemcheckbox"
                  data-a11y-previous="about-dialog__close-button"
                  data-a11y-next="about-dialog__copy-button__commit-hash"
                  {...buildDateCopyAriaProps}
                />
              </CopyToClipboard>
            </div>
          </div>
          <div className={commitHashCopyClass}>
            <div className="about-dialog__about-build-info__hash__left-column">
              <Trans i18nKey="dialog.about.commitHashLabel">
                <span>Commit hash:</span>
                <code role="presentation">{{ commitHashShort }}</code>
              </Trans>
            </div>
            <div className="about-dialog__about-build-info__hash__right-column">
              <CopyToClipboard
                text={commitHashLong}
                onCopy={() => updateCopied(COPY_TYPE_COMMIT_HASH)}
              >
                <Button
                  hasIconOnly
                  size="sm"
                  kind="ghost"
                  id="about-dialog__copy-button__commit-hash"
                  iconDescription={t("btnLabel.Copy", { ns: "common" })}
                  onClick={function noRefCheck() {}}
                  onBlur={handleTabElementOnBlur}
                  onKeyDown={handleTabElementOnKeyDown}
                  renderIcon={commitHashCopyIcon}
                  role="menuitemcheckbox"
                  data-a11y-previous="about-dialog__copy-button__build-date"
                  data-a11y-next="about-dialog__theme-toggle"
                  {...commitHashCopyAriaProps}
                />
              </CopyToClipboard>
            </div>
          </div>
          <div className="about-dialog__about-build-info__theme">
            <div
              id="about-dialog__theme-toggle-label"
              className="about-dialog__about-build-info__theme__left-column"
            >
              {t("dialog.about.themeLabel")}:
            </div>
            <div className="about-dialog__about-build-info__theme__right-column">
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
                onBlur={handleTabElementOnBlur}
                onKeyDown={handleTabElementOnKeyDown}
                data-a11y-previous="about-dialog__copy-button__commit-hash"
                data-a11y-next="about-dialog__theme-from-os-toggle"
                role="menuitemradio"
                {...useLightThemeAriaProps}
              />
            </div>
          </div>
          <div className="about-dialog__about-build-info__theme">
            <div
              id="about-dialog__theme-from-os-toggle-label"
              className="about-dialog__about-build-info__theme__leftcolumn"
            >
              {t("dialog.about.themeFromOsLabel")}:
            </div>
            <div className="about-dialog__about-build-info__theme__right-column">
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
                onBlur={handleTabElementOnBlur}
                onKeyDown={handleTabElementOnKeyDown}
                data-a11y-previous="about-dialog__theme-toggle"
                data-a11y-next="about-dialog__about-kissues-button"
                role="menuitemradio"
              />
            </div>
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
          onBlur={handleTabElementOnBlur}
          onKeyDown={handleTabElementOnKeyDown}
          data-a11y-previous="about-dialog__theme-from-os-toggle"
          data-a11y-next="about-dialog__about-report-button"
          renderIcon={Launch}
          iconDescription={t("dialog.about.knownIssuesLabel")}
          {...externalLinkKnownIssueAriaProps}
        >
          <span>{t("dialog.about.knownIssuesLabel")}</span>
          <span
            className="about-dialog__about-external-link-hint"
            id="about-dialog__about-external-link-hint__kissues"
          >
            {t("dialog.about.externalLinkHint")}
          </span>
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
          onBlur={handleTabElementOnBlur}
          onKeyDown={handleTabElementOnKeyDown}
          data-a11y-previous="about-dialog__about-kissues-button"
          data-a11y-next={
            !globalState.isEditing
              ? "about-dialog__about-prune-button"
              : "about-dialog__close-button"
          }
          renderIcon={Launch}
          iconDescription={t("dialog.about.reportIssueLabel")}
          {...externalLinkReportIssueAriaProps}
        >
          <span>{t("dialog.about.reportIssueLabel")}</span>
          <span
            className="about-dialog__about-external-link-hint"
            id="about-dialog__about-external-link-hint__rissues"
          >
            {t("dialog.about.externalLinkHint")}
          </span>
        </Button>
      </li>
      {!globalState.isEditing && (
        <li className="about-dialog__about-prune-button-container" role="none">
          <Button
            kind="ghost"
            data-title="prune"
            id="about-dialog__about-prune-button"
            onClick={pruneSettings}
            onBlur={handleTabElementOnBlur}
            onKeyDown={handleTabElementOnKeyDown}
            className="about-dialog__about-prune-button"
            data-a11y-previous="about-dialog__about-report-button"
            data-a11y-next="about-dialog__close-button"
          >
            <span>{t("dialog.about.pruneSettingsLabel")}</span>
          </Button>
        </li>
      )}
    </ul>
  );
});

About.propTypes = {
  closeNotification: PropTypes.func.isRequired,
  pruneSettings: PropTypes.func.isRequired,
};

export default About;
