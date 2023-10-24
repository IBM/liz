/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  TextArea,
  ToggletipLabel,
  Toggletip,
  ToggletipButton,
  ToggletipContent
} from "@carbon/react";
import { Information , Copy, Download, Reset } from '@carbon/react/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import "./_param-file-text-area.scss";

const ParamFileTextArea = (
    {
      contents,
      copyContents,
      resetContents,
      downloadContents,
      onChange,
      allowCopy,
      allowReset,
      allowDownload,
      label
    }
) => {

  const getLabel = (label, buttonLabel, content) => {
      return (
          <>
            <ToggletipLabel>{label}</ToggletipLabel>
            <Toggletip className="param-file-text-area_info-icon" align="right-bottom">
                <ToggletipButton label={buttonLabel}>
                  <Information/>
                </ToggletipButton>
                <ToggletipContent>
                  {content}
                </ToggletipContent>
            </Toggletip>
          </>
      );
  }

  const buttonBarMarkup = (
    <div className="param-file-text-area_textarea-button-bar">
      {allowCopy &&
        <CopyToClipboard text={contents} onCopy={copyContents}>
          <div className="param-file-text-area_textarea-button-bar__button" title="Copy to clipboard">
            <Button
              size="32"
              kind="ghost"
              renderIcon={Copy}
              iconDescription="Copy to clipboard"
              tooltipPosition="left"
              hasIconOnly
            />
          </div>
        </CopyToClipboard>
      }
      {allowReset &&
        <div className="param-file-text-area_textarea-button-bar__button" onClick={resetContents}>
          <Button
            size="32"
            kind="ghost"
            renderIcon={Reset}
            iconDescription="Reset param file"
            tooltipPosition="left"
            hasIconOnly
          />
        </div>
      }
      {allowDownload &&
        <div className="param-file-text-area_textarea-button-bar__button" onClick={downloadContents}>
          <Button
            size="32"
            kind="ghost"
            renderIcon={Download}
            iconDescription="Download param file"
            tooltipPosition="left"
            hasIconOnly
          />
        </div>
      }
    </div>
  );

  const textAreaModifiedClass = allowReset ? "param-file-text-area_textarea__modified": "";
  const textAreaClasses = `param-file-text-area_textarea ${textAreaModifiedClass}`;
  const textAreaMarkup = (
    <TextArea
      enableCounter
      labelText={getLabel(
        label.text,
        "Show information",
        label.content
      )}
      className={textAreaClasses}
      rows={10}
      value={contents}
      onChange={onChange}
    >
    </TextArea>
  );

  return (
    <>
      {buttonBarMarkup}
      {textAreaMarkup}
    </>
  )
}

ParamFileTextArea.propTypes = {
  contents: PropTypes.string,
  copyContents: PropTypes.func,
  resetContents: PropTypes.func,
  downloadContents: PropTypes.func,
  onChange: PropTypes.func,
  allowCopy: PropTypes.bool,
  allowReset: PropTypes.bool,
  allowDownload: PropTypes.bool,
  label: PropTypes.shape({
      text: PropTypes.string,
      content: PropTypes.object
  })
};
  
export default ParamFileTextArea;
