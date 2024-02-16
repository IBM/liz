/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import {
  InlineNotification,
  Layer,
  Toggle,
  TextInput,
  PasswordInput,
  FlexGrid,
  Row,
  Column,
} from "@carbon/react";
import isUrl from "is-url-superb";
import { getLabel, getContent } from "../../../uiUtil/help-util";
import { toUrl, isHostnameValid } from "../../../util/network-address-util";
import {
  ACTION_UPDATE_INSTALLATION_PARAM_USE_SSH,
  ACTION_UPDATE_INSTALLATION_PARAM_USE_VNC,
  ACTION_UPDATE_INSTALLATION_PARAM_ADDRESS,
  ACTION_UPDATE_INSTALLATION_PARAM_USERNAME,
  ACTION_UPDATE_INSTALLATION_PARAM_PASSWORD,
  ACTION_UPDATE_INSTALLATION_PARAM_VNC_PASSWORD,
  ACTION_UPDATE_APP_STEPS,
  ACTION_UPDATE_APP_IS_DIRTY,
  ACTION_UPDATE_APP_IS_DISABLED,
  LOCAL_STORAGE_KEY_APP_INSTALLATION_PARAMETERS,
  STATE_ORIGIN_USER,
  STATE_ORIGIN_STORAGE,
} from "../../../util/constants";
import { ApplicationContext } from "../../../App";
import { updateIsDisabled } from "../../../util/panel-utils";
import "./_installation-parameters.scss";

const SUPPORTED_PROTOCOLS = ["http", "https", "ftp"];

const InstallationParameters = ({ state, dispatch, ipAddressVersion }) => {
  const { t } = useTranslation();
  const { state: globalState, dispatch: globalDispatch } =
    React.useContext(ApplicationContext);

  const updateUseSsh = (flag) => {
    dispatch({
      type: ACTION_UPDATE_INSTALLATION_PARAM_USE_SSH,
      nextUseSsh: flag,
    });
  };

  const updateUseVnc = (flag) => {
    dispatch({
      type: ACTION_UPDATE_INSTALLATION_PARAM_USE_VNC,
      nextUseVnc: flag,
    });
  };

  const updateInstallationAddress = (address, computedAddress, valid) => {
    dispatch({
      type: ACTION_UPDATE_INSTALLATION_PARAM_ADDRESS,
      nextInstallationAddress: {
        value: address,
        computed: computedAddress,
        valid,
      },
      nextUserAndPwdAreDisabled:
        !address ||
        address.length === 0 ||
        installationAddressContainsUidOrPwd(address),
      nextUserName: {
        value: "",
        valid: true,
      },
      nextPassword: {
        value: "",
        valid: true,
      },
    });
  };

  const updateUserName = (userName, valid) => {
    dispatch({
      type: ACTION_UPDATE_INSTALLATION_PARAM_USERNAME,
      nextUserName: {
        value: userName,
        valid,
      },
    });
  };

  const updatePassword = (password, valid) => {
    dispatch({
      type: ACTION_UPDATE_INSTALLATION_PARAM_PASSWORD,
      nextPassword: {
        value: password,
        valid,
      },
    });
  };

  const updateVncPassword = (password) => {
    dispatch({
      type: ACTION_UPDATE_INSTALLATION_PARAM_VNC_PASSWORD,
      nextVncPassword: password,
    });
  };

  const isUserNameInputValid = (userName) => {
    // The username is optional, if it is a zero length string
    // mark it as a valid value.
    if (typeof userName === "string" && userName.length >= 0) {
      return true;
    }
    return false;
  };

  const isPasswordInputValid = (password) => {
    // The password is optional, if it is a zero length string
    // mark it as a valid value.
    if (typeof password === "string" && password.length >= 0) {
      return true;
    }
    return false;
  };

  const urlUsesSupportedProtocols = (url) => {
    if (url && typeof url === "string") {
      const urlParts = url.split("://");
      if (SUPPORTED_PROTOCOLS.indexOf(urlParts[0]) >= 0) {
        return true;
      }
    }
    return false;
  };

  const isInstallationAddressInputValid = (url) => {
    const urlObject = toUrl(url);
    const hostname = urlObject ? urlObject.hostname : "";
    const href = urlObject ? urlObject.href : "";

    if (urlObject && urlObject.isIP && hostname && href) {
      return urlUsesSupportedProtocols(url);
    } else if (
      urlObject &&
      hostname &&
      href &&
      isHostnameValid(urlObject.host) &&
      isUrl(urlObject.href)
    ) {
      return urlUsesSupportedProtocols(url);
    }

    return false;
  };

  const hexEncodePassword = (password) => {
    if (password && typeof password === "string" && password.length > 0) {
      return (
        "%" +
        password
          .split("")
          .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
          .join("%")
      );
    }
    return "";
  };

  const installationAddressContainsUidOrPwd = (address) => {
    if (address && address.length > 0) {
      const installationAddressUrl = toUrl(address);
      const username = installationAddressUrl?.username ?? "";
      const password = installationAddressUrl?.password ?? "";
      if (
        (username && username.length > 0) ||
        (password && password.length > 0)
      ) {
        return true;
      }
    }
    return false;
  };

  const computeInstallationAddress = (url = "", uid = "", pwd = "") => {
    const address = url || (state?.installationAddress?.value ?? "");
    const userName = uid || (state?.userName?.value ?? "");
    const password = pwd || (state?.password?.value ?? "");

    if (address && address.length > 0) {
      const installationAddressUrl = toUrl(address);
      if (installationAddressUrl && userName && userName.length > 0) {
        installationAddressUrl.username = userName;
      }
      if (
        installationAddressUrl &&
        installationAddressUrl.password &&
        installationAddressUrl.password.length > 0
      ) {
        installationAddressUrl.password = hexEncodePassword(
          installationAddressUrl.password,
        );
      }
      if (
        installationAddressUrl &&
        !installationAddressUrl.password &&
        password &&
        password.length > 0
      ) {
        installationAddressUrl.password = hexEncodePassword(password);
      }
      return installationAddressUrl ? installationAddressUrl.toString() : "";
    }
    return "";
  };

  const useSshToggled = state.useSsh;
  const useVncToggled = state?.useVnc ?? true;

  const isCompleteAndValid = (callback) => {
    let isComplete = false;
    let isValid = false;

    if (
      typeof state.installationAddress === "object" &&
      typeof state.installationAddress.value === "string" &&
      state.installationAddress.value.length > 0
    ) {
      isComplete = true;
      isValid = isInstallationAddressInputValid(
        state.installationAddress.value,
      );
    }

    if (isComplete && isValid) {
      return callback(null, { isComplete, isValid });
    }

    return callback(new Error("Form data is incomplete or invalid"), {
      isComplete,
      isValid,
    });
  };

  useEffect(() => {
    let mergedSteps = {};

    isCompleteAndValid((error, isCompleteAndValid) => {
      if (!error) {
        mergedSteps = {
          ...globalState,
          steps: {
            ...globalState.steps,
            installationParameters: {
              ...globalState.steps.installationParameters,
              networkInstallationUrl: state.installationAddress.computed,
              vnc: {
                password: state.vncPassword,
                enabled: state?.useVnc ?? true,
              },
              ssh: {
                enabled: state.useSsh,
              },
              complete: true,
              invalid: false,
              origin: STATE_ORIGIN_USER,
            },
          },
        };
      } else if (isCompleteAndValid.isComplete) {
        mergedSteps = {
          ...globalState,
          steps: {
            ...globalState.steps,
            installationParameters: {
              ...globalState.steps.installationParameters,
              networkInstallationUrl: state.installationAddress.computed,
              vnc: {
                password: state.vncPassword,
                enabled: state?.useVnc ?? true,
              },
              ssh: {
                enabled: state.useSsh,
              },
              complete: isCompleteAndValid.isComplete,
              invalid: !isCompleteAndValid.isValid,
              origin: STATE_ORIGIN_USER,
            },
          },
        };
      } else {
        mergedSteps = {
          ...globalState,
          steps: {
            ...globalState.steps,
            installationParameters: {
              ...globalState.steps.installationParameters,
              networkInstallationUrl: state.installationAddress?.computed ?? "",
              vnc: {
                password: state?.vncPassword ?? "",
                enabled: state?.useVnc ?? true,
              },
              ssh: {
                enabled: state?.useSsh ?? "",
              },
              disabled: false,
              complete: isCompleteAndValid.isComplete,
              invalid: !isCompleteAndValid.isValid,
              origin: STATE_ORIGIN_USER,
            },
          },
        };
      }

      globalDispatch({
        type: ACTION_UPDATE_APP_STEPS,
        nextSteps: mergedSteps.steps,
      });
      globalDispatch({
        type: ACTION_UPDATE_APP_IS_DIRTY,
        nextIsDirty: true,
      });
      globalDispatch({
        type: ACTION_UPDATE_APP_IS_DISABLED,
        nextSteps: updateIsDisabled(mergedSteps.steps),
      });
    });

    localStorage.setItem(
      LOCAL_STORAGE_KEY_APP_INSTALLATION_PARAMETERS,
      JSON.stringify({
        ...state,
        origin: STATE_ORIGIN_STORAGE,
      }),
    );
  }, [state]);

  const ipAddressVersionMissmatchExists = () => {
    const urlObject = toUrl(state.installationAddress?.value ?? "");

    if (
      urlObject &&
      urlObject.isIP &&
      urlObject.ipVersion &&
      urlObject.ipVersion !== ipAddressVersion
    ) {
      return true;
    }

    return false;
  };

  const ipVersionMissmatchNotification = (
    <InlineNotification
      hideCloseButton
      statusIconDescription="notification"
      subtitle={t(
        "panel.installationParameter.missingRemoteAccessNotificationSubtitle",
        {
          ns: "panels",
        },
      )}
      title={t(
        "panel.installationParameter.missingRemoteAccessNotificationTitle",
        {
          ns: "panels",
        },
      )}
      kind="info"
      className="installation-address_ip-version-missmatch-banner"
    />
  );

  const gridContentsMarkupRowOne = (
    <>
      <TextInput
        helperText=""
        type="url"
        id="installation-address-input"
        invalid={
          state.installationAddress ? !state.installationAddress.valid : false
        }
        invalidText={t("invalidTextLabel", { ns: "common" })}
        labelText={getLabel(
          t("panel.installationParameter.installationAddressTextLabel", {
            ns: "panels",
          }),
          t("showInformationLabel", { ns: "common" }),
          getContent(
            t("panel.installationParameter.installationAddressHelp", {
              ns: "panels",
            }),
          ),
        )}
        placeholder={t(
          "panel.installationParameter.installationAddressPlaceholder",
          { ns: "panels" },
        )}
        className="installation-parameters_installation-address-input"
        value={state.installationAddress ? state.installationAddress.value : ""}
        onChange={(url) => {
          const urlValue = url && url.target ? url.target.value : "";
          const computedUrlValue = computeInstallationAddress(urlValue);
          // while editing we don't update the validity but set it to true
          // cause we don't want to have the form validation logic kick in.
          updateInstallationAddress(urlValue, computedUrlValue, true);
        }}
        onBlur={(url) => {
          const urlValue = url && url.target ? url.target.value : "";
          const computedUrlValue = computeInstallationAddress(urlValue);
          const urlValueIsValid = isInstallationAddressInputValid(urlValue);
          updateInstallationAddress(
            urlValue,
            computedUrlValue,
            urlValueIsValid,
          );
        }}
      />
      {ipAddressVersionMissmatchExists() && ipVersionMissmatchNotification}
    </>
  );

  const gridContentsMarkupComputedRow = (
    <>
      <TextInput
        readOnly
        helperText=""
        id="computed-installation-address-input"
        labelText={getLabel(
          t(
            "panel.installationParameter.computedInstallationAddressTextLabel",
            { ns: "panels" },
          ),
          t("showInformationLabel", { ns: "common" }),
          getContent(
            t("panel.installationParameter.computedInstallationAddressHelp", {
              ns: "panels",
            }),
          ),
        )}
        placeholder={t(
          "panel.installationParameter.computedInstallationAddressPlaceholder",
          { ns: "panels" },
        )}
        className="installation-parameters_installation-address-input"
        value={
          state.installationAddress ? state.installationAddress.computed : ""
        }
      />
    </>
  );

  const gridContentsMarkupRowTwoColumnOne = (
    <div className="installation-parameters_column-left">
      <TextInput
        disabled={state?.userAndPwdAreDisabled ?? true}
        helperText=""
        id="username-input"
        invalid={state && state.userName ? !state.userName.valid : false}
        invalidText={t("invalidTextLabel", { ns: "common" })}
        labelText={getLabel(
          t("panel.installationParameter.usernameTextLabel", { ns: "panels" }),
          t("showInformationLabel", { ns: "common" }),
          getContent(
            t("panel.installationParameter.usernameHelp", { ns: "panels" }),
          ),
        )}
        placeholder={t("panel.installationParameter.usernamePlaceholder", {
          ns: "panels",
        })}
        className="installation-parameters_username-input"
        value={state.userName ? state.userName.value : ""}
        onChange={(userName) => {
          const userNameValue =
            userName && userName.target ? userName.target.value : "";
          const computedUrlValue = state.installationAddress
            ? computeInstallationAddress(
                state.installationAddress.value,
                userNameValue,
              )
            : "";
          // while editing we don't update the validity but set it to true
          // cause we don't want to have the form validation logic kick in.
          updateUserName(userNameValue, true);
          updateInstallationAddress(
            state?.installationAddress?.value ?? "",
            computedUrlValue,
            true,
          );
        }}
        onBlur={(userName) => {
          const userNameValue =
            userName && userName.target ? userName.target.value : "";
          const computedUrlValue = state.installationAddress
            ? computeInstallationAddress(
                state.installationAddress.value,
                userNameValue,
              )
            : "";
          const userNameValueIsValid = isUserNameInputValid(userNameValue);
          updateUserName(userNameValue, userNameValueIsValid);
          updateInstallationAddress(
            state?.installationAddress?.value ?? "",
            computedUrlValue,
            true,
          );
        }}
      />
    </div>
  );

  const gridContentsMarkupRowTwoColumnTwo = (
    <div className="installation-parameters_column-right">
      <PasswordInput
        disabled={state?.userAndPwdAreDisabled ?? true}
        autoComplete="true"
        helperText=""
        id="password-input"
        invalid={state && state.password ? !state.password.valid : false}
        invalidText={t("invalidTextLabel", { ns: "common" })}
        labelText={getLabel(
          t("panel.installationParameter.passwordTextLabel", { ns: "panels" }),
          t("showInformationLabel", { ns: "common" }),
          getContent(
            t("panel.installationParameter.passwordHelp", { ns: "panels" }),
          ),
        )}
        placeholder={t("panel.installationParameter.passwordPlaceholder", {
          ns: "panels",
        })}
        className="installation-parameters_password-input"
        value={state.password ? state.password.value : ""}
        onChange={(password) => {
          const passwordValue =
            password && password.target ? password.target.value : "";
          const computedUrlValue = state.installationAddress
            ? computeInstallationAddress(
                state.installationAddress.value,
                state?.userName?.value ?? "",
                passwordValue,
              )
            : "";
          // while editing we don't update the validity but set it to true
          // cause we don't want to have the form validation logic kick in.
          updatePassword(passwordValue, true);
          updateInstallationAddress(
            state?.installationAddress?.value ?? "",
            computedUrlValue,
            true,
          );
        }}
        onBlur={(password) => {
          const passwordValue =
            password && password.target ? password.target.value : "";
          const computedUrlValue = state.installationAddress
            ? computeInstallationAddress(
                state.installationAddress.value,
                state?.userName?.value ?? "",
                passwordValue,
              )
            : "";
          const passwordValueIsValid = isPasswordInputValid(passwordValue);
          updatePassword(passwordValue, passwordValueIsValid);
          updateInstallationAddress(
            state?.installationAddress?.value ?? "",
            computedUrlValue,
            true,
          );
        }}
      />
    </div>
  );

  const gridContentsMarkupRowThreeColumnOne = (
    <div className="installation-parameters_column-left">
      <Toggle
        labelText={getLabel(
          t("panel.installationParameter.vncToggleTextLabel", { ns: "panels" }),
          t("showInformationLabel", { ns: "common" }),
          getContent(
            t("panel.installationParameter.vncToggleHelp", { ns: "panels" }),
          ),
        )}
        labelA={t("toggle.disableLabel", { ns: "common" })}
        labelB={t("toggle.enableLabel", { ns: "common" })}
        id="vnc-toggle"
        defaultToggled={useVncToggled}
        onToggle={() => {
          if (useVncToggled) {
            updateUseVnc(false);
          } else {
            updateUseVnc(true);
          }
        }}
      />
      {useVncToggled && (
        <PasswordInput
          autoComplete="true"
          helperText=""
          id="vnc-password-input"
          invalidText={t("invalidTextLabel", { ns: "common" })}
          labelText={getLabel(
            t("panel.installationParameter.vncPasswordTextLabel", {
              ns: "panels",
            }),
            t("showInformationLabel", { ns: "common" }),
            getContent(
              t("panel.installationParameter.vncPasswordHelp", {
                ns: "panels",
              }),
            ),
          )}
          placeholder={t("panel.installationParameter.vncPasswordPlaceholder", {
            ns: "panels",
          })}
          value={state.vncPassword ? state.vncPassword : ""}
          onChange={(password) => {
            updateVncPassword(
              password && password.target ? password.target.value : "",
            );
          }}
          onBlur={(password) => {
            updateVncPassword(
              password && password.target ? password.target.value : "",
            );
          }}
        />
      )}
    </div>
  );

  const gridContentsMarkupRowThreeColumnTwo = (
    <div className="installation-parameters_column-right">
      <Toggle
        labelText={getLabel(
          t("panel.installationParameter.sshToggleTextLabel", { ns: "panels" }),
          t("showInformationLabel", { ns: "common" }),
          getContent(
            t("panel.installationParameter.sshToggleHelp", { ns: "panels" }),
          ),
        )}
        labelA={t("toggle.disableLabel", { ns: "common" })}
        labelB={t("toggle.enableLabel", { ns: "common" })}
        id="ssh-toggle"
        defaultToggled={useSshToggled}
        onToggle={() => {
          if (useSshToggled) {
            updateUseSsh(false);
          } else {
            updateUseSsh(true);
          }
        }}
      />
    </div>
  );

  return (
    <Layer>
      <FlexGrid className="installation-parameters__grid">
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
  );
};

InstallationParameters.propTypes = {
  state: PropTypes.shape({
    useSsh: PropTypes.bool.isRequired,
    useVnc: PropTypes.bool.isRequired,
    userName: PropTypes.shape({
      value: PropTypes.string.isRequired,
      valid: PropTypes.bool.isRequired,
    }),
    password: PropTypes.shape({
      value: PropTypes.string.isRequired,
      valid: PropTypes.bool.isRequired,
    }),
    userAndPwdAreDisabled: PropTypes.bool.isRequired,
    vncPassword: PropTypes.string.isRequired,
    installationAddress: PropTypes.shape({
      value: PropTypes.string.isRequired,
      computed: PropTypes.string.isRequired,
      valid: PropTypes.bool.isRequired,
    }),
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
  ipAddressVersion: PropTypes.string.isRequired,
};

export default InstallationParameters;
