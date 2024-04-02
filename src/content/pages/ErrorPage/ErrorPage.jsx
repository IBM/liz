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
} from "@carbon/react";
import { Linux } from "@carbon/icons-react";
import {
  STATE_ORIGIN_STORAGE,
  LOCAL_STORAGE_KEY_APP_ERROR_PAGE,
  LOCAL_STORAGE_KEY_APP_INLINE_NOTIFICATION,
} from "../../../util/local-storage-constants";
import { ErrorPageContext, ApplicationContext } from "../../../contexts";
import { getInlineNotification } from "../../../uiUtil/panel-util";
import "./_error-page.scss";

const ErrorPage = forwardRef(function ErrorPage(props, ref) {
  const { t } = useTranslation();
  const error = useRouteError();
  const { updateShowLegalNotification } = useContext(ApplicationContext);
  const { state } = useContext(ErrorPageContext);
  const publicRef = {
    persistState: () => {
      localStorage.setItem(
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

  const onCloseInlineNotification = () => {
    const localInlineNotification = Object.assign({}, inlineNotification);
    localInlineNotification.show = false;

    updateShowLegalNotification(false);
    localStorage.setItem(
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
  const errorDetailsMessage =
    error?.error?.message ?? t("errorPage.dataPlaceholderString");
  const errorDetailsStack =
    error?.error?.stack ?? t("errorPage.dataPlaceholderString");

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
                <div className="liz__error-page__payload-message">
                  {t("errorPage.headerTitle")}
                </div>
                <div className="liz__error-page__payload-message-status">
                  {errorStatus !== t("errorPage.dataPlaceholderString") && (
                    <div>
                      {t("Status code")}:&nbsp;{errorStatus}
                    </div>
                  )}
                  {errorData !== t("errorPage.dataPlaceholderString") && (
                    <div>
                      {t("Status message")}:&nbsp;{errorData}
                    </div>
                  )}
                </div>
                <div className="liz__error-page__payload-accordion">
                  {errorDetailsStack !==
                    t("errorPage.dataPlaceholderString") && (
                    <Accordion>
                      <AccordionItem title={t("errorPage.detailsLabel")}>
                        <div className="liz__error-page__payload-error-message">
                          {t("Error message")}:&nbsp;{errorDetailsMessage}
                        </div>
                        <div className="liz__error-page__payload-error-stack">
                          <CodeSnippet
                            type="multi"
                            feedback="Copied to clipboard"
                          >
                            {errorDetailsStack}
                          </CodeSnippet>
                        </div>
                      </AccordionItem>
                    </Accordion>
                  )}
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
