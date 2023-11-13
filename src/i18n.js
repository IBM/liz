/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    lng: "en",
    fallbackLng: "en",
    preload: ["en", "de"],
    ns: ["translation"],
    defaultNS: "translation",
    backend: {
      // load from GHE liz repo
      loadPath:
        "https://raw.github.ibm.com/linuxonz/liz/main/src/locales/{{lng}}/{{ns}}.json",
      crossDomain: true,
      requestOptions: {
        // used for fetch, can also be a function (payload) => ({ method: 'GET' })
        mode: "no-cors",
        credentials: "same-origin",
        cache: "default",
      },
    },
  });

export default i18n;
