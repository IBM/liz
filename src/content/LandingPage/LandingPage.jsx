/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { InlineNotification, FlexGrid, Row, Column, Link } from "@carbon/react";
import {
  ExpressiveCard,
  ProductiveCard,
  PageHeader,
} from "@carbon/ibm-products";
import {
  ResultDraft,
  SettingsEdit,
  NextOutline,
  DocumentDownload,
  Edit,
  Popup,
  CollapseAll,
  Add,
  Subtract,
} from "@carbon/icons-react";
import About from "../../components/About";
import {
  ADDRESS_TYPE_IPV4,
  ACTION_UPDATE_APP_STEP,
  ACTION_UPDATE_APP_IS_EDITING,
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
import { NextSteps, SystemRequirements } from "./components";
import "./_landing-page.scss";

const LandingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    state: globalState,
    dispatch,
    helper,
  } = React.useContext(ApplicationContext);

  const [requirementsCardIsExpanded, setRequirementsCardIsExpanded] =
    useState(false);
  const [nextStepsCardIsExpanded, setNextStepsCardIsExpanded] = useState(false);

  const { closeNotification, resetToInitialState } = helper;

  const showNotification = globalState.showNotification || false;
  const localStorageKeys = getLocalStorageKeys(globalState);
  const productiveCardsAreExpanded =
    requirementsCardIsExpanded || nextStepsCardIsExpanded;

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
    dispatch({
      type: ACTION_UPDATE_APP_STEP,
      nextStep: 9,
    });
    if (
      window.location.hash &&
      window.location.hash === "#/expanded-requirements-card"
    ) {
      setRequirementsCardIsExpanded(true);
    } else if (
      window.location.hash &&
      window.location.hash === "#/expanded-nextsteps-card"
    ) {
      setNextStepsCardIsExpanded(true);
    }
  }, []);

  const getBreadcrumbs = () => {
    const breadcrumbs = [
      {
        href: `${import.meta.env.VITE_URL_PATH_PREFIX}#`,
        isCurrentPage: true,
        key: "breadcrumb-01",
        label: t("pageHeader.breadcrumbs.home", { ns: "common" }),
      },
    ];

    if (requirementsCardIsExpanded) {
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
            setRequirementsCardIsExpanded(false);
          }}
        >
          {t("pageHeader.breadcrumbs.home", { ns: "common" })}
        </Link>
      );
    } else if (nextStepsCardIsExpanded) {
      breadcrumbs.push({
        href: `${import.meta.env.VITE_URL_PATH_PREFIX}#`,
        isCurrentPage: true,
        key: "breadcrumb-02",
        label: t("modalHeading.showNextStepsInformation"),
      });
      breadcrumbs[0].isCurrentPage = false;
      breadcrumbs[0].title = t("pageHeader.breadcrumbs.home", { ns: "common" });
      breadcrumbs[0].label = (
        <Link
          href={`${import.meta.env.VITE_URL_PATH_PREFIX}#`}
          onClick={() => {
            setNextStepsCardIsExpanded(false);
          }}
        >
          {t("pageHeader.breadcrumbs.home", { ns: "common" })}
        </Link>
      );
    }

    return breadcrumbs;
  };

  const hrefForRequirementsCard = requirementsCardIsExpanded
    ? `${import.meta.env.VITE_URL_PATH_PREFIX}#/expanded-requirements-card`
    : `${import.meta.env.VITE_URL_PATH_PREFIX}#/`;
  const hrefForNextStepsCard = nextStepsCardIsExpanded
    ? `${import.meta.env.VITE_URL_PATH_PREFIX}#/expanded-nextsteps-card`
    : `${import.meta.env.VITE_URL_PATH_PREFIX}#/`;

  const collapseRequirementsCard = () => {
    setRequirementsCardIsExpanded(false);
    navigate("/");
  };

  const collapseNextStepsCard = () => {
    setNextStepsCardIsExpanded(false);
    navigate("/");
  };

  const expandRequirementsCard = () => {
    setRequirementsCardIsExpanded(true);
    navigate("/expanded-requirements-card");
  };

  const expandNextStepsCard = () => {
    setNextStepsCardIsExpanded(true);
    navigate("/expanded-nextsteps-card");
  };

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
        className="landing-page__page-header"
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
        breadcrumbs={getBreadcrumbs()}
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
            {!nextStepsCardIsExpanded && (
              <ProductiveCard
                label={t("landingPage.expressiveCard.requirements.label")}
                mediaRatio={null}
                pictogram={() => {
                  return <ResultDraft size="24" />;
                }}
                onPrimaryButtonClick={() => {
                  if (requirementsCardIsExpanded) {
                    collapseRequirementsCard();
                  } else {
                    expandRequirementsCard();
                  }
                }}
                primaryButtonIcon={requirementsCardIsExpanded ? Subtract : Add}
                primaryButtonText={t("btnLabel.ReviewInformation", {
                  ns: "common",
                })}
                title={t("panel.information.requirementsHeader", {
                  ns: "panels",
                })}
                titleSize="large"
                className="landing-page__express-card"
                actionIcons={[
                  {
                    id: "landing-page__productive-card_expand-requirements",
                    href: hrefForRequirementsCard,
                    icon: requirementsCardIsExpanded
                      ? (props) => <CollapseAll size={16} {...props} />
                      : (props) => <Popup size={16} {...props} />,
                    onClick: () => {
                      if (requirementsCardIsExpanded) {
                        collapseRequirementsCard();
                      } else {
                        expandRequirementsCard();
                      }
                    },
                    iconDescription: requirementsCardIsExpanded
                      ? t("btnLabel.Collapse", { ns: "common" })
                      : t("btnLabel.Expand", { ns: "common" }),
                  },
                ]}
              >
                {requirementsCardIsExpanded && <SystemRequirements />}
                {!requirementsCardIsExpanded && (
                  <p>{t("panel.hint.explanation", { ns: "panels" })}</p>
                )}
              </ProductiveCard>
            )}
            {!productiveCardsAreExpanded && (
              <ExpressiveCard
                label={t("landingPage.expressiveCard.tool.label")}
                mediaRatio={null}
                pictogram={() => {
                  return <SettingsEdit size="24" />;
                }}
                onPrimaryButtonClick={() => {
                  dispatch({
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
            )}
            {!requirementsCardIsExpanded && (
              <ProductiveCard
                label={t("panel.nextSteps.header", { ns: "panels" })}
                mediaRatio={null}
                pictogram={() => <NextOutline size="24" />}
                primaryButtonText={t("btnLabel.ReviewInformation", {
                  ns: "common",
                })}
                primaryButtonIcon={nextStepsCardIsExpanded ? Subtract : Add}
                onPrimaryButtonClick={() => {
                  if (nextStepsCardIsExpanded) {
                    collapseNextStepsCard();
                  } else {
                    expandNextStepsCard();
                  }
                }}
                title={t("modalHeading.showNextStepsInformation")}
                titleSize="large"
                className="landing-page__express-card"
                actionIcons={[
                  {
                    id: "landing-page__productive-card_expand-nextsteps",
                    href: hrefForNextStepsCard,
                    icon: nextStepsCardIsExpanded
                      ? (props) => <CollapseAll size={16} {...props} />
                      : (props) => <Popup size={16} {...props} />,
                    onClick: () => {
                      if (nextStepsCardIsExpanded) {
                        collapseNextStepsCard();
                      } else {
                        expandNextStepsCard();
                      }
                    },
                    iconDescription: nextStepsCardIsExpanded
                      ? t("btnLabel.Collapse", { ns: "common" })
                      : t("btnLabel.Expand", { ns: "common" }),
                  },
                ]}
              >
                {nextStepsCardIsExpanded && <NextSteps {...nextStepsProps} />}
                {!nextStepsCardIsExpanded && (
                  <p>{t("landingPage.expressiveCard.nextSteps.para")}</p>
                )}
              </ProductiveCard>
            )}
          </Column>
        </Row>
      </FlexGrid>
    </>
  );
};

export default LandingPage;
