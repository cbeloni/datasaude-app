import React from "react";
import PropTypes from "prop-types";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const MENU_PROPS = {
  PaperProps: { sx: { maxHeight: 320, mt: 0.5 } },
};

const SexoSelect = ({ sexo, handleSexoChange }) => {
  return (
    <FormControl size="small" fullWidth>
      <InputLabel id="sexo-label">Sexo</InputLabel>
      <Select
        labelId="sexo-label"
        id="sexo"
        value={sexo}
        onChange={handleSexoChange}
        label="Sexo"
        MenuProps={MENU_PROPS}
      >
        <MenuItem value="TODOS">
          <em>Todos</em>
        </MenuItem>
        <MenuItem value="M">Masculino</MenuItem>
        <MenuItem value="F">Feminino</MenuItem>
      </Select>
    </FormControl>
  );
};

SexoSelect.propTypes = {
  sexo: PropTypes.string.isRequired,
  handleSexoChange: PropTypes.func.isRequired,
};

export default SexoSelect;
