/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getDistributionName } from "./util/local-storage-util";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import Pseudo from "i18next-pseudo";

const i18Init = (distributionName) => {
    const localDistributionName = distributionName || getDistributionName();

    i18n.use(
        new Pseudo({
            enabled: true,
            languageToPseudo: "es-US",
            letterMultiplier: 4,
            repeatedLetters: ["B", "o", "a", "t"],
        })
    )
        .use(Backend)
        .use(LanguageDetector)
        .use(initReactI18next)
        // for all options read: https://www.i18next.com/overview/configuration-options
        .init({
            debug: true,
            fallbackLng: "en",
            preload: ["en"],
            ns: [
                "translation",
                "panels",
                "common",
                "help_downloadParamFile",
                "help_errorPage",
                "help_hint",
                "help_information",
                "help_inputFileSelection",
                "help_installationParameters",
                "help_intro",
                "help_landingPage",
                "help_networkAddress",
                "help_networkDevice",
                "help_nextSteps",
                "help_summary",
            ],
            defaultNS: "translation",
            backend: {
                loadPath: `${import.meta.env.VITE_URL_PATH_PREFIX}locales/${localDistributionName}/{{lng}}/{{ns}}.json`,
            },
            detection: {
                order: ["querystring", "cookie", "navigator", "htmlTag"],
            },
            postProcess: ["pseudo"],
        });
};

export default i18Init;
export {};
