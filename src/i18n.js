/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import Pseudo from "i18next-pseudo";

const i18Init = () => {
  i18n
    .use(
      new Pseudo({
        enabled: true,
        languageToPseudo: "es-US",
        letterMultiplier: 4,
        repeatedLetters: ["B", "o", "a", "t"],
      }),
    )
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
      debug: true,
      fallbackLng: "en",
      preload: ["en", "de"],
      ns: ["translation", "panels", "common", "help"],
      defaultNS: "translation",
      backend: {
        loadPath: "locales/{{lng}}/{{ns}}.json",
      },
      detection: {
        order: ["querystring", "cookie", "navigator", "htmlTag"],
      },
      postProcess: ["pseudo"],
    });
};

export default i18Init;
