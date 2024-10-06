/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import React, { useContext, forwardRef, useState, useEffect } from "react";
import { LOCAL_STORAGE_KEY_APP_INLINE_NOTIFICATION } from "../../../util/local-storage-constants";
import {
    Button,
    InlineNotification,
    Layer,
    Link,
    FlexGrid,
    Row,
    Column,
    TabsVertical,
    TabListVertical,
    Tab,
    TabPanels,
    TabPanel,
    Heading,
    Section,
    Toggle,
} from "@carbon/react";
import { Checkmark, Copy, Debug, Report, Erase } from "@carbon/icons-react";
import { PageHeader } from "@carbon/ibm-products";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useTranslation } from "react-i18next";
import { useNavigate, useHref } from "react-router-dom";
import {
    ApplicationContext,
    SettingsPageContext,
    HeaderContext,
    DownloadParamFileContext,
    EditPageContext,
    InformationContext,
    InputFileSelectionContext,
    InstallationParameterContext,
    IntroContext,
    LandingPageContext,
    NetworkAddressContext,
    NetworkDeviceContext,
    SummaryContext,
} from "../../../contexts";
import {
    parmfileCardIsExpanded,
    setItem,
} from "../../../util/local-storage-util";
import { getInlineNotification } from "../../../uiUtil/panel-util";
import { resetToInitialState } from "../../../uiUtil/state-util";
import PathConstants from "../../../util/path-constants";
import { LIGHT_THEME, DARK_THEME } from "../../../util/constants";
import { PANEL_SETTINGS_PAGE } from "../../../util/panel-constants";
import "./_settings-page.scss";

const SettingsPage = forwardRef(function SettingsPage(props, ref) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const expandedParmfileCardHref = useHref(
        PathConstants.EXPANDED_PARMFILE_CARD
    );
    const homePageHref = useHref(PathConstants.HOME);
    const settingsPageHref = useHref(PathConstants.SETTINGS);

    const contexts = {
        applicationContext: useContext(ApplicationContext),
        downloadParamFileContext: useContext(DownloadParamFileContext),
        editPageContext: useContext(EditPageContext),
        settingsPageContext: useContext(SettingsPageContext),
        headerContext: useContext(HeaderContext),
        informationContext: useContext(InformationContext),
        inputFileSelectionContext: useContext(InputFileSelectionContext),
        installationParameterContext: useContext(InstallationParameterContext),
        introContext: useContext(IntroContext),
        landingPageContext: useContext(LandingPageContext),
        networkAddressContext: useContext(NetworkAddressContext),
        networkDeviceContext: useContext(NetworkDeviceContext),
        summaryContext: useContext(SummaryContext),
    };

    const {
        state: globalState,
        config,
        updateShowLegalNotification,
        updateTheme,
        updateStep,
        updateUseOperatingSystemTheme,
        updateShowPasswords,
    } = contexts.applicationContext;
    const {
        state,
        updateIsDirty,
        updateTheme: localUpdateTheme,
        updateUseOperatingSystemTheme: localUpdateUseOperatingSystemTheme,
        updateShowPasswords: localUpdateShowPasswords,
    } = contexts.settingsPageContext;
    const {
        state: headerState,
        updateNeedsManualNavigationConfirmation,
        updateManualNavigationOrigin,
    } = contexts.headerContext;

    const [buildDateBeenCopied, setBuildDateHasBeenCopied] = useState(false);
    const [commitHashHasBeenCopied, setCommitHashHasBeenCopied] =
        useState(false);

    const { appConfig } = config || {
        appConfig: {},
    };
    const showConfidentialityNotice =
        appConfig?.config?.showConfidentialityNotice ?? false;
    const buildDate = appConfig?.config?.buildDate ?? "";
    const commitHashShort = appConfig?.config?.commitHashShort ?? "";
    const commitHashLong = appConfig?.config?.commitHashLong ?? "";
    const bugTrackerUrl = appConfig?.config?.bugTrackerUrl ?? "";
    const knownIssuesUrl = appConfig?.config?.knownIssuesUrl ?? "";
    const theme = state?.theme ?? LIGHT_THEME;
    const useLightTheme = theme === LIGHT_THEME;
    const useOperatingSystemTheme = state?.useOperatingSystemTheme ?? false;
    const showPasswords = state?.showPasswords ?? false;
    const isDirty = state?.isDirty ?? false;

    const buildDateCopyIcon = buildDateBeenCopied ? Checkmark : Copy;
    const commitHashCopyIcon = commitHashHasBeenCopied ? Checkmark : Copy;

    const buildDateCopyClass = buildDateBeenCopied
        ? "liz__settings-page__about-build-info__date__copied"
        : "liz__settings-page__about-build-info__date";
    const commitHashCopyClass = commitHashHasBeenCopied
        ? "liz__settings-page__about-build-info__commit-hash__copied"
        : "liz__settings-page__about-build-info__commit-hash";
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
    const useLightThemeAriaProps = useOperatingSystemTheme
        ? {
              "aria-readonly": "true",
          }
        : {
              "aria-readonly": "false",
          };
    const externalLinkKnownIssueAriaProps = {
        "aria-describedby": "about-dialog__about-external-link-hint__kissues",
    };
    const externalLinkReportIssueAriaProps = {
        "aria-describedby": "about-dialog__about-external-link-hint__rissues",
    };

    useEffect(() => {
        updateStep(12);
    }, []);

    const onCloseInlineNotification = () => {
        const localInlineNotification = Object.assign({}, inlineNotification);
        localInlineNotification.show = false;

        updateShowLegalNotification(false);
        setItem(
            LOCAL_STORAGE_KEY_APP_INLINE_NOTIFICATION,
            JSON.stringify(localInlineNotification)
        );
    };

    const inlineNotification = getInlineNotification(
        t("legalNotice.headerLabel"),
        t("legalNotice.contentLabel")
    );
    const showInlineNotification = inlineNotification
        ? inlineNotification.show &&
          typeof showConfidentialityNotice === "string" &&
          showConfidentialityNotice.toLowerCase() === "true"
        : false;

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

    const getBreadcrumbs = () => {
        return [
            {
                href: parmfileCardIsExpanded()
                    ? expandedParmfileCardHref
                    : homePageHref,
                key: "breadcrumb-01",
                label: labelForHomeLink,
                title: t("pageHeader.breadcrumbs.home", { ns: "common" }),
            },
            {
                href: settingsPageHref,
                isCurrentPage: true,
                key: "breadcrumb-02",
                label: labelForSettingsLink,
            },
        ];
    };

    const localPruneSettings = () => {
        resetToInitialState({
            shouldCloseNotification: true,
            contexts,
        });
    };

    const labelForSettingsLink = state.isDirty
        ? `${t("pageHeader.breadcrumbs.settings", {
              ns: "common",
          })} *`
        : t("pageHeader.breadcrumbs.settings", {
              ns: "common",
          });

    const labelForHomeLink = !headerState.needsManualNavigationConfirmation ? (
        <Link
            className="liz__settings-page__link-cursor"
            onClick={() => {
                if (state.isDirty) {
                    updateNeedsManualNavigationConfirmation(true);
                    updateManualNavigationOrigin(PANEL_SETTINGS_PAGE);
                } else {
                    navigate(
                        `${parmfileCardIsExpanded() ? PathConstants.EXPANDED_PARMFILE_CARD : PathConstants.HOME}`
                    );
                }
            }}
        >
            {t("pageHeader.breadcrumbs.home", { ns: "common" })}
        </Link>
    ) : (
        t("pageHeader.breadcrumbs.home", { ns: "common" })
    );

    const pageHeaderMarkup = (
        <PageHeader
            className="liz__settings-page__page-header"
            actionBarOverflowAriaLabel={t(
                "pageHeader.actionBarOverflowAriaLabel",
                {
                    ns: "common",
                }
            )}
            allTagsModalSearchLabel={t("pageHeader.allTagsModalSearchLabel", {
                ns: "common",
            })}
            allTagsModalSearchPlaceholderText={t(
                "pageHeader.allTagsModalSearchPlaceholderText",
                { ns: "common" }
            )}
            allTagsModalTitle={t("pageHeader.allTagsModalTitle", {
                ns: "common",
            })}
            breadcrumbOverflowAriaLabel={t(
                "pageHeader.breadcrumbOverflowAriaLabel",
                {
                    ns: "common",
                }
            )}
            breadcrumbs={getBreadcrumbs()}
            collapseHeaderIconDescription={t(
                "pageHeader.collapseHeaderIconDescription",
                { ns: "common" }
            )}
            expandHeaderIconDescription={t(
                "pageHeader.expandHeaderIconDescription",
                {
                    ns: "common",
                }
            )}
            pageActionsOverflowLabel={t("pageHeader.pageActionsOverflowLabel", {
                ns: "common",
            })}
            showAllTagsLabel={t("pageHeader.showAllTagsLabel", {
                ns: "common",
            })}
            subtitle={t("settingsPage.pageHeader.subtitle")}
            title={{
                icon: function noRefCheck() {},
                loading: false,
                text: t("settingsPage.pageHeader.title"),
            }}
        />
    );

    const tabMarkup = (
        <TabsVertical height="100%">
            <TabListVertical aria-label="List of tabs">
                <Tab>{t("settingsPage.tabs.label.about")}</Tab>
                <Tab>{t("settingsPage.tabs.label.appearance")}</Tab>
                <Tab>{t("settingsPage.tabs.label.security")}</Tab>
            </TabListVertical>
            <TabPanels>
                <TabPanel>
                    <Heading className="liz__settings-page__tab-panel-heading">
                        {t("settingsPage.tabs.label.about")}
                    </Heading>
                    <Section>
                        <Heading className="liz__settings-page__tab-panel-subheading">
                            {t("dialog.about.headerLabelLong")}
                        </Heading>
                        <Section className="liz__settings-page__about-build-info">
                            <div className="liz__settings-page__tab-panel-body-info">
                                {t("settingsPage.tabs.label.aboutInfo")}
                            </div>
                            <div className={buildDateCopyClass}>
                                <div className="liz__settings-page__tab-panel-body__date__left-column">
                                    <span>
                                        {t("dialog.about.buildDateLabel")}:{" "}
                                    </span>
                                    <code role="presentation">{buildDate}</code>
                                </div>
                                <div className="liz__settings-page__tab-panel-body__date__right-column">
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
                                            id="settings-page__copy-button__build-date"
                                            iconDescription={t(
                                                "btnLabel.Copy",
                                                {
                                                    ns: "common",
                                                }
                                            )}
                                            onClick={function noRefCheck() {}}
                                            renderIcon={buildDateCopyIcon}
                                            {...buildDateCopyAriaProps}
                                            onBlur={() => {
                                                document
                                                    .getElementById(
                                                        "helpPanelContents_settingsPage_para1"
                                                    )
                                                    ?.classList?.remove(
                                                        "help-panel__settings-page__content__active"
                                                    );
                                                document
                                                    .getElementById(
                                                        "helpPanelContents_settingsPage_para2"
                                                    )
                                                    ?.classList?.remove(
                                                        "help-panel__settings-page__content__active"
                                                    );
                                            }}
                                            onFocus={() => {
                                                document
                                                    .getElementById(
                                                        "helpPanelContents_settingsPage_para1"
                                                    )
                                                    ?.classList?.add(
                                                        "help-panel__settings-page__content__active"
                                                    );
                                                document
                                                    .getElementById(
                                                        "helpPanelContents_settingsPage_para2"
                                                    )
                                                    ?.classList?.add(
                                                        "help-panel__settings-page__content__active"
                                                    );
                                            }}
                                        />
                                    </CopyToClipboard>
                                </div>
                            </div>
                            <div className={commitHashCopyClass}>
                                <div className="liz__settings-page__tab-panel-body__hash__left-column">
                                    <span>
                                        {t("dialog.about.commitHashLabel")}:{" "}
                                    </span>
                                    <code role="presentation">
                                        {commitHashShort}
                                    </code>
                                </div>
                                <div className="liz__settings-page__tab-panel-body__hash__right-column">
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
                                            id="settings-page__copy-button__commit-hash"
                                            iconDescription={t(
                                                "btnLabel.Copy",
                                                {
                                                    ns: "common",
                                                }
                                            )}
                                            onClick={function noRefCheck() {}}
                                            renderIcon={commitHashCopyIcon}
                                            {...commitHashCopyAriaProps}
                                            onBlur={() => {
                                                document
                                                    .getElementById(
                                                        "helpPanelContents_settingsPage_para1"
                                                    )
                                                    ?.classList?.remove(
                                                        "help-panel__settings-page__content__active"
                                                    );
                                                document
                                                    .getElementById(
                                                        "helpPanelContents_settingsPage_para2"
                                                    )
                                                    ?.classList?.remove(
                                                        "help-panel__settings-page__content__active"
                                                    );
                                            }}
                                            onFocus={() => {
                                                document
                                                    .getElementById(
                                                        "helpPanelContents_settingsPage_para1"
                                                    )
                                                    ?.classList?.add(
                                                        "help-panel__settings-page__content__active"
                                                    );
                                                document
                                                    .getElementById(
                                                        "helpPanelContents_settingsPage_para2"
                                                    )
                                                    ?.classList?.add(
                                                        "help-panel__settings-page__content__active"
                                                    );
                                            }}
                                        />
                                    </CopyToClipboard>
                                </div>
                            </div>
                            <div className="liz__settings-page__about-build-info__theme">
                                <Button
                                    data-title="clear"
                                    kind="danger"
                                    id="settings-page__about-clear-settings-button"
                                    target="_blank"
                                    className="liz__settings-page__about-clear-settings-button"
                                    renderIcon={Erase}
                                    iconDescription={t(
                                        "dialog.about.pruneSettingsLabel"
                                    )}
                                    onClick={localPruneSettings}
                                    onBlur={() => {
                                        document
                                            .getElementById(
                                                "helpPanelContents_settingsPage_para1"
                                            )
                                            ?.classList?.remove(
                                                "help-panel__settings-page__content__active"
                                            );
                                        document
                                            .getElementById(
                                                "helpPanelContents_settingsPage_para2"
                                            )
                                            ?.classList?.remove(
                                                "help-panel__settings-page__content__active"
                                            );
                                    }}
                                    onFocus={() => {
                                        document
                                            .getElementById(
                                                "helpPanelContents_settingsPage_para1"
                                            )
                                            ?.classList?.add(
                                                "help-panel__settings-page__content__active"
                                            );
                                        document
                                            .getElementById(
                                                "helpPanelContents_settingsPage_para2"
                                            )
                                            ?.classList?.add(
                                                "help-panel__settings-page__content__active"
                                            );
                                    }}
                                >
                                    <span>
                                        {t("dialog.about.pruneSettingsLabel")}
                                    </span>
                                </Button>
                                <Button
                                    data-title="report"
                                    id="settings-page__about-kissues-button"
                                    href={knownIssuesUrl}
                                    target="_blank"
                                    className="liz__settings-page__about-kissues-button"
                                    renderIcon={Report}
                                    iconDescription={t(
                                        "dialog.about.knownIssuesLabel"
                                    )}
                                    {...externalLinkKnownIssueAriaProps}
                                    onBlur={() => {
                                        document
                                            .getElementById(
                                                "helpPanelContents_settingsPage_para1"
                                            )
                                            ?.classList?.remove(
                                                "help-panel__settings-page__content__active"
                                            );
                                        document
                                            .getElementById(
                                                "helpPanelContents_settingsPage_para2"
                                            )
                                            ?.classList?.remove(
                                                "help-panel__settings-page__content__active"
                                            );
                                    }}
                                    onFocus={() => {
                                        document
                                            .getElementById(
                                                "helpPanelContents_settingsPage_para1"
                                            )
                                            ?.classList?.add(
                                                "help-panel__settings-page__content__active"
                                            );
                                        document
                                            .getElementById(
                                                "helpPanelContents_settingsPage_para2"
                                            )
                                            ?.classList?.add(
                                                "help-panel__settings-page__content__active"
                                            );
                                    }}
                                >
                                    <span>
                                        {t("dialog.about.knownIssuesLabel")}
                                    </span>
                                    <span
                                        className="liz__settings-page__about-external-link-hint"
                                        id="settings-page__about-external-link-hint__kissues"
                                    >
                                        {t("dialog.about.externalLinkHint")}
                                    </span>
                                </Button>
                                <Button
                                    data-title="report"
                                    id="settings-page__about-report-button"
                                    href={bugTrackerUrl}
                                    target="_blank"
                                    className="liz__settings-page__about-report-button"
                                    renderIcon={Debug}
                                    iconDescription={t(
                                        "dialog.about.reportIssueLabel"
                                    )}
                                    {...externalLinkReportIssueAriaProps}
                                    onBlur={() => {
                                        document
                                            .getElementById(
                                                "helpPanelContents_settingsPage_para1"
                                            )
                                            ?.classList?.remove(
                                                "help-panel__settings-page__content__active"
                                            );
                                        document
                                            .getElementById(
                                                "helpPanelContents_settingsPage_para2"
                                            )
                                            ?.classList?.remove(
                                                "help-panel__settings-page__content__active"
                                            );
                                    }}
                                    onFocus={() => {
                                        document
                                            .getElementById(
                                                "helpPanelContents_settingsPage_para1"
                                            )
                                            ?.classList?.add(
                                                "help-panel__settings-page__content__active"
                                            );
                                        document
                                            .getElementById(
                                                "helpPanelContents_settingsPage_para2"
                                            )
                                            ?.classList?.add(
                                                "help-panel__settings-page__content__active"
                                            );
                                    }}
                                >
                                    <span>
                                        {t("dialog.about.reportIssueLabel")}
                                    </span>
                                    <span
                                        className="liz__settings-page__about-external-link-hint"
                                        id="settings-page__about-external-link-hint__rissues"
                                    >
                                        {t("dialog.about.externalLinkHint")}
                                    </span>
                                </Button>
                            </div>
                        </Section>
                    </Section>
                </TabPanel>
                <TabPanel>
                    <Heading className="liz__settings-page__tab-panel-heading">
                        {t("settingsPage.tabs.label.appearance")}
                    </Heading>
                    <Section>
                        <Heading className="liz__settings-page__tab-panel-subheading">
                            {t("settingsPage.tabs.heading.lightDarkMode")}
                        </Heading>
                        <Section className="liz__settings-page__about-build-info">
                            <div className="liz__settings-page__tab-panel-body-info">
                                {t("settingsPage.tabs.label.appearanceInfo")}
                            </div>
                            <div className="liz__settings-page__about-build-info__theme">
                                <div
                                    id="settings-page__theme-toggle-label"
                                    className="liz__settings-page__tab-panel-body__theme__left-column"
                                >
                                    {t("dialog.about.themeLabel")}:
                                </div>
                                <div className="liz__settings-page__tab-panel-body__theme__right-column">
                                    <Toggle
                                        size="md"
                                        readOnly={
                                            isDirty
                                                ? useOperatingSystemTheme
                                                : globalState.useOperatingSystemTheme
                                        }
                                        aria-labelledby="settings-page__theme-toggle-label"
                                        labelA={t(
                                            "dialog.about.darkThemeLabel"
                                        )}
                                        labelB={t(
                                            "dialog.about.lightThemeLabel"
                                        )}
                                        id="settings-page__theme-toggle"
                                        toggled={
                                            isDirty
                                                ? useLightTheme
                                                : globalState.theme ===
                                                  LIGHT_THEME
                                        }
                                        onToggle={() => {
                                            if (useLightTheme) {
                                                localUpdateTheme(DARK_THEME);
                                                updateIsDirty(true);
                                            } else {
                                                localUpdateTheme(LIGHT_THEME);
                                                updateIsDirty(true);
                                            }
                                        }}
                                        {...useLightThemeAriaProps}
                                        onBlur={() => {
                                            document
                                                .getElementById(
                                                    "helpPanelContents_settingsPage_para3"
                                                )
                                                ?.classList?.remove(
                                                    "help-panel__settings-page__content__active"
                                                );
                                        }}
                                        onFocus={() => {
                                            document
                                                .getElementById(
                                                    "helpPanelContents_settingsPage_para3"
                                                )
                                                ?.classList?.add(
                                                    "help-panel__settings-page__content__active"
                                                );
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="liz__settings-page__about-build-info__theme">
                                <div
                                    id="settings-page__theme-from-os-toggle-label"
                                    className="liz__settings-page__tab-panel-body__theme__left-column"
                                >
                                    {t("dialog.about.themeFromOsLabel")}:
                                </div>
                                <div className="liz__settings-page__tab-panel-body__theme__right-column">
                                    <Toggle
                                        size="md"
                                        aria-labelledby="settings-page__theme-from-os-toggle-label"
                                        labelA={t("btnLabel.No", {
                                            ns: "common",
                                        })}
                                        labelB={t("btnLabel.Yes", {
                                            ns: "common",
                                        })}
                                        id="about-dialog__theme-from-os-toggle"
                                        toggled={
                                            isDirty
                                                ? useOperatingSystemTheme
                                                : globalState.useOperatingSystemTheme
                                        }
                                        onToggle={() => {
                                            const dataset =
                                                document.documentElement
                                                    .dataset;
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
                                                localUpdateUseOperatingSystemTheme(
                                                    false
                                                );
                                                updateIsDirty(true);
                                            } else {
                                                osThemeUsesDarkMode &&
                                                    localUpdateTheme(
                                                        DARK_THEME
                                                    );
                                                osThemeUsesLightMode &&
                                                    localUpdateTheme(
                                                        LIGHT_THEME
                                                    );
                                                dataset.useOperatingSystemTheme =
                                                    "true";
                                                localUpdateUseOperatingSystemTheme(
                                                    true
                                                );
                                                updateIsDirty(true);
                                            }
                                        }}
                                        onBlur={() => {
                                            document
                                                .getElementById(
                                                    "helpPanelContents_settingsPage_para3"
                                                )
                                                ?.classList?.remove(
                                                    "help-panel__settings-page__content__active"
                                                );
                                        }}
                                        onFocus={() => {
                                            document
                                                .getElementById(
                                                    "helpPanelContents_settingsPage_para3"
                                                )
                                                ?.classList?.add(
                                                    "help-panel__settings-page__content__active"
                                                );
                                        }}
                                    />
                                </div>
                            </div>
                        </Section>
                    </Section>
                </TabPanel>
                <TabPanel>
                    <Heading className="liz__settings-page__tab-panel-heading">
                        {t("settingsPage.tabs.label.security")}
                    </Heading>
                    <Section>
                        <Heading className="liz__settings-page__tab-panel-subheading">
                            {t("settingsPage.tabs.heading.showPasswords")}
                        </Heading>
                        <Section className="liz__settings-page__about-build-info">
                            <div className="liz__settings-page__tab-panel-body-info">
                                {t("settingsPage.tabs.label.securityInfo")}
                            </div>
                            <div className="liz__settings-page__about-build-info__theme">
                                <div
                                    id="settings-page__show-passwords-toggle-label"
                                    className="liz__settings-page__tab-panel-body__theme__left-column"
                                >
                                    {t("dialog.about.showPasswordsLabel")}:
                                </div>
                                <div className="liz__settings-page__tab-panel-body__theme__right-column">
                                    <Toggle
                                        size="md"
                                        aria-labelledby="about-dialog__show-passwords-toggle-label"
                                        labelA={t("btnLabel.No", {
                                            ns: "common",
                                        })}
                                        labelB={t("btnLabel.Yes", {
                                            ns: "common",
                                        })}
                                        id="settings-page__show-passwords-toggle"
                                        toggled={
                                            isDirty
                                                ? showPasswords
                                                : globalState.showPasswords
                                        }
                                        onToggle={() => {
                                            if (showPasswords) {
                                                localUpdateShowPasswords(false);
                                                updateIsDirty(true);
                                            } else {
                                                localUpdateShowPasswords(true);
                                                updateIsDirty(true);
                                            }
                                        }}
                                        onBlur={() => {
                                            document
                                                .getElementById(
                                                    "helpPanelContents_settingsPage_para4"
                                                )
                                                ?.classList?.remove(
                                                    "help-panel__settings-page__content__active"
                                                );
                                            document
                                                .getElementById(
                                                    "helpPanelContents_settingsPage_para5"
                                                )
                                                ?.classList?.remove(
                                                    "help-panel__settings-page__content__active"
                                                );
                                        }}
                                        onFocus={() => {
                                            document
                                                .getElementById(
                                                    "helpPanelContents_settingsPage_para4"
                                                )
                                                ?.classList?.add(
                                                    "help-panel__settings-page__content__active"
                                                );
                                            document
                                                .getElementById(
                                                    "helpPanelContents_settingsPage_para5"
                                                )
                                                ?.classList?.add(
                                                    "help-panel__settings-page__content__active"
                                                );
                                        }}
                                    />
                                </div>
                            </div>
                        </Section>
                    </Section>
                </TabPanel>
            </TabPanels>
        </TabsVertical>
    );

    const buttonMarkup = (
        <>
            <Button
                data-title="cancel"
                id="settings-page__cancel-button"
                onClick={() => {
                    if (state.isDirty) {
                        updateNeedsManualNavigationConfirmation(true);
                        updateManualNavigationOrigin(PANEL_SETTINGS_PAGE);
                    } else {
                        navigate(
                            `${parmfileCardIsExpanded() ? PathConstants.EXPANDED_PARMFILE_CARD : PathConstants.HOME}`
                        );
                    }
                }}
                className="liz__settings-page__buttonbar-button liz__settings-page__buttonbar-button__cancel"
                kind="ghost"
            >
                {t("btnLabel.Cancel", { ns: "common" })}
            </Button>
            <Button
                data-title="ok"
                id="settings-page__ok-button"
                href={
                    parmfileCardIsExpanded()
                        ? expandedParmfileCardHref
                        : homePageHref
                }
                onClick={() => {
                    if (isDirty) {
                        updateTheme(state.theme);
                        updateUseOperatingSystemTheme(
                            state.useOperatingSystemTheme
                        );
                        updateShowPasswords(state.showPasswords);
                    }
                    updateIsDirty(false);
                }}
                className="liz__settings-page__buttonbar-button liz__settings-page__buttonbar-button__ok"
            >
                {t("btnLabel.OK", { ns: "common" })}
            </Button>
        </>
    );

    const rootLayerClassName = showInlineNotification
        ? "liz__settings-page__root-layer__with-legal-banner"
        : "liz__settings-page__root-layer__wo-legal-banner";

    return (
        <>
            {showInlineNotification && (
                <InlineNotification
                    aria-label="closes notification"
                    onClose={onCloseInlineNotification}
                    onCloseButtonClick={onCloseInlineNotification}
                    statusIconDescription="notification"
                    subtitle={inlineNotification.subtitle}
                    title={inlineNotification.title}
                    kind={inlineNotification.kind}
                    className="liz__settings-page__legal-banner"
                />
            )}
            <Layer className={rootLayerClassName}>
                {pageHeaderMarkup}
                <Layer className="liz__settings-page__grid-layer">
                    <FlexGrid className="liz__settings-page__grid">
                        <Row className="liz__settings-page__grid__tab-row liz__settings-page__grid__tab-row__tabs">
                            <Column className="liz__settings-page__grid__tab-column">
                                {tabMarkup}
                            </Column>
                        </Row>
                        <Row className="liz__settings-page__grid__tab-row liz__settings-page__grid__tab-row__buttonbar">
                            {buttonMarkup}
                        </Row>
                    </FlexGrid>
                </Layer>
            </Layer>
        </>
    );
});

export default SettingsPage;
