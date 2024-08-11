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
import { useHref } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Button, Toggle, Tooltip } from "@carbon/react";
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
import PathConstants from "../../util/path-constants";
import "./_about.scss";

const About = forwardRef(function About(props, ref) {
    const { t } = useTranslation();
    const { closeNotification, pruneSettings } = props;
    const settingsPageHref = useHref(PathConstants.SETTINGS);
    const {
        config,
        state: globalState,
        updateTheme,
        updateUseOperatingSystemTheme,
        updateShowPasswords,
    } = useContext(ApplicationContext);

    const [buildDateBeenCopied, setBuildDateHasBeenCopied] = useState(false);
    const [commitHashHasBeenCopied, setCommitHashHasBeenCopied] =
        useState(false);
    const { appConfig } = config || {
        appConfig: {},
    };

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
    const useOperatingSystemTheme =
        globalState?.useOperatingSystemTheme ?? false;
    const showPasswords = globalState?.showPasswords ?? false;

    const buildDateCopyIcon = buildDateBeenCopied ? Checkmark : Copy;
    const commitHashCopyIcon = commitHashHasBeenCopied ? Checkmark : Copy;

    const buildDateCopyClass = buildDateBeenCopied
        ? "about-dialog__about-build-info__date about-dialog__about-build-info__value-copied"
        : "about-dialog__about-build-info__date";
    const commitHashCopyClass = commitHashHasBeenCopied
        ? "about-dialog__about-build-info__commit-hash about-dialog__about-build-info__value-copied"
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
    const externalLinkSettingsAriaProps = {
        "aria-describedby": "about-dialog__about-internal-link-hint__settings",
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
            targetId === "about-dialog__about-menu" &&
            relatedTargetId === "liz__installer-header_global-action__profile"
        ) {
            return closeNotification();
        } else if (
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
            const previous = document.getElementById(
                target.dataset.a11yPrevious
            );
            const next = document.getElementById(target.dataset.a11yNext);
            const first = document.getElementById(menu.dataset.a11yFirst);
            const last = document.getElementById(menu.dataset.a11yLast);

            const skipToContent = document.getElementById(
                "liz__skip-to-content"
            );

            switch (event.code) {
                case TAB_KEY_EVENT:
                    if (
                        !event.shiftKey &&
                        target.id === "about-dialog__about-report-button"
                    ) {
                        skipToContent?.focus();
                    }
                    break;
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

    const pruneButtonMarkup = (
        <Button
            disabled={globalState.isEditing}
            kind="danger--ghost"
            size="sm"
            data-title="prune"
            id="about-dialog__about-prune-button"
            role="menuitem"
            onClick={pruneSettings}
            onBlur={handleTabElementOnBlur}
            onKeyDown={handleTabElementOnKeyDown}
            className="about-dialog__about-menu-item__button"
            data-a11y-previous="about-dialog__about-settings-button"
            data-a11y-next="about-dialog__show-passwords-toggle"
        >
            <span>{t("dialog.about.pruneSettingsLabel")}</span>
        </Button>
    );

    const pruneButtonTooltipMarkup = globalState.isEditing ? (
        <Tooltip align="top" label={t("dialog.about.pruneSettingsTooltip")}>
            {pruneButtonMarkup}
        </Tooltip>
    ) : (
        pruneButtonMarkup
    );

    const settingsButtonMarkup = (
        <Button
            disabled={globalState.isEditing}
            kind="ghost"
            size="sm"
            data-title="report"
            id="about-dialog__about-settings-button"
            href={settingsPageHref}
            onClick={closeNotification}
            className="about-dialog__about-menu-item__button"
            role="menuitem"
            onBlur={handleTabElementOnBlur}
            onKeyDown={handleTabElementOnKeyDown}
            data-a11y-previous="about-dialog__copy-button__commit-hash"
            data-a11y-next={
                !globalState.isEditing
                    ? "about-dialog__about-prune-button"
                    : "about-dialog__show-passwords-toggle"
            }
            iconDescription={t("dialog.about.settingsLabel")}
            {...externalLinkSettingsAriaProps}
        >
            <span>{t("dialog.about.settingsLabel")}</span>
            <span
                className="about-dialog__about-internal-link-hint"
                id="about-dialog__about-internal-link-hint__settings"
            >
                {t("dialog.about.internalLinkHint")}
            </span>
        </Button>
    );

    const settingsButtonTooltipMarkup = globalState.isEditing ? (
        <Tooltip align="top" label={t("dialog.about.pruneSettingsTooltip")}>
            {settingsButtonMarkup}
        </Tooltip>
    ) : (
        settingsButtonMarkup
    );

    return (
        <div
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
            <ul
                id="about-dialog__about-menu__title-options"
                aria-label={t("dialog.about.ariaLabel.applicationInformation")}
                role="group"
                className="about-dialog__panel-group"
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
                    </div>
                    <div className="about-dialog__about__info-section">
                        <div
                            title={t("dialog.about.headerLabel")}
                            className="about-dialog__about__info-section__app-title"
                        >
                            {t("dialog.about.headerLabel")}
                        </div>
                        <div
                            title={t("header.productName.appName", {
                                ns: "common",
                            })}
                            className="about-dialog__about__info-section__app-subtitle"
                        >
                            {t("header.productName.appName", { ns: "common" })}
                        </div>
                        <div
                            title={t("header.productName.productFragment", {
                                ns: "common",
                            })}
                            className="about-dialog__about__info-section__app-subtitle"
                        >
                            {t("header.productName.productFragment", {
                                ns: "common",
                            })}
                        </div>
                        <div className="about-dialog__about__info-section__icon">
                            <Button
                                ref={ref}
                                hasIconOnly
                                size="sm"
                                kind="ghost"
                                id="about-dialog__close-button"
                                iconDescription={t("btnLabel.Close", {
                                    ns: "common",
                                })}
                                onClick={closeNotification}
                                onBlur={handleTabElementOnBlur}
                                onKeyDown={handleTabElementOnKeyDown}
                                renderIcon={Close}
                                tooltipPosition="left"
                                data-a11y-previous="about-dialog__about-report-button"
                                data-a11y-next="about-dialog__copy-button__build-date"
                            />
                        </div>
                    </div>
                </li>
            </ul>
            <hr className="about-dialog__panel-divider" />
            <ul
                id="about-dialog__about-menu__settings-options"
                aria-label={t("dialog.about.ariaLabel.applicationOptions")}
                role="group"
                className="about-dialog__panel-group"
            >
                <li className="about-dialog__about-build-info" role="none">
                    <div className={buildDateCopyClass}>
                        {t("dialog.about.buildDateLabel")}
                        <div className="about-dialog__about-build-info__value">
                            <code role="presentation">{buildDate}</code>
                            <CopyToClipboard
                                text={buildDate}
                                onCopy={() =>
                                    updateCopied(COPY_TYPE_BUILD_DATE)
                                }
                            >
                                <Button
                                    hasIconOnly
                                    size="sm"
                                    kind="ghost"
                                    id="about-dialog__copy-button__build-date"
                                    className="about-dialog__copy-button"
                                    iconDescription={t("btnLabel.Copy", {
                                        ns: "common",
                                    })}
                                    onClick={function noRefCheck() {}}
                                    onBlur={handleTabElementOnBlur}
                                    onKeyDown={handleTabElementOnKeyDown}
                                    tooltipPosition="left"
                                    renderIcon={buildDateCopyIcon}
                                    role="menuitemcheckbox"
                                    data-a11y-previous="about-dialog__close-button"
                                    data-a11y-next="about-dialog__copy-button__commit-hash"
                                    {...buildDateCopyAriaProps}
                                />
                            </CopyToClipboard>
                        </div>
                    </div>
                </li>
                <li className="about-dialog__about-build-info" role="none">
                    <div className={commitHashCopyClass}>
                        {t("dialog.about.commitHashLabel")}
                        <div className="about-dialog__about-build-info__value">
                            <code role="presentation">{commitHashShort}</code>
                            <CopyToClipboard
                                text={commitHashLong}
                                onCopy={() =>
                                    updateCopied(COPY_TYPE_COMMIT_HASH)
                                }
                            >
                                <Button
                                    hasIconOnly
                                    size="sm"
                                    kind="ghost"
                                    id="about-dialog__copy-button__commit-hash"
                                    className="about-dialog__copy-button"
                                    iconDescription={t("btnLabel.Copy", {
                                        ns: "common",
                                    })}
                                    onClick={function noRefCheck() {}}
                                    onBlur={handleTabElementOnBlur}
                                    onKeyDown={handleTabElementOnKeyDown}
                                    tooltipPosition="left"
                                    renderIcon={commitHashCopyIcon}
                                    role="menuitemcheckbox"
                                    data-a11y-previous="about-dialog__copy-button__build-date"
                                    data-a11y-next={
                                        !globalState.isEditing
                                            ? "about-dialog__about-settings-button"
                                            : "about-dialog__show-passwords-toggle"
                                    }
                                    {...commitHashCopyAriaProps}
                                />
                            </CopyToClipboard>
                        </div>
                    </div>
                </li>
                <li className="about-dialog__about-menu-item" role="none">
                    {settingsButtonTooltipMarkup}
                </li>
                <li
                    className={
                        globalState.isEditing
                            ? "about-dialog__about-menu-item"
                            : "about-dialog__about-menu-item about-dialog__about-menu-item-danger"
                    }
                    role="none"
                >
                    {pruneButtonTooltipMarkup}
                </li>
                <li className="about-dialog__about-build-info" role="none">
                    <div className="about-dialog__about-build-info__show-passwords">
                        {t("dialog.about.showPasswordsLabel")}
                        <div className="about-dialog__about-build-info__value">
                            <Toggle
                                size="sm"
                                aria-labelledby="about-dialog__show-passwords-toggle-label"
                                labelA={t("btnLabel.No", { ns: "common" })}
                                labelB={t("btnLabel.Yes", { ns: "common" })}
                                id="about-dialog__show-passwords-toggle"
                                toggled={showPasswords}
                                onToggle={() => {
                                    if (showPasswords) {
                                        updateShowPasswords(false);
                                    } else {
                                        updateShowPasswords(true);
                                    }
                                }}
                                onBlur={handleTabElementOnBlur}
                                onKeyDown={handleTabElementOnKeyDown}
                                data-a11y-previous={
                                    !globalState.isEditing
                                        ? "about-dialog__about-prune-button"
                                        : "about-dialog__copy-button__commit-hash"
                                }
                                data-a11y-next="about-dialog__theme-toggle"
                                role="menuitemradio"
                            />
                        </div>
                    </div>
                </li>
                <li className="about-dialog__about-build-info" role="none">
                    <div className="about-dialog__about-build-info__theme">
                        {t("dialog.about.themeLabel")}
                        <div className="about-dialog__about-build-info__value">
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
                                data-a11y-previous="about-dialog__show-passwords-toggle"
                                data-a11y-next="about-dialog__theme-from-os-toggle"
                                role="menuitemradio"
                                {...useLightThemeAriaProps}
                            />
                        </div>
                    </div>
                </li>
                <li className="about-dialog__about-build-info" role="none">
                    <div className="about-dialog__about-build-info__theme">
                        {t("dialog.about.themeFromOsLabel")}
                        <div className="about-dialog__about-build-info__value">
                            <Toggle
                                size="sm"
                                aria-labelledby="about-dialog__theme-from-os-toggle-label"
                                labelA={t("btnLabel.No", { ns: "common" })}
                                labelB={t("btnLabel.Yes", { ns: "common" })}
                                id="about-dialog__theme-from-os-toggle"
                                toggled={useOperatingSystemTheme}
                                onToggle={() => {
                                    const dataset =
                                        document.documentElement.dataset;
                                    const osThemeUsesDarkMode =
                                        window.matchMedia &&
                                        window.matchMedia(
                                            "(prefers-color-scheme: dark)"
                                        ).matches;
                                    const osThemeUsesLightMode =
                                        window.matchMedia &&
                                        window.matchMedia(
                                            "(prefers-color-scheme: light)"
                                        ).matches;

                                    if (useOperatingSystemTheme) {
                                        dataset.useOperatingSystemTheme =
                                            "false";
                                        updateUseOperatingSystemTheme(false);
                                    } else {
                                        osThemeUsesDarkMode &&
                                            updateTheme(DARK_THEME);
                                        osThemeUsesLightMode &&
                                            updateTheme(LIGHT_THEME);
                                        dataset.useOperatingSystemTheme =
                                            "true";
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
                </li>
            </ul>
            <p className="about-dialog__panel-divider-label">
                {t("dialog.about.shortcutsLabel")}
            </p>
            <hr className="about-dialog__panel-divider" />
            <ul
                id="about-dialog__about-menu__shortcut-options"
                aria-label={t("dialog.about.ariaLabel.applicationShortcuts")}
                role="group"
                className="about-dialog__panel-group"
            >
                <li className="about-dialog__about-menu-item" role="none">
                    <Button
                        kind="ghost"
                        size="sm"
                        data-title="report"
                        id="about-dialog__about-kissues-button"
                        href={knownIssuesUrl}
                        target="_blank"
                        className="about-dialog__about-menu-item__button"
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
                <li className="about-dialog__about-menu-item" role="none">
                    <Button
                        kind="ghost"
                        size="sm"
                        data-title="report"
                        id="about-dialog__about-report-button"
                        href={bugTrackerUrl}
                        target="_blank"
                        className="about-dialog__about-menu-item__button"
                        role="menuitem"
                        onBlur={handleTabElementOnBlur}
                        onKeyDown={handleTabElementOnKeyDown}
                        data-a11y-previous="about-dialog__about-kissues-button"
                        data-a11y-next="about-dialog__close-button"
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
            </ul>
        </div>
    );
});

About.propTypes = {
    closeNotification: PropTypes.func.isRequired,
    pruneSettings: PropTypes.func.isRequired,
};

export default About;
