/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Button, TextArea } from "@carbon/react";
import { Copy, Download, Reset } from "@carbon/react/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import "./_param-file-text-area.scss";

const ParamFileTextArea = ({
  contents,
  copyContents,
  resetContents,
  downloadContents,
  onChange,
  onBlur,
  onFocus,
  allowCopy,
  allowReset,
  allowDownload,
  label,
}) => {
  const { t } = useTranslation();

  const buttonBarMarkup = (
    <div className="param-file-text-area_textarea-button-bar">
      {allowCopy && (
        <CopyToClipboard text={contents} onCopy={copyContents}>
          <div
            className="param-file-text-area_textarea-button-bar__button"
            title={t("btnLabel.Copy", { ns: "common" })}
          >
            <Button
              size="md"
              kind="ghost"
              renderIcon={Copy}
              iconDescription={t("btnLabel.Copy", { ns: "common" })}
              tooltipPosition="left"
              hasIconOnly
            />
          </div>
        </CopyToClipboard>
      )}
      {allowReset && (
        <div
          className="param-file-text-area_textarea-button-bar__button"
          onClick={resetContents}
        >
          <Button
            size="md"
            kind="ghost"
            renderIcon={Reset}
            iconDescription={t("btnLabel.Reset", { ns: "common" })}
            tooltipPosition="left"
            hasIconOnly
          />
        </div>
      )}
      {allowDownload && (
        <div
          className="param-file-text-area_textarea-button-bar__button"
          onClick={downloadContents}
        >
          <Button
            size="md"
            kind="ghost"
            renderIcon={Download}
            iconDescription={t("btnLabel.Download", { ns: "common" })}
            tooltipPosition="left"
            hasIconOnly
          />
        </div>
      )}
    </div>
  );

  const textAreaModifiedClass = allowReset
    ? "param-file-text-area_textarea__modified"
    : "";
  const textAreaClasses = `param-file-text-area_textarea ${textAreaModifiedClass}`;
  const textAreaMarkup = (
    <TextArea
      enableCounter
      id="liz__param-file-text-area"
      maxCount={860}
      labelText={label.text}
      aria-label={label.text}
      helperText={label.content}
      className={textAreaClasses}
      rows={10}
      value={contents}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
    ></TextArea>
  );

  return (
    <>
      {buttonBarMarkup}
      {textAreaMarkup}
    </>
  );
};

ParamFileTextArea.propTypes = {
  contents: PropTypes.string,
  copyContents: PropTypes.func,
  resetContents: PropTypes.func,
  downloadContents: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  allowCopy: PropTypes.bool,
  allowReset: PropTypes.bool,
  allowDownload: PropTypes.bool,
  label: PropTypes.shape({
    text: PropTypes.string,
    content: PropTypes.string,
  }),
};

export default ParamFileTextArea;
