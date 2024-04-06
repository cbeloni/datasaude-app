import React from "react";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import PropTypes from "prop-types";

export default function RadioGroupCid({ value, onChange }) {
  return (
    <FormControl>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={value}
        onChange={onChange}
      >
        <FormControlLabel value="cid" control={<Radio />} label="Todos" />
        <FormControlLabel
          value="cid_maiores"
          control={<Radio />}
          label="10 Maiores"
        />
      </RadioGroup>
    </FormControl>
  );
}

RadioGroupCid.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
};
