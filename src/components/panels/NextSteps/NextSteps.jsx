import React, { useState } from "react";
import { TextArea, Grid, Column } from "@carbon/react";

const NextSteps = () => {
  // eslint-disable-next-line
  const [state, setState] = useState({
  });

  return (
    <Grid className="download-param-file_grid" fullWidth>
      <Column sm={6} md={8} lg={16}>
        <TextArea
          labelText=""
          helperText=""
          rows={8}
          id="download-param-file-input"
        />
      </Column>
    </Grid>
  );
};

export default NextSteps;
