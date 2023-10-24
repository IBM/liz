/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

const getOsaInterfaceName = (readChannelId) => {
  const channelSegments = readChannelId && typeof readChannelId === "string"
    ? toChannelSegments(readChannelId)
    : [];

  if (
    channelSegments.length === 3 &&
    channelSegments[0] === "0" &&
    channelSegments[1] === "0" &&
    channelSegments[2] === "0"
  ) {
    return "enc0";
  } else if (
    channelSegments.length === 3 &&
    channelSegments[0] === "0" &&
    channelSegments[1] === "0"
  ) {
    return `enc${channelSegments[2].replace(/^0+/, '')}`;
  } else if (
    channelSegments.length === 3 &&
    channelSegments[0] === "0"
  ) {
    return `enc${channelSegments[1].replace(/^0+/, '')}.${channelSegments[2].replace(/^0+/, '')}`;
  }

  return "";
}

const getRoCeInterfaceName = (fid = "", uid = "") => {
  if (uid && uid.length > 0) {
    return `eno${parseInt(uid, 16)}`;
  } else if (fid && fid.length > 0) {
    return `ens${parseInt(fid, 16)}`;
  }

  return "";
}

const getInterfaceName = (readChannelId = "", fid = "", uid = "") => {
  if (
    readChannelId &&
    typeof readChannelId === "string" &&
    readChannelId.length > 0
  ) {
    return getOsaInterfaceName(readChannelId);
  } else if (
    uid &&
    typeof uid === "string" &&
    uid.length > 0
  ) {
    return getRoCeInterfaceName(uid);
  } else if (
    fid &&
    typeof fid === "string" &&
    fid.length > 0
  ) {
    return getRoCeInterfaceName(fid);
  } else if (
    fid &&
    uid &&
    typeof fid === "string" &&
    typeof uid === "string" &&
    fid.length > 0 &&
    uid.length > 0
  ) {
    return getRoCeInterfaceName(fid, uid);
  }
}

const toChannelSegments = (value) => {
  const hasSegments = value.indexOf(".") >= 0 &&
    (value.match(/\./g) || []).length === 2;

  if (typeof value === "string" && hasSegments) {
    const segments = value.split(".");

    if (segments[2].length < 4) {
      const lastSegment = segments.pop();
      segments.push(lastSegment.padStart(4, "0"));
    }
    return segments;
  }
  return [];
}

const validateSegments = (segments) => {
  let i;
  let isValid = false;
  for (i = 0; i < segments.length; i++) {
    const segment = segments[i];
    isValid = isHex(segment);
  }
  return isValid;
}

const isHex = (value) => {
  const intValue = parseInt(value, 16);
  if (typeof value === "string" && value.startsWith("0x")) {
    return (`0x${intValue.toString(16)}` === value.toLowerCase(value));
  } else if (typeof value === "string" && value.startsWith("0") && value.length === 4) {
    return (intValue.toString(16).padStart(4, "0") === value.toLowerCase(value));
  } else if (typeof value === "string") {
    return (intValue.toString(16) === value.toLowerCase(value));
  }
  return false;
}

export {
  getInterfaceName,
  toChannelSegments,
  validateSegments,
  isHex
};
