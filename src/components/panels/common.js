/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

const getInterfaceName = (readChannelId) => {
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

const toChannelSegments = (value) => {
  const hasSegments = value.indexOf(".") >= 0 &&
    (value.match(/\./g) || []).length === 2;

  if (typeof value === "string" && hasSegments) {
    return value.split(".");
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
