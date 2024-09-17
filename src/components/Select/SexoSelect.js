import React from "react";
import PropTypes from "prop-types";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const SexoSelect = ({ sexo, handleSexoChange }) => {
  return (
    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="sexo-label">Sexo</InputLabel>
      <Select
        labelId="sexo-label"
        id="sexo"
        value={sexo}
        onChange={handleSexoChange}
        label="sexo"
      >
        <MenuItem value="TODOS">
          <em>TODOS</em>
        </MenuItem>
        <MenuItem value={"M"}>Masculino</MenuItem>
        <MenuItem value={"F"}>Feminino</MenuItem>
      </Select>
    </FormControl>
  );
};

SexoSelect.propTypes = {
  sexo: PropTypes.string.isRequired,
  handleSexoChange: PropTypes.func.isRequired,
};

export default SexoSelect;
