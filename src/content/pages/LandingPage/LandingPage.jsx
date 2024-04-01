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
import { useNavigate } from "react-router-dom";
import {
  Button,
  InlineNotification,
  Link,
  Layer,
  FlexGrid,
  Row,
  Column,
} from "@carbon/react";
import {
  Popup,
  CollapseAll,
  Add,
  Edit,
  Linux,
  Subtract,
  Warning,
  CheckmarkOutline,
  Incomplete,
  DocumentDownload,
} from "@carbon/icons-react";
import { PageHeader, ExpressiveCard } from "@carbon/ibm-products";
import {
  ADDRESS_TYPE_IPV4,
  DEFAULT_PARAM_FILE_NAME,
} from "../../../util/constants";
import {
  STATE_ORIGIN_STORAGE,
  LOCAL_STORAGE_KEY_APP_LANDING_PAGE,
  LOCAL_STORAGE_KEY_APP_INLINE_NOTIFICATION,
} from "../../../util/local-storage-constants";
import {
  saveParamFileContent,
  getParamFileContents,
  getParamFileName,
  hasParamFile,
} from "../../../util/param-file-util";
import { getInlineNotification } from "../../../uiUtil/panel-util";
import { LandingPageContext, ApplicationContext } from "../../../contexts";
import { SystemRequirements, Parmfile, NextSteps } from "./components";
import "./_landing-page.scss";

const LandingPage = forwardRef(function LandingPage(props, ref) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    state,
    updateRequirementsCardIsExpanded,
    updateNextStepsCardIsExpanded,
    updateParmfileCardIsExpanded,
    updateRequirementsCardHasBeenReviewed,
    updateNextStepsCardHasBeenReviewed,
  } = useContext(LandingPageContext);
  const {
    state: globalState,
    updateStep,
    updateShowLegalNotification,
    updateIsEditing,
  } = useContext(ApplicationContext);
  const publicRef = {
    persistState: () => {
      localStorage.setItem(
        LOCAL_STORAGE_KEY_APP_LANDING_PAGE,
        JSON.stringify({
          ...state,
          origin: STATE_ORIGIN_STORAGE,
        }),
      );
    },
  };

  useEffect(() => {
    updateStep(9);
    if (
      window.location.hash &&
      window.location.hash === "#/expanded-requirements-card"
    ) {
      updateRequirementsCardIsExpanded(true);
    } else if (
      window.location.hash &&
      window.location.hash === "#/expanded-nextsteps-card"
    ) {
      updateNextStepsCardIsExpanded(true);
    }
  }, []);

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

  const getBreadcrumbs = () => {
    const breadcrumbs = [
      {
        href: `${import.meta.env.VITE_URL_PATH_PREFIX}#`,
        isCurrentPage: true,
        key: "breadcrumb-01",
        label: t("pageHeader.breadcrumbs.home", { ns: "common" }),
      },
    ];

    if (state.requirementsCardIsExpanded) {
      breadcrumbs.push({
        href: `${import.meta.env.VITE_URL_PATH_PREFIX}#`,
        isCurrentPage: true,
        key: "breadcrumb-02",
        label: t("panel.information.requirementsHeader", {
          ns: "panels",
        }),
      });
      breadcrumbs[0].isCurrentPage = false;
      breadcrumbs[0].title = t("pageHeader.breadcrumbs.home", { ns: "common" });
      breadcrumbs[0].label = (
        <Link
          href={`${import.meta.env.VITE_URL_PATH_PREFIX}#`}
          onClick={() => {
            updateRequirementsCardIsExpanded(false);
          }}
        >
          {t("pageHeader.breadcrumbs.home", { ns: "common" })}
        </Link>
      );
    } else if (state.nextStepsCardIsExpanded) {
      breadcrumbs.push({
        href: `${import.meta.env.VITE_URL_PATH_PREFIX}#`,
        isCurrentPage: true,
        key: "breadcrumb-03",
        label: t("modalHeading.showNextStepsInformation"),
      });
      breadcrumbs[0].isCurrentPage = false;
      breadcrumbs[0].title = t("pageHeader.breadcrumbs.home", { ns: "common" });
      breadcrumbs[0].label = (
        <Link
          href={`${import.meta.env.VITE_URL_PATH_PREFIX}#`}
          onClick={() => {
            updateNextStepsCardIsExpanded(false);
          }}
        >
          {t("pageHeader.breadcrumbs.home", { ns: "common" })}
        </Link>
      );
    }

    return breadcrumbs;
  };

  const pageHeaderMarkup = (
    <PageHeader
      className="liz__landing-page__page-header"
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
      breadcrumbs={getBreadcrumbs()}
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
      subtitle={t("landingPage.pageHeader.subtitle")}
      title={{
        icon: function noRefCheck() {},
        loading: false,
        text: t("landingPage.pageHeader.title"),
      }}
    />
  );

  const rootLayerClassName = showInlineNotification
    ? "liz__landing-page__root-layer__with-legal-banner"
    : "liz__landing-page__root-layer__wo-legal-banner";

  const hideRequirementsCard =
    state.parmfileCardIsExpanded || state.nextStepsCardIsExpanded;
  const hideParmfileCard =
    state.requirementsCardIsExpanded || state.nextStepsCardIsExpanded;
  const hideNextStepsCard =
    state.parmfileCardIsExpanded || state.requirementsCardIsExpanded;

  const productiveCardPrimaryButtonText =
    hideRequirementsCard || hideNextStepsCard
      ? t("btnLabel.Close", { ns: "common" })
      : t("btnLabel.ReviewInformation", { ns: "common" });

  const classNameForRequirementsCardTitle =
    state.requirementsCardHasBeenReviewed
      ? "liz__landing-page__page-header__productive-card-title__complete-icon"
      : "liz__landing-page__page-header__productive-card-title__incomplete-icon";
  const titleForRequirementsCard = state.requirementsCardHasBeenReviewed ? (
    <>
      <span className="liz__landing-page__page-header__productive-card-title__text">
        {t("panel.information.requirementsHeader", { ns: "panels" })}
      </span>
      <Button
        hasIconOnly
        className={classNameForRequirementsCardTitle}
        size="sm"
        kind="ghost"
        iconDescription={t("leftNavigation.descriptionForCompleteStep")}
        onClick={function noRefCheck() {}}
        renderIcon={CheckmarkOutline}
      />
    </>
  ) : (
    <>
      <span className="liz__landing-page__page-header__productive-card-title__text">
        {t("panel.information.requirementsHeader", { ns: "panels" })}
      </span>
      <Button
        hasIconOnly
        className={classNameForRequirementsCardTitle}
        size="sm"
        kind="ghost"
        iconDescription={t("leftNavigation.descriptionForIncompleteStep")}
        onClick={function noRefCheck() {}}
        renderIcon={Incomplete}
      />
    </>
  );

  const collapseParmfileCard = () => {
    updateParmfileCardIsExpanded(false);
    navigate("/");
  };

  const collapseRequirementsCard = () => {
    updateRequirementsCardIsExpanded(false);
    updateRequirementsCardHasBeenReviewed(true);
    navigate("/");
  };

  const collapseNextStepsCard = () => {
    updateNextStepsCardIsExpanded(false);
    updateNextStepsCardHasBeenReviewed(true);
    navigate("/");
  };

  const expandParmfileCard = () => {
    updateRequirementsCardIsExpanded(false);
    updateParmfileCardIsExpanded(true);
    updateNextStepsCardIsExpanded(false);
    navigate("/expanded-parmfile-card");
  };

  const expandRequirementsCard = () => {
    updateRequirementsCardIsExpanded(true);
    updateParmfileCardIsExpanded(false);
    updateNextStepsCardIsExpanded(false);
    navigate("/expanded-requirements-card");
  };

  const expandNextStepsCard = () => {
    updateRequirementsCardIsExpanded(false);
    updateParmfileCardIsExpanded(false);
    updateNextStepsCardIsExpanded(true);
    navigate("/expanded-nextsteps-card");
  };

  const requirementsCardMarkup = (
    <>
      {!hideRequirementsCard && (
        <ExpressiveCard
          label={t("landingPage.expressiveCard.requirements.label")}
          mediaRatio={null}
          onPrimaryButtonClick={() => {
            if (state.requirementsCardIsExpanded) {
              collapseRequirementsCard();
            } else {
              expandRequirementsCard();
            }
          }}
          primaryButtonIcon={state.requirementsCardIsExpanded ? Subtract : Add}
          primaryButtonText={productiveCardPrimaryButtonText}
          title={titleForRequirementsCard}
          titleSize="large"
          className="liz__landing-page__expressive-card"
          actionIcons={[
            {
              id: "liz__landing-page__expressive-card_expand-requirements",
              icon: state.requirementsCardIsExpanded
                ? (props) => <CollapseAll size={16} {...props} />
                : (props) => <Popup size={16} {...props} />,
              onClick: () => {
                if (state.requirementsCardIsExpanded) {
                  collapseRequirementsCard();
                } else {
                  expandRequirementsCard();
                }
              },
              iconDescription: state.requirementsCardIsExpanded
                ? t("btnLabel.Collapse", { ns: "common" })
                : t("btnLabel.Expand", { ns: "common" }),
            },
          ]}
          actionsPlacement="top"
        >
          {state.requirementsCardIsExpanded && <SystemRequirements />}
          {!state.requirementsCardIsExpanded && (
            <p>{t("panel.hint.explanation", { ns: "panels" })}</p>
          )}
        </ExpressiveCard>
      )}
    </>
  );

  const getActionIconsForParmfileCard = () => {
    const distributionName =
      globalState.steps.inputFileSelection.distributionName;
    const hasDistributionName =
      distributionName &&
      typeof distributionName === "string" &&
      distributionName.length > 0;
    const distributionVersion =
      globalState.steps.inputFileSelection.distributionVersion;
    const hasDistributionVersion =
      distributionVersion &&
      typeof distributionVersion === "string" &&
      distributionVersion.length > 0;

    if (hasParamFile() && hasDistributionName && hasDistributionVersion) {
      const iconMarkup = () => <Linux size={20} />;
      return [
        {
          id: "liz__landing-page__expressive-card_show-distribution-info",
          icon: iconMarkup,
          onClick: () => {
            if (state.parmfileCardIsExpanded) {
              collapseParmfileCard();
            } else {
              expandParmfileCard();
            }
          },
          iconDescription: state.parmfileCardIsExpanded
            ? t("btnLabel.Collapse", { ns: "common" })
            : t("btnLabel.Expand", { ns: "common" }),
        },
      ];
    }
    return null;
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

  const hasInvalidSteps = () => {
    const steps = globalState.steps;
    const stepKeys = Object.keys(steps);
    let hasInvalidSteps = false;

    stepKeys.forEach((key) => {
      if (steps[key].invalid) {
        hasInvalidSteps = true;
      }
    });

    return hasInvalidSteps;
  };
  const hasIncompleteSteps = () => {
    const steps = globalState.steps;
    const stepKeys = Object.keys(steps);
    let hasIncompleteSteps = false;

    stepKeys.forEach((key) => {
      if (!steps[key].complete) {
        hasIncompleteSteps = true;
      }
    });

    return hasIncompleteSteps;
  };
  const getClassNameForParmfileCardTitle = () => {
    if (hasParamFile() && hasInvalidSteps()) {
      return "liz__landing-page__page-header__productive-card-title__incomplete-error-icon";
    } else if (hasParamFile() && hasIncompleteSteps()) {
      return "liz__landing-page__page-header__productive-card-title__incomplete-icon";
    } else if (!hasParamFile()) {
      return "liz__landing-page__page-header__productive-card-title__incomplete-icon";
    }

    return "liz__landing-page__page-header__productive-card-title__complete-icon";
  };
  const getIconForParmfileCardTitle = () => {
    if (hasParamFile() && hasInvalidSteps()) {
      return (
        <Button
          hasIconOnly
          className={getClassNameForParmfileCardTitle()}
          size="sm"
          kind="ghost"
          iconDescription={t("leftNavigation.descriptionForInvalidStep")}
          onClick={function noRefCheck() {}}
          renderIcon={Warning}
        />
      );
    } else if (hasParamFile() && hasIncompleteSteps()) {
      return (
        <Button
          hasIconOnly
          className={getClassNameForParmfileCardTitle()}
          size="sm"
          kind="ghost"
          iconDescription={t("leftNavigation.descriptionForIncompleteStep")}
          onClick={function noRefCheck() {}}
          renderIcon={Incomplete}
        />
      );
    } else if (!hasParamFile()) {
      return (
        <Button
          hasIconOnly
          className={getClassNameForParmfileCardTitle()}
          size="sm"
          kind="ghost"
          iconDescription={t("leftNavigation.descriptionForIncompleteStep")}
          onClick={function noRefCheck() {}}
          renderIcon={Incomplete}
        />
      );
    }

    return (
      <Button
        hasIconOnly
        className={getClassNameForParmfileCardTitle()}
        size="sm"
        kind="ghost"
        iconDescription={t("leftNavigation.descriptionForCompleteStep")}
        onClick={function noRefCheck() {}}
        renderIcon={CheckmarkOutline}
      />
    );
  };
  const titleForParmfileCard = hasParamFile() ? (
    <>
      <span className="liz__landing-page__page-header__productive-card-title__text">
        {getTitleForParamFileCard()}
      </span>
      <span className={getClassNameForParmfileCardTitle()}>
        {getIconForParmfileCardTitle()}
      </span>
    </>
  ) : (
    <>
      <span className="liz__landing-page__page-header__productive-card-title__text">
        {getTitleForParamFileCard()}
      </span>
      <span className={getClassNameForParmfileCardTitle()}>
        {getIconForParmfileCardTitle()}
      </span>
    </>
  );

  const parmfileCardMarkup = (
    <>
      {!hideParmfileCard && (
        <ExpressiveCard
          label={t("landingPage.expressiveCard.tool.label")}
          mediaRatio={null}
          onPrimaryButtonClick={() => {
            updateIsEditing(true);
          }}
          actionIcons={getActionIconsForParmfileCard()}
          actionsPlacement="top"
          primaryButtonIcon={Edit}
          primaryButtonText={getPrimaryButtonTextForParamFileCard()}
          primaryButtonHref={`${import.meta.env.VITE_URL_PATH_PREFIX}#/edit`}
          secondaryButtonText={getSecondaryButtonTextForParamFileCard()}
          onSecondaryButtonClick={saveParamFileContentProxy}
          secondaryButtonIcon={DocumentDownload}
          secondaryButtonKind="ghost"
          title={titleForParmfileCard}
          titleSize="large"
          className="liz__landing-page__expressive-card"
        >
          {state.parmfileCardIsExpanded && (
            <Parmfile
              parmfile={globalState.steps.downloadParamFile.contents}
              distributionName={
                globalState.steps.inputFileSelection.distributionName
              }
              distributionVersion={
                globalState.steps.inputFileSelection.distributionVersion
              }
            />
          )}
          {!state.parmfileCardIsExpanded &&
            (hasParamFile() ? (
              <p>{t("landingPage.expressiveCard.tool.paraModify")}</p>
            ) : (
              <p>{t("landingPage.expressiveCard.tool.paraNew")}</p>
            ))}
        </ExpressiveCard>
      )}
    </>
  );

  const classNameForNextStepsCardTitle = state.nextStepsCardHasBeenReviewed
    ? "liz__landing-page__page-header__productive-card-title__complete-icon"
    : "liz__landing-page__page-header__productive-card-title__incomplete-icon";
  const titleForNextStepsCard = state.nextStepsCardHasBeenReviewed ? (
    <>
      <span className="liz__landing-page__page-header__productive-card-title__text">
        {t("modalHeading.showNextStepsInformation")}
      </span>
      <Button
        hasIconOnly
        className={classNameForNextStepsCardTitle}
        size="sm"
        kind="ghost"
        iconDescription={t("leftNavigation.descriptionForCompleteStep")}
        onClick={function noRefCheck() {}}
        renderIcon={CheckmarkOutline}
      />
    </>
  ) : (
    <>
      <span className="liz__landing-page__page-header__productive-card-title__text">
        {t("modalHeading.showNextStepsInformation")}
      </span>
      <Button
        hasIconOnly
        className={classNameForNextStepsCardTitle}
        size="sm"
        kind="ghost"
        iconDescription={t("leftNavigation.descriptionForIncompleteStep")}
        onClick={function noRefCheck() {}}
        renderIcon={Incomplete}
      />
    </>
  );

  const useSsh = globalState.steps.installationParameters.ssh.enabled;
  const useVnc = globalState.steps.installationParameters.vnc.enabled;
  const networkAddress =
    globalState.steps.networkAddress.addressType === ADDRESS_TYPE_IPV4
      ? globalState.steps.networkAddress.ipv4.address
      : globalState.steps.networkAddress.ipv6.address;
  const vncPassword = globalState.steps.installationParameters.vnc.password;
  const nextStepsProps = {
    useSsh,
    useVnc,
    networkAddress,
    addressType: globalState.steps.networkAddress.addressType,
    vncPassword,
  };

  const nextStepsCardMarkup = (
    <>
      {!hideNextStepsCard && (
        <ExpressiveCard
          label={t("panel.nextSteps.header", { ns: "panels" })}
          mediaRatio={null}
          primaryButtonText={productiveCardPrimaryButtonText}
          primaryButtonIcon={state.nextStepsCardIsExpanded ? Subtract : Add}
          onPrimaryButtonClick={() => {
            if (state.nextStepsCardIsExpanded) {
              collapseNextStepsCard();
            } else {
              expandNextStepsCard();
            }
          }}
          title={titleForNextStepsCard}
          titleSize="large"
          className="liz__landing-page__expressive-card"
          actionIcons={[
            {
              id: "liz__landing-page__productive-card_expand-nextsteps",
              icon: state.nextStepsCardIsExpanded
                ? (props) => <CollapseAll size={16} {...props} />
                : (props) => <Popup size={16} {...props} />,
              onClick: () => {
                if (state.nextStepsCardIsExpanded) {
                  collapseNextStepsCard();
                } else {
                  expandNextStepsCard();
                }
              },
              iconDescription: state.nextStepsCardIsExpanded
                ? t("btnLabel.Collapse", { ns: "common" })
                : t("btnLabel.Expand", { ns: "common" }),
            },
          ]}
          actionsPlacement="top"
        >
          {state.nextStepsCardIsExpanded && <NextSteps {...nextStepsProps} />}
          {!state.nextStepsCardIsExpanded && (
            <p>{t("landingPage.expressiveCard.nextSteps.para")}</p>
          )}
        </ExpressiveCard>
      )}
    </>
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
          className="liz__landing-page__legal-banner"
        />
      )}
      <Layer className={rootLayerClassName}>
        {pageHeaderMarkup}
        <Layer className="liz__landing-page__grid-layer">
          <FlexGrid className="liz__landing-page__grid">
            <Row>
              <Column className="liz__landing-page__grid__card-column">
                {requirementsCardMarkup}
                {parmfileCardMarkup}
                {nextStepsCardMarkup}
              </Column>
            </Row>
          </FlexGrid>
        </Layer>
      </Layer>
    </>
  );
});

export default LandingPage;
