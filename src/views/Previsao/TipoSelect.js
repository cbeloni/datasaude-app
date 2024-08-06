import React from "react";
import PropTypes from "prop-types";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const CidSelect = ({ tipo, handleTipoChange }) => {
  return (
    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="tipo-label">Tipo de Análise</InputLabel>
      <Select
        labelId="tipo-label"
        id="tipo"
        value={tipo}
        onChange={handleTipoChange}
        label="Tipo Análise"
      >
        <MenuItem value={"ATENDIMENTO"}>Atendimento</MenuItem>
        <MenuItem value={"INTERNACAO"}>Internação</MenuItem>
      </Select>
    </FormControl>
  );
};

CidSelect.propTypes = {
  tipo: PropTypes.string.isRequired,
  handleTipoChange: PropTypes.func.isRequired,
};

export default CidSelect;
