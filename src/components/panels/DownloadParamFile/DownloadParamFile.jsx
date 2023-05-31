import React, { useState } from "react";
import { Button, ButtonSet, TextArea, Grid, Column } from "@carbon/react";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import "./_download-param-file.scss";

const DownloadParamFile = () => {
  const [state, setState] = useState({
    copied: false,
    paramFileValue: `
    rd.znet=qeth,
    0.0.bdf0,0.0.
    bdf1,0.0.bdf2,
    layer2=1,
    portno=0,
    ip=172.18.132.1::172.18.0.1:15:t3560001.lnxne.boe:encbdf0:none,
    nameserver=172.18.0.1
    `
  });

  const updateCopied = () => {
    setState({ ...state, copied: true });
    const timer = setTimeout(() => {
      setState({ ...state, copied: false });
    }, 2000);
    return () => clearTimeout(timer);
  }

  const markup = (
    <Grid className="download-param-file_grid" fullWidth>
      <Column sm={6} md={8} lg={16}>
        <TextArea
          enableCounter
          id="download-param-file_textarea"
          labelText="Param text file"
          className="download-param-file_textarea"
          value={state.paramFileValue}
        />
        {state.copied ? <span className="download-param-file_copied-label">Copied.</span> : null}
        <ButtonSet className="download-param-file_buttons">
          <CopyToClipboard text={state.paramFileValue}
            onCopy={ updateCopied }>
            <Button kind="secondary" size="xl" className="download-param-file_button">
              Copy to clipboard
            </Button>
          </CopyToClipboard>
          <Button kind="primary" size="xl" className="download-param-file_button">
            Download param file
          </Button>
        </ButtonSet>
      </Column>
    </Grid>
  );

  return (markup);
};

export default DownloadParamFile;
