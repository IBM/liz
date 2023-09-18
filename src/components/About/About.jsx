/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Close, Copy, LinuxAlt } from "@carbon/icons-react";
import "./_about.scss";

const About = ({closeNotification, pruneSettings}) => {
    const useOutsideAlerter = (ref) => {
        useEffect(() => {
          const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
              closeNotification();
            }
          }

          document.addEventListener("mousedown", handleClickOutside);

          return () => {
            document.removeEventListener("mousedown", handleClickOutside);
          };
        }, [ref]);
    }

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef);

    return (
        <ul id="about-dialog__about-menu" className="about-dialog__about-menu" ref={wrapperRef} onBlur={closeNotification}>
            <li id="about-dialog__about-title" className="about-dialog__about__title-section">
                <div className="about-dialog__about__linux-icon">
                    <div>
                        <LinuxAlt size="48" />
                    </div>
                </div>
                <div className="about-dialog__about__info-section">
                    <div title="About">About</div>
                    <div title="Installation assistant for Linux on IBM Z">Installation assistant for Linux on IBM Z</div>
                    <div title="Close" className="about-dialog__about__info-section__icon" onClick={closeNotification}>
                        <Close size="16"/>
                    </div>
                </div>
            </li>
            <li>
                <div className="about-dialog__about-build-info">
                    <div className="about-dialog__about-build-info__date">
                        <span>Build date: <code>BUILD_DATE</code></span>
                        <span title="Copy">
                        <CopyToClipboard text="BUILD_DATE">
                            <Copy size="16" />
                        </CopyToClipboard>
                        </span>
                    </div>
                    <div className="about-dialog__about-build-info__commit-hash">
                        <span>Commit hash: <code>COMMIT_HASH_SHORT</code></span>
                        <span title="Copy">
                        <CopyToClipboard text="COMMIT_HASH_LONG">
                            <Copy size="16" />
                        </CopyToClipboard>
                        </span>
                    </div>
                </div>
            </li>
            <li className="about-dialog__about-report-button-container">
                <a href="BUG_TRACKER" data-title="report" id="about-dialog__about-report-button" target="_blank">
                    <span>Report an issue</span>
                </a>
            </li>
            <li className="about-dialog__about-prune-button-container">
                <a href="#" data-title="prune" id="about-dialog__about-prune-button" onClick={pruneSettings}>
                    <span>Prune Settings</span>
                </a>
            </li>
        </ul>
    );
}

About.propTypes = {
    closeNotification: PropTypes.func.isRequired,
    pruneSettings: PropTypes.func.isRequired
};
  
export default About;
