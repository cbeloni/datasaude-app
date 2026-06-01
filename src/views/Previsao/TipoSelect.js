import React from "react";
import PropTypes from "prop-types";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const OPTIONS = [
  { value: "ATENDIMENTO", label: "Atendimento" },
  { value: "INTERNACAO", label: "Internação" },
];

const MENU_PROPS = {
  PaperProps: {
    sx: {
      maxHeight: 320,
      mt: 0.5,
    },
  },
};

const TipoSelect = ({ tipo, handleTipoChange }) => {
  return (
    <FormControl size="small" fullWidth>
      <InputLabel id="tipo-label">Tipo de análise</InputLabel>
      <Select
        labelId="tipo-label"
        id="tipo"
        value={tipo}
        onChange={handleTipoChange}
        label="Tipo de análise"
        MenuProps={MENU_PROPS}
      >
        {OPTIONS.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

TipoSelect.propTypes = {
  tipo: PropTypes.string.isRequired,
  handleTipoChange: PropTypes.func.isRequired,
};

export default TipoSelect;
