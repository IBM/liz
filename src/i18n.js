/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import i18n from "i18next";
// import resources from "virtual:i18next-loader";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

i18n
  .use(LanguageDetector)
  .use(HttpApi)
  .use(initReactI18next)
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    fallbackLng: "en",
    ns: ["translation"],
    defaultNS: "translation",
    backend: {
      // load from GHE liz repo
      loadPath:
        "https://raw.github.ibm.com/linuxonz/liz/main/src/locales/{{lng}}/{{ns}}.json",
      crossDomain: true,
      requestOptions: {
        // used for fetch, can also be a function (payload) => ({ method: 'GET' })
        mode: "cors",
        credentials: "same-origin",
        cache: "default",
      },
    },
    // resources
  });

export default i18n;
