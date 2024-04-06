import React, { useEffect } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import axios from "axios";
import { format } from "date-fns";
import PropTypes from "prop-types";
import { Stack, Typography } from "@mui/material";

const valueFormatter = (value) => `${value} pacientes`;

const chartSetting = {
  yAxis: [
    {
      label: "Qtd pacientes",
    },
  ],
  series: [
    { dataKey: "qtd_internacao", label: "Qtd Internação", valueFormatter },
    { dataKey: "qtd_alta", label: "Qtd Alta", valueFormatter },
  ],
  height: 300,
  sx: {
    [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
      transform: "translateX(-10px)",
    },
  },
};

export default function CustomInternacaGraphBars(props) {
  const [dados, setDados] = React.useState([{ qtd: 0, DT_ATENDIMENTO: "" }]);
  const [chave] = React.useState("DT_ATENDIMENTO");
  const URL_BASE =
    "http://datasaude-api.beloni.dev.br/api/v1/paciente/queries/";
  const [url, setUrl] = React.useState(URL_BASE);

  const handleButtonClick = () => {
    console.log("props:", props);
    const [dataInicial, dataFinal] = props.dateRange || [null, null];
    let filtros = "";
    if (dataInicial && dataFinal) {
      let dataInicialFormatada = format(dataInicial, "ddMMyyyy");
      let dataFinalFormatada = format(dataFinal, "ddMMyyyy");
      console.log("dataInicial", dataInicialFormatada);
      console.log("dataFinal", dataFinalFormatada);
      filtros += `${dataInicialFormatada}/${dataFinalFormatada}`;
    }

    filtros += `?query=internacao_alta`;

    let urlChanged = `${URL_BASE}${filtros}`;
    console.log("Resultado url alterada ", urlChanged);
    setUrl(urlChanged);
  };

  useEffect(() => {
    console.log("DataRange foi alterado");
    let [dataInicial, dataFinal] = props.dateRange || [null, null];

    if (dataInicial && dataFinal) {
      console.log(dataInicial);
      console.log(dataFinal);
      handleButtonClick();
    }
  }, [props.dateRange]);

  useEffect(() => {
    axios
      .get(url)
      .then((response) => {
        setDados(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [url]);

  useEffect(() => {
    handleButtonClick();
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <Stack direction="row" spacing={2} sx={{ marginTop: "25px" }}>
        <Typography variant="body1">Leitos dia: 13 </Typography>
        <Typography variant="body1">Leitos: 108 </Typography>
        <Typography variant="body1">Leitos UTI: 55 </Typography>
      </Stack>
      <BarChart
        dataset={dados}
        xAxis={[
          {
            scaleType: "band",
            dataKey: chave,
            tickPlacement: "middle",
            tickLabelPlacement: "middle",
          },
        ]}
        {...chartSetting}
      />
    </div>
  );
}

CustomInternacaGraphBars.propTypes = {
  dateRange: PropTypes.any,
};
