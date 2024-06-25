import React, { useEffect } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import axios from "axios";
import { format } from "date-fns";
import RadioGroupMesAno from "components/RadioGroup/RadioGroupMesAno";
import { Box, Button } from "@material-ui/core";
import PropTypes from "prop-types";

const valueFormatter = (value) => `${value} pacientes`;

const chartSetting = {
  yAxis: [
    {
      label: "Qtd atendimentos",
    },
  ],
  series: [{ dataKey: "qtd", label: "Qtd atendimentos", valueFormatter }],
  height: 300,
  sx: {
    [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
      transform: "translateX(-10px)",
    },
  },
};

export default function CustomGraphBars(props) {
  const [dados, setDados] = React.useState([{ qtd: 0, DT_ATENDIMENTO: "" }]);
  const [selectedPeriod, setSelectedPeriod] = React.useState("dia");
  const [chave, setChave] = React.useState("DT_ATENDIMENTO");
  const URL_BASE =
    "https://datasaude-api.beloni.dev.br/api/v1/paciente/queries/";
  const [url, setUrl] = React.useState(URL_BASE);

  const handleChangePeriodo = (event) => {
    setSelectedPeriod(event.target.value);
  };

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

    if (selectedPeriod === "dia") {
      filtros += `?query=dia`;
      setChave("DT_ATENDIMENTO");
    }
    if (selectedPeriod === "mes") {
      filtros += `?query=mes`;
      setChave("mes");
      console.log(chave);
    }

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
      <Box className="estiloHorizontal" justifyContent="space-between">
        <div
          style={{
            paddingLeft: "20px",
            paddingRight: "40px",
            paddingTop: "10px",
          }}
        >
          <RadioGroupMesAno
            value={selectedPeriod}
            onChange={handleChangePeriodo}
          ></RadioGroupMesAno>
        </div>
        <Button onClick={handleButtonClick}>Atualizar</Button>
      </Box>
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

CustomGraphBars.propTypes = {
  dateRange: PropTypes.any,
};
