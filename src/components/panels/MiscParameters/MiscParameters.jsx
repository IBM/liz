import React from "react";
import { TextArea, Grid, Column } from "@carbon/react";

const MiscParameters = () => {
  return (
    <Grid className="misc-parameters_grid" fullWidth>
      <Column sm={6} md={8} lg={16}>
        <TextArea
          labelText=""
          helperText=""
          rows={8}
          id="misc-parameters-input"
        />
      </Column>
    </Grid>
  );
};

export default MiscParameters;
