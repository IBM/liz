/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import isValidHostname from "is-valid-hostname";
import { isIP, ipVersion } from "is-ip";
import { ADDRESS_TYPE_IPV4, ADDRESS_TYPE_IPV6 } from "./constants";

const toUrl = (url) => {
  let urlObject = null;
  try {
    urlObject = new URL(url);

    const hostnameHasBrackets =
      urlObject && urlObject.hostname && urlObject.hostname.indexOf("[") >= 0;
    const hostnameFromURLObject = hostnameHasBrackets
      ? urlObject.hostname.substring(1, urlObject.hostname.length - 1)
      : urlObject.hostname;
    const hostnameIsIP = urlObject ? isIP(hostnameFromURLObject) : false;
    const hostnameIPVersion = urlObject
      ? ipVersion(hostnameFromURLObject)
      : null;

    if (hostnameIsIP) {
      urlObject.isIP = true;
    } else {
      urlObject.isIP = false;
    }
    if (hostnameIsIP && hostnameIPVersion && hostnameIPVersion === 4) {
      urlObject.ipVersion = ADDRESS_TYPE_IPV4;
    } else if (hostnameIsIP && hostnameIPVersion && hostnameIPVersion === 6) {
      urlObject.ipVersion = ADDRESS_TYPE_IPV6;
    }
  } catch (error) {
    console.log("Error while attempting to construct an URL object.");
  }
  return urlObject;
};

const isCidr = (addressType, cidr) => {
  const isInteger =
    typeof cidr === "string"
      ? Number.isInteger(parseInt(cidr))
      : Number.isInteger(cidr);
  if (addressType === ADDRESS_TYPE_IPV4 && isInteger) {
    const decimal = Math.trunc(cidr);
    return decimal <= 32;
  } else if (addressType === ADDRESS_TYPE_IPV6 && isInteger) {
    const decimal = Math.trunc(cidr);
    return decimal <= 128;
  }
  return false;
};

const netmaskToCidr = (netmask) => {
  let cidr = 0;

  if (netmask) {
    const maskNodes = netmask.match(/(\d+)/g);

    for (const i in maskNodes) {
      cidr += ((maskNodes[i] >>> 0).toString(2).match(/1/g) || []).length;
    }
  }
  return cidr;
};

const cidrToNetmask = (cidr) => {
  const isInteger =
    typeof cidr === "string"
      ? Number.isInteger(parseInt(cidr))
      : Number.isInteger(cidr);
  const mask = [];
  let i;
  let n;

  if (isInteger && cidr) {
    for (i = 0; i < 4; i++) {
      n = Math.min(cidr, 8);
      mask.push(256 - Math.pow(2, 8 - n));
      cidr -= n;
    }
  }
  return mask.join(".");
};

const pad = (value, width, padchar) => {
  while (value.length < width) {
    value += padchar;
  }
  return value;
};

const netmaskToBinary = (netmask) => {
  let binary;

  if (netmask) {
    const parts = netmask.split(".");

    const newParts = [];
    parts.forEach((part) => {
      const dec2bin = parseInt(part).toString(2);
      newParts.push(pad(dec2bin, 8, "0"));
    });

    binary = newParts.join(".");
  }
  return binary;
};

const domainNameHasValidLabels = (domainName) => {
  let hasValidLabels = false;

  if (domainName && typeof domainName === "string" && domainName.length > 0) {
    const labels = domainName.split(".");

    for (let i = 0; i < labels.length; i++) {
      if (labels[i].length <= 63) {
        hasValidLabels = true;
      } else {
        hasValidLabels = false;
        // we don't need to continue if there's one invalid label.
        return;
      }
    }
  }

  return hasValidLabels;
};

const isHostnameValid = (hostName) => {
  // the hostName is optional,
  // if it is a zero length string mark it as a valid value.
  if (typeof hostName === "string" && hostName.length === 0) {
    return true;
  }

  return (
    hostName &&
    typeof hostName === "string" &&
    hostName.length <= 253 &&
    domainNameHasValidLabels(hostName) &&
    isValidHostname(hostName)
  );
};

const isDomainSearchPathValid = (domainSearchPath) => {
  // the domainSearchPath is optional,
  // if it is a zero length string mark it as a valid value.
  if (typeof domainSearchPath === "string" && domainSearchPath.length === 0) {
    return true;
  }

  return (
    domainSearchPath &&
    typeof domainSearchPath === "string" &&
    domainSearchPath.length <= 253 &&
    domainNameHasValidLabels(domainSearchPath) &&
    isValidHostname(domainSearchPath)
  );
};

const isIpv4NetworkAddressValid = (ipv4Address) => {
  const match = ipv4Address.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  return (
    match != null &&
    match[1] <= 255 &&
    match[2] <= 255 &&
    match[3] <= 255 &&
    match[4] <= 255
  );
};

const isIpv6NetworkAddressValid = (ipv6Address) => {
  const regexExp =
    /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/gi;
  return regexExp.test(ipv6Address);
};

export {
  toUrl,
  isCidr,
  netmaskToCidr,
  cidrToNetmask,
  netmaskToBinary,
  domainNameHasValidLabels,
  isHostnameValid,
  isDomainSearchPathValid,
  isIpv4NetworkAddressValid,
  isIpv6NetworkAddressValid,
};
