import React from "react";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import PropTypes from "prop-types";
export default function RowRadioButtonsGroup({ value, onChange }) {
  return (
    <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">Escala:</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={value}
        onChange={onChange}
      >
        <FormControlLabel value="movel" control={<Radio />} label="Móvel" />
        <FormControlLabel value="fixa" control={<Radio />} label="Fixa" />
      </RadioGroup>
    </FormControl>
  );
}

RowRadioButtonsGroup.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
};
