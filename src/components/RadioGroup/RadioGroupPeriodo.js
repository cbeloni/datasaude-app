import React from "react";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import PropTypes from "prop-types";

export default function RowRadioButtonsPeriodo({ value, onChange }) {
  return (
    <FormControl>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={value}
        onChange={onChange}
      >
        <FormControlLabel value="meses" control={<Radio />} label="Meses" />
        <FormControlLabel value="anos" control={<Radio />} label="Anos" />
      </RadioGroup>
    </FormControl>
  );
}

RowRadioButtonsPeriodo.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
};
