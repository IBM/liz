/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import React from "react";
import PropTypes from "prop-types";
import "../../../_installation-parameters.scss";

const VncView = ({
    paramFileHasBeenModifiedFromState,
    useVncToggled,
    showPasswords,
    vncPassword,
    isPasswordInputValid,
}) => {
    return <></>;
};

VncView.propTypes = {
    paramFileHasBeenModifiedFromState: PropTypes.bool.isRequired,
    useVncToggled: PropTypes.bool.isRequired,
    showPasswords: PropTypes.bool.isRequired,
    isPasswordInputValid: PropTypes.func.isRequired,
    vncPassword: PropTypes.object,
};

export default VncView;
