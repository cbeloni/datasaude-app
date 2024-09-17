import React from "react";
import PropTypes from "prop-types";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const CidSelect = ({ cid, handleCidChange }) => {
  return (
    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="cid-label">CID</InputLabel>
      <Select
        labelId="cid-label"
        id="cid"
        value={cid}
        onChange={handleCidChange}
        label="CID"
      >
        <MenuItem value="TODOS">
          <em>TODOS</em>
        </MenuItem>
        <MenuItem value={"BRONQUITE AGUDA"}>BRONQUITE AGUDA</MenuItem>
        <MenuItem
          value={"INFECCAO AGUDA DAS VIAS AEREAS SUPERIORES NAO ESPECIFICADA"}
        >
          INFECCAO AGUDA DAS VIAS AEREAS SUPERIORES NAO ESPECIFICADA
        </MenuItem>
        <MenuItem value={"NASOFARINGITE AGUDA [RESFRIADO COMUM]"}>
          NASOFARINGITE AGUDA [RESFRIADO COMUM]
        </MenuItem>
        <MenuItem value={"SINUSITE AGUDA"}>SINUSITE AGUDA</MenuItem>
        <MenuItem value={"BRONQUIOLITE AGUDA"}>BRONQUIOLITE AGUDA</MenuItem>
        <MenuItem value={"AMIGDALITE AGUDA"}>AMIGDALITE AGUDA</MenuItem>
        <MenuItem value={"ASMA"}>ASMA</MenuItem>
        <MenuItem value={"BRONCOPNEUMONIA NAO ESPECIFICADA"}>
          BRONCOPNEUMONIA NAO ESPECIFICADA
        </MenuItem>
        <MenuItem value={"LARINGITE AGUDA"}>LARINGITE AGUDA</MenuItem>
        <MenuItem value={"INFLUENZA [GRIPE] DEVIDA A VIRUS NAO IDENTIFICADO"}>
          INFLUENZA [GRIPE] DEVIDA A VIRUS NAO IDENTIFICADO
        </MenuItem>
      </Select>
    </FormControl>
  );
};

CidSelect.propTypes = {
  cid: PropTypes.string.isRequired,
  handleCidChange: PropTypes.func.isRequired,
};

export default CidSelect;
