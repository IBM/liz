/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */
import React, { useReducer, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import {
    PANEL_DOWNLOAD_PARAM_FILE,
    PANEL_INFORMATION,
    PANEL_INPUT_FILE_SELECTION,
    PANEL_INSTALLATION_PARAMETERS,
    PANEL_NETWORK_ADDRESS,
    PANEL_NETWORK_DEVICE,
    PANEL_SUMMARY,
    PANEL_INTRO,
    PANEL_LANDING_PAGE,
    PANEL_ERROR_PAGE,
    PANEL_UNKNOWN,
} from '../util/panel-constants'
import {
    ACTION_UPDATE_APP_THEME,
    ACTION_UPDATE_APP_STATE,
    ACTION_UPDATE_APP_STEP,
    ACTION_UPDATE_APP_HELP_STEP,
    ACTION_UPDATE_APP_NEXT_STEP,
    ACTION_RESET_TO_INITIAL_STATE,
    ACTION_UPDATE_APP_PARAM_FILE_CONTENT,
    ACTION_UPDATE_APP_PARAM_FILE_MODIFIED,
    ACTION_UPDATE_APP_SHOW_LEGAL_NOTIFICATION,
    ACTION_UPDATE_APP_USE_STATE_FROM_LOCAL_STORAGE,
    ACTION_UPDATE_APP_IS_DIRTY,
    ACTION_UPDATE_APP_IS_EDITING,
    ACTION_UPDATE_APP_STEPS,
    ACTION_UPDATE_APP_IS_DISABLED,
    ACTION_UPDATE_APP_INCLUDE_INTRO_STEP,
    ACTION_UPDATE_APP_USE_OS_THEME,
    ACTION_UPDATE_APP_CONFIG,
} from '../util/reducer-action-constants'
import { ADDRESS_TYPE_IPV4, DEFAULT_STEPS } from '../util/constants'
import { getLocalStorageKeys, pruneSettings } from '../util/local-storage-util'
import { ApplicationContext } from '.'

import reducer from '../reducers/AppReducer'
import createInitialState from '../states/AppState'

const ApplicationContextProvider = ({ value, children }) => {
    const { t } = useTranslation()
    const [state, dispatch] = useReducer(reducer, createInitialState())

    const updateResetToInitialState = useCallback(
        (updates) => {
            const includeIntroStep = updates
            const initialState = createInitialState(true)
            dispatch({
                type: ACTION_RESET_TO_INITIAL_STATE,
                nextInitialState: includeIntroStep
                    ? {
                          ...initialState,
                          includeIntroStep: true,
                      }
                    : initialState,
            })
        },
        [state, dispatch]
    )

    const updateConfig = useCallback(
        (updates) => {
            dispatch({
                type: ACTION_UPDATE_APP_CONFIG,
                nextAppConfig: updates,
            })
        },
        [state, dispatch]
    )

    const getConfig = useCallback((updates) => {
        const hasConfigObject =
            updates &&
            typeof updates.config === 'object' &&
            Object.keys(updates.config).length > 0

        const fetchData = async () => {
            const response = await fetch(
                `${import.meta.env.VITE_URL_PATH_PREFIX}config/app/config.json`
            )
            const config = await response.json()

            return config
        }

        fetchData().then((config) => {
            !hasConfigObject && updateConfig(config)
        })
    })

    const updateUseOperatingSystemTheme = useCallback(
        (updates) => {
            dispatch({
                type: ACTION_UPDATE_APP_USE_OS_THEME,
                nextUseOperatingSystemTheme: updates,
            })
        },
        [state, dispatch]
    )

    const updateTheme = useCallback(
        (updates) => {
            dispatch({
                type: ACTION_UPDATE_APP_THEME,
                nextTheme: updates,
            })
        },
        [state, dispatch]
    )

    const updateState = useCallback(
        (updates) => {
            dispatch({
                type: ACTION_UPDATE_APP_STATE,
                nextState: updates,
            })
        },
        [state, dispatch]
    )

    const updateStep = useCallback(
        (updates) => {
            dispatch({
                type: ACTION_UPDATE_APP_STEP,
                nextStep: updates,
            })
        },
        [state, dispatch]
    )

    const updateCurrentHelpStep = useCallback(
        (updates) => {
            dispatch({
                type: ACTION_UPDATE_APP_HELP_STEP,
                nextHelpStep: updates,
            })
        },
        [state, dispatch]
    )

    const updateNextStep = useCallback(
        (updates) => {
            dispatch({
                type: ACTION_UPDATE_APP_NEXT_STEP,
                nextNextStep: updates,
            })
        },
        [state, dispatch]
    )

    const updateIncludeIntroStep = useCallback(
        (updates) => {
            dispatch({
                type: ACTION_UPDATE_APP_INCLUDE_INTRO_STEP,
                nextIncludeIntroStep: updates,
            })
        },
        [state, dispatch]
    )

    const updateParamFileContent = useCallback(
        (updates) => {
            dispatch({
                type: ACTION_UPDATE_APP_PARAM_FILE_CONTENT,
                nextParamFileContent: updates,
            })
        },
        [state, dispatch]
    )

    const updateModified = useCallback(
        (updates) => {
            dispatch({
                type: ACTION_UPDATE_APP_PARAM_FILE_MODIFIED,
                nextParamFileContentModified: updates,
            })
        },
        [state, dispatch]
    )

    const updateShowLegalNotification = useCallback(
        (updates) => {
            dispatch({
                type: ACTION_UPDATE_APP_SHOW_LEGAL_NOTIFICATION,
                nextShowLegalNotification: updates,
            })
        },
        [state, dispatch]
    )

    const updateUseStateFromLocalStorage = useCallback(
        (updates) => {
            dispatch({
                type: ACTION_UPDATE_APP_USE_STATE_FROM_LOCAL_STORAGE,
                nextUseStateFromLocalStorage: updates,
            })
        },
        [state, dispatch]
    )

    const updateIsDirty = useCallback(
        (updates) => {
            dispatch({
                type: ACTION_UPDATE_APP_IS_DIRTY,
                nextIsDirty: updates,
            })
        },
        [state, dispatch]
    )

    const updateIsEditing = useCallback(
        (updates) => {
            dispatch({
                type: ACTION_UPDATE_APP_IS_EDITING,
                nextIsEditing: updates,
            })
        },
        [state, dispatch]
    )

    const updateSteps = useCallback(
        (updates) => {
            dispatch({
                type: ACTION_UPDATE_APP_STEPS,
                nextSteps: updates,
            })
        },
        [state, dispatch]
    )

    const updateIsDisabled = useCallback(
        (updates) => {
            dispatch({
                type: ACTION_UPDATE_APP_IS_DISABLED,
                nextSteps: updates,
            })
        },
        [state, dispatch]
    )

    const getHelpPanelConfig = ({ step }) => {
        let config

        switch (step) {
            case 0:
                config = {
                    forPanel: PANEL_INPUT_FILE_SELECTION,
                    params: {
                        hasMultipleSteps: false,
                        currentHelpStep: state.helpStep,
                        updateCurrentHelpStep,
                    },
                }
                break
            case 1:
                config = {
                    forPanel: PANEL_INFORMATION,
                    params: {
                        hasMultipleSteps: false,
                        currentHelpStep: state.helpStep,
                        updateCurrentHelpStep,
                    },
                }
                break
            case 3:
                config = {
                    forPanel: PANEL_NETWORK_DEVICE,
                    params: {
                        hasMultipleSteps: false,
                        currentHelpStep: state.helpStep,
                        updateCurrentHelpStep,
                    },
                }
                break
            case 4:
                config = {
                    forPanel: PANEL_NETWORK_ADDRESS,
                    params: {
                        hasMultipleSteps: false,
                        currentHelpStep: state.helpStep,
                        updateCurrentHelpStep,
                    },
                }
                break
            case 5:
                config = {
                    forPanel: PANEL_INSTALLATION_PARAMETERS,
                    params: {
                        hasMultipleSteps: false,
                        currentHelpStep: state.helpStep,
                        updateCurrentHelpStep,
                    },
                }
                break
            case 6:
                config = {
                    forPanel: PANEL_DOWNLOAD_PARAM_FILE,
                    params: {
                        hasMultipleSteps: false,
                        currentHelpStep: state.helpStep,
                        updateCurrentHelpStep,
                    },
                }
                break
            case 8:
                config = {
                    forPanel: PANEL_SUMMARY,
                    params: {
                        hasMultipleSteps: false,
                        currentHelpStep: state.helpStep,
                        updateCurrentHelpStep,
                    },
                }
                break
            case 9:
                config = {
                    forPanel: PANEL_LANDING_PAGE,
                    params: {
                        hasMultipleSteps: false,
                        currentHelpStep: state.helpStep,
                        updateCurrentHelpStep,
                    },
                }
                break
            case 10:
                config = {
                    forPanel: PANEL_INTRO,
                    params: {
                        hasMultipleSteps: false,
                        currentHelpStep: state.helpStep,
                        updateCurrentHelpStep,
                    },
                }
                break
            case 11:
                config = {
                    forPanel: PANEL_ERROR_PAGE,
                    params: {
                        hasMultipleSteps: false,
                        currentHelpStep: state.helpStep,
                        updateCurrentHelpStep,
                    },
                }
                break
            default:
                config = <div>Help content not yet implemented.</div>
        }

        return config
    }

    const getPanelConfig = ({ step }) => {
        let config

        switch (step) {
            case 0:
                config = {
                    panel: PANEL_INPUT_FILE_SELECTION,
                    params: {
                        disableSubmit: !state.steps.inputFileSelection.complete,
                        invalid: state.steps.inputFileSelection.invalid,
                        title: t(
                            'leftNavigation.progressStep.inputFileSelection.label'
                        ),
                        subtitle: t(
                            'leftNavigation.progressStep.inputFileSelection.secondaryLabel'
                        ),
                        index: state.steps.inputFileSelection.index,
                        includeStep: true,
                        introStep: false,
                    },
                }
                break
            case 1:
                config = {
                    panel: PANEL_INFORMATION,
                    params: {
                        systemRequirements: state.steps.inputFileSelection
                            .distributionName
                            ? state.steps.inputFileSelection.systemRequirements[
                                  state.steps.inputFileSelection
                                      .distributionName
                              ]
                            : {},
                        distribution: {
                            name: state.steps.inputFileSelection
                                .distributionName,
                            version:
                                state.steps.inputFileSelection
                                    .distributionVersion,
                        },
                        docLink: state.steps.inputFileSelection.docLink,
                        disableSubmit: !state.steps.information.complete,
                        invalid: state.steps.information.invalid,
                        title: t(
                            'leftNavigation.progressStep.information.label'
                        ),
                        subtitle: t(
                            'leftNavigation.progressStep.information.secondaryLabel'
                        ),
                        index: state.steps.information.index,
                        includeStep: true,
                        introStep: false,
                    },
                }
                break
            case 3:
                config = {
                    panel: PANEL_NETWORK_DEVICE,
                    params: {
                        disableSubmit: !state.steps.networkDevice.complete,
                        invalid: state.steps.networkDevice.invalid,
                        title: t(
                            'leftNavigation.progressStep.networkDevice.label'
                        ),
                        subtitle: t(
                            'leftNavigation.progressStep.networkDevice.secondaryLabel'
                        ),
                        index: state.steps.networkDevice.index,
                        includeStep: true,
                        introStep: false,
                    },
                }
                break
            case 4:
                config = {
                    panel: PANEL_NETWORK_ADDRESS,
                    params: {
                        disableSubmit: !state.steps.networkAddress.complete,
                        invalid: state.steps.networkAddress.invalid,
                        title: t(
                            'leftNavigation.progressStep.networkAddress.label'
                        ),
                        subtitle: t(
                            'leftNavigation.progressStep.networkAddress.secondaryLabel'
                        ),
                        index: state.steps.networkAddress.index,
                        includeStep: true,
                        introStep: false,
                    },
                }
                break
            case 5:
                config = {
                    panel: PANEL_INSTALLATION_PARAMETERS,
                    params: {
                        ipAddressVersion:
                            state?.steps?.networkAddress?.addressType ??
                            ADDRESS_TYPE_IPV4,
                        disableSubmit:
                            !state.steps.installationParameters.complete,
                        invalid: state.steps.installationParameters.invalid,
                        title: t(
                            'leftNavigation.progressStep.installationParameters.label'
                        ),
                        subtitle: t(
                            'leftNavigation.progressStep.installationParameters.secondaryLabel'
                        ),
                        index: state.steps.installationParameters.index,
                        includeStep: true,
                        introStep: false,
                    },
                }
                break
            case 6:
                config = {
                    panel: PANEL_DOWNLOAD_PARAM_FILE,
                    params: {
                        disableSubmit: !state.steps.downloadParamFile.complete,
                        invalid: state.steps.downloadParamFile.invalid,
                        title: t(
                            'leftNavigation.progressStep.downloadParamFile.label'
                        ),
                        subtitle: t(
                            'leftNavigation.progressStep.downloadParamFile.secondaryLabel'
                        ),
                        index: state.steps.downloadParamFile.index,
                        includeStep: true,
                        introStep: false,
                    },
                }
                break
            case 8:
                config = {
                    panel: PANEL_SUMMARY,
                    params: {
                        disableSubmit: !state.steps.summary.complete,
                        invalid: state.steps.summary.invalid,
                        title: t('leftNavigation.progressStep.summary.label'),
                        subtitle: t(
                            'leftNavigation.progressStep.summary.secondaryLabel'
                        ),
                        index: state.steps.summary.index,
                        includeStep: true,
                        introStep: false,
                    },
                }
                break
            case 10:
                config = {
                    panel: PANEL_INTRO,
                    params: {
                        disableSubmit: !state.steps.intro.complete,
                        invalid: state.steps.intro.invalid,
                        title: t('modalHeading.useExistingSettingsPrompt'),
                        subtitle: t('modalBody.useExistingSettingsPrompt'),
                        index: state.steps.intro.index,
                        includeStep:
                            state.includeIntroStep ||
                            (state.isEditing && state.useStateFromLocalStorage),
                        introStep: true,
                    },
                }
                break
            default:
                config = {
                    panel: PANEL_UNKNOWN,
                    params: null,
                }
        }

        return config
    }

    const getPanelConfigArray = () => {
        return [
            getPanelConfig({ step: state.steps.intro.index }),
            getPanelConfig({ step: state.steps.inputFileSelection.index }),
            getPanelConfig({ step: state.steps.information.index }),
            getPanelConfig({ step: state.steps.networkDevice.index }),
            getPanelConfig({ step: state.steps.networkAddress.index }),
            getPanelConfig({
                step: state.steps.installationParameters.index,
            }),
            getPanelConfig({ step: state.steps.downloadParamFile.index }),
            getPanelConfig({ step: state.steps.summary.index }),
        ]
    }

    const panelConfigArray = getPanelConfigArray()

    const resetToInitialState = useCallback(
        (updates) => {
            pruneSettings(getLocalStorageKeys(state))

            updateResetToInitialState(updates)

            updateSteps(DEFAULT_STEPS)
            if (!state.isEditing) {
                updateUseStateFromLocalStorage(false)
            }
        },
        [
            state,
            pruneSettings,
            getLocalStorageKeys,
            updateResetToInitialState,
            updateSteps,
            updateUseStateFromLocalStorage,
        ]
    )

    const getContextValue = useCallback(() => {
        return {
            ...value,
            state,
            updateTheme,
            updateState,
            updateStep,
            updateNextStep,
            updateCurrentHelpStep,
            updateIncludeIntroStep,
            updateParamFileContent,
            updateModified,
            updateShowLegalNotification,
            updateUseStateFromLocalStorage,
            updateUseOperatingSystemTheme,
            updateIsDirty,
            updateIsEditing,
            updateSteps,
            updateIsDisabled,
            resetToInitialState,
            config: {
                appConfig: state.appConfig,
                panelConfig: panelConfigArray,
                helpPanelConfig: getHelpPanelConfig({ step: state.step }),
            },
        }
    }, [
        value,
        state,
        getConfig,
        updateTheme,
        updateState,
        updateStep,
        updateNextStep,
        updateCurrentHelpStep,
        updateIncludeIntroStep,
        updateParamFileContent,
        updateModified,
        updateShowLegalNotification,
        updateUseStateFromLocalStorage,
        updateUseOperatingSystemTheme,
        updateIsDirty,
        updateIsEditing,
        updateSteps,
        updateIsDisabled,
        resetToInitialState,
        panelConfigArray,
        getHelpPanelConfig,
    ])

    getConfig(state.appConfig)

    return (
        <ApplicationContext.Provider value={getContextValue()}>
            {children}
        </ApplicationContext.Provider>
    )
}

ApplicationContextProvider.propTypes = {
    value: PropTypes.object,
    children: PropTypes.node,
}

export default ApplicationContextProvider
