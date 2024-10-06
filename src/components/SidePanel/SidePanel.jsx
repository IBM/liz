/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

import React, { useRef, useEffect, forwardRef } from "react";
import { HeaderPanel } from "@carbon/react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { ESCAPE_KEY_EVENT } from "../../util/event-handler-constants";
import "./_side-panel.scss";

const SidePanel = forwardRef(function SidePanel(props, ref) {
    const { t } = useTranslation();
    const { children, href, expanded } = props;

    const useOutsideAlerter = (ref) => {
        useEffect(() => {
            const handleClickOutside = (event) => {
                if (ref.current && !ref.current.contains(event.target)) {
                    // MOP
                }
            };

            document.addEventListener("mousedown", handleClickOutside);

            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    };

    const handleOnBlur = (event) => {
        // NOP
    };

    const handleOnKeyDown = (event) => {
        switch (event.code) {
            case ESCAPE_KEY_EVENT:
                // NOP
                break;
        }
    };

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef);

    return (
        <HeaderPanel
            expanded={expanded}
            tabIndex="0"
            id="help-dialog__help-menu"
            className="help-dialog__help-menu"
            ref={wrapperRef}
            href={href}
            role="menu"
            aria-orientation="vertical"
            aria-label={t("rightNavigation.header")}
            addFocusListeners={false}
            onBlur={handleOnBlur}
            onKeyDown={handleOnKeyDown}
        >
            <div className="help-dialog__help-menu__content">
                <div className="help-dialog__help-menu__content__title-container">
                    <div className="help-dialog__help-menu__content__title">
                        <h2 className="help-dialog__help-menu__content__title-text">
                            {t("rightNavigation.header")}
                        </h2>
                    </div>
                </div>
                <div className="help-dialog__help-menu__inner-content">
                    {children}
                </div>
            </div>
        </HeaderPanel>
    );
});

SidePanel.propTypes = {
    closeNotification: PropTypes.func.isRequired,
    pruneSettings: PropTypes.func.isRequired,
    href: PropTypes.string.isRequired,
    expanded: PropTypes.bool.isRequired,
    children: PropTypes.node,
};

export default SidePanel;
