/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { forwardRef, useEffect, useImperativeHandle } from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import {
    InlineNotification,
    Layer,
    Toggle,
    TextInput,
    PasswordInput,
    FlexGrid,
    Row,
    Column,
    ActionableNotification,
} from '@carbon/react'
import isUrl from 'is-url-superb'
import { toUrl, isHostnameValid } from '../../../util/network-address-util'
import {
    LOCAL_STORAGE_KEY_APP_INSTALLATION_PARAMETERS,
    STATE_ORIGIN_USER,
    STATE_ORIGIN_STORAGE,
} from '../../../util/local-storage-constants'
import {
    ADDRESS_TYPE_IPV4,
    SLES_DISTRIBUTION_ID,
    DEFAULT_DISTRIBUTION_ID,
} from '../../../util/constants'
import {
    ApplicationContext,
    InstallationParameterContext,
    DownloadParamFileContext,
} from '../../../contexts'
import { updateIsDisabled as updateIsDisabledFromUtils } from '../../../util/panel-util'
import { resetParamFileTextAreaData } from '../../../uiUtil/panel-util'
import { encryptItem } from '../../../util/local-storage-util'
import './_installation-parameters.scss'

const SUPPORTED_PROTOCOLS = ['http', 'https', 'ftp']
const PWD_REGEXP = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/

const InstallationParameters = forwardRef(
    function InstallationParameters(props, ref) {
        const {
            state: globalState,
            updateModified: globalUpdateModified,
            updateNextStep,
            updateIsDirty,
            updateIsDisabled,
        } = React.useContext(ApplicationContext)
        const { updateModified, updateParamFileContent } = React.useContext(
            DownloadParamFileContext
        )
        const { t } = useTranslation()
        const {
            state,
            updateUseSsh,
            updateUseVnc,
            updateInstallationAddress,
            updateUserName,
            updatePassword,
            updateVncPassword,
            updateSshPassword,
        } = React.useContext(InstallationParameterContext)
        const { ipAddressVersion } = props
        const publicRef = {
            persistState: () => {
                let mergedSteps = {}

                isCompleteAndValid((error, isCompleteAndValid) => {
                    if (!error) {
                        mergedSteps = {
                            ...globalState,
                            steps: {
                                ...globalState.steps,
                                installationParameters: {
                                    ...globalState.steps.installationParameters,
                                    networkInstallationUrl:
                                        state.installationAddress.computed,
                                    vnc: {
                                        password: state.vncPassword,
                                        enabled: state?.useVnc ?? true,
                                    },
                                    ssh: {
                                        password: state.sshPassword,
                                        enabled: state.useSsh,
                                    },
                                    complete: true,
                                    invalid: false,
                                    origin: STATE_ORIGIN_USER,
                                },
                            },
                        }
                    } else if (isCompleteAndValid.isComplete) {
                        mergedSteps = {
                            ...globalState,
                            steps: {
                                ...globalState.steps,
                                installationParameters: {
                                    ...globalState.steps.installationParameters,
                                    networkInstallationUrl:
                                        state.installationAddress.computed,
                                    vnc: {
                                        password: state.vncPassword,
                                        enabled: state?.useVnc ?? true,
                                    },
                                    ssh: {
                                        password: state.sshPassword,
                                        enabled: state.useSsh,
                                    },
                                    complete: isCompleteAndValid.isComplete,
                                    invalid: !isCompleteAndValid.isValid,
                                    origin: STATE_ORIGIN_USER,
                                },
                            },
                        }
                    } else {
                        mergedSteps = {
                            ...globalState,
                            steps: {
                                ...globalState.steps,
                                installationParameters: {
                                    ...globalState.steps.installationParameters,
                                    networkInstallationUrl:
                                        state.installationAddress?.computed ??
                                        '',
                                    vnc: {
                                        password: state?.vncPassword ?? '',
                                        enabled: state?.useVnc ?? true,
                                    },
                                    ssh: {
                                        password: state.sshPassword,
                                        enabled: state?.useSsh ?? '',
                                    },
                                    disabled: false,
                                    complete: isCompleteAndValid.isComplete,
                                    invalid: !isCompleteAndValid.isValid,
                                    origin: STATE_ORIGIN_USER,
                                },
                            },
                        }
                    }

                    updateNextStep(mergedSteps.steps)
                    updateIsDirty(true)
                    updateIsDisabled(
                        updateIsDisabledFromUtils(mergedSteps.steps)
                    )
                })

                encryptItem(
                    LOCAL_STORAGE_KEY_APP_INSTALLATION_PARAMETERS,
                    JSON.stringify({
                        ...state,
                        origin: STATE_ORIGIN_STORAGE,
                    })
                )
            },
        }

        useEffect(publicRef.persistState, [state])
        useImperativeHandle(ref, () => publicRef)

        const isUserNameInputValid = (userName) => {
            // The username is optional, if it is a zero length string
            // mark it as a valid value.
            if (typeof userName === 'string' && userName.length >= 0) {
                return true
            }
            return false
        }

        const isPasswordInputValid = (password) => {
            // The password is optional, if it is a zero length string
            // mark it as a valid value.
            if (typeof password === 'string' && password.length === 0) {
                return true
            }
            return PWD_REGEXP.test(password)
        }

        const urlUsesSupportedProtocols = (url) => {
            if (url && typeof url === 'string') {
                const urlParts = url.split('://')
                if (SUPPORTED_PROTOCOLS.indexOf(urlParts[0]) >= 0) {
                    return true
                }
            }
            return false
        }

        const getHostNameFromUrl = (url) => {
            if (url && url.length > 0) {
                const hostUrlWithoutProtocol = url.substring(
                    url.indexOf('://') + 3,
                    url.length
                )
                const hostName =
                    hostUrlWithoutProtocol.indexOf('/') >= 0
                        ? hostUrlWithoutProtocol.substring(
                              0,
                              hostUrlWithoutProtocol.indexOf('/')
                          )
                        : hostUrlWithoutProtocol
                return hostName
            }
            return undefined
        }

        const isInstallationAddressInputValid = (url) => {
            const hostNameFromUrl = url ? getHostNameFromUrl(url) : ''
            const urlObject = toUrl(url)
            const hostname = urlObject ? urlObject.hostname : ''
            const href = urlObject ? urlObject.href : ''

            if (
                urlObject &&
                urlObject.isIP &&
                urlObject.ipVersion === ADDRESS_TYPE_IPV4 &&
                typeof hostNameFromUrl === 'string' &&
                hostNameFromUrl.split('.').length !== 4
            ) {
                return false
            } else if (urlObject && urlObject.isIP && hostname && href) {
                return urlUsesSupportedProtocols(url)
            } else if (
                urlObject &&
                hostname &&
                href &&
                isHostnameValid(urlObject.host) &&
                isUrl(urlObject.href)
            ) {
                return urlUsesSupportedProtocols(url)
            }

            return false
        }

        const hexEncodePassword = (password) => {
            if (
                password &&
                typeof password === 'string' &&
                password.length > 0
            ) {
                return (
                    '%' +
                    password
                        .split('')
                        .map((c) =>
                            c.charCodeAt(0).toString(16).padStart(2, '0')
                        )
                        .join('%')
                )
            }
            return ''
        }

        const computeInstallationAddress = (url = '', uid = '', pwd = '') => {
            const address = url || (state?.installationAddress?.value ?? '')
            const userName = uid || (state?.userName?.value ?? '')
            const password = pwd || (state?.password?.value ?? '')

            if (address && address.length > 0) {
                const installationAddressUrl = toUrl(address)
                if (installationAddressUrl && userName && userName.length > 0) {
                    installationAddressUrl.username = userName
                }
                if (
                    installationAddressUrl &&
                    installationAddressUrl.password &&
                    installationAddressUrl.password.length > 0
                ) {
                    installationAddressUrl.password = hexEncodePassword(
                        installationAddressUrl.password
                    )
                }
                if (
                    installationAddressUrl &&
                    !installationAddressUrl.password &&
                    password &&
                    password.length > 0
                ) {
                    installationAddressUrl.password =
                        hexEncodePassword(password)
                }
                return installationAddressUrl
                    ? installationAddressUrl.toString()
                    : ''
            }
            return ''
        }

        const useSshToggled = state?.useSsh ?? false
        const useVncToggled = state?.useVnc ?? true
        const paramFileHasBeenModifiedFromState =
            globalState?.steps.downloadParamFile?.modified ?? false
        const distributionName =
            globalState?.steps?.inputFileSelection?.distributionName ??
            DEFAULT_DISTRIBUTION_ID
        const requiresSshPassword =
            distributionName && distributionName === SLES_DISTRIBUTION_ID

        const isCompleteAndValid = (callback) => {
            let isComplete = false
            let isValid = false

            if (
                typeof state.installationAddress === 'object' &&
                typeof state.installationAddress.value === 'string' &&
                state.installationAddress.value.length > 0
            ) {
                isComplete = true
                isValid =
                    isInstallationAddressInputValid(
                        state.installationAddress.value
                    ) &&
                    state.password.valid &&
                    state.vncPassword.valid &&
                    state.sshPassword.valid
            }

            if (isComplete && isValid) {
                return callback(null, { isComplete, isValid })
            }

            return callback(new Error('Form data is incomplete or invalid'), {
                isComplete,
                isValid,
            })
        }

        const ipAddressVersionMissmatchExists = () => {
            const urlObject = toUrl(state.installationAddress?.value ?? '')

            if (
                urlObject &&
                urlObject.isIP &&
                urlObject.ipVersion &&
                urlObject.ipVersion !== ipAddressVersion
            ) {
                return true
            }

            return false
        }

        const ipVersionMissmatchNotification = (
            <InlineNotification
                hideCloseButton
                statusIconDescription="notification"
                subtitle={t(
                    'panel.installationParameter.missingRemoteAccessNotificationSubtitle',
                    {
                        ns: 'panels',
                    }
                )}
                title={t(
                    'panel.installationParameter.missingRemoteAccessNotificationTitle',
                    {
                        ns: 'panels',
                    }
                )}
                kind="info"
                className="installation-address_ip-version-missmatch-banner"
            />
        )

        const gridContentsMarkupRowOne = (
            <>
                <TextInput
                    readOnly={paramFileHasBeenModifiedFromState}
                    type="url"
                    id="installation-address-input"
                    key="installation-address-input"
                    invalid={
                        state.installationAddress
                            ? !state.installationAddress.valid
                            : false
                    }
                    invalidText={t('invalidTextLabel', { ns: 'common' })}
                    maxLength={256}
                    labelText={t(
                        'panel.installationParameter.installationAddressTextLabel',
                        {
                            ns: 'panels',
                        }
                    )}
                    helperText={t(
                        'panel.installationParameter.installationAddressHelp',
                        {
                            ns: 'panels',
                        }
                    )}
                    placeholder={t(
                        'panel.installationParameter.installationAddressPlaceholder',
                        { ns: 'panels' }
                    )}
                    className="installation-parameters_installation-address-input"
                    value={
                        state.installationAddress
                            ? state.installationAddress.value
                            : ''
                    }
                    onChange={(url) => {
                        if (paramFileHasBeenModifiedFromState) return

                        const urlValue =
                            url && url.target ? url.target.value : ''
                        const computedUrlValue =
                            computeInstallationAddress(urlValue)
                        // while editing we don't update the validity but set it to true
                        // cause we don't want to have the form validation logic kick in.
                        updateInstallationAddress({
                            address: urlValue,
                            computedAddress: computedUrlValue,
                            valid: true,
                        })
                    }}
                    onBlur={(url) => {
                        if (paramFileHasBeenModifiedFromState) return

                        const urlValue =
                            url && url.target ? url.target.value : ''
                        const computedUrlValue =
                            computeInstallationAddress(urlValue)
                        const urlValueIsValid =
                            isInstallationAddressInputValid(urlValue)

                        if (!urlValueIsValid) {
                            updateInstallationAddress({
                                address: urlValue,
                                computedAddress: computedUrlValue,
                                valid: urlValueIsValid,
                            })
                        }
                    }}
                />
                {ipAddressVersionMissmatchExists() &&
                    ipVersionMissmatchNotification}
            </>
        )

        const gridContentsMarkupComputedRow = (
            <>
                <TextInput
                    readOnly
                    helperText={t(
                        'panel.installationParameter.computedInstallationAddressHelp',
                        {
                            ns: 'panels',
                        }
                    )}
                    id="computed-installation-address-input"
                    key="computed-installation-address-input"
                    labelText={t(
                        'panel.installationParameter.computedInstallationAddressTextLabel',
                        { ns: 'panels' }
                    )}
                    placeholder={t(
                        'panel.installationParameter.computedInstallationAddressPlaceholder',
                        { ns: 'panels' }
                    )}
                    className="installation-parameters_installation-address-input"
                    value={
                        state.installationAddress
                            ? state.installationAddress.computed
                            : ''
                    }
                />
            </>
        )

        const gridContentsMarkupRowTwoColumnOne = (
            <div className="installation-parameters_column-left">
                <TextInput
                    readOnly={paramFileHasBeenModifiedFromState}
                    disabled={state?.userAndPwdAreDisabled ?? true}
                    helperText={t('panel.installationParameter.usernameHelp', {
                        ns: 'panels',
                    })}
                    id="username-input"
                    key="username-input"
                    invalid={
                        state && state.userName ? !state.userName.valid : false
                    }
                    invalidText={t('invalidTextLabel', { ns: 'common' })}
                    maxLength={64}
                    labelText={t(
                        'panel.installationParameter.usernameTextLabel',
                        {
                            ns: 'panels',
                        }
                    )}
                    placeholder={t(
                        'panel.installationParameter.usernamePlaceholder',
                        {
                            ns: 'panels',
                        }
                    )}
                    className="installation-parameters_username-input"
                    value={state.userName ? state.userName.value : ''}
                    onChange={(userName) => {
                        if (paramFileHasBeenModifiedFromState) return

                        const userNameValue =
                            userName && userName.target
                                ? userName.target.value
                                : ''
                        const computedUrlValue = state.installationAddress
                            ? computeInstallationAddress(
                                  state.installationAddress.value,
                                  userNameValue
                              )
                            : ''
                        // while editing we don't update the validity but set it to true
                        // cause we don't want to have the form validation logic kick in.
                        updateUserName({
                            userName: userNameValue,
                            valid: true,
                        })
                        updateInstallationAddress({
                            address: state?.installationAddress?.value ?? '',
                            computedAddress: computedUrlValue,
                            valid: true,
                        })
                    }}
                    onBlur={(userName) => {
                        if (paramFileHasBeenModifiedFromState) return

                        const userNameValue =
                            userName && userName.target
                                ? userName.target.value
                                : ''
                        const computedUrlValue = state.installationAddress
                            ? computeInstallationAddress(
                                  state.installationAddress.value,
                                  userNameValue
                              )
                            : ''
                        const userNameValueIsValid =
                            isUserNameInputValid(userNameValue)

                        if (!userNameValueIsValid) {
                            updateUserName({
                                userName: userNameValue,
                                valid: userNameValueIsValid,
                            })
                            updateInstallationAddress({
                                address:
                                    state?.installationAddress?.value ?? '',
                                computedAddress: computedUrlValue,
                                valid: true,
                            })
                        }
                    }}
                />
            </div>
        )

        const gridContentsMarkupRowTwoColumnTwo = (
            <div className="installation-parameters_column-right">
                <PasswordInput
                    readOnly={paramFileHasBeenModifiedFromState}
                    disabled={state?.userAndPwdAreDisabled ?? true}
                    autoComplete="on"
                    helperText={t('panel.installationParameter.passwordHelp', {
                        ns: 'panels',
                    })}
                    id="password-input"
                    key="password-input"
                    invalid={
                        state && state.password ? !state.password.valid : false
                    }
                    invalidText={t('invalidTextLabel', { ns: 'common' })}
                    maxLength={64}
                    labelText={t(
                        'panel.installationParameter.passwordTextLabel',
                        {
                            ns: 'panels',
                        }
                    )}
                    placeholder={t(
                        'panel.installationParameter.passwordPlaceholder',
                        {
                            ns: 'panels',
                        }
                    )}
                    className="installation-parameters_password-input"
                    value={state.password ? state.password.value : ''}
                    onChange={(password) => {
                        if (paramFileHasBeenModifiedFromState) return

                        const passwordValue =
                            password && password.target
                                ? password.target.value
                                : ''
                        const computedUrlValue = state.installationAddress
                            ? computeInstallationAddress(
                                  state.installationAddress.value,
                                  state?.userName?.value ?? '',
                                  passwordValue
                              )
                            : ''
                        // while editing we don't update the validity but set it to true
                        // cause we don't want to have the form validation logic kick in.
                        updatePassword({
                            password: passwordValue,
                            valid: true,
                        })
                        updateInstallationAddress({
                            address: state?.installationAddress?.value ?? '',
                            computedAddress: computedUrlValue,
                            valid: true,
                        })
                    }}
                    onBlur={(password) => {
                        if (paramFileHasBeenModifiedFromState) return

                        const passwordValue =
                            password && password.target
                                ? password.target.value
                                : ''
                        const computedUrlValue = state.installationAddress
                            ? computeInstallationAddress(
                                  state.installationAddress.value,
                                  state?.userName?.value ?? '',
                                  passwordValue
                              )
                            : ''
                        const passwordValueIsValid =
                            isPasswordInputValid(passwordValue)

                        if (!passwordValueIsValid) {
                            updatePassword({
                                password: passwordValue,
                                valid: passwordValueIsValid,
                            })
                            updateInstallationAddress({
                                address:
                                    state?.installationAddress?.value ?? '',
                                computedAddress: computedUrlValue,
                                valid: true,
                            })
                        }
                    }}
                />
            </div>
        )

        const gridContentsMarkupRowThreeColumnOne = (
            <div className="installation-parameters_column-left">
                <Toggle
                    readOnly={paramFileHasBeenModifiedFromState}
                    labelText={t(
                        'panel.installationParameter.vncToggleTextLabel',
                        {
                            ns: 'panels',
                        }
                    )}
                    labelA={t('btnLabel.No', { ns: 'common' })}
                    labelB={t('btnLabel.Yes', { ns: 'common' })}
                    id="vnc-toggle"
                    toggled={useVncToggled}
                    onToggle={() => {
                        if (paramFileHasBeenModifiedFromState) return

                        if (useVncToggled) {
                            updateUseVnc(false)
                        } else {
                            updateUseVnc(true)
                        }
                    }}
                />
                {useVncToggled && (
                    <PasswordInput
                        readOnly={paramFileHasBeenModifiedFromState}
                        autoComplete="on"
                        helperText={t(
                            'panel.installationParameter.vncPasswordHelp',
                            {
                                ns: 'panels',
                            }
                        )}
                        id="vnc-password-input"
                        invalid={
                            state && state.vncPassword
                                ? !state.vncPassword.valid
                                : false
                        }
                        invalidText={t('invalidTextLabel', { ns: 'common' })}
                        maxLength={64}
                        labelText={t(
                            'panel.installationParameter.vncPasswordTextLabel',
                            {
                                ns: 'panels',
                            }
                        )}
                        placeholder={t(
                            'panel.installationParameter.vncPasswordPlaceholder',
                            {
                                ns: 'panels',
                            }
                        )}
                        value={state.vncPassword ? state.vncPassword.value : ''}
                        onChange={(password) => {
                            if (paramFileHasBeenModifiedFromState) return

                            const passwordValue =
                                password && password.target
                                    ? password.target.value
                                    : ''

                            updateVncPassword({
                                password: passwordValue,
                                valid: true,
                            })
                        }}
                        onBlur={(password) => {
                            const passwordValue =
                                password && password.target
                                    ? password.target.value
                                    : ''
                            const passwordValueIsValid =
                                isPasswordInputValid(passwordValue)

                            updateVncPassword({
                                password: passwordValue,
                                valid: passwordValueIsValid,
                            })
                        }}
                    />
                )}
            </div>
        )

        const gridContentsMarkupRowThreeColumnTwo = (
            <div className="installation-parameters_column-right">
                <Toggle
                    readOnly={paramFileHasBeenModifiedFromState}
                    labelText={t(
                        'panel.installationParameter.sshToggleTextLabel',
                        {
                            ns: 'panels',
                        }
                    )}
                    labelA={t('btnLabel.No', { ns: 'common' })}
                    labelB={t('btnLabel.Yes', { ns: 'common' })}
                    id="ssh-toggle"
                    toggled={useSshToggled}
                    onToggle={() => {
                        if (paramFileHasBeenModifiedFromState) return

                        if (useSshToggled) {
                            updateUseSsh(false)
                        } else {
                            updateUseSsh(true)
                        }
                    }}
                />
                {useSshToggled && requiresSshPassword && (
                    <PasswordInput
                        readOnly={paramFileHasBeenModifiedFromState}
                        autoComplete="on"
                        helperText={t(
                            'panel.installationParameter.sshPasswordHelp',
                            {
                                ns: 'panels',
                            }
                        )}
                        id="ssh-password-input"
                        invalid={
                            state && state.sshPassword
                                ? !state.sshPassword.valid
                                : false
                        }
                        invalidText={t('invalidTextLabel', { ns: 'common' })}
                        maxLength={64}
                        labelText={t(
                            'panel.installationParameter.sshPasswordTextLabel',
                            {
                                ns: 'panels',
                            }
                        )}
                        placeholder={t(
                            'panel.installationParameter.sshPasswordPlaceholder',
                            {
                                ns: 'panels',
                            }
                        )}
                        value={state.sshPassword ? state.sshPassword.value : ''}
                        onChange={(password) => {
                            if (paramFileHasBeenModifiedFromState) return

                            const passwordValue =
                                password && password.target
                                    ? password.target.value
                                    : ''

                            updateSshPassword({
                                password: passwordValue,
                                valid: true,
                            })
                        }}
                        onBlur={(password) => {
                            const passwordValue =
                                password && password.target
                                    ? password.target.value
                                    : ''
                            const passwordValueIsValid =
                                isPasswordInputValid(passwordValue)

                            updateSshPassword({
                                password: passwordValue,
                                valid: passwordValueIsValid,
                            })
                        }}
                    />
                )}
            </div>
        )

        const parmfileHasBeenModifiedNotificationMarkup = (
            <ActionableNotification
                hideCloseButton
                inline
                lowContrast
                className="intro_parmfile-purge-banner"
                actionButtonLabel={t('btnLabel.Reset', { ns: 'common' })}
                aria-label="closes notification"
                kind="info"
                onActionButtonClick={() => {
                    resetParamFileTextAreaData({
                        updateParamFileContent,
                        globalUpdateModified,
                        updateModified,
                        state: globalState,
                    })
                }}
                onClose={function noRefCheck() {}}
                onCloseButtonClick={function noRefCheck() {}}
                statusIconDescription="notification"
                subtitle={t(
                    'panel.parmFileHasBeenModifiedNotificationSubtitle',
                    {
                        ns: 'common',
                    }
                )}
                title={t('modalHeading.discardParamFileModificationsPrompt')}
            />
        )

        return (
            <Layer className="installation-parameters__layer">
                <FlexGrid className="installation-parameters__grid">
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
                        <Column>{gridContentsMarkupRowTwoColumnOne}</Column>
                        <Column>{gridContentsMarkupRowTwoColumnTwo}</Column>
                    </Row>
                    <Row>
                        <Column>{gridContentsMarkupComputedRow}</Column>
                    </Row>
                    <Row>
                        <Column>{gridContentsMarkupRowThreeColumnOne}</Column>
                        <Column>{gridContentsMarkupRowThreeColumnTwo}</Column>
                    </Row>
                </FlexGrid>
            </Layer>
        )
    }
)

InstallationParameters.propTypes = {
    ipAddressVersion: PropTypes.string.isRequired,
}

export default InstallationParameters
