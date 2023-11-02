import * as React from "react";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import PropTypes from "prop-types";

export default function DateRange({ value, onChange }) {
  // const minDate = new Date("2022-01-01");
  // const maxDate = new Date("2022-12-31");

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker value={value} onChange={onChange} />
    </LocalizationProvider>
  );
}

DateRange.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func,
};
