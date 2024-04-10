/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
} from "react";
import { useRouteError } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionItem,
  InlineNotification,
  Layer,
  FlexGrid,
  Row,
  Column,
  CodeSnippet,
  IconButton,
} from "@carbon/react";
import { Linux, Debug, Report } from "@carbon/icons-react";
import {
  STATE_ORIGIN_STORAGE,
  LOCAL_STORAGE_KEY_APP_ERROR_PAGE,
  LOCAL_STORAGE_KEY_APP_INLINE_NOTIFICATION,
} from "../../../util/local-storage-constants";
import { ErrorPageContext, ApplicationContext } from "../../../contexts";
import { getInlineNotification } from "../../../uiUtil/panel-util";
import { setItem } from "../../../util/local-storage-util";
import "./_error-page.scss";

const ErrorPage = forwardRef(function ErrorPage(props, ref) {
  const { t } = useTranslation();
  const error = useRouteError();
  const { updateShowLegalNotification, updateStep } =
    useContext(ApplicationContext);
  const { state, updateConfig } = useContext(ErrorPageContext);
  const publicRef = {
    persistState: () => {
      updateStep(11);

      setItem(
        LOCAL_STORAGE_KEY_APP_ERROR_PAGE,
        JSON.stringify({
          ...state,
          origin: STATE_ORIGIN_STORAGE,
        }),
      );
    },
  };

  useEffect(publicRef.persistState, [state]);
  useImperativeHandle(ref, () => publicRef);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_URL_PATH_PREFIX}config/app/config.json`,
      );
      const config = await response.json();

      updateConfig(config);
    };

    fetchData();
  }, []);

  const onCloseInlineNotification = () => {
    const localInlineNotification = Object.assign({}, inlineNotification);
    localInlineNotification.show = false;

    updateShowLegalNotification(false);
    setItem(
      LOCAL_STORAGE_KEY_APP_INLINE_NOTIFICATION,
      JSON.stringify(localInlineNotification),
    );
  };

  const inlineNotification = getInlineNotification(
    t("legalNotice.headerLabel"),
    t("legalNotice.contentLabel"),
  );
  const showInlineNotification = inlineNotification
    ? inlineNotification.show
    : false;

  const rootLayerClassName = showInlineNotification
    ? "liz__error-page__root-layer__with-legal-banner"
    : "liz__error-page__root-layer__wo-legal-banner";

  const errorStatus = error?.status ?? t("errorPage.dataPlaceholderString");
  const errorData = error?.data ?? t("errorPage.dataPlaceholderString");
  const hasErrorInsideError = typeof error.error === "object";
  const errorDetailsMessage = hasErrorInsideError
    ? error?.error?.message ?? t("errorPage.dataPlaceholderString")
    : error?.message ?? t("errorPage.dataPlaceholderString");
  const errorDetailsStack = hasErrorInsideError
    ? error?.error?.stack ?? t("errorPage.dataPlaceholderString")
    : error?.stack ?? t("errorPage.dataPlaceholderString");

  const appConfig = state?.appConfig ?? {};
  const bugTrackerUrl = appConfig?.config?.bugTrackerUrl ?? "";
  const knownIssuesUrl = appConfig?.config?.knownIssuesUrl ?? "";

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
          className="liz__error-page__legal-banner"
        />
      )}
      <Layer className={rootLayerClassName}>
        <FlexGrid className="liz__error-page__grid">
          <Row>
            <Column className="liz__error-page__grid__flow-column">
              <div className="liz__error-page__payload">
                <div className="liz__error-page__payload-icon">
                  <Linux size="64" />
                </div>
                <div className="liz__error-page__payload-message-one">
                  {t("errorPage.headerTitleOne")}
                </div>
                <div className="liz__error-page__payload-message-two">
                  {t("errorPage.headerTitleTwo")}
                </div>
                <div className="liz__error-page__payload-message-status">
                  {errorStatus !== t("errorPage.dataPlaceholderString") && (
                    <div>
                      <span className="liz__error-page__payload-message-status-key">
                        {t("errorPage.label.statusCode")}:
                      </span>
                      <span className="liz__error-page__payload-message-status-value">
                        {errorStatus}
                      </span>
                    </div>
                  )}
                  {errorData !== t("errorPage.dataPlaceholderString") && (
                    <div>
                      <span className="liz__error-page__payload-message-status-key">
                        {t("errorPage.label.statusMessage")}:
                      </span>
                      <span className="liz__error-page__payload-message-status-value">
                        {errorData}
                      </span>
                    </div>
                  )}
                </div>
                <div className="liz__error-page__payload-accordion">
                  {errorDetailsStack !==
                    t("errorPage.dataPlaceholderString") && (
                    <Accordion>
                      <AccordionItem title={t("errorPage.detailsLabel")}>
                        {errorDetailsMessage && (
                          <div className="liz__error-page__payload-error-message">
                            <span className="liz__error-page__payload-message-status-key">
                              {t("errorPage.label.errorMessage")}:
                            </span>
                            <span className="liz__error-page__payload-message-status-value">
                              {errorDetailsMessage}
                            </span>
                          </div>
                        )}
                        <div className="liz__error-page__payload-error-stack">
                          <CodeSnippet
                            type="multi"
                            feedback={t("copied.long", { ns: "common" })}
                          >
                            {errorDetailsStack}
                          </CodeSnippet>
                        </div>
                      </AccordionItem>
                    </Accordion>
                  )}
                </div>
                <div className="liz__error-page__support-icons">
                  <IconButton
                    kind="ghost"
                    label={t("dialog.about.knownIssuesLabel")}
                    id="liz__error-page__report-button"
                    href={knownIssuesUrl}
                    target="_blank"
                  >
                    <Report size="24" />
                  </IconButton>
                  <IconButton
                    kind="ghost"
                    label={t("dialog.about.reportIssueLabel")}
                    id="liz__error-page__report-button"
                    href={bugTrackerUrl}
                    target="_blank"
                  >
                    <Debug size="24" />
                  </IconButton>
                </div>
              </div>
            </Column>
          </Row>
        </FlexGrid>
      </Layer>
    </>
  );
});

export default ErrorPage;
