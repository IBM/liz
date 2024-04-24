/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "signed-off-by": [2, "always", "Signed-off-by:"],
  },
};
