import * as React from "react";
import { useState } from "react";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import "react-datepicker/dist/react-datepicker.css";
import ptBr from "date-fns/locale/pt-BR";

// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import PropTypes from "prop-types";

registerLocale("pt-BR", ptBr);

export default function DatePicker() {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  return (
    <ReactDatePicker
      selectsRange={true}
      startDate={startDate}
      endDate={endDate}
      dateFormat="dd/MM/yyyy"
      onChange={(update) => {
        setDateRange(update);
        console.log(update);
      }}
      locale="pt-BR"
      placeholderText="Filtro data atendimento"
    />
  );
}

// DateRange.propTypes = {
//   value: PropTypes.object,
//   onChange: PropTypes.func,
// };
