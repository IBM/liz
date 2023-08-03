/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

const toChannelSegments = (value) => {
  const hasSegments = value.indexOf(".") >= 0 &&
    (value.match(/\./g) || []).length === 3;

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
  toChannelSegments,
  validateSegments,
  isHex
};
