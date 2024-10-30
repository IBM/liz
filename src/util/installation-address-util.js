/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import isUrl from "is-url-superb";
import { ADDRESS_TYPE_IPV4 } from "./constants";
import { toUrl, isHostnameValid } from "./network-address-util";

const SUPPORTED_PROTOCOLS = ["http", "https", "ftp"];

const urlUsesSupportedProtocols = (url) => {
    if (url && typeof url === "string") {
        const urlParts = url.split("://");
        if (SUPPORTED_PROTOCOLS.indexOf(urlParts[0]) >= 0) {
            return true;
        }
    }
    return false;
};

const getHostNameFromUrl = (url) => {
    if (url && url.length > 0) {
        const hostUrlWithoutProtocol = url.substring(
            url.indexOf("://") + 3,
            url.length
        );
        const hostName =
            hostUrlWithoutProtocol.indexOf("/") >= 0
                ? hostUrlWithoutProtocol.substring(
                      0,
                      hostUrlWithoutProtocol.indexOf("/")
                  )
                : hostUrlWithoutProtocol;
        return hostName;
    }
    return undefined;
};

const isInstallationAddressInputValid = (url) => {
    const hostNameFromUrl = url ? getHostNameFromUrl(url) : "";
    const urlObject = toUrl(url);
    const hostname = urlObject ? urlObject.hostname : "";
    const href = urlObject ? urlObject.href : "";

    if (
        urlObject &&
        urlObject.isIP &&
        urlObject.ipVersion === ADDRESS_TYPE_IPV4 &&
        typeof hostNameFromUrl === "string" &&
        hostNameFromUrl.split(".").length !== 4
    ) {
        return false;
    } else if (urlObject && urlObject.isIP && hostname && href) {
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

export {
    urlUsesSupportedProtocols,
    isInstallationAddressInputValid,
    getHostNameFromUrl,
};
