import React from "react";
import PropTypes from "prop-types";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const OPTIONS = [
  "TODOS",
  "BRONQUITE AGUDA",
  "INFECCAO AGUDA DAS VIAS AEREAS SUPERIORES NAO ESPECIFICADA",
  "NASOFARINGITE AGUDA [RESFRIADO COMUM]",
  "SINUSITE AGUDA",
  "BRONQUIOLITE AGUDA",
  "AMIGDALITE AGUDA",
  "ASMA",
  "BRONCOPNEUMONIA NAO ESPECIFICADA",
  "LARINGITE AGUDA",
  "INFLUENZA [GRIPE] DEVIDA A VIRUS NAO IDENTIFICADO",
];

const MENU_PROPS = {
  PaperProps: {
    sx: {
      maxHeight: 360,
      mt: 0.5,
    },
  },
};

const CidSelect = ({ cid, handleCidChange }) => {
  return (
    <FormControl size="small" fullWidth>
      <InputLabel id="cid-label">CID</InputLabel>
      <Select
        labelId="cid-label"
        id="cid"
        value={cid}
        onChange={handleCidChange}
        label="CID"
        MenuProps={MENU_PROPS}
      >
        {OPTIONS.map((option) => (
          <MenuItem key={option} value={option}>
            {option === "TODOS" ? <em>TODOS</em> : option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

CidSelect.propTypes = {
  cid: PropTypes.string.isRequired,
  handleCidChange: PropTypes.func.isRequired,
};

export default CidSelect;
