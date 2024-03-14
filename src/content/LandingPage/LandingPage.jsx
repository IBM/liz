/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { InlineNotification, FlexGrid, Row, Column } from "@carbon/react";
import { ExpressiveCard, PageHeader } from "@carbon/ibm-products";
import {
  ResultDraft,
  SettingsEdit,
  NextOutline,
  DocumentDownload,
  Edit,
  TaskView,
} from "@carbon/icons-react";
import PropTypes from "prop-types";
import About from "../../components/About";
import {
  ACTION_UPDATE_APP_STEP,
  ACTION_UPDATE_APP_IS_EDITING,
  ACTION_UPDATE_APP_HELP_STEP,
  ACTION_UPDATE_APP_SHOW_LEGAL_NOTIFICATION,
  LOCAL_STORAGE_KEY_APP_INLINE_NOTIFICATION,
  DEFAULT_PARAM_FILE_NAME,
} from "../../util/constants";
import {
  saveParamFileContent,
  getParamFileContents,
  getParamFileName,
  hasParamFile,
} from "../../util/param-file-util";
import { getInlineNotification } from "../../uiUtil/panel-utils";
import {
  pruneSettings,
  getLocalStorageKeys,
} from "../../util/local-storage-util";
import { ApplicationContext } from "../../App";
import "./_landing-page.scss";

const LandingPage = ({ closeNotification, resetToInitialState }) => {
  const { t } = useTranslation();
  const { state: globalState, dispatch: globalDispatch } =
    React.useContext(ApplicationContext);

  const showNotification = globalState.showNotification || false;
  const localStorageKeys = getLocalStorageKeys(globalState);

  const updateShowLegalNotification = (showLegalNotification) => {
    globalDispatch({
      type: ACTION_UPDATE_APP_SHOW_LEGAL_NOTIFICATION,
      nextShowLegalNotification: showLegalNotification,
    });
  };

  const localPruneSettings = () => {
    pruneSettings(localStorageKeys);
    resetToInitialState();
    closeNotification(true);
  };
  const inlineNotification = getInlineNotification(
    t("legalNotice.headerLabel"),
    t("legalNotice.contentLabel"),
  );
  const showInlineNotification = inlineNotification
    ? inlineNotification.show
    : false;
  const onCloseInlineNotification = () => {
    const localInlineNotification = Object.assign({}, inlineNotification);
    localInlineNotification.show = false;

    updateShowLegalNotification(false);
    localStorage.setItem(
      LOCAL_STORAGE_KEY_APP_INLINE_NOTIFICATION,
      JSON.stringify(localInlineNotification),
    );
  };

  const saveParamFileContentProxy = () => {
    const paramFileContents = getParamFileContents();
    const paramFileName = getParamFileName() || DEFAULT_PARAM_FILE_NAME;

    if (paramFileContents.length > 0) {
      saveParamFileContent(paramFileContents, paramFileName);
    }
  };

  const getPrimaryButtonTextForParamFileCard = () => {
    let text = "";

    hasParamFile()
      ? (text = t("btnLabel.EditParmfile", { ns: "common" }))
      : (text = t("btnLabel.ComposeParmfile", { ns: "common" }));

    return text;
  };

  const getSecondaryButtonTextForParamFileCard = () => {
    let text = "";

    hasParamFile()
      ? (text = t("btnLabel.Download", { ns: "common" }))
      : (text = "");

    return text;
  };

  const getTitleForParamFileCard = () => {
    let title = "";

    hasParamFile()
      ? (title = t("editPage.pageHeader.subtitle.modify"))
      : (title = t("editPage.pageHeader.subtitle.new"));

    return title;
  };

  useEffect(() => {
    globalDispatch({
      type: ACTION_UPDATE_APP_STEP,
      nextStep: 9,
    });
  }, []);

  return (
    <>
      {showNotification && (
        <About
          closeNotification={closeNotification}
          pruneSettings={localPruneSettings}
        />
      )}
      {showInlineNotification && (
        <InlineNotification
          aria-label="closes notification"
          onClose={onCloseInlineNotification}
          onCloseButtonClick={onCloseInlineNotification}
          statusIconDescription="notification"
          subtitle={inlineNotification.subtitle}
          title={inlineNotification.title}
          kind={inlineNotification.kind}
          className="landing-page__legal-banner"
        />
      )}
      <PageHeader
        actionBarOverflowAriaLabel={t("pageHeader.actionBarOverflowAriaLabel", {
          ns: "common",
        })}
        allTagsModalSearchLabel={t("pageHeader.allTagsModalSearchLabel", {
          ns: "common",
        })}
        allTagsModalSearchPlaceholderText={t(
          "pageHeader.allTagsModalSearchPlaceholderText",
          { ns: "common" },
        )}
        allTagsModalTitle={t("pageHeader.allTagsModalTitle", { ns: "common" })}
        breadcrumbOverflowAriaLabel={t(
          "pageHeader.breadcrumbOverflowAriaLabel",
          { ns: "common" },
        )}
        breadcrumbs={[
          {
            href: `${import.meta.env.VITE_URL_PATH_PREFIX}#`,
            isCurrentPage: true,
            key: "breadcrumb-01",
            label: t("pageHeader.breadcrumbs.home", { ns: "common" }),
          },
        ]}
        collapseHeaderIconDescription={t(
          "pageHeader.collapseHeaderIconDescription",
          { ns: "common" },
        )}
        expandHeaderIconDescription={t(
          "pageHeader.expandHeaderIconDescription",
          {
            ns: "common",
          },
        )}
        pageActionsOverflowLabel={t("pageHeader.pageActionsOverflowLabel", {
          ns: "common",
        })}
        showAllTagsLabel={t("pageHeader.showAllTagsLabel", { ns: "common" })}
        subtitle={t("landingPage.pageHeader.subtitle")}
        title={{
          icon: function noRefCheck() {},
          loading: false,
          text: t("landingPage.pageHeader.title"),
        }}
        withoutBackground
      />
      <FlexGrid className="landing-page__grid">
        <Row>
          <Column className="landing-page__grey-column-background">
            <ExpressiveCard
              label={t("landingPage.expressiveCard.requirements.label")}
              mediaRatio={null}
              pictogram={() => {
                return <ResultDraft size="24" />;
              }}
              onPrimaryButtonClick={() => {
                globalDispatch({
                  type: ACTION_UPDATE_APP_HELP_STEP,
                  nextHelpStep: 1,
                });
              }}
              primaryButtonIcon={TaskView}
              primaryButtonText={t("btnLabel.ReviewInformation", {
                ns: "common",
              })}
              title={t("panel.information.requirementsHeader", {
                ns: "panels",
              })}
              className="landing-page__express-card"
            >
              <p>{t("panel.hint.explanation", { ns: "panels" })}</p>
            </ExpressiveCard>
            <ExpressiveCard
              label={t("landingPage.expressiveCard.tool.label")}
              mediaRatio={null}
              pictogram={() => {
                return <SettingsEdit size="24" />;
              }}
              onPrimaryButtonClick={() => {
                globalDispatch({
                  type: ACTION_UPDATE_APP_IS_EDITING,
                  nextIsEditing: true,
                });
              }}
              primaryButtonIcon={Edit}
              primaryButtonText={getPrimaryButtonTextForParamFileCard()}
              primaryButtonHref={`${import.meta.env.VITE_URL_PATH_PREFIX}#/edit`}
              secondaryButtonText={getSecondaryButtonTextForParamFileCard()}
              onSecondaryButtonClick={saveParamFileContentProxy}
              secondaryButtonIcon={DocumentDownload}
              title={getTitleForParamFileCard()}
              className="landing-page__express-card"
            >
              {hasParamFile() ? (
                <p>{t("landingPage.expressiveCard.tool.paraModify")}</p>
              ) : (
                <p>{t("landingPage.expressiveCard.tool.paraNew")}</p>
              )}
            </ExpressiveCard>
            <ExpressiveCard
              label={t("panel.nextSteps.header", { ns: "panels" })}
              mediaRatio={null}
              pictogram={() => {
                return <NextOutline size="24" />;
              }}
              primaryButtonText={t("btnLabel.ReviewInformation", {
                ns: "common",
              })}
              primaryButtonIcon={TaskView}
              onPrimaryButtonClick={() => {
                globalDispatch({
                  type: ACTION_UPDATE_APP_HELP_STEP,
                  nextHelpStep: 2,
                });
              }}
              title={t("modalHeading.showNextStepsInformation")}
              className="landing-page__express-card"
            >
              <p>{t("landingPage.expressiveCard.nextSteps.para")}</p>
            </ExpressiveCard>
          </Column>
        </Row>
      </FlexGrid>
    </>
  );
};

LandingPage.propTypes = {
  closeNotification: PropTypes.func.isRequired,
  resetToInitialState: PropTypes.func.isRequired,
};

export default LandingPage;
