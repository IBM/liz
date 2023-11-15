/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import {
  Layer,
  Toggle,
  ToggletipLabel,
  Toggletip,
  ToggletipButton,
  ToggletipContent,
  TextInput,
  PasswordInput,
  FlexGrid,
  Row,
  Column,
} from "@carbon/react";
import { Information } from "@carbon/react/icons";
import "./_installation-parameters.scss";

const SUPPORTED_PROTOCOLS = ["http", "https", "ftp"];

const InstallationParameters = (patchState, localStorageKey) => {
  const { t } = useTranslation();
  const getInitialState = () => {
    const initialState = JSON.parse(localStorage.getItem(localStorageKey));
    const defaultState = {
      useSsh: false,
      useVnc: false,
      installationAddress: {
        value: "",
        computed: "",
        valid: false,
      },
      userName: {
        value: "",
        valid: false,
      },
      password: {
        value: "",
        valid: false,
      },
      userAndPwdAreDisabled: true,
      vncHost: "",
      vncPassword: "",
      sshHost: "",
    };

    if (initialState) {
      return initialState;
    }
    return defaultState;
  };
  const [state, setState] = useState(getInitialState);

  const updateUseSsh = (flag) => {
    setState((prevState) => ({ ...prevState, useSsh: flag }));
  };

  const updateUseVnc = (flag) => {
    setState((prevState) => ({ ...prevState, useVnc: flag }));
  };

  const updateInstallationAddress = (address, computedAddress, valid) => {
    setState((prevState) => ({
      ...prevState,
      installationAddress: {
        value: address,
        computed: computedAddress,
        valid,
      },
      userAndPwdAreDisabled:
        !address ||
        address.length === 0 ||
        installationAddressContainsUidOrPwd(address),
      userName: {
        value: installationAddressContainsUidOrPwd(address)
          ? ""
          : prevState?.userName?.value ?? "",
        valid: installationAddressContainsUidOrPwd(address)
          ? true
          : prevState?.userName?.valid ?? true,
      },
      password: {
        value: installationAddressContainsUidOrPwd(address)
          ? ""
          : prevState?.password?.value ?? "",
        valid: installationAddressContainsUidOrPwd(address)
          ? true
          : prevState?.password?.valid ?? true,
      },
    }));
  };

  const updateUserName = (userName, valid) => {
    setState((prevState) => ({
      ...prevState,
      userName: { value: userName, valid },
    }));
  };

  const updatePassword = (password, valid) => {
    setState((prevState) => ({
      ...prevState,
      password: { value: password, valid },
    }));
  };

  const updateVncPassword = (password) => {
    setState((prevState) => ({ ...prevState, vncPassword: password }));
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

  const isInstallationAddressInputValid = (url) => {
    let installationAddressInputIsValid = false;

    const expression =
      /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi;
    const regex = new RegExp(expression);

    if (url.match(regex)) {
      const urlParts = url.split("://");
      if (SUPPORTED_PROTOCOLS.indexOf(urlParts[0]) >= 0) {
        installationAddressInputIsValid = true;
      }
    }

    return installationAddressInputIsValid;
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
      try {
        const installationAddressUrl = new URL(address);
        const username = installationAddressUrl.username;
        const password = installationAddressUrl.password;
        if (
          (username && username.length > 0) ||
          (password && password.length > 0)
        ) {
          return true;
        }
      } catch (error) {
        console.log("Error while attempting to construct an URL object.");
      }
    }
    return false;
  };

  const computeInstallationAddress = (url = "", uid = "", pwd = "") => {
    const address = url || (state?.installationAddress?.value ?? "");
    const userName = uid || (state?.userName?.value ?? "");
    const password = pwd || (state?.password?.value ?? "");

    if (address && address.length > 0) {
      try {
        const installationAddressUrl = new URL(address);
        if (userName && userName.length > 0) {
          installationAddressUrl.username = userName;
        }
        if (
          installationAddressUrl.password &&
          installationAddressUrl.password.length > 0
        ) {
          installationAddressUrl.password = hexEncodePassword(
            installationAddressUrl.password,
          );
        }
        if (
          !installationAddressUrl.password &&
          password &&
          password.length > 0
        ) {
          installationAddressUrl.password = hexEncodePassword(password);
        }
        return installationAddressUrl.toString();
      } catch (error) {
        console.log("Error while attempting to construct an URL object.");
      }
    }
    return "";
  };

  const content = (
    <p>
      Lorem ipsum dolor sit amet, di os consectetur adipiscing elit, sed do
      eiusmod tempor incididunt ut fsil labore et dolore magna aliqua.
    </p>
  );

  const getLabel = (label, buttonLabel, content) => {
    return (
      <>
        <ToggletipLabel>{label}</ToggletipLabel>
        <Toggletip className="misc-parameters_info-icon" align="right-bottom">
          <ToggletipButton label={buttonLabel}>
            <Information />
          </ToggletipButton>
          <ToggletipContent>{content}</ToggletipContent>
        </Toggletip>
      </>
    );
  };

  const useSshToggled = state.useSsh;
  const useVncToggled = state.useVnc;

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
    localStorage.setItem(localStorageKey, JSON.stringify(state));

    isCompleteAndValid((error, isCompleteAndValid) => {
      if (!error) {
        patchState({
          steps: {
            installationParameters: {
              networkInstallationUrl: state.installationAddress.computed,
              vnc: {
                password: state.vncPassword,
                enabled: state.useVnc,
              },
              ssh: {
                host: state.sshHost,
                enabled: state.useSsh,
              },
              localStorageKey,
              complete: true,
              invalid: false,
            },
          },
        });
      } else if (isCompleteAndValid.isComplete) {
        patchState({
          steps: {
            installationParameters: {
              networkInstallationUrl: state.installationAddress.computed,
              vnc: {
                password: state.vncPassword,
                enabled: state.useVnc,
              },
              ssh: {
                host: state.sshHost,
                enabled: state.useSsh,
              },
              localStorageKey,
              complete: isCompleteAndValid.isComplete,
              invalid: !isCompleteAndValid.isValid,
            },
          },
        });
      } else {
        patchState({
          steps: {
            installationParameters: {
              networkInstallationUrl:
                state?.installationAddress?.computed ?? "",
              vnc: {
                password: state?.vncPassword ?? "",
                enabled: state?.useVnc ?? "",
              },
              ssh: {
                host: state?.sshHost ?? "",
                enabled: state?.useSsh ?? "",
              },
              localStorageKey,
              disabled: false,
              complete: isCompleteAndValid.isComplete,
              invalid: !isCompleteAndValid.isValid,
            },
          },
        });
      }
    });
  }, [state]);

  const gridContentsMarkupRowOne = (
    <>
      <TextInput
        helperText=""
        type="url"
        id="installation-address-input"
        invalid={
          state && state.installationAddress
            ? !state.installationAddress.valid
            : false
        }
        invalidText={t("invalidTextLabel", { ns: "common" })}
        labelText={getLabel(
          "Installation address",
          "Show information",
          content,
        )}
        placeholder="ex: ftp://user:password@ftpserver/iso/SLE-15-SP3-Full-s390x-GM-Media1/"
        className="installation-parameters_installation-address-input"
        defaultValue={
          state.installationAddress ? state.installationAddress.value : ""
        }
        value={state.installationAddress ? state.installationAddress.value : ""}
        onChange={(url) => {
          const urlValue = url && url.target ? url.target.value : "";
          const computedUrlValue = computeInstallationAddress();
          // while editing we don't update the validity but set it to true
          // cause we don't want to have the form validation logic kick in.
          updateInstallationAddress(urlValue, computedUrlValue, true);
        }}
        onBlur={(url) => {
          const urlValue = url && url.target ? url.target.value : "";
          const computedUrlValue = computeInstallationAddress();
          const urlValueIsValid = isInstallationAddressInputValid(urlValue);
          updateInstallationAddress(
            urlValue,
            computedUrlValue,
            urlValueIsValid,
          );
        }}
      />
      <TextInput
        readOnly
        helperText=""
        id="computed-installation-address-input"
        labelText={getLabel(
          "Installation address (computed)",
          "Show information",
          content,
        )}
        placeholder="ex: ftp://user:password@ftpserver/iso/SLE-15-SP3-Full-s390x-GM-Media1/"
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
        labelText={getLabel("Username (optional)", "Show information", content)}
        placeholder="ex: johndoe"
        className="installation-parameters_username-input"
        defaultValue={state.userName ? state.userName.value : ""}
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
        labelText={getLabel("Password (optional)", "Show information", content)}
        placeholder="ex: foobar"
        className="installation-parameters_password-input"
        defaultValue={state.password ? state.password.value : ""}
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
          "VNC for installation",
          "Show information",
          content,
        )}
        labelA="Disable"
        labelB="Enable"
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
          labelText={getLabel("VNC password", "Show information", content)}
          placeholder="VNC password here"
          defaultValue={state.vncPassword ? state.vncPassword : ""}
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
          "SSH for installation",
          "Show information",
          content,
        )}
        labelA="Disable"
        labelB="Enable"
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
          <Column>{gridContentsMarkupRowThreeColumnOne}</Column>
          <Column>{gridContentsMarkupRowThreeColumnTwo}</Column>
        </Row>
      </FlexGrid>
    </Layer>
  );
};

InstallationParameters.propTypes = {
  patchState: PropTypes.func.isRequired,
  localStorageKey: PropTypes.string.isRequired,
};

export default InstallationParameters;
