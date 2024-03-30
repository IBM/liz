/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { InlineNotification } from "@carbon/react";
import { CreateFullPage, PageHeader } from "@carbon/ibm-products";
import { getSteps, getInlineNotification } from "../../uiUtil/panel-utils";
import { ApplicationContext } from "../../App";
import {
  ACTION_UPDATE_APP_STEP,
  ACTION_UPDATE_APP_NEXT_STEP,
  ACTION_UPDATE_APP_IS_EDITING,
  ACTION_UPDATE_APP_SHOW_LEGAL_NOTIFICATION,
  DEFAULT_PARAM_FILE_NAME,
  LOCAL_STORAGE_KEY_APP_INLINE_NOTIFICATION,
} from "../../util/constants";
import {
  saveParamFileContent,
  getParamFileContents,
} from "../../util/param-file-util";
import {
  pruneSettings,
  getLocalStorageKeys,
  parmfileCardIsExpanded,
} from "../../util/local-storage-util";
import About from "../../components/About";
import "./_edit-page.scss";

const EditPage = () => {
  const { t } = useTranslation();
  const { state, dispatch, helper, config } =
    React.useContext(ApplicationContext);
  const { closeNotification, resetToInitialState } = helper;
  const { panelConfig } = config;
  const navigate = useNavigate();

  const hasLocalStorageState = state.useStateFromLocalStorage;
  const showNotification = state.showNotification || false;
  const showInlineNotification = state.showLegalNotification;
  const localStorageKeys = getLocalStorageKeys(state);

  const CLASS_WITH_LEGAL_BANNER = "edit-page__full-page__w-legal-banner";
  const CLASS_WITHOUT_LEGAL_BANNER = "edit-page__full-page__wo-legal-banner";

  const updateStep = (step) => {
    dispatch({
      type: ACTION_UPDATE_APP_STEP,
      nextStep: step,
    });
  };

  const updateNextStep = (nextStep) => {
    dispatch({
      type: ACTION_UPDATE_APP_NEXT_STEP,
      nextNextStep: nextStep,
    });
  };

  const updateShowLegalNotification = (showLegalNotification) => {
    dispatch({
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

  const fullPageClassName = showInlineNotification
    ? CLASS_WITH_LEGAL_BANNER
    : CLASS_WITHOUT_LEGAL_BANNER;

  const onCloseInlineNotification = () => {
    const localInlineNotification = Object.assign({}, inlineNotification);
    localInlineNotification.show = false;

    updateShowLegalNotification(false);
    localStorage.setItem(
      LOCAL_STORAGE_KEY_APP_INLINE_NOTIFICATION,
      JSON.stringify(localInlineNotification),
    );
  };

  const createParamFile = () => {
    const downloadParamFile = state?.steps?.summary?.downloadParmfile ?? false;
    const downloadParamFileName =
      state?.steps?.summary?.downloadParmfileName ?? "";

    if (downloadParamFile) {
      const paramFileContents = getParamFileContents();

      if (paramFileContents.length > 0) {
        saveParamFileContent(
          paramFileContents,
          downloadParamFileName.length > 0
            ? downloadParamFileName
            : DEFAULT_PARAM_FILE_NAME,
        );
      }
    }
  };

  const subtitleNew = t("editPage.pageHeader.subtitle.new");
  const subtitleModify = t("editPage.pageHeader.subtitle.modify");
  const subtitle = hasLocalStorageState ? subtitleModify : subtitleNew;

  const titleNew = t("editPage.pageHeader.title.new");
  const titleModify = t("editPage.pageHeader.title.modify");
  const title = hasLocalStorageState ? titleModify : titleNew;

  const submitButtonCreate = t("btnLabel.Create", { ns: "common" });
  const submitButtonModify = t("btnLabel.Modify", { ns: "common" });
  const submitButton = hasLocalStorageState
    ? submitButtonModify
    : submitButtonCreate;

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
          className="edit-page__legal-banner"
        />
      )}

      <PageHeader
        className="edit-page__page-header"
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
            href: `${import.meta.env.VITE_URL_PATH_PREFIX}${parmfileCardIsExpanded() ? "#/expanded-parmfile-card" : "#"}`,
            key: "breadcrumb-01",
            label: t("pageHeader.breadcrumbs.home", { ns: "common" }),
          },
          {
            href: `${import.meta.env.VITE_URL_PATH_PREFIX}#/edit/`,
            isCurrentPage: true,
            key: "breadcrumb-02",
            label: t("pageHeader.breadcrumbs.composeParmfile", {
              ns: "common",
            }),
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
        subtitle={subtitle}
        title={{
          icon: function noRefCheck() {},
          loading: false,
          text: title,
        }}
        withoutBackground
      />
      <CreateFullPage
        className={fullPageClassName}
        backButtonText={t("btnLabel.Back", { ns: "common" })}
        cancelButtonText={t("btnLabel.Cancel", { ns: "common" })}
        modalDangerButtonText={t(
          "editPage.createFullPage.modalDangerButtonText",
        )}
        modalDescription={t("editPage.createFullPage.modalDescription")}
        modalSecondaryButtonText={t(
          "editPage.createFullPage.modalSecondaryButtonText",
        )}
        modalTitle={t("editPage.createFullPage.modalTitle")}
        nextButtonText={t("btnLabel.Next", { ns: "common" })}
        onClose={() => {
          dispatch({
            type: ACTION_UPDATE_APP_IS_EDITING,
            nextIsEditing: false,
          });
          navigate(
            `${parmfileCardIsExpanded() ? "/expanded-parmfile-card" : "/"}`,
          );
        }}
        onRequestSubmit={createParamFile}
        secondaryTitle=""
        submitButtonText={submitButton}
      >
        {getSteps({ panelConfig, updateStep, updateNextStep })}
      </CreateFullPage>
    </>
  );
};

export default EditPage;
