/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import React from "react";
import PropTypes from "prop-types";
import { Row, Column } from "@carbon/react";
import "../../_installation-parameters.scss";

const RemoteAccessWrapper = ({ children }) => {
    return (
        <Row>
            <Column>{children.vncView}</Column>
            <Column>{children.sshView}</Column>
        </Row>
    );
};

RemoteAccessWrapper.propTypes = {
    children: PropTypes.node.isRequired,
};

export default RemoteAccessWrapper;
