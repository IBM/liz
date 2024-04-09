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
import { useTranslation } from "react-i18next";
import { useNavigate, useHref } from "react-router-dom";
import {
  InlineNotification,
  Layer,
  FlexGrid,
  Row,
  Column,
  Link,
} from "@carbon/react";
import { PageHeader, CreateFullPage } from "@carbon/ibm-products";
import {
  STATE_ORIGIN_STORAGE,
  LOCAL_STORAGE_KEY_APP_EDIT_PAGE,
  LOCAL_STORAGE_KEY_APP_INLINE_NOTIFICATION,
} from "../../../util/local-storage-constants";
import { DEFAULT_PARAM_FILE_NAME } from "../../../util/constants";
import {
  EditPageContext,
  ApplicationContext,
  HeaderContext,
} from "../../../contexts";
import { parmfileCardIsExpanded } from "../../../util/local-storage-util";
import {
  saveParamFileContent,
  getParamFileContents,
} from "../../../util/param-file-util";
import PathConstants from "../../../util/path-constants";
import { getSteps, getInlineNotification } from "../../../uiUtil/panel-util";
import "./_edit-page.scss";

const EditPage = forwardRef(function EditPage(props, ref) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const expandedParmfileCardHref = useHref(
    PathConstants.EXPANDED_PARMFILE_CARD,
  );
  const homePageHref = useHref(PathConstants.HOME);
  const editPageHref = useHref(PathConstants.EDIT);
  const { state } = useContext(EditPageContext);
  const {
    state: globalState,
    config,
    updateStep,
    updateNextStep,
    updateShowLegalNotification,
    updateIsEditing,
    updateIncludeIntroStep,
    updateUseStateFromLocalStorage,
  } = useContext(ApplicationContext);
  const { state: headerState, updateNeedsManualNavigationConfirmation } =
    useContext(HeaderContext);
  const { panelConfig } = config;
  const publicRef = {
    persistState: () => {
      localStorage.setItem(
        LOCAL_STORAGE_KEY_APP_EDIT_PAGE,
        JSON.stringify({
          ...state,
          origin: STATE_ORIGIN_STORAGE,
        }),
      );
    },
  };

  useEffect(publicRef.persistState, [state]);
  useImperativeHandle(ref, () => publicRef);

  const hasLocalStorageState = globalState.useStateFromLocalStorage;

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

  const hasTabs = state.hasTabs;
  const tabs = state.tabs;

  const inlineNotification = getInlineNotification(
    t("legalNotice.headerLabel"),
    t("legalNotice.contentLabel"),
  );
  const showInlineNotification = inlineNotification
    ? inlineNotification.show
    : false;

  const subtitleNew = t("editPage.pageHeader.subtitle.new");
  const subtitleModify = t("editPage.pageHeader.subtitle.modify");
  const subtitle = hasLocalStorageState ? subtitleModify : subtitleNew;

  const titleNew = t("editPage.pageHeader.title.new");
  const titleModify = t("editPage.pageHeader.title.modify");
  const title = hasLocalStorageState ? titleModify : titleNew;

  const submitButton = t("btnLabel.Finish", { ns: "common" });

  const labelForHomeLink = !headerState.needsManualNavigationConfirmation ? (
    <Link
      className="liz__edit-page__link-cursor"
      onClick={() => {
        updateNeedsManualNavigationConfirmation(true);
      }}
    >
      {t("pageHeader.breadcrumbs.home", { ns: "common" })}
    </Link>
  ) : (
    t("pageHeader.breadcrumbs.home", { ns: "common" })
  );

  const pageHeaderMarkup = (
    <PageHeader
      navigation={hasTabs ? tabs : null}
      className="liz__edit-page__page-header"
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
      breadcrumbOverflowAriaLabel={t("pageHeader.breadcrumbOverflowAriaLabel", {
        ns: "common",
      })}
      breadcrumbs={[
        {
          href: parmfileCardIsExpanded()
            ? expandedParmfileCardHref
            : homePageHref,
          key: "breadcrumb-01",
          label: labelForHomeLink,
          title: t("pageHeader.breadcrumbs.home", { ns: "common" }),
        },
        {
          href: editPageHref,
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
      expandHeaderIconDescription={t("pageHeader.expandHeaderIconDescription", {
        ns: "common",
      })}
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
    />
  );

  const rootLayerClassName = showInlineNotification
    ? "liz__edit-page__root-layer__with-legal-banner"
    : "liz__edit-page__root-layer__wo-legal-banner";

  const CLASS_WITH_LEGAL_BANNER =
    "liz__edit-page__full-page__with-legal-banner";
  const CLASS_WITHOUT_LEGAL_BANNER =
    "liz__edit-page__full-page__wo-legal-banner";

  const fullPageClassName = showInlineNotification
    ? CLASS_WITH_LEGAL_BANNER
    : CLASS_WITHOUT_LEGAL_BANNER;

  const createFullPageMarkup = (
    <CreateFullPage
      className={fullPageClassName}
      backButtonText={t("btnLabel.Back", { ns: "common" })}
      cancelButtonText={t("btnLabel.Cancel", { ns: "common" })}
      modalDangerButtonText={t("editPage.createFullPage.modalDangerButtonText")}
      modalDescription={t("editPage.createFullPage.modalDescription")}
      modalSecondaryButtonText={t(
        "editPage.createFullPage.modalSecondaryButtonText",
      )}
      modalTitle={t("editPage.createFullPage.modalTitle")}
      nextButtonText={t("btnLabel.Next", { ns: "common" })}
      onClose={() => {
        updateIsEditing(false);
        updateIncludeIntroStep(false);
        updateUseStateFromLocalStorage(true);
        navigate(
          `${parmfileCardIsExpanded() ? PathConstants.EXPANDED_PARMFILE_CARD : PathConstants.HOME}`,
        );
      }}
      onRequestSubmit={createParamFile}
      secondaryTitle=""
      submitButtonText={submitButton}
    >
      {getSteps({ panelConfig, updateStep, updateNextStep })}
    </CreateFullPage>
  );

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
          className="liz__edit-page__legal-banner"
        />
      )}
      <Layer className={rootLayerClassName}>
        {pageHeaderMarkup}
        <Layer className="liz__edit-page__grid-layer">
          <FlexGrid className="liz__edit-page__grid">
            <Row>
              <Column className="liz__edit-page__grid__flow-column">
                {createFullPageMarkup}
              </Column>
            </Row>
          </FlexGrid>
        </Layer>
      </Layer>
    </>
  );
});

export default EditPage;
