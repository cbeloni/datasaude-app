import React, { useState } from "react";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";

export default function RowRadioButtonsGroup() {
  const [selectedValue, setSelectedValue] = useState("movel");

  const handleRadioChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">Escala:</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={selectedValue}
        onChange={handleRadioChange}
      >
        <FormControlLabel value="movel" control={<Radio />} label="Móvel" />
        <FormControlLabel value="fixa" control={<Radio />} label="Fixa" />
      </RadioGroup>
    </FormControl>
  );
}
