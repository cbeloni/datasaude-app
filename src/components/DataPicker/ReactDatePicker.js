import React from "react";
import PropTypes from "prop-types";
import { Stack } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const slotProps = {
  textField: {
    size: "small",
    fullWidth: true,
  },
  popper: {
    placement: "bottom-start",
  },
};

export default function DateRangePicker({ value, onChange }) {
  const [from, to] = value || [null, null];

  const handleFromChange = (newFrom) => {
    onChange([newFrom, to]);
  };

  const handleToChange = (newTo) => {
    onChange([from, newTo]);
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <DatePicker
        label="De"
        value={from}
        onChange={handleFromChange}
        format="dd/MM/yyyy"
        maxDate={to || undefined}
        slotProps={slotProps}
      />
      <DatePicker
        label="Até"
        value={to}
        onChange={handleToChange}
        format="dd/MM/yyyy"
        minDate={from || undefined}
        slotProps={slotProps}
      />
    </Stack>
  );
}

DateRangePicker.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
};
