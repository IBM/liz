/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, {
    forwardRef,
    useEffect,
    useContext,
    useImperativeHandle,
} from "react";
import { useTranslation } from "react-i18next";
import {
    Dropdown,
    /* FileUploader, */ FlexGrid,
    Row,
    Column,
    Layer,
    ActionableNotification,
    InlineNotification,
} from "@carbon/react";
import {
    STATE_ORIGIN_USER,
    STATE_ORIGIN_STORAGE,
    LOCAL_STORAGE_KEY_INPUT_FILE_SELECTION,
} from "../../../util/local-storage-constants";
import {
    DEVICE_TYPE_OSA,
    ADDRESS_TYPE_IPV4,
    MAJORITY_EXPERIMENTAL,
    DISTRIBUTION_LIST,
    VERSION_LIST,
    SLES_DISTRIBUTION_ID,
    UBUNTU_DISTRIBUTION_ID,
} from "../../../util/constants";
import {
    ApplicationContext,
    InputFileSelectionContext,
    DownloadParamFileContext,
    NetworkAddressContext,
    NetworkDeviceContext,
    InstallationParameterContext,
} from "../../../contexts";
import { updateIsDisabled as updateIsDisabledFromUtils } from "../../../util/panel-util";
import { resetParamFileTextAreaData } from "../../../uiUtil/panel-util";
import { setItem } from "../../../util/local-storage-util";
import "./_input-file-selection.scss";

const InputFileSelection = forwardRef(function InputFileSelection(props, ref) {
    const {
        state: globalState,
        updateModified: globalUpdateModified,
        updateNextStep,
        updateIsDirty,
        updateIsDisabled,
    } = useContext(ApplicationContext);
    const { updateModified, updateParamFileContent } = useContext(
        DownloadParamFileContext
    );
    const { t } = useTranslation();
    const {
        state,
        updateSelectedDistributionName,
        updateSelectedDistributionVersion,
    } = useContext(InputFileSelectionContext);
    const { updateUseSsh } = React.useContext(InstallationParameterContext);
    const { updateAddressType } = React.useContext(NetworkAddressContext);
    const { updateSelectedDeviceType } = React.useContext(NetworkDeviceContext);
    const publicRef = {
        persistState: () => {
            isComplete((error, isComplete) => {
                let mergedSteps = {};

                if (!error) {
                    mergedSteps = {
                        ...globalState,
                        steps: {
                            ...globalState.steps,
                            inputFileSelection: {
                                ...globalState.steps.inputFileSelection,
                                distributionName:
                                    state.selectedDistributionName &&
                                    state.selectedDistributionName.id
                                        ? state.selectedDistributionName.id
                                        : "",
                                distributionVersion:
                                    state.selectedDistributionVersion &&
                                    state.selectedDistributionVersion.id
                                        ? state.selectedDistributionVersion.id
                                        : "",
                                complete: isComplete,
                                disabled: false,
                                invalid: false,
                                origin: STATE_ORIGIN_USER,
                            },
                        },
                    };

                    updateNextStep(mergedSteps.steps);
                    updateIsDirty(true);
                    updateIsDisabled(
                        updateIsDisabledFromUtils(mergedSteps.steps)
                    );
                }
            });

            setItem(
                LOCAL_STORAGE_KEY_INPUT_FILE_SELECTION,
                JSON.stringify({
                    ...state,
                    origin: STATE_ORIGIN_STORAGE,
                })
            );
        },
    };

    useEffect(publicRef.persistState, [state]);
    useImperativeHandle(ref, () => publicRef);

    const paramFileHasBeenModifiedFromState =
        globalState?.steps.downloadParamFile?.modified ?? false;
    const majority = state?.selectedDistributionName?.majority;
    const dropdownContentStyle =
        majority === MAJORITY_EXPERIMENTAL
            ? "input-file-selection__dropdown-content-experimental"
            : "input-file-selection__dropdown-content-stable";

    const isComplete = (callback) => {
        if (
            typeof state.selectedDistributionName === "object" &&
            typeof state.selectedDistributionName.label === "string" &&
            state.selectedDistributionName.label.length > 0 &&
            typeof state.selectedDistributionVersion === "object" &&
            typeof state.selectedDistributionVersion.label === "string" &&
            state.selectedDistributionVersion.label.length > 0
        ) {
            return callback(null, true);
        }
        return callback(null, false);
    };

    const parmfileHasBeenModifiedNotificationMarkup = (
        <ActionableNotification
            hideCloseButton
            inline
            lowContrast
            className="input-file-selection_parmfile-purge-banner"
            actionButtonLabel={t("btnLabel.Reset", { ns: "common" })}
            aria-label="closes notification"
            kind="info"
            onActionButtonClick={() => {
                resetParamFileTextAreaData({
                    updateParamFileContent,
                    globalUpdateModified,
                    updateModified,
                    state: globalState,
                });
            }}
            onClose={function noRefCheck() {}}
            onCloseButtonClick={function noRefCheck() {}}
            statusIconDescription="notification"
            subtitle={t("panel.parmFileHasBeenModifiedNotificationSubtitle", {
                ns: "common",
            })}
            title={t("modalHeading.discardParamFileModificationsPrompt")}
        />
    );

    const experimentalNotificationMarkup = (
        <InlineNotification
            hideCloseButton
            lowContrast
            kind="info"
            className="input-file-selection__experimental-notification"
            onClose={function noRefCheck() {}}
            onCloseButtonClick={function noRefCheck() {}}
            statusIconDescription="notification"
            subtitle={t(
                "panel.inputFileSelection.experimentalNotificationMarkupSubtitle",
                { ns: "panels" }
            )}
            title={t(
                "panel.inputFileSelection.experimentalNotificationMarkupTitle",
                {
                    ns: "panels",
                }
            )}
        />
    );

    const gridContentsMarkupRowOne = (
        <>
            {/* <div className="input-file-selection__heading">edgedancer9487</div> */}
        </>
    );
    const gridContentsMarkupRowTwo = (
        <>
            {/*
      <div>
        <div className="input-file-selection__subheading">
          {t("panel.inputFileSelection.hostOS", { ns: "panels" })}
        </div>
      </div>
      */}
        </>
    );
    const gridContentsMarkupRowThreeColumnOne = (
        <div>
            <div className={dropdownContentStyle}>
                <Dropdown
                    className="input-file-selection__distribution-dropdown"
                    readOnly={paramFileHasBeenModifiedFromState}
                    id="distribution-selection"
                    items={DISTRIBUTION_LIST}
                    titleText={t(
                        "panel.inputFileSelection.chooseDistributionFromeTemplate",
                        { ns: "panels" }
                    )}
                    label={t(
                        "panel.inputFileSelection.chooseDistributionFromeTemplateShort",
                        { ns: "panels" }
                    )}
                    size="md"
                    warn={false}
                    invalid={false}
                    disabled={false}
                    onChange={({ selectedItem }) => {
                        if (paramFileHasBeenModifiedFromState) return;

                        if (selectedItem.id === UBUNTU_DISTRIBUTION_ID) {
                            updateUseSsh(true);
                            updateAddressType(ADDRESS_TYPE_IPV4);
                        }
                        if (selectedItem.id === SLES_DISTRIBUTION_ID) {
                            updateSelectedDeviceType(DEVICE_TYPE_OSA);
                        }
                        updateSelectedDistributionName(selectedItem);
                        updateSelectedDistributionVersion({});
                    }}
                    selectedItem={state.selectedDistributionName}
                    onFocus={() => {
                        document
                            .getElementById(
                                "helpPanelContents_inputFileSelection_para1"
                            )
                            ?.classList?.add(
                                "help-panel__input-file-selection__content__active"
                            );
                    }}
                    onBlur={() => {
                        document
                            .getElementById(
                                "helpPanelContents_inputFileSelection_para1"
                            )
                            ?.classList?.remove(
                                "help-panel__input-file-selection__content__active"
                            );
                    }}
                />
                {majority === MAJORITY_EXPERIMENTAL &&
                    experimentalNotificationMarkup}
                {Object.keys(state.selectedDistributionName).length > 0 && (
                    <Dropdown
                        className="input-file-selection__version-dropdown"
                        readOnly={paramFileHasBeenModifiedFromState}
                        id="version-selection"
                        items={VERSION_LIST[state.selectedDistributionName.id]}
                        titleText={t(
                            "panel.inputFileSelection.chooseVersionFromeTemplate",
                            {
                                ns: "panels",
                            }
                        )}
                        label={t(
                            "panel.inputFileSelection.chooseVersionFromeTemplateShort",
                            {
                                ns: "panels",
                            }
                        )}
                        size="md"
                        warn={false}
                        invalid={false}
                        disabled={false}
                        onChange={({ selectedItem }) => {
                            if (paramFileHasBeenModifiedFromState) return;

                            updateSelectedDistributionVersion(selectedItem);
                        }}
                        onFocus={() => {
                            document
                                .getElementById(
                                    "helpPanelContents_inputFileSelection_para1"
                                )
                                ?.classList?.add(
                                    "help-panel__input-file-selection__content__active"
                                );
                        }}
                        onBlur={() => {
                            document
                                .getElementById(
                                    "helpPanelContents_inputFileSelection_para1"
                                )
                                ?.classList?.remove(
                                    "help-panel__input-file-selection__content__active"
                                );
                        }}
                        selectedItem={state.selectedDistributionVersion}
                    />
                )}
            </div>
        </div>
    );
    const gridContentsMarkupRowThreeColumnTwo = (
        <div>
            <div></div>
            <div>
                {/*
        <FileUploader
          labelTitle="Already have a custom ISO file?"
          labelDescription="Drag and drop or upload your ISO file here."
          buttonLabel="Add file"
          buttonKind="primary"
          size="md"
          filenameStatus="edit"
          role="button"
          accept={[".iso"]}
          multiple={true}
          disabled={false}
          iconDescription="Delete file"
          name=""
        />
        */}
            </div>
        </div>
    );

    return (
        <Layer className="input-file-selection__layer">
            <FlexGrid className="input-file-selection__grid">
                <Row>
                    <Column>
                        {paramFileHasBeenModifiedFromState &&
                            parmfileHasBeenModifiedNotificationMarkup}
                    </Column>
                </Row>
                <Row>
                    <Column>{gridContentsMarkupRowOne}</Column>
                </Row>
                <Row>
                    <Column>{gridContentsMarkupRowTwo}</Column>
                </Row>
                <Row>
                    <Column>{gridContentsMarkupRowThreeColumnOne}</Column>
                    <Column>{gridContentsMarkupRowThreeColumnTwo}</Column>
                </Row>
            </FlexGrid>
        </Layer>
    );
});

export default InputFileSelection;
