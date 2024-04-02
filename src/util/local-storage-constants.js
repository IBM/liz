/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

const LOCAL_STORAGE_KEY_APP = "com.ibm.systems.linux.z.app";
const LOCAL_STORAGE_KEY_INPUT_FILE_SELECTION =
  "com.ibm.systems.linux.z.inputFileSelection";
const LOCAL_STORAGE_KEY_APP_INFORMATION = "com.ibm.systems.linux.z.information";
const LOCAL_STORAGE_KEY_APP_DOWNLOAD_PARAM_FILE =
  "com.ibm.systems.linux.z.downloadParamFile";
const LOCAL_STORAGE_KEY_APP_INTRO = "com.ibm.systems.linux.z.intro";
const LOCAL_STORAGE_KEY_APP_HEADER = "com.ibm.systems.linux.z.header";
const LOCAL_STORAGE_KEY_APP_INSTALLATION_PARAMETERS =
  "com.ibm.systems.linux.z.installationParameters";
const LOCAL_STORAGE_KEY_APP_NETWORK_ADDRESS =
  "com.ibm.systems.linux.z.networkAddress";
const LOCAL_STORAGE_KEY_APP_NETWORK_DEVICE =
  "com.ibm.systems.linux.z.networkDevice";
const LOCAL_STORAGE_KEY_APP_SUMMARY = "com.ibm.systems.linux.z.summary";
const LOCAL_STORAGE_KEY_APP_INLINE_NOTIFICATION =
  "com.ibm.systems.linux.z.inlineNotification";
const LOCAL_STORAGE_KEY_APP_LANDING_PAGE =
  "com.ibm.systems.linux.z.landingPage";
const LOCAL_STORAGE_KEY_APP_EDIT_PAGE = "com.ibm.systems.linux.z.editPage";
const LOCAL_STORAGE_KEY_APP_ERROR_PAGE = "com.ibm.systems.linux.z.errorPage";

const STATE_ORIGIN_USER = "user";
const STATE_ORIGIN_DEFAULT = "default";
const STATE_ORIGIN_STORAGE = "storage";

export {
  LOCAL_STORAGE_KEY_APP_HEADER,
  LOCAL_STORAGE_KEY_APP,
  LOCAL_STORAGE_KEY_INPUT_FILE_SELECTION,
  LOCAL_STORAGE_KEY_APP_INFORMATION,
  LOCAL_STORAGE_KEY_APP_DOWNLOAD_PARAM_FILE,
  LOCAL_STORAGE_KEY_APP_INTRO,
  LOCAL_STORAGE_KEY_APP_INSTALLATION_PARAMETERS,
  LOCAL_STORAGE_KEY_APP_NETWORK_ADDRESS,
  LOCAL_STORAGE_KEY_APP_NETWORK_DEVICE,
  LOCAL_STORAGE_KEY_APP_SUMMARY,
  LOCAL_STORAGE_KEY_APP_INLINE_NOTIFICATION,
  LOCAL_STORAGE_KEY_APP_LANDING_PAGE,
  LOCAL_STORAGE_KEY_APP_EDIT_PAGE,
  LOCAL_STORAGE_KEY_APP_ERROR_PAGE,
  STATE_ORIGIN_USER,
  STATE_ORIGIN_DEFAULT,
  STATE_ORIGIN_STORAGE,
};
