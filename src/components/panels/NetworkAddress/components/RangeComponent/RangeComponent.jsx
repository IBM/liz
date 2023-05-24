import React from "react";
import PropTypes from "prop-types";
import { TextInput, Grid, Column } from "@carbon/react";

const RangeComponent = ({multi}) => {
  return (
    <Grid className="download-param-file_grid" fullWidth>
      <Column sm={6} md={8} lg={16}>
        <TextInput
            helperText=""
            id="hostip-range-input1"
            invalidText="A valid value is required"
            labelText=""
            placeholder="00.0.0.000"
        />
      </Column>
      <Column sm={6} md={8} lg={16}>
        {multi &&
            <TextInput
                helperText=""
                id="hostip-range-input2"
                invalidText="A valid value is required"
                labelText=""
                placeholder="00.0.0.000"
            />
        }
      </Column>
    </Grid>
  );
};

RangeComponent.propTypes = {
    multi: PropTypes.bool
};

export default RangeComponent;
