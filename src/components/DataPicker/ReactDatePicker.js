import * as React from "react";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import { PropTypes } from "prop-types";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import "react-datepicker/dist/react-datepicker.css";
import ptBr from "date-fns/locale/pt-BR";

registerLocale("pt-BR", ptBr);

export default function DatePicker(props) {
  const [startDate, endDate] = props.value;

  return (
    <ReactDatePicker
      selectsRange={true}
      startDate={startDate}
      endDate={endDate}
      dateFormat="dd/MM/yyyy"
      onChange={props.onChange}
      locale="pt-BR"
      placeholderText="Filtro data atendimento"
    />
  );
}

DatePicker.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
};
