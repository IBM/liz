import React from "react";
import { CodeSnippet, Grid, Column } from "@carbon/react";

const DownloadParamFile = () => {
  return (
    <Grid className="download-param-file_grid" fullWidth>
      <Column sm={6} md={8} lg={16}>
        <CodeSnippet type="multi" feedback="Copied to clipboard">
          rd.znet=qeth,0.0.bdf0,0.0.bdf1,0.0.bdf2,layer2=1,portno=0
          ip=172.18.132.1::172.18.0.1:15:t3560001.lnxne.boe:encbdf0:none
          nameserver=172.18.0.1
        </CodeSnippet>
      </Column>
    </Grid>
  );
};

export default DownloadParamFile;
