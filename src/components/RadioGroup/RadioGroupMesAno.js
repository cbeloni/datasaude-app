import React from "react";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import PropTypes from "prop-types";

export default function RadioGroupMesAno({ value, onChange }) {
  return (
    <FormControl>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={value}
        onChange={onChange}
      >
        <FormControlLabel value="mes" control={<Radio />} label="Mês" />
        <FormControlLabel value="dia" control={<Radio />} label="Dia" />
      </RadioGroup>
    </FormControl>
  );
}

RadioGroupMesAno.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
};
