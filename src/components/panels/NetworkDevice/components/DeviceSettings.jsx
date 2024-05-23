/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import {
    TextInput,
    Toggle,
    FlexGrid,
    Column,
    Row,
    RadioButtonGroup,
    RadioButton,
    InlineNotification,
} from '@carbon/react'
import {
    PORT_NUMBER_ZERO,
    PORT_NUMBER_ONE,
    UPDATE_FUNCTION__LAYER,
    UPDATE_FUNCTION__USE_MULTIPORT,
    UPDATE_FUNCTION__PORT_NO,
    UPDATE_FUNCTION__PCI_FUNCTION_ID,
    UPDATE_FUNCTION__USER_IDENTIFIER,
} from '../../../../util/constants'
import { isHex } from '../../../../util/network-device-util'
import './_device-settings.scss'

const DeviceSettings = ({
    deviceSettingsId,
    updateFunction,
    state,
    readOnly,
    displayRoCEControls,
}) => {
    const { t } = useTranslation()

    const isPciFunctionIdValid = (pciFunctionIdValue) => {
        const userIdentifierValue = state?.userIdentifier?.value ?? ''

        if (
            userIdentifierValue.length > 0 &&
            typeof pciFunctionIdValue === 'string' &&
            pciFunctionIdValue.length === 0
        ) {
            return true
        }
        if (isHex(pciFunctionIdValue)) {
            return true
        }
        return false
    }

    const isUserIdentifierValid = (pciUserIdValue) => {
        const pciFunctionIdValue = state?.pciFunctionId?.value ?? ''

        if (
            pciFunctionIdValue.length > 0 &&
            typeof pciUserIdValue === 'string' &&
            pciUserIdValue.length === 0
        ) {
            return true
        }
        if (isHex(pciUserIdValue)) {
            return true
        }
        return false
    }

    const getDefaultSelected = () => {
        if (+state.portNo === 0) {
            return PORT_NUMBER_ZERO
        } else if (+state.portNo === 1) {
            return PORT_NUMBER_ONE
        }

        return PORT_NUMBER_ZERO
    }

    const osaMarkup = (
        <>
            <FlexGrid className="device-settings_grid" condensed>
                <Row>
                    <Column>
                        <div className="device-settings_grid-column-left">
                            <Toggle
                                className="device-settings_toggle-label-nowrap"
                                readOnly={readOnly}
                                toggled={state.layer}
                                labelText={t(
                                    'panel.networkDevice.layerTwoToggleTextLabel',
                                    {
                                        ns: 'panels',
                                    }
                                )}
                                labelA={t(
                                    'panel.networkDevice.layerTwoToggleTextLabelA',
                                    {
                                        ns: 'panels',
                                    }
                                )}
                                labelB={t(
                                    'panel.networkDevice.layerTwoToggleTextLabelB',
                                    {
                                        ns: 'panels',
                                    }
                                )}
                                id="layer2-toggle"
                                onToggle={(toggleState) => {
                                    if (readOnly) return

                                    updateFunction(
                                        UPDATE_FUNCTION__LAYER,
                                        toggleState
                                    )
                                }}
                            />
                        </div>
                    </Column>
                    <Column>
                        <div className="device-settings_grid-column-right">
                            <Toggle
                                className="device-settings_toggle-label-nowrap"
                                readOnly={readOnly}
                                toggled={state.useMultiPort}
                                labelText={t(
                                    'panel.networkDevice.multiPortToggleTextLabel',
                                    {
                                        ns: 'panels',
                                    }
                                )}
                                labelA={t('btnLabel.No', { ns: 'common' })}
                                labelB={t('btnLabel.Yes', { ns: 'common' })}
                                id="portno-toggle"
                                onToggle={(toggleState) => {
                                    if (readOnly) return

                                    updateFunction(
                                        UPDATE_FUNCTION__USE_MULTIPORT,
                                        toggleState
                                    )
                                }}
                            />
                        </div>
                    </Column>
                </Row>
            </FlexGrid>
            {state.useMultiPort && (
                <FlexGrid className="device-settings_grid" condensed>
                    <Row>
                        <Column>
                            <RadioButtonGroup
                                readOnly={readOnly}
                                className="network-device_port-number-radiobutton-group"
                                legendText={t(
                                    'panel.networkDevice.portNumberToggleTextLabel',
                                    {
                                        ns: 'panels',
                                    }
                                )}
                                helperText={t(
                                    'panel.networkDevice.portNumberToggleHelp',
                                    {
                                        ns: 'panels',
                                    }
                                )}
                                name="network-device_port-number-group"
                                defaultSelected={getDefaultSelected()}
                                onChange={(selectedItem) => {
                                    if (readOnly) return

                                    const portOneToggled =
                                        selectedItem === PORT_NUMBER_ONE
                                    updateFunction(
                                        UPDATE_FUNCTION__PORT_NO,
                                        portOneToggled
                                    )
                                }}
                            >
                                <RadioButton
                                    labelText="Port 0"
                                    value={PORT_NUMBER_ZERO}
                                    id="network-device_portno-zero-radio"
                                />
                                <RadioButton
                                    labelText="Port 1"
                                    value={PORT_NUMBER_ONE}
                                    id="network-device_portno-one-radio"
                                />
                            </RadioButtonGroup>
                        </Column>
                    </Row>
                </FlexGrid>
            )}
        </>
    )

    const roceLabelHasOptionalTag = (forLabel, label, optionalLabel) => {
        const hasValue = state[forLabel]?.value?.length > 0
        const allValuesArePresent =
            state?.pciFunctionId?.value?.length > 0 &&
            state?.userIdentifier?.value?.length > 0

        if (hasValue && !allValuesArePresent) {
            return optionalLabel
        }

        return label
    }

    const roceHelperMarkup = (
        <FlexGrid className="device-settings_grid" fullWidth>
            <Row>
                <Column>
                    <div className="device-settings_grid-column-single">
                        <InlineNotification
                            hideCloseButton
                            statusIconDescription="notification"
                            subtitle={t(
                                'panel.networkDevice.roceHelperNotificationSubtitle',
                                {
                                    ns: 'panels',
                                }
                            )}
                            title={t(
                                'panel.networkDevice.roceHelperNotificationTitle',
                                { ns: 'panels' }
                            )}
                            kind="info"
                            className="device-settings_roce-helper-banner"
                        />
                    </div>
                </Column>
            </Row>
        </FlexGrid>
    )

    const roceMarkup = (
        <FlexGrid className="device-settings_grid" fullWidth>
            <Row>
                <Column>
                    <div className="device-settings_grid-column-single">
                        <TextInput
                            readOnly={readOnly}
                            id="pci-function-input"
                            key="pci-function-input"
                            invalidText={t('invalidTextLabel', {
                                ns: 'common',
                            })}
                            invalid={
                                state && state.pciFunctionId
                                    ? !state.pciFunctionId.valid
                                    : false
                            }
                            maxLength={16}
                            labelText={roceLabelHasOptionalTag(
                                'userIdentifier',
                                t('panel.networkDevice.fidTextLabel', {
                                    ns: 'panels',
                                }),
                                t('panel.networkDevice.fidTextLabelOptional', {
                                    ns: 'panels',
                                })
                            )}
                            helperText={t('panel.networkDevice.fidHelp', {
                                ns: 'panels',
                            })}
                            placeholder={t(
                                'panel.networkDevice.fidPlaceholder',
                                {
                                    ns: 'panels',
                                }
                            )}
                            value={state?.pciFunctionId?.value ?? ''}
                            onChange={(pciFunctionId) => {
                                if (readOnly) return

                                const pciFunctionIdValue =
                                    pciFunctionId &&
                                    pciFunctionId.target &&
                                    pciFunctionId.target.value
                                        ? pciFunctionId.target.value
                                        : ''
                                updateFunction(
                                    UPDATE_FUNCTION__PCI_FUNCTION_ID,
                                    pciFunctionIdValue,
                                    true
                                )
                            }}
                            onBlur={(pciFunctionId) => {
                                if (readOnly) return

                                const pciFunctionIdValue =
                                    pciFunctionId &&
                                    pciFunctionId.target &&
                                    pciFunctionId.target.value
                                        ? pciFunctionId.target.value
                                        : ''
                                const pciFunctionIdIsValid =
                                    isPciFunctionIdValid(pciFunctionIdValue)

                                if (!pciFunctionIdIsValid) {
                                    updateFunction(
                                        UPDATE_FUNCTION__PCI_FUNCTION_ID,
                                        pciFunctionIdValue,
                                        pciFunctionIdIsValid
                                    )
                                }
                            }}
                        />
                        <TextInput
                            readOnly={readOnly}
                            id="user-identifier-input"
                            key="user-identifier-input"
                            invalidText={t('invalidTextLabel', {
                                ns: 'common',
                            })}
                            invalid={
                                state && state.userIdentifier
                                    ? !state.userIdentifier.valid
                                    : false
                            }
                            maxLength={16}
                            labelText={roceLabelHasOptionalTag(
                                'pciFunctionId',
                                t('panel.networkDevice.uidTextLabel', {
                                    ns: 'panels',
                                }),
                                t('panel.networkDevice.uidTextLabelOptional', {
                                    ns: 'panels',
                                })
                            )}
                            helperText={t('panel.networkDevice.uidHelp', {
                                ns: 'panels',
                            })}
                            placeholder={t(
                                'panel.networkDevice.uidPlaceholder',
                                {
                                    ns: 'panels',
                                }
                            )}
                            value={state?.userIdentifier?.value ?? ''}
                            onChange={(userIdentifier) => {
                                if (readOnly) return

                                const userIdentifierValue =
                                    userIdentifier &&
                                    userIdentifier.target &&
                                    userIdentifier.target.value
                                        ? userIdentifier.target.value
                                        : ''

                                updateFunction(
                                    UPDATE_FUNCTION__USER_IDENTIFIER,
                                    userIdentifierValue,
                                    true
                                )
                            }}
                            onBlur={(userIdentifier) => {
                                if (readOnly) return

                                const userIdentifierValue =
                                    userIdentifier &&
                                    userIdentifier.target &&
                                    userIdentifier.target.value
                                        ? userIdentifier.target.value
                                        : ''
                                const userIdentifierIsValid =
                                    isUserIdentifierValid(userIdentifierValue)

                                if (!userIdentifierIsValid) {
                                    updateFunction(
                                        UPDATE_FUNCTION__USER_IDENTIFIER,
                                        userIdentifierValue,
                                        userIdentifierIsValid
                                    )
                                }
                            }}
                        />
                    </div>
                </Column>
            </Row>
        </FlexGrid>
    )

    if (deviceSettingsId === 'network-device_osa-option') {
        return osaMarkup
    } else if (
        displayRoCEControls &&
        deviceSettingsId === 'network-device_roce-option'
    ) {
        return roceMarkup
    } else if (
        !displayRoCEControls &&
        deviceSettingsId === 'network-device_roce-option'
    ) {
        return roceHelperMarkup
    }
    return null
}

DeviceSettings.propTypes = {
    deviceSettingsId: PropTypes.string.isRequired,
    updateFunction: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
    readOnly: PropTypes.bool.isRequired,
    displayRoCEControls: PropTypes.bool.isRequired,
}

export default DeviceSettings
